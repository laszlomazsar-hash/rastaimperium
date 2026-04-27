from __future__ import annotations

import hashlib
import hmac
import json
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Protocol


class TopologyOperation(Protocol):
    """Pure topology operation.

    Implementations must be side-effect free and return a new candidate topology
    based on the provided input topology.
    """

    def apply(self, topology: Dict[str, Any]) -> Dict[str, Any]:
        """Return a new topology candidate."""


class TopologyValidationError(ValueError):
    """Raised when a candidate topology violates integrity or policy bounds."""

from src.codex.canonical_json import dumps_canonical


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


@dataclass
class CalibrationMetadata:
    threshold_version: str
    calibrated_at: str
    dataset_scope: str
    baseline_window: str
    policy_limit: float
    latest_residual_drift: float
    recalibration_required: bool


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self, *, override_cooldown_ticks: int = 2, override_min_hold_ticks: int = 3) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._override_active = False
        self._override_history: List[Dict[str, object]] = []
        self._override_tick = 0
        self._last_transition_tick = -10**9
        self._override_engaged_tick: int | None = None
        self._override_cooldown_ticks = max(0, override_cooldown_ticks)
        self._override_min_hold_ticks = max(0, override_min_hold_ticks)

    def append_audit_record(self, actor: str, action: str, article: str, metadata: Dict[str, object]) -> AuditRecord:
        timestamp = datetime.now(timezone.utc).isoformat()
        payload = {
            "actor": actor,
            "action": action,
            "article": article,
            "metadata": metadata,
            "timestamp": timestamp,
        }
        digest = hashlib.sha256(dumps_canonical(payload).encode("utf-8")).hexdigest()
        record = AuditRecord(**payload, digest=digest)
        self._audit_log.append(record)
        return record

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
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

    def evaluate_override_state(self, metrics: Dict[str, float], manual_override: str | None = None) -> bool:
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

    def should_trigger_rollback(self) -> bool:
        return self.evaluate_override_state(
            metrics={
                "min_trace_coverage": min(self._trace_coverage.values(), default=100.0),
                "error_rate_pct": 0.0,
                "p95_latency_ms": 0.0,
            }
        )

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

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)

    @property
    def override_history(self) -> List[Dict[str, object]]:
        return list(self._override_history)
