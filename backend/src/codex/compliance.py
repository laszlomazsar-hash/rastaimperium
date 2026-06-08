from __future__ import annotations

import hashlib
import hmac
import json
import math
from collections import Counter
from copy import deepcopy
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from threading import RLock
from typing import Any, Callable, Dict, List, Literal, Mapping, Optional, Protocol, Tuple

# Fixed: use relative import from the same package
from .canonical_json import dumps_canonical

# ---------------------------------------------------------------------------
# Re-export dumps_canonical so that `from codex.compliance import dumps_canonical`
# works (required by the architecture import contract test).
# ---------------------------------------------------------------------------
__all__ = [
    "dumps_canonical",
    "CANONICALIZATION_VERSION",
    "canonical_json",
    "sha256_canonical_digest",
    "DATASET_SNAPSHOT_FORMAT_VERSION",
    "LINEAGE_SCHEMA_VERSION",
    "DatasetSnapshot",
    "CalibrationReplayError",
    "LineageVerificationError",
    "build_trust_root",
    "create_lineage_record",
    "verify_lineage_record",
    "TopologyOperation",
    "PolicyState",
    "ReplayResult",
    "ComplianceEngine",
]

# ---------------------------------------------------------------------------
# Canonicalization helpers
# ---------------------------------------------------------------------------

CANONICALIZATION_VERSION = "1.0"


def canonical_json(payload: Any) -> str:
    """Return canonical JSON string for *payload*, normalising floats and key order."""
    return _canonical_json_inner(payload)


def _canonical_json_inner(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float):
        # Floats are serialised as JSON strings containing their canonical representation.
        # e.g. 2.5 → "\"2.5\"", 0.0 → "\"0\""
        return json.dumps(dumps_canonical(value), ensure_ascii=False, separators=(",", ":"))
    if isinstance(value, str):
        # Normalise CR-only and CRLF line endings to LF before encoding
        normalised = value.replace("\r\n", "\n").replace("\r", "\n")
        return json.dumps(normalised, ensure_ascii=False, separators=(",", ":"))
    if isinstance(value, list):
        serialised_items = [_canonical_json_inner(item) for item in value]
        # Sort arrays of strings and objects (dicts) by their canonical representation.
        # Arrays of numbers (int/float) preserve their original order.
        if value and not isinstance(value[0], (int, float)):
            serialised_items.sort()
        return "[" + ",".join(serialised_items) + "]"
    if isinstance(value, dict):
        keys = sorted(value)
        parts = []
        for key in keys:
            if not isinstance(key, str):
                raise TypeError("Canonical JSON object keys must be strings")
            parts.append(f"{_canonical_json_inner(key)}:{_canonical_json_inner(value[key])}")
        return "{" + ",".join(parts) + "}"
    raise TypeError(f"Type {type(value)!r} is not serialisable in canonical JSON")


