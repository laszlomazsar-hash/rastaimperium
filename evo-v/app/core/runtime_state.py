from __future__ import annotations

from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Deque

from core.codex_engine import CodexEngine


MAX_TRANSITIONS = 20


@dataclass
class RuntimeState:
    current_state: str = "initializing"
    state_reason: str = "Engine booted and waiting for first workload."
    last_transition_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
    recent_transitions: Deque[dict[str, str]] = field(
        default_factory=lambda: deque(maxlen=MAX_TRANSITIONS)
    )
    watchdog_status: str = "nominal"

    def transition_to(self, new_state: str, reason: str) -> None:
        timestamp = datetime.now(timezone.utc).isoformat()
        self.current_state = new_state
        self.state_reason = reason
        self.last_transition_at = timestamp
        self.recent_transitions.appendleft(
            {
                "to": new_state,
                "reason": reason,
                "at": timestamp,
            }
        )

    def set_watchdog(self, status: str) -> None:
        self.watchdog_status = status

    def snapshot(self, limit: int = 10) -> dict:
        bounded = list(self.recent_transitions)[:limit]
        return {
            "current_state": self.current_state,
            "state_reason": self.state_reason,
            "last_transition_at": self.last_transition_at,
            "recent_transitions": bounded,
            "watchdog_status": self.watchdog_status,
        }


engine = CodexEngine()
runtime_state = RuntimeState()
runtime_state.transition_to("idle", "Awaiting provisioning requests.")
