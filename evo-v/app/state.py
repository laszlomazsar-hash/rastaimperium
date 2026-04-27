from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Deque, Literal

TransitionSource = Literal["watchdog", "health", "manual"]


@dataclass(frozen=True)
class TransitionEvent:
    from_state: str
    to_state: str
    at: str
    reason: str
    source: TransitionSource


class StateTracker:
    def __init__(self, initial_state: str = "booting", history_size: int = 100) -> None:
        self.current_state = initial_state
        self._transition_history: Deque[TransitionEvent] = deque(maxlen=history_size)

    def transition_to(self, to_state: str, reason: str, source: TransitionSource) -> TransitionEvent | None:
        if to_state == self.current_state:
            return None

        event = TransitionEvent(
            from_state=self.current_state,
            to_state=to_state,
            at=datetime.now(timezone.utc).isoformat(),
            reason=reason,
            source=source,
        )
        self.current_state = to_state
        self._transition_history.append(event)
        return event

    def state_payload(self) -> dict:
        return {
            "state": self.current_state,
            "transition_history": [event.__dict__ for event in self._transition_history],
        }

    def epistemic_summary(self) -> dict:
        if not self._transition_history:
            return {
                "state": self.current_state,
                "summary": "No transitions recorded yet.",
                "history": [],
            }

        history = [
            (
                f"{event.at}: {event.from_state} -> {event.to_state} "
                f"(source={event.source}, reason={event.reason})"
            )
            for event in self._transition_history
        ]
        return {
            "state": self.current_state,
            "summary": f"{len(self._transition_history)} transition(s) tracked.",
            "history": history,
        }


state_tracker = StateTracker()