def sha256_canonical_digest(payload: Any) -> str:
    """Return the lowercase hex SHA-256 digest of the canonical JSON of *payload*."""
    serialised = canonical_json(payload)
    return hashlib.sha256(serialised.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------------------
# Dataset / lineage types
# ---------------------------------------------------------------------------

DATASET_SNAPSHOT_FORMAT_VERSION = "dataset_snapshot.v1"
LINEAGE_SCHEMA_VERSION = "lineage.v1"


@dataclass
class DatasetSnapshot:
    """Immutable snapshot of a dataset used for lineage tracking."""

    snapshot_id: str
    format_version: str = DATASET_SNAPSHOT_FORMAT_VERSION
    schema: List[str] = field(default_factory=list)
    row_count: int = 0
    content_digest: str = ""
    created_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    metadata: Dict[str, Any] = field(default_factory=dict)


class CalibrationReplayError(Exception):
    """Raised when a calibration replay produces inconsistent results."""


class LineageVerificationError(Exception):
    """Raised when a lineage record fails verification."""


def build_trust_root(
    authority: str,
    *,
    algorithm: str = "sha256",
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Build a trust-root descriptor for lineage anchoring."""
    return {
        "authority": authority,
        "algorithm": algorithm,
        "schema_version": LINEAGE_SCHEMA_VERSION,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "metadata": metadata or {},
    }


def create_lineage_record(
    snapshot: DatasetSnapshot,
    trust_root: Dict[str, Any],
    *,
    actor: str = "system",
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Create a signed lineage record for *snapshot* anchored to *trust_root*."""
    payload = {
        "snapshot_id": snapshot.snapshot_id,
        "format_version": snapshot.format_version,
        "content_digest": snapshot.content_digest,
        "row_count": snapshot.row_count,
        "schema": snapshot.schema,
        "trust_root_authority": trust_root["authority"],
        "actor": actor,
        "schema_version": LINEAGE_SCHEMA_VERSION,
        "metadata": metadata or {},
    }
    digest = sha256_canonical_digest(payload)
    return {**payload, "record_digest": digest}


def verify_lineage_record(
    record: Dict[str, Any],
    trust_root: Dict[str, Any],
) -> bool:
    """Verify *record* against *trust_root*.

    Raises :class:`LineageVerificationError` on mismatch.
    """
    expected_authority = trust_root.get("authority")
    if record.get("trust_root_authority") != expected_authority:
        raise LineageVerificationError(
            f"Trust root authority mismatch: expected {expected_authority!r}, "
            f"got {record.get('trust_root_authority')!r}"
        )

    # Re-derive digest from the record payload (excluding the digest field itself)
    payload = {k: v for k, v in record.items() if k != "record_digest"}
    expected_digest = sha256_canonical_digest(payload)
    if record.get("record_digest") != expected_digest:
        raise LineageVerificationError(
            "Lineage record digest mismatch — record may have been tampered with."
        )
    return True


# ---------------------------------------------------------------------------
# Protocol
# ---------------------------------------------------------------------------


class TopologyOperation(Protocol):
    """Pure topology operation.

    Implementations must be side-effect free and return a new candidate topology
    based on the provided input topology.
    """

    def apply(self, topology: Dict[str, Any]) -> Dict[str, Any]:
        """Return a new topology candidate."""


# ---------------------------------------------------------------------------
# Audit record
# ---------------------------------------------------------------------------

_GENESIS_HASH = "0" * 64


@dataclass
class AuditRecord:
    """Immutable audit record with chained SHA-256 digests."""

    actor: str
    action: str
    article: str
    metadata: Dict[str, Any]
    timestamp: str
    digest: str
    cert_hash: str
    prev_cert_hash: str


# ---------------------------------------------------------------------------
# PolicyState & governance diagnostics
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class PolicyState:
    """Snapshot of policy evaluation metrics for governance diagnostics."""

    rules_evaluated: int
    rules_matched: int
    violations: int
    escalations: int


# ---------------------------------------------------------------------------
# ReplayResult
# ---------------------------------------------------------------------------


@dataclass
class ReplayResult:
    """Result of a compliance replay operation."""

    success: bool
    tick_count: int
    first_divergence_tick: Optional[int] = None
    reconstructed_hashes: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


# ---------------------------------------------------------------------------
# ComplianceEngine
# ---------------------------------------------------------------------------

_ROLLBACK_COVERAGE_THRESHOLD = 75.0
_DEFAULT_COVERAGE = 100.0


class ComplianceEngine:
    """Stateful compliance and governance engine.

    Responsibilities
    ----------------
    - Append-only audit log with chained SHA-256 digests.
    - Trace-coverage tracking and rollback-readiness signalling.
    - Candidate trace-update gate (Lyapunov-style loss comparison).
    - Override-state evaluation with min-hold and cooldown semantics.
    - Likelihood specification registry and calibration diagnostics.
    - Governance diagnostics with a versioned confidence formula.
    """

    def __init__(
        self,
        *,
        rollback_threshold: float = _ROLLBACK_COVERAGE_THRESHOLD,
        override_cooldown_ticks: int = 3,
        override_min_hold_ticks: int = 2,
    ) -> None:
        self._rollback_threshold = rollback_threshold
        self._override_cooldown_ticks = override_cooldown_ticks
        self._override_min_hold_ticks = override_min_hold_ticks

        self._lock = RLock()

        # Audit log
        self._audit_log: List[AuditRecord] = []
        self._prev_cert_hash: str = _GENESIS_HASH

        # Trace coverage: layer_name → coverage_pct (0–100)
        self._coverage: Dict[str, float] = {}

        # Override state
        self._override_active: bool = False
        self._override_hold_ticks: int = 0
        self._override_cooldown_remaining: int = 0
        self._override_history: List[Dict[str, Any]] = []

        # Likelihood specifications: key = "regime:model_class"
        self._likelihood_specs: Dict[str, Dict[str, Any]] = {}
        # Calibration data: key = "regime:model_class" → list of (pred, obs)
        self._calibration_data: Dict[str, List[Tuple[float, float]]] = {}

    # ------------------------------------------------------------------
    # Audit log
    # ------------------------------------------------------------------

    @property
    def audit_log(self) -> List[AuditRecord]:
        with self._lock:
            return list(self._audit_log)

    def append_audit_record(
        self,
        actor: str,
        action: str,
        article: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> AuditRecord:
        """Append a new audit record and return it."""
        with self._lock:
            timestamp = datetime.now(timezone.utc).isoformat()
            payload = {
                "actor": actor,
                "action": action,
                "article": article,
                "metadata": metadata or {},
                "timestamp": timestamp,
                "prev_cert_hash": self._prev_cert_hash,
            }
            digest = sha256_canonical_digest(payload)
            record = AuditRecord(
                actor=actor,
                action=action,
                article=article,
                metadata=metadata or {},
                timestamp=timestamp,
                digest=digest,
                cert_hash=digest,
                prev_cert_hash=self._prev_cert_hash,
            )
            self._audit_log.append(record)
            self._prev_cert_hash = digest
            return record

    # ------------------------------------------------------------------
    # Trace coverage
    # ------------------------------------------------------------------

    def set_trace_coverage(self, layer: str, coverage_pct: float) -> None:
        """Set the trace coverage percentage for *layer*."""
        with self._lock:
            self._coverage[layer] = float(coverage_pct)

    def trace_coverage_graph(self) -> List[Dict[str, Any]]:
        """Return a list of coverage records, one per tracked layer.

        If no layers have been set, returns a single synthetic entry at 100 %.
        """
        with self._lock:
            if not self._coverage:
                return [{"layer": "default", "coverage": _DEFAULT_COVERAGE}]
            return [
                {"layer": layer, "coverage": cov}
                for layer, cov in sorted(self._coverage.items())
            ]

    def should_trigger_rollback(self) -> bool:
        """Return True if any tracked layer is below the rollback threshold."""
        with self._lock:
            if not self._coverage:
                return False
            return any(
                cov < self._rollback_threshold for cov in self._coverage.values()
            )

    # ------------------------------------------------------------------
    # Candidate trace-update gate (Lyapunov loss)
    # ------------------------------------------------------------------

    def _loss(self, coverage_snapshot: Dict[str, float]) -> float:
        """Compute the Lyapunov-style loss for a coverage snapshot.

        Loss = sum of coverage deficits below 100 % across all layers.
        A lower loss means better coverage.
        """
        if not coverage_snapshot:
            return 0.0
        return sum(max(0.0, _DEFAULT_COVERAGE - cov) for cov in coverage_snapshot.values())

    def evaluate_candidate_trace_update(
        self, candidate: Dict[str, float]
    ) -> Dict[str, Any]:
        """Evaluate whether applying *candidate* coverage values reduces the loss.

        Returns a dict with keys:
        - ``gate_passed``: True if L_new < L_old
        - ``accepted``: True if gate passed and no concurrent revision conflict
        - ``conflict``: True if a concurrent revision was detected
        - ``L_old``: loss before the candidate
        - ``L_new``: loss after the candidate
        """
        with self._lock:
            snapshot_before = dict(self._coverage)
            l_old = self._loss(snapshot_before)

            # Merge candidate into a prospective coverage map
            prospective = {**snapshot_before, **candidate}
            l_new = self._loss(prospective)

            gate_passed = l_new <= l_old

            # Detect concurrent revision: if the coverage map changed during
            # the loss computation (e.g. via monkeypatching in tests), reject.
            snapshot_after = dict(self._coverage)
            conflict = snapshot_after != snapshot_before

            accepted = gate_passed and not conflict

            return {
                "gate_passed": gate_passed,
                "accepted": accepted,
                "conflict": conflict,
                "L_old": l_old,
                "L_new": l_new,
            }

    # ------------------------------------------------------------------
    # Override-state evaluation
    # ------------------------------------------------------------------

    @staticmethod
    def _clamp_predicate_inputs(metrics: Dict[str, float]) -> Dict[str, float]:
        return {
            "min_trace_coverage": max(0.0, min(100.0, metrics.get("min_trace_coverage", 100.0))),
            "error_rate_pct": max(0.0, min(100.0, metrics.get("error_rate_pct", 0.0))),
            "p95_latency_ms": max(0.0, min(60_000.0, metrics.get("p95_latency_ms", 0.0))),
        }

    def _predicate_active(self, inputs: Dict[str, float]) -> bool:
        """Return True if any emergency predicate is triggered."""
        return (
            inputs["min_trace_coverage"] < 75.0
            or inputs["error_rate_pct"] > 10.0
            or inputs["p95_latency_ms"] > 3_000.0
        )

    @property
    def override_history(self) -> List[Dict[str, Any]]:
        with self._lock:
            return list(self._override_history)

    def evaluate_override_state(
        self,
        metrics: Dict[str, float],
        *,
        manual_override: Optional[str] = None,
    ) -> bool:
        """Evaluate and update the override state.

        Parameters
        ----------
        metrics:
            Dict with keys ``min_trace_coverage``, ``error_rate_pct``,
            ``p95_latency_ms``.
        manual_override:
            ``"force_on"`` or ``"force_off"`` to bypass predicate logic.

        Returns
        -------
        bool
            True if the override is active (system should be in override mode).
        """
        with self._lock:
            inputs = self._clamp_predicate_inputs(metrics)

            if manual_override == "force_off":
                self._override_active = False
                self._override_hold_ticks = 0
                self._override_cooldown_remaining = 0
                self._override_history.append(
                    {
                        "override_active": False,
                        "reason_code": "MANUAL_FORCE_OFF",
                        "predicate_inputs": inputs,
                    }
                )
                return False

            if manual_override == "force_on":
                self._override_active = True
                self._override_hold_ticks = 0
                self._override_cooldown_remaining = 0
                self._override_history.append(
                    {
                        "override_active": True,
                        "reason_code": "MANUAL_FORCE_ON_APPLIED",
                        "predicate_inputs": inputs,
                    }
                )
                return True

            predicate_triggered = self._predicate_active(inputs)

            if predicate_triggered:
                # Activate or maintain override
                self._override_active = True
                self._override_hold_ticks += 1
                # cooldown_ticks=1 means no extra cooldown ticks after min-hold;
                # store (cooldown_ticks - 1) so the counter reaches 0 immediately.
                self._override_cooldown_remaining = max(0, self._override_cooldown_ticks - 1)
                self._override_history.append(
                    {
                        "override_active": True,
                        "reason_code": "PREDICATE_TRIGGERED",
                        "predicate_inputs": inputs,
                    }
                )
                return True

            # Predicate is clear — check min-hold
            if self._override_active:
                # Increment hold ticks first, then check against threshold.
                # This means with override_min_hold_ticks=3:
                #   tick 1 (activation): hold_ticks=1
                #   tick 2 (clear, suppressed): hold_ticks=2 < 3 → MIN_HOLD_SUPPRESSED
                #   tick 3 (clear, recovery): hold_ticks=3, 3 < 3 is False → PREDICATE_CLEAR_APPLIED
                self._override_hold_ticks += 1
                if self._override_hold_ticks < self._override_min_hold_ticks:
                    self._override_history.append(
                        {
                            "override_active": True,
                            "reason_code": "MIN_HOLD_SUPPRESSED",
                            "predicate_inputs": inputs,
                        }
                    )
                    return True

                # Min-hold elapsed — check cooldown
                if self._override_cooldown_remaining > 0:
                    self._override_cooldown_remaining -= 1
                    self._override_history.append(
                        {
                            "override_active": True,
                            "reason_code": "COOLDOWN_SUPPRESSED",
                            "predicate_inputs": inputs,
                        }
                    )
                    return True

                # Clear override
                self._override_active = False
                self._override_hold_ticks = 0
                self._override_history.append(
                    {
                        "override_active": False,
                        "reason_code": "PREDICATE_CLEAR_APPLIED",
                        "predicate_inputs": inputs,
                    }
                )
                return False

            # Override was not active and predicate is clear
            self._override_history.append(
                {
                    "override_active": False,
                    "reason_code": "PREDICATE_CLEAR",
                    "predicate_inputs": inputs,
                }
            )
            return False

    # ------------------------------------------------------------------
    # Likelihood specification registry & calibration
    # ------------------------------------------------------------------

    def register_likelihood(
        self,
        *,
        regime: str,
        model_class: str,
        likelihood_form: str,
        noise_model: str,
        parameter_bounds: Optional[Dict[str, Tuple[float, float]]] = None,
    ) -> None:
        """Register a likelihood specification for a regime/model-class pair."""
        key = f"{regime}:{model_class}"
        with self._lock:
            self._likelihood_specs[key] = {
                "regime": regime,
                "model_class": model_class,
                "likelihood_form": likelihood_form,
                "noise_model": noise_model,
                "parameter_bounds": parameter_bounds or {},
            }

    @staticmethod
    def _compute_nll(
        pairs: List[Tuple[float, float]],
        likelihood_form: str,
    ) -> float:
        """Compute negative log-likelihood for *pairs* using *likelihood_form*.

        Supported forms:
        - ``"bernoulli"`` — binary cross-entropy
        - ``"gaussian"`` — mean-squared-error proxy (Gaussian NLL with unit variance)
        - anything else — falls back to bernoulli
        """
        n = len(pairs)
        if n == 0:
            return 0.0
        eps = 1e-15
        if likelihood_form == "gaussian":
            # Gaussian NLL with unit variance: 0.5 * mean((y - mu)^2) + 0.5*log(2*pi)
            return sum(0.5 * (obs - pred) ** 2 for pred, obs in pairs) / n + 0.5 * math.log(2 * math.pi)
        # Default: bernoulli (binary cross-entropy)
        return -sum(
            obs * math.log(max(pred, eps)) + (1.0 - obs) * math.log(max(1.0 - pred, eps))
            for pred, obs in pairs
        ) / n

    def calibrate_regime(
        self,
        *,
        regime: str,
        model_class: str,
        predicted_probabilities: List[float],
        observed_outcomes: List[float],
        bins: int = 10,
    ) -> Dict[str, Any]:
        """Calibrate a regime/model-class pair and return diagnostics."""
        key = f"{regime}:{model_class}"
        with self._lock:
            # Store calibration data
            pairs = list(zip(predicted_probabilities, observed_outcomes))
            self._calibration_data[key] = pairs

            n = len(pairs)
            if n == 0:
                return {
                    "regime": regime,
                    "model_class": model_class,
                    "sample_size": 0,
                    "nll": 0.0,
                    "reliability_curve": [],
                }

            # Look up the registered likelihood form for this key
            spec = self._likelihood_specs.get(key, {})
            likelihood_form = spec.get("likelihood_form", "bernoulli")
            nll = self._compute_nll(pairs, likelihood_form)

            # Reliability curve: bin predictions and compute mean pred/obs per bin
            bin_edges = [i / bins for i in range(bins + 1)]
            reliability_curve = []
            for i in range(bins):
                lo, hi = bin_edges[i], bin_edges[i + 1]
                # Include upper edge in last bin
                if i == bins - 1:
                    bin_pairs = [(p, o) for p, o in pairs if lo <= p <= hi]
                else:
                    bin_pairs = [(p, o) for p, o in pairs if lo <= p < hi]
                if bin_pairs:
                    mean_pred = sum(p for p, _ in bin_pairs) / len(bin_pairs)
                    mean_obs = sum(o for _, o in bin_pairs) / len(bin_pairs)
                    reliability_curve.append(
                        {"mean_predicted": mean_pred, "mean_observed": mean_obs, "count": len(bin_pairs)}
                    )

            return {
                "regime": regime,
                "model_class": model_class,
                "sample_size": n,
                "nll": round(nll, 10),
                "reliability_curve": reliability_curve,
            }

    def likelihood_diagnostics(self) -> Dict[str, Any]:
        """Return a diagnostics payload for all registered likelihood specs."""
        with self._lock:
            specs_out: Dict[str, Any] = {}
            for key, spec in self._likelihood_specs.items():
                specs_out[key] = {
                    "likelihood_form": spec["likelihood_form"],
                    "noise_model": spec["noise_model"],
                    "parameter_bounds": spec["parameter_bounds"],
                }

            calibration_out: Dict[str, Any] = {}
            for key, pairs in self._calibration_data.items():
                n = len(pairs)
                spec = self._likelihood_specs.get(key, {})
                likelihood_form = spec.get("likelihood_form", "bernoulli")
                nll = self._compute_nll(pairs, likelihood_form)
                bins = 10
                bin_edges = [i / bins for i in range(bins + 1)]
                reliability_curve = []
                for i in range(bins):
                    lo, hi = bin_edges[i], bin_edges[i + 1]
                    if i == bins - 1:
                        bin_pairs = [(p, o) for p, o in pairs if lo <= p <= hi]
                    else:
                        bin_pairs = [(p, o) for p, o in pairs if lo <= p < hi]
                    if bin_pairs:
                        mean_pred = sum(p for p, _ in bin_pairs) / len(bin_pairs)
                        mean_obs = sum(o for _, o in bin_pairs) / len(bin_pairs)
                        reliability_curve.append(
                            {"mean_predicted": mean_pred, "mean_observed": mean_obs, "count": len(bin_pairs)}
                        )
                calibration_out[key] = {
                    "sample_size": n,
                    "nll": round(nll, 10),
                    "reliability_curve": reliability_curve,
                }

            return {
                "specifications": specs_out,
                "calibration": calibration_out,
            }

    # ------------------------------------------------------------------
    # Governance diagnostics
    # ------------------------------------------------------------------

    def compute_governance_diagnostics(self, policy_state: PolicyState) -> Dict[str, Any]:
        """Compute governance diagnostics for *policy_state*.

        Confidence formula (v1):
            0.70 * match_rate + 0.20 * compliance_rate + 0.10 * non_escalation_rate

        where:
            match_rate          = rules_matched / rules_evaluated
            compliance_rate     = (rules_evaluated - violations) / rules_evaluated
            non_escalation_rate = (rules_evaluated - escalations) / rules_evaluated
        """
        n = policy_state.rules_evaluated
        if n == 0:
            confidence = 0.0
        else:
            match_rate = policy_state.rules_matched / n
            compliance_rate = (n - policy_state.violations) / n
            non_escalation_rate = (n - policy_state.escalations) / n
            confidence = round(
                0.70 * match_rate + 0.20 * compliance_rate + 0.10 * non_escalation_rate,
                10,
            )

        # Round to 2 decimal places for stable output
        confidence = round(confidence, 2)

        if confidence >= 0.90:
            rule_match_strength = "strong"
        elif confidence >= 0.75:
            rule_match_strength = "moderate"
        else:
            rule_match_strength = "weak"

        return {
            "policy_metadata": {
                "confidence_formula_version": "policy_confidence.v1",
                "confidence_formula": (
                    "0.70*match_rate + 0.20*compliance_rate + 0.10*non_escalation_rate"
                ),
            },
            "diagnostics": {
                "confidence": confidence,
                "rule_match_strength": rule_match_strength,
                "rules_evaluated": n,
                "rules_matched": policy_state.rules_matched,
                "violations": policy_state.violations,
                "escalations": policy_state.escalations,
            },
        }

    # ------------------------------------------------------------------
    # Violation / fault model diagnostics
    # ------------------------------------------------------------------

    def violation_status(self) -> Dict[str, Any]:
        """Return a summary of current violation status."""
        with self._lock:
            rollback_ready = self.should_trigger_rollback()
            low_coverage_layers = [
                layer
                for layer, cov in self._coverage.items()
                if cov < self._rollback_threshold
            ]
            return {
                "violation_detected": rollback_ready,
                "low_coverage_layers": low_coverage_layers,
                "override_active": self._override_active,
                "audit_log_entries": len(self._audit_log),
            }

    def fault_model_diagnostics(self) -> Dict[str, Any]:
        """Return fault-model, collapse-resistance, and integrity diagnostics."""
        with self._lock:
            coverage_values = list(self._coverage.values()) or [_DEFAULT_COVERAGE]
            mean_coverage = sum(coverage_values) / len(coverage_values)
            collapse_resistance = round(mean_coverage / 100.0, 4)
            integrity = "nominal" if collapse_resistance >= 0.75 else "degraded"
            return {
                "fault_model": "coverage_deficit_lyapunov_v1",
                "collapse_resistance": collapse_resistance,
                "integrity": integrity,
                "mean_coverage": round(mean_coverage, 4),
                "layers_monitored": len(self._coverage),
            }


