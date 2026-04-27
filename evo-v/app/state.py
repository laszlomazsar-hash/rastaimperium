from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Deque


class EvoState(str, Enum):
    NORMAL = "NORMAL"
    DEGRADED = "DEGRADED"
    DRIFT = "DRIFT"
    COMPROMISE = "COMPROMISE"
    RECOVERY = "RECOVERY"


LEGAL_TRANSITIONS: dict[EvoState, set[EvoState]] = {
    EvoState.NORMAL: {EvoState.DEGRADED, EvoState.DRIFT, EvoState.COMPROMISE},
    EvoState.DEGRADED: {
        EvoState.NORMAL,
        EvoState.DRIFT,
        EvoState.COMPROMISE,
        EvoState.RECOVERY,
    },
    EvoState.DRIFT: {EvoState.DEGRADED, EvoState.COMPROMISE, EvoState.RECOVERY},
    EvoState.COMPROMISE: {EvoState.RECOVERY},
    EvoState.RECOVERY: {EvoState.NORMAL, EvoState.DEGRADED},
}


@dataclass(frozen=True, slots=True)
class TransitionRecord:
    from_state: EvoState
    to_state: EvoState
    at: datetime
    reason: str | None = None

    def as_dict(self) -> dict[str, str | None]:
        return {
            "from_state": self.from_state,
            "to_state": self.to_state,
            "at": self.at.isoformat(),
            "reason": self.reason,
        }


class StateMachine:
    """Finite state machine used by health checks and watchdog workflows."""

    def __init__(self, history_size: int = 50) -> None:
        self.current_state: EvoState = EvoState.NORMAL
        self.previous_state: EvoState | None = None
        self.last_transition_at: datetime | None = None
        self.transition_history: Deque[TransitionRecord] = deque(maxlen=history_size)

    @staticmethod
    def _utc_now() -> datetime:
        return datetime.now(timezone.utc)

    def can_transition(self, to_state: EvoState) -> bool:
        if to_state == self.current_state:
            return True
        return to_state in LEGAL_TRANSITIONS[self.current_state]

    def transition(self, to_state: EvoState, reason: str | None = None) -> bool:
        if not self.can_transition(to_state):
            raise ValueError(f"Illegal transition {self.current_state} -> {to_state}")

        if to_state == self.current_state:
            return False

        now = self._utc_now()
        self.transition_history.append(
            TransitionRecord(
                from_state=self.current_state,
                to_state=to_state,
                at=now,
                reason=reason,
            )
        )
        self.previous_state = self.current_state
        self.current_state = to_state
        self.last_transition_at = now
        return True

    # Helper methods used by watchdog and health checks.
    def is_healthy(self) -> bool:
        return self.current_state == EvoState.NORMAL

    def needs_watchdog_attention(self) -> bool:
        return self.current_state in {
            EvoState.DEGRADED,
            EvoState.DRIFT,
            EvoState.COMPROMISE,
        }

    def in_recovery(self) -> bool:
        return self.current_state == EvoState.RECOVERY

    def as_dict(self) -> dict[str, object]:
        return {
            "current_state": self.current_state,
            "previous_state": self.previous_state,
            "last_transition_at": self.last_transition_at.isoformat()
            if self.last_transition_at
            else None,
            "transition_history": [
                transition.as_dict() for transition in self.transition_history
            ],
        }


state_machine = StateMachine()
