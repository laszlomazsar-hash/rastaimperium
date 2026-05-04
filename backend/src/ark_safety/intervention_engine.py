from __future__ import annotations

from dataclasses import dataclass


def _clamp_unit(value: float) -> float:
    return max(0.0, min(1.0, value))


@dataclass(frozen=True)
class InterventionState:
    """Observable state used to score deterministic recovery interventions."""

    drift_score: float
    containment_score: float
    rollback_ready: float
    human_approval: bool
    lyapunov_margin: float


@dataclass(frozen=True)
class InterventionDecision:
    """Deterministic intervention output for v7 remediation mode."""

    recovery_score: float
    action: str
    intervention_allowed: bool
    reason: str


class V7InterventionEngine:
    """Deterministic intervention policy with explicit Lyapunov and governance gates."""

    def __init__(self, *, trigger_threshold: float = 0.55, critical_threshold: float = 0.80) -> None:
        if not 0.0 <= trigger_threshold <= 1.0:
            raise ValueError("trigger_threshold must be within [0, 1]")
        if not 0.0 <= critical_threshold <= 1.0:
            raise ValueError("critical_threshold must be within [0, 1]")
        if critical_threshold < trigger_threshold:
            raise ValueError("critical_threshold must be >= trigger_threshold")
        self._trigger_threshold = trigger_threshold
        self._critical_threshold = critical_threshold

    def recovery_score(self, state: InterventionState) -> float:
        """Compute bounded score where higher values indicate stronger intervention urgency."""
        drift = _clamp_unit(state.drift_score)
        containment = _clamp_unit(state.containment_score)
        rollback = _clamp_unit(state.rollback_ready)
        # Penalize poor containment and absent rollback readiness.
        raw = (0.60 * drift) + (0.25 * (1.0 - containment)) + (0.15 * (1.0 - rollback))
        return _clamp_unit(raw)

    def decide(self, state: InterventionState) -> InterventionDecision:
        score = self.recovery_score(state)

        if state.lyapunov_margin < 0.0:
            return InterventionDecision(
                recovery_score=score,
                action="hold",
                intervention_allowed=False,
                reason="lyapunov_guard_negative_margin",
            )

        if score < self._trigger_threshold:
            return InterventionDecision(
                recovery_score=score,
                action="observe",
                intervention_allowed=False,
                reason="below_trigger_threshold",
            )

        if not state.human_approval:
            return InterventionDecision(
                recovery_score=score,
                action="queue_review",
                intervention_allowed=False,
                reason="human_governance_required",
            )

        action = "rollback" if score >= self._critical_threshold else "rebalance"
        return InterventionDecision(
            recovery_score=score,
            action=action,
            intervention_allowed=True,
            reason="deterministic_intervention_authorized",
        )
