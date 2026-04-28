from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass(frozen=True)
class PhaseThreshold:
    enter: float
    exit: float


@dataclass(frozen=True)
class PhaseTransitionEvent:
    tick: int
    from_phase: str
    to_phase: str
    contradiction_signal: float
    reason: str


class RegimePhaseSwitcher:
    """Hysteresis-based phase switching for noisy contradiction signals."""

    def __init__(
        self,
        phase_order: List[str],
        thresholds: Dict[str, PhaseThreshold],
        min_dwell_ticks: int = 0,
        initial_phase: str | None = None,
    ) -> None:
        if not phase_order:
            raise ValueError("phase_order must not be empty")

        missing = [phase for phase in phase_order if phase not in thresholds]
        if missing:
            raise ValueError(f"Missing thresholds for phases: {missing}")

        for phase in phase_order:
            threshold = thresholds[phase]
            if threshold.enter < threshold.exit:
                raise ValueError(
                    f"Invalid thresholds for phase '{phase}': enter must be >= exit",
                )

        if min_dwell_ticks < 0:
            raise ValueError("min_dwell_ticks must be >= 0")

        self.phase_order = phase_order
        self.thresholds = thresholds
        self.min_dwell_ticks = min_dwell_ticks
        self.current_phase = initial_phase or phase_order[0]

        if self.current_phase not in self.phase_order:
            raise ValueError(f"initial_phase '{self.current_phase}' must be in phase_order")

        self.tick = 0
        self.phase_entered_at = 0
        self.last_transition_reason = "initialized"
        self.transition_events: List[PhaseTransitionEvent] = []

    def update(self, contradiction_signal: float, reason: str = "") -> str:
        """Advance one tick and update phase using hysteresis + dwell constraints."""

        self.tick += 1
        current_index = self.phase_order.index(self.current_phase)
        target_index = current_index

        # Escalate to more severe phases when crossing enter thresholds.
        while target_index + 1 < len(self.phase_order):
            candidate_phase = self.phase_order[target_index + 1]
            if contradiction_signal >= self.thresholds[candidate_phase].enter:
                target_index += 1
                continue
            break

        # De-escalate to less severe phases when crossing exit thresholds.
        while target_index > 0:
            phase_at_target = self.phase_order[target_index]
            if contradiction_signal < self.thresholds[phase_at_target].exit:
                target_index -= 1
                continue
            break

        if target_index == current_index:
            return self.current_phase

        dwell_ticks = self.tick - self.phase_entered_at
        if dwell_ticks < self.min_dwell_ticks:
            return self.current_phase

        from_phase = self.current_phase
        self.current_phase = self.phase_order[target_index]
        self.phase_entered_at = self.tick

        transition_reason = (
            reason
            or f"contradiction_signal={contradiction_signal:.4f}, "
            f"dwell_ticks={dwell_ticks}, min_dwell_ticks={self.min_dwell_ticks}"
        )
        self.last_transition_reason = transition_reason
        self.transition_events.append(
            PhaseTransitionEvent(
                tick=self.tick,
                from_phase=from_phase,
                to_phase=self.current_phase,
                contradiction_signal=contradiction_signal,
                reason=transition_reason,
            ),
        )
        return self.current_phase

    def replayable_transitions(self) -> List[dict[str, object]]:
        """Serialized phase transition events for audit/replay pipelines."""

        return [
            {
                "tick": event.tick,
                "from_phase": event.from_phase,
                "to_phase": event.to_phase,
                "contradiction_signal": event.contradiction_signal,
                "reason": event.reason,
            }
            for event in self.transition_events
        ]
