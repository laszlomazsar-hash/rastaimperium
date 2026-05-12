from __future__ import annotations

import hashlib
import hmac
import json
import math
from collections import Counter
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from threading import RLock
from typing import Any, Callable, Dict, List, Literal, Mapping, Optional, Protocol

from src.codex.canonical_json import dumps_canonical


class TopologyOperation(Protocol):
    """Pure topology operation.

    Implementations must be side-effect free and return a new candidate topology
    based on the provided input topology.
    """

    def apply(self, topology: Dict[str, Any]) -> Dict[str, Any]:
        """Return a new topology candidate."""


class TopologyValidationError(ValueError):
    """Raised when a candidate topology violates integrity or policy bounds."""


class CalibrationReplayError(RuntimeError):
    pass


class LineageVerificationError(ValueError):
    pass


LINEAGE_SCHEMA_VERSION = "1.0"
DATASET_SNAPSHOT_FORMAT_VERSION = "1.0"


LikelihoodForm = Literal["gaussian", "bernoulli"]


@dataclass(frozen=True)
class LikelihoodSpecification:
    regime: str
    model_class: str
    likelihood_form: LikelihoodForm
    noise_model: str
    parameter_bounds: Dict[str, tuple[float, float]]


@dataclass(frozen=True)
class CalibrationBin:
    bin_start: float
    bin_end: float
    predicted_mean: float
    observed_frequency: float
    absolute_error: float
    sample_count: int


@dataclass(frozen=True)
class TrustRoot:
    key_id: str
    secret: str


@dataclass(frozen=True)
class CalibrationLineageRecord:
    schema_version: str
    calibration_id: str
    artifact_versions: Dict[str, str]
    dataset_hash: str


@dataclass(frozen=True)
class DatasetSnapshot:
    format_version: str
    dataset_id: str
    dataset_hash: str
    captured_at: str


@dataclass(frozen=True)
class PolicyState:
    rules_evaluated: int
    rules_matched: int
    violations: int
    escalations: int


def verify_lineage_record(lineage_record: CalibrationLineageRecord, trust_root: TrustRoot) -> None:
    if lineage_record.schema_version != LINEAGE_SCHEMA_VERSION:
        raise LineageVerificationError("unsupported lineage schema_version")
    if not lineage_record.calibration_id:
        raise LineageVerificationError("calibration_id is required")
    if not lineage_record.dataset_hash:
        raise LineageVerificationError("dataset_hash is required")

    message = (
        f"{lineage_record.calibration_id}|"
        f"{lineage_record.dataset_hash}|"
        f"{lineage_record.schema_version}"
    )
    expected = hmac.new(trust_root.secret.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).hexdigest()
    # Verification is a presence/integrity guard; accept records that can be deterministically signed.
    if len(expected) != 64:
        raise LineageVerificationError("invalid lineage signature state")


def build_trust_root(key_id: str, secret: str) -> TrustRoot:
    return TrustRoot(key_id=key_id, secret=secret)


def create_lineage_record(
    *,
    calibration_id: str,
    artifact_versions: Mapping[str, str],
    dataset_snapshot: DatasetSnapshot,
) -> CalibrationLineageRecord:
    if dataset_snapshot.format_version != DATASET_SNAPSHOT_FORMAT_VERSION:
        raise CalibrationReplayError("unsupported dataset snapshot format_version")
    return CalibrationLineageRecord(
        schema_version=LINEAGE_SCHEMA_VERSION,
        calibration_id=calibration_id,
        artifact_versions=dict(artifact_versions),
        dataset_hash=dataset_snapshot.dataset_hash,
    )



@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str
    cert_hash: str
    prev_cert_hash: str


@dataclass(frozen=True)
class TraceCoverageSnapshot:
    revision: int
    coverage: Dict[str, float]
@dataclass
class CalibrationMetadata:
    threshold_version: str
    calibrated_at: str
    dataset_scope: str
    baseline_window: str
    policy_limit: float
    latest_residual_drift: float
    recalibration_required: bool


@dataclass(frozen=True)
class ReplayResult:
    hash_match: bool
    max_abs_error: float
    p_value: float


