"""Enhanced safety validator with enforceable compactness policy bounds."""

from __future__ import annotations

from dataclasses import dataclass
import math
from typing import Any, Dict, List, Mapping, Sequence, Tuple


MetricTriplet = Dict[str, float]
TopologicalState = Dict[str, Any]


@dataclass(frozen=True)
class CompactnessPolicyBounds:
    """Concrete bounds required by compactness assumptions."""

    max_hypotheses: int = 64
    predictive_mean_range: Tuple[float, float] = (-1000.0, 1000.0)
    variance_range: Tuple[float, float] = (1e-9, 1000.0)
    log_belief_range: Tuple[float, float] = (-1000.0, 0.0)


class EnhancedSafetyValidator:
    """Validator that enforces bounded-state assumptions before commit."""

    _NON_METRIC_METADATA_KEYS = {
        "id",
        "ids",
        "uuid",
        "nonce",
        "trace_id",
        "request_id",
        "created_at",
        "updated_at",
        "timestamp",
    }

    def __init__(self, bounds: CompactnessPolicyBounds | None = None) -> None:
        self.bounds = bounds or CompactnessPolicyBounds()

    def validate(self, content: str) -> bool:
        return bool(content)

    def _enforce_range(self, name: str, value: float, bounds: Tuple[float, float]) -> float:
        lower, upper = bounds
        if not math.isfinite(value):
            raise ValueError(f"{name} must be finite")
        if value < lower or value > upper:
            raise ValueError(f"{name}={value} out of bounds [{lower}, {upper}]")
        return value

    def enforce_metric_bounds(self, metrics: Mapping[str, Any]) -> MetricTriplet:
        """Validate and normalize the metric triplet used in compactness arguments."""

        predictive_mean = self._enforce_range(
            "predictive_mean",
            float(metrics["predictive_mean"]),
            self.bounds.predictive_mean_range,
        )
        variance = self._enforce_range(
            "variance",
            float(metrics["variance"]),
            self.bounds.variance_range,
        )
        log_belief = self._enforce_range(
            "log_belief",
            float(metrics["log_belief"]),
            self.bounds.log_belief_range,
        )
        return {
            "predictive_mean": predictive_mean,
            "variance": variance,
            "log_belief": log_belief,
        }

    def enforce_hypothesis_family(self, hypotheses: Sequence[Mapping[str, Any]]) -> List[MetricTriplet]:
        """Enforce upper cardinality bound and per-hypothesis metric bounds."""

        if len(hypotheses) > self.bounds.max_hypotheses:
            raise ValueError(
                f"hypothesis count {len(hypotheses)} exceeds max_hypotheses={self.bounds.max_hypotheses}"
            )
        return [self.enforce_metric_bounds(hypothesis) for hypothesis in hypotheses]

    def canonical_projection(
        self,
        state: Mapping[str, Any],
        *,
        include_bounded_metadata: bool = False,
        metadata_bounds: Mapping[str, Tuple[float, float]] | None = None,
    ) -> TopologicalState:
        """
        Project state to canonical compactness-relevant coordinates.

        - Default: ignores non-metric metadata (IDs, trace values, timestamps, etc.).
        - Optional: include explicitly bounded metadata keys.
        """

        projected: TopologicalState = {}

        if "hypotheses" in state and isinstance(state["hypotheses"], Sequence):
            projected["hypotheses"] = self.enforce_hypothesis_family(
                [h for h in state["hypotheses"] if isinstance(h, Mapping)]
            )

        if "metrics" in state and isinstance(state["metrics"], Mapping):
            projected["metrics"] = self.enforce_metric_bounds(state["metrics"])

        if include_bounded_metadata and metadata_bounds:
            bounded_metadata: Dict[str, float] = {}
            for key, key_bounds in metadata_bounds.items():
                if key in state:
                    bounded_metadata[key] = self._enforce_range(
                        key,
                        float(state[key]),
                        key_bounds,
                    )
            if bounded_metadata:
                projected["bounded_metadata"] = bounded_metadata

        topology = state.get("topology")
        if isinstance(topology, Mapping):
            projected["topology"] = {
                k: v
                for k, v in topology.items()
                if k not in self._NON_METRIC_METADATA_KEYS
            }

        return projected

    def enforce_structural_operation(
        self,
        state: Mapping[str, Any],
        op: Mapping[str, Any],
    ) -> TopologicalState:
        """Apply structural operation and enforce compactness bounds on the result."""

        operation = op.get("op")
        if operation not in {"append_hypothesis", "replace_metrics"}:
            raise ValueError(f"Unsupported structural operation: {operation}")

        new_state: TopologicalState = dict(state)

        if operation == "append_hypothesis":
            hypotheses = list(new_state.get("hypotheses", []))
            payload = op.get("payload")
            if not isinstance(payload, Mapping):
                raise ValueError("append_hypothesis requires mapping payload")
            hypotheses.append(dict(payload))
            new_state["hypotheses"] = hypotheses

        if operation == "replace_metrics":
            payload = op.get("payload")
            if not isinstance(payload, Mapping):
                raise ValueError("replace_metrics requires mapping payload")
            new_state["metrics"] = dict(payload)

        # Hard gate: projected result must satisfy all enforceable bounds.
        self.commit_gate(new_state)
        return new_state

    def commit_gate(self, state: Mapping[str, Any]) -> bool:
        """Accept commit only when compactness assumptions are enforceably true."""

        hypotheses = state.get("hypotheses", [])
        if not isinstance(hypotheses, Sequence):
            raise ValueError("state.hypotheses must be a sequence")

        metrics = state.get("metrics", {})
        if not isinstance(metrics, Mapping):
            raise ValueError("state.metrics must be a mapping")

        self.enforce_hypothesis_family([h for h in hypotheses if isinstance(h, Mapping)])
        self.enforce_metric_bounds(metrics)
        self.canonical_projection(state)
        return True

    def compactness_theorem_statement(self) -> str:
        """Scope-limited theorem statement under explicit enforced bounds."""

        return (
            "Compactness theorem (bounded form): Any sequence of canonical projections "
            "produced by this validator has a convergent subsequence only when commits pass "
            "the gate enforcing max_hypotheses and bounded predictive_mean, variance, and "
            "log_belief ranges."
        )