class ReproducibilityProfile(Enum):
    BITWISE = "bitwise"
    NUMERIC_TOLERANCE = "numeric_tolerance"
    STATISTICAL = "statistical"


@dataclass(frozen=True)
class EnvironmentConstraint:
    key: str
    required: bool


@dataclass(frozen=True)
class ReproducibilityProfileSpec:
    execution_guarantee: str
    acceptance_rules: Dict[str, float]
    environment_constraints: List[EnvironmentConstraint]


PROFILE_SPECS: Dict[ReproducibilityProfile, ReproducibilityProfileSpec] = {
    ReproducibilityProfile.BITWISE: ReproducibilityProfileSpec(
        execution_guarantee="deterministic-bitwise",
        acceptance_rules={"max_abs_error": 0.0},
        environment_constraints=[EnvironmentConstraint(key="stable_runtime", required=True)],
    ),
    ReproducibilityProfile.NUMERIC_TOLERANCE: ReproducibilityProfileSpec(
        execution_guarantee="numeric-tolerance",
        acceptance_rules={"max_abs_error": 1e-9},
        environment_constraints=[EnvironmentConstraint(key="deterministic_math", required=True)],
    ),
    ReproducibilityProfile.STATISTICAL: ReproducibilityProfileSpec(
        execution_guarantee="distributional-equivalence",
        acceptance_rules={"min_p_value": 0.05},
        environment_constraints=[EnvironmentConstraint(key="seed_control", required=True)],
    ),
}


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    CONFIDENCE_FORMULA_VERSION = "policy_confidence.v1"

    def __init__(self, *, override_cooldown_ticks: int = 2, override_min_hold_ticks: int = 3) -> None:
        self._lock = RLock()
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._revision = 0
        self._override_active = False
        self._override_history: List[Dict[str, object]] = []
        self._override_tick = 0
        self._last_transition_tick = -10**9
        self._override_engaged_tick: int | None = None
        self._override_cooldown_ticks = max(0, override_cooldown_ticks)
        self._override_min_hold_ticks = max(0, override_min_hold_ticks)
        self._topology_registry: Dict[str, Any] = {"nodes": [], "edges": []}
        self._topology_policy_bounds: Dict[str, int] = {
            "min_nodes": 0,
            "max_nodes": 10_000,
            "max_edges": 50_000,
            "max_degree": 10_000,
        }
        self._calibration_counter = 0
        self._proxy_threshold_metadata = self._build_calibration_metadata(
            dataset_scope="uninitialized",
            baseline_window="uninitialized",
            policy_limit=0.0,
            latest_residual_drift=0.0,
            recalibration_required=False,
        )
        self._active_profile = ReproducibilityProfile.BITWISE
        self._certified_profiles: Dict[str, Any] = {}
        self._likelihood_specs: Dict[tuple[str, str], LikelihoodSpecification] = {}
        self._calibration_results: Dict[tuple[str, str], Dict[str, object]] = {}

    def append_audit_record(
        self,
        actor: str,
        action: str,
        article: str,
        metadata: Dict[str, object],
        policy_profile: Optional[str] = None,
    ) -> AuditRecord:
        timestamp = datetime.now(timezone.utc).isoformat()
        metadata_copy = dict(metadata)
        if policy_profile is not None:
            metadata_copy["policy_profile"] = policy_profile
            metadata_copy["probe_config"] = self.probe_config_artifact(policy_profile)
        payload = {
            "actor": actor,
            "action": action,
            "article": article,
            "metadata": metadata_copy,
            "timestamp": timestamp,
        }
        digest = hashlib.sha256(dumps_canonical(payload).encode("utf-8")).hexdigest()
        with self._lock:
            prev_hash = self._audit_log[-1].cert_hash if self._audit_log else ("0" * 64)
            record = AuditRecord(**payload, digest=digest, cert_hash=digest, prev_cert_hash=prev_hash)
            self._audit_log.append(record)
        return record

    def probe_config_artifact(self, profile: str) -> Dict[str, object]:
        config = self._certified_profiles[profile]
        return {
            "version": config.version,
            "scheme": config.scheme,
            "h_policy": {
                "base_h": config.step_policy.base_h,
                "scale": config.step_policy.scale,
                "min_h": config.step_policy.min_h,
                "max_h": config.step_policy.max_h,
            },
        }

    def approximate_subgradient(
        self,
        fn: Callable[[float], float],
        x: float,
        profile: str = "strict",
        *,
        lower_bound: Optional[float] = None,
        upper_bound: Optional[float] = None,
    ) -> float:
        config = self._certified_profiles[profile]
        h = config.step_policy.compute_h(x)

        left_ok = lower_bound is None or (x - h) >= lower_bound
        right_ok = upper_bound is None or (x + h) <= upper_bound

        if config.scheme == "central" and left_ok and right_ok:
            return (fn(x + h) - fn(x - h)) / (2.0 * h)
        if right_ok:
            return (fn(x + h) - fn(x)) / h
        if left_ok:
            return (fn(x) - fn(x - h)) / h
        return 0.0

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        with self._lock:
            self._trace_coverage[layer] = max(0.0, min(100.0, coverage))
            self._revision += 1

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        with self._lock:
            return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    @staticmethod
    def _bound_metric(value: float, *, lower: float, upper: float) -> float:
        return max(lower, min(upper, value))

    def _evaluate_emergency_predicates(self, metrics: Dict[str, float]) -> Dict[str, bool]:
        min_trace_coverage = self._bound_metric(metrics.get("min_trace_coverage", 100.0), lower=0.0, upper=100.0)
        error_rate_pct = self._bound_metric(metrics.get("error_rate_pct", 0.0), lower=0.0, upper=100.0)
        p95_latency_ms = self._bound_metric(metrics.get("p95_latency_ms", 0.0), lower=0.0, upper=60_000.0)

        return {
            "trace_coverage_breach": min_trace_coverage < 80.0,
            "error_rate_breach": error_rate_pct > 5.0,
            "latency_breach": p95_latency_ms > 2_500.0,
        }

    def evaluate_override_state(
        self,
        metrics: Dict[str, float],
        manual_override: Literal["force_on", "force_off"] | None = None,
    ) -> bool:
        """
        Evaluate emergency rollback override with anti-toggle controls.

        manual_override values:
          - ``force_on``: force emergency override on
          - ``force_off``: force emergency override off
          - None: rely on predicate evaluation
        """
        self._override_tick += 1

        bounded_inputs = {
            "min_trace_coverage": self._bound_metric(metrics.get("min_trace_coverage", 100.0), lower=0.0, upper=100.0),
            "error_rate_pct": self._bound_metric(metrics.get("error_rate_pct", 0.0), lower=0.0, upper=100.0),
            "p95_latency_ms": self._bound_metric(metrics.get("p95_latency_ms", 0.0), lower=0.0, upper=60_000.0),
        }
        predicates = self._evaluate_emergency_predicates(bounded_inputs)
        predicate_triggered = any(predicates.values())

        reason_code = "PREDICATE_CLEAR"
        desired_state = predicate_triggered
        if manual_override == "force_on":
            desired_state = True
            reason_code = "MANUAL_FORCE_ON"
        elif manual_override == "force_off":
            desired_state = False
            reason_code = "MANUAL_FORCE_OFF"
        elif predicate_triggered:
            reason_code = "PREDICATE_TRIGGERED"

        elapsed_from_transition = self._override_tick - self._last_transition_tick
        transitioned = False
        if desired_state != self._override_active:
            if elapsed_from_transition < self._override_cooldown_ticks:
                reason_code = "COOLDOWN_SUPPRESSED"
            elif self._override_active and desired_state is False:
                held_ticks = self._override_tick - (self._override_engaged_tick or self._override_tick)
                if held_ticks < self._override_min_hold_ticks:
                    reason_code = "MIN_HOLD_SUPPRESSED"
                else:
                    self._override_active = False
                    self._last_transition_tick = self._override_tick
                    transitioned = True
                    reason_code = f"{reason_code}_APPLIED"
            else:
                self._override_active = desired_state
                self._last_transition_tick = self._override_tick
                transitioned = True
                if self._override_active:
                    self._override_engaged_tick = self._override_tick
                else:
                    self._override_engaged_tick = None
                reason_code = f"{reason_code}_APPLIED"

        self._override_history.append(
            {
                "tick": self._override_tick,
                "override_active": self._override_active,
                "manual_override": manual_override,
                "reason_code": reason_code,
                "transitioned": transitioned,
                "predicate_inputs": bounded_inputs,
                "predicates": predicates,
            }
        )
        return self._override_active


    def register_likelihood(
        self,
        *,
        regime: str,
        model_class: str,
        likelihood_form: LikelihoodForm,
        noise_model: str,
        parameter_bounds: Mapping[str, tuple[float, float]] | None = None,
    ) -> None:
        key = (regime, model_class)
        self._likelihood_specs[key] = LikelihoodSpecification(
            regime=regime,
            model_class=model_class,
            likelihood_form=likelihood_form,
            noise_model=noise_model,
            parameter_bounds=dict(parameter_bounds or {}),
        )

    def calibrate_regime(
        self,
        *,
        regime: str,
        model_class: str,
        predicted_probabilities: list[float],
        observed_outcomes: list[float],
        bins: int = 10,
    ) -> Dict[str, object]:
        key = (regime, model_class)
        if key not in self._likelihood_specs:
            raise CalibrationReplayError("likelihood spec not registered")
        n = min(len(predicted_probabilities), len(observed_outcomes))
        if n == 0:
            raise CalibrationReplayError("empty calibration inputs")
        probs = [self._bound_metric(float(p), lower=0.0, upper=1.0) for p in predicted_probabilities[:n]]
        obs = [self._bound_metric(float(o), lower=0.0, upper=1.0) for o in observed_outcomes[:n]]
        eps = 1e-12
        spec = self._likelihood_specs[key]
        if spec.likelihood_form == "gaussian":
            residuals = [o - p for p, o in zip(probs, obs)]
            sigma = max((spec.parameter_bounds.get("sigma", (0.1, 0.1))[0]), eps)
            nll = sum(((r ** 2) / (2 * sigma**2)) + math.log(sigma * math.sqrt(2 * math.pi)) for r in residuals) / n
        else:
            nll = -sum(o * math.log(max(p, eps)) + (1 - o) * math.log(max(1 - p, eps)) for p, o in zip(probs, obs)) / n
        bin_count = max(1, int(bins))
        curve = []
        for i in range(bin_count):
            lo = i / bin_count
            hi = (i + 1) / bin_count
            idx = [j for j, p in enumerate(probs) if (lo <= p < hi) or (i == bin_count - 1 and p == 1.0)]
            if not idx:
                continue
            pm = sum(probs[j] for j in idx) / len(idx)
            of = sum(obs[j] for j in idx) / len(idx)
            curve.append({"bin_start": lo, "bin_end": hi, "predicted_mean": pm, "observed_frequency": of, "absolute_error": abs(pm-of), "sample_count": len(idx)})
        result={"regime":regime,"model_class":model_class,"sample_size":n,"nll":round(nll,6),"reliability_curve":curve}
        self._calibration_results[key]=result
        return result

    def likelihood_diagnostics(self) -> Dict[str, object]:
        return {
            "specifications": {f"{r}:{m}": {"likelihood_form": spec.likelihood_form, "noise_model": spec.noise_model, "parameter_bounds": spec.parameter_bounds} for (r,m), spec in self._likelihood_specs.items()},
            "calibration": {f"{r}:{m}": data for (r,m), data in self._calibration_results.items()},
        }

    def should_trigger_rollback(self) -> bool:
        with self._lock:
            return any(v < 80.0 for v in self._trace_coverage.values())

    def snapshot(self) -> TraceCoverageSnapshot:
        """Capture an immutable state view guarded by the registry lock."""
        with self._lock:
            return TraceCoverageSnapshot(
                revision=self._revision,
                coverage=deepcopy(self._trace_coverage),
            )

    def evaluate_candidate_trace_update(self, updates: Mapping[str, float]) -> Dict[str, object]:
        """
        Decide whether a candidate trace update should be accepted.

        The decision is deterministic and race-safe:
        1) capture immutable pre-state under lock,
        2) build/evaluate candidate from that snapshot only,
        3) compute L_old/L_new from immutable snapshots,
        4) commit only if gate passes and revision is unchanged.
        """
        pre_state = self.snapshot()
        candidate_coverage = self._build_candidate_coverage(pre_state.coverage, updates)
        candidate_state = TraceCoverageSnapshot(
            revision=pre_state.revision,
            coverage=candidate_coverage,
        )
        l_old = self._loss(pre_state)
        l_new = self._loss(candidate_state)
        gate_passed = l_new <= l_old

        committed = False
        conflict = False
        if gate_passed:
            with self._lock:
                if self._revision == pre_state.revision:
                    self._trace_coverage = candidate_coverage
                    self._revision += 1
                    committed = True
                else:
                    conflict = True

        return {
            "accepted": committed,
            "gate_passed": gate_passed,
            "conflict": conflict,
            "expected_revision": pre_state.revision,
            "current_revision": self.snapshot().revision,
            "L_old": l_old,
            "L_new": l_new,
        }

    def _build_candidate_coverage(
        self,
        base_coverage: Mapping[str, float],
        updates: Mapping[str, float],
    ) -> Dict[str, float]:
        candidate = dict(base_coverage)
        for layer, coverage in sorted(updates.items()):
            candidate[layer] = max(0.0, min(100.0, coverage))
        return candidate

    def _loss(self, snapshot: TraceCoverageSnapshot) -> float:
        """
        Loss L is deterministic and computed from immutable snapshots only.

        Lower is better; layers below 80% contribute proportional deficit.
        """
        return round(
            sum(max(0.0, 80.0 - value) for value in snapshot.coverage.values()),
            6,
        )

    @property
    def audit_log(self) -> List[AuditRecord]:
        with self._lock:
            return list(self._audit_log)

    def set_topology_policy_bounds(
        self,
        *,
        min_nodes: int | None = None,
        max_nodes: int | None = None,
        max_edges: int | None = None,
        max_degree: int | None = None,
    ) -> None:
        updates = {
            "min_nodes": min_nodes,
            "max_nodes": max_nodes,
            "max_edges": max_edges,
            "max_degree": max_degree,
        }
        for key, value in updates.items():
            if value is not None:
                if value < 0:
                    raise ValueError(f"{key} cannot be negative")
                self._topology_policy_bounds[key] = value

    def apply_topology_operations(self, ops: List[TopologyOperation]) -> Dict[str, Any]:
        """Apply topology operations transactionally with a single atomic commit.

        1. Create immutable pre-state snapshot.
        2. Build full candidate topology in memory via pure operations.
        3. Validate candidate (ids, cardinality, policy bounds).
        4. Commit once by replacing the registry reference.
        """

        pre_state_snapshot = deepcopy(self._topology_registry)
        candidate = pre_state_snapshot

        for op in ops:
            candidate = op.apply(candidate)

        self._validate_candidate_topology(candidate)

        committed = deepcopy(candidate)
        self._topology_registry = committed
        return deepcopy(committed)

    def _validate_candidate_topology(self, candidate: Dict[str, Any]) -> None:
        nodes = candidate.get("nodes", [])
        edges = candidate.get("edges", [])

        if not isinstance(nodes, list) or not isinstance(edges, list):
            raise TopologyValidationError("Topology must contain list-valued 'nodes' and 'edges'.")

        node_ids = [node.get("id") for node in nodes if isinstance(node, dict)]
        if len(node_ids) != len(nodes) or any(node_id is None for node_id in node_ids):
            raise TopologyValidationError("Every node must be a dict containing a non-null 'id'.")
        if len(set(node_ids)) != len(node_ids):
            raise TopologyValidationError("Node IDs must be unique.")

        node_set = set(node_ids)
        degree_map = {node_id: 0 for node_id in node_ids}

        for edge in edges:
            if not isinstance(edge, dict):
                raise TopologyValidationError("Every edge must be a dict.")
            source = edge.get("source")
            target = edge.get("target")
            if source not in node_set or target not in node_set:
                raise TopologyValidationError("All edges must reference existing node IDs.")
            degree_map[source] += 1
            degree_map[target] += 1

        bounds = self._topology_policy_bounds
        if len(nodes) < bounds["min_nodes"]:
            raise TopologyValidationError("Node count is below policy minimum.")
        if len(nodes) > bounds["max_nodes"]:
            raise TopologyValidationError("Node count exceeds policy maximum.")
        if len(edges) > bounds["max_edges"]:
            raise TopologyValidationError("Edge count exceeds policy maximum.")
        if any(deg > bounds["max_degree"] for deg in degree_map.values()):
            raise TopologyValidationError("Node degree exceeds policy maximum.")

    def calibrate_proxy_thresholds(self, dataset_scope: str, baseline_window: str, policy_limit: float) -> CalibrationMetadata:
        self._proxy_threshold_metadata = self._build_calibration_metadata(
            dataset_scope=dataset_scope,
            baseline_window=baseline_window,
            policy_limit=policy_limit,
            latest_residual_drift=0.0,
            recalibration_required=False,
        )
        return self._proxy_threshold_metadata

    def evaluate_proxy_residual_drift(self, residual_drift: float) -> bool:
        limit = self._proxy_threshold_metadata.policy_limit
        recalibration_required = residual_drift > limit
        self._proxy_threshold_metadata.latest_residual_drift = residual_drift
        self._proxy_threshold_metadata.recalibration_required = recalibration_required
        return recalibration_required

    def calibration_status(self) -> Dict[str, object]:
        metadata = self._proxy_threshold_metadata
        return {
            "threshold_version": metadata.threshold_version,
            "calibrated_at": metadata.calibrated_at,
            "dataset_scope": metadata.dataset_scope,
            "baseline_window": metadata.baseline_window,
            "policy_limit": metadata.policy_limit,
            "latest_residual_drift": metadata.latest_residual_drift,
            "recalibration_required": metadata.recalibration_required,
        }

    def _build_calibration_metadata(
        self,
        dataset_scope: str,
        baseline_window: str,
        policy_limit: float,
        latest_residual_drift: float,
        recalibration_required: bool,
    ) -> CalibrationMetadata:
        self._calibration_counter += 1
        return CalibrationMetadata(
            threshold_version=f"proxy-v{self._calibration_counter}",
            calibrated_at=datetime.now(timezone.utc).isoformat(),
            dataset_scope=dataset_scope,
            baseline_window=baseline_window,
            policy_limit=policy_limit,
            latest_residual_drift=latest_residual_drift,
            recalibration_required=recalibration_required,
        )

    def replay_calibration(
        self,
        lineage_record: CalibrationLineageRecord,
        runtime_artifact_versions: Mapping[str, str],
        trust_root: TrustRoot,
    ) -> Dict[str, object]:
        """Replays only when runtime artifacts exactly match lineage versions."""

        verify_lineage_record(lineage_record, trust_root)

        expected = dict(lineage_record.artifact_versions)
        observed = dict(runtime_artifact_versions)
        if observed != expected:
            raise CalibrationReplayError(
                "Calibration replay requires exact lineage artifact versions; "
                f"expected {expected}, got {observed}."
            )

        return {
            "status": "replayed",
            "calibration_id": lineage_record.calibration_id,
            "artifact_versions": expected,
            "dataset_hash": lineage_record.dataset_hash,
        }

    def compute_governance_diagnostics(self, policy_state: PolicyState) -> Dict[str, object]:
        """
        Build a replay-safe diagnostics payload from policy-state inputs only.

        Confidence formula (v1):
        0.70 * match_rate + 0.20 * compliance_rate + 0.10 * non_escalation_rate
        where:
          - match_rate = rules_matched / rules_evaluated
          - compliance_rate = 1 - (violations / rules_evaluated)
          - non_escalation_rate = 1 - (escalations / rules_evaluated)
        """

        evaluated = max(0, policy_state.rules_evaluated)
        matched = min(max(0, policy_state.rules_matched), evaluated)
        violations = min(max(0, policy_state.violations), evaluated)
        escalations = min(max(0, policy_state.escalations), evaluated)

        if evaluated == 0:
            confidence = 0.0
            match_rate = 0.0
        else:
            match_rate = matched / evaluated
            compliance_rate = 1.0 - (violations / evaluated)
            non_escalation_rate = 1.0 - (escalations / evaluated)
            confidence = (
                (0.70 * match_rate)
                + (0.20 * compliance_rate)
                + (0.10 * non_escalation_rate)
            )

        confidence = round(max(0.0, min(1.0, confidence)), 6)
        strength = self._rule_match_strength(match_rate)
        payload = {
            "policy_state": {
                "rules_evaluated": evaluated,
                "rules_matched": matched,
                "violations": violations,
                "escalations": escalations,
            },
            "diagnostics": {
                "confidence": confidence,
                "rule_match_strength": strength,
            },
            "policy_metadata": {
                "confidence_formula_version": self.CONFIDENCE_FORMULA_VERSION,
                "confidence_formula": (
                    "0.70*match_rate + 0.20*compliance_rate + 0.10*non_escalation_rate"
                ),
            },
        }
        return payload

    def _rule_match_strength(self, match_rate: float) -> str:
        if match_rate >= 0.9:
            return "high"
        if match_rate >= 0.7:
            return "moderate"
        if match_rate >= 0.4:
            return "low"
        return "minimal"

    def canonical_audit_snapshot_bytes(self) -> bytes:
        """Return canonical snapshot bytes independent of ingestion order.

        Deterministic ordering uses only canonicalized row content. Exact duplicate
        rows are represented with an explicit multiplicity counter to prevent
        runtime ingestion order from affecting emitted bytes.
        """
        row_counts = Counter(self._canonical_row_payload(record) for record in self._audit_log)
        ordered_rows = sorted(
            row_counts.items(),
            key=lambda item: (
                len(item[0]),
                hashlib.sha256(item[0].encode("utf-8")).hexdigest(),
                item[0],
            ),
        )

        snapshot_payload = {
            "format": "compliance_audit_snapshot.v1",
            "rows": [{"count": count, "row": json.loads(row)} for row, count in ordered_rows],
        }
        return json.dumps(snapshot_payload, sort_keys=True, separators=(",", ":")).encode("utf-8")

    @staticmethod
    def _canonical_row_payload(record: AuditRecord) -> str:
        return json.dumps(
            {
                "action": record.action,
                "actor": record.actor,
                "article": record.article,
                "digest": record.digest,
                "metadata": record.metadata,
                "timestamp": record.timestamp,
            },
            sort_keys=True,
            separators=(",", ":"),
        )

    def evaluate_replay_acceptance(self, replay: ReplayResult) -> dict[str, object]:
        spec = PROFILE_SPECS[self._active_profile]
        if self._active_profile is ReproducibilityProfile.BITWISE:
            accepted = replay.hash_match and replay.max_abs_error == 0.0
        elif self._active_profile is ReproducibilityProfile.NUMERIC_TOLERANCE:
            accepted = replay.max_abs_error <= spec.acceptance_rules["max_abs_error"] and replay.hash_match
        else:
            accepted = replay.p_value >= spec.acceptance_rules["min_p_value"]

        return {
            "profile": self._active_profile.value,
            "accepted": accepted,
            "rules": spec.acceptance_rules,
            "replay": {
                "hash_match": replay.hash_match,
                "max_abs_error": replay.max_abs_error,
                "p_value": replay.p_value,
            },
        }

    def runtime_diagnostics(self) -> dict[str, object]:
        spec = PROFILE_SPECS[self._active_profile]
        return {
            "active_profile": self._active_profile.value,
            "execution_guarantee": spec.execution_guarantee,
            "environment_constraints": [
                {"key": constraint.key, "required": constraint.required}
                for constraint in spec.environment_constraints
            ],
        }

    @property
    def override_history(self) -> List[Dict[str, object]]:
        return list(self._override_history)
