from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from threading import RLock
from typing import Mapping


class RuntimeState(str, Enum):
    NORMAL = "NORMAL"
    DEGRADED = "DEGRADED"
    DRIFT = "DRIFT"
    COMPROMISE = "COMPROMISE"
    RECOVERY = "RECOVERY"


DEFAULT_ALLOWED_TRANSITIONS: Mapping[RuntimeState, frozenset[RuntimeState]] = {
    RuntimeState.NORMAL: frozenset({RuntimeState.DEGRADED, RuntimeState.COMPROMISE}),
    RuntimeState.DEGRADED: frozenset(
        {RuntimeState.NORMAL, RuntimeState.DRIFT, RuntimeState.COMPROMISE}
    ),
    RuntimeState.DRIFT: frozenset(
        {RuntimeState.DEGRADED, RuntimeState.RECOVERY, RuntimeState.COMPROMISE}
    ),
    RuntimeState.COMPROMISE: frozenset({RuntimeState.RECOVERY}),
    RuntimeState.RECOVERY: frozenset(
        {
            RuntimeState.NORMAL,
            RuntimeState.DEGRADED,
            RuntimeState.DRIFT,
            RuntimeState.COMPROMISE,
        }
    ),
}


@dataclass(slots=True)
class StateManager:
    allowed_transitions: Mapping[RuntimeState, frozenset[RuntimeState]] = field(
        default_factory=lambda: DEFAULT_ALLOWED_TRANSITIONS
    )
    current_state: RuntimeState = RuntimeState.NORMAL
    previous_state: RuntimeState | None = None
    last_transition_at: datetime | None = None
    compromise_started_at: datetime | None = None
    anomaly_streak: int = 0
    recovery_streak: int = 0
    _lock: RLock = field(default_factory=RLock, init=False, repr=False)

    def transition_to(
        self,
        new_state: RuntimeState,
        reason: str,
        source: str,
    ) -> RuntimeState:
        if not reason.strip():
            raise ValueError("reason must be a non-empty string")
        if not source.strip():
            raise ValueError("source must be a non-empty string")

        with self._lock:
            if new_state == self.current_state:
                return self.current_state

            allowed = self.allowed_transitions.get(self.current_state, frozenset())
            if new_state not in allowed:
                raise ValueError(
                    "invalid transition "
                    f"{self.current_state.value} -> {new_state.value} "
                    f"(reason={reason!r}, source={source!r})"
                )

            self.previous_state = self.current_state
            self.current_state = new_state
            self.last_transition_at = datetime.now(timezone.utc)

            if new_state == RuntimeState.COMPROMISE:
                self.compromise_started_at = self.last_transition_at
            elif new_state == RuntimeState.NORMAL:
                self.compromise_started_at = None

            return self.current_state

    def record_anomaly(self, source: str, reason: str = "anomaly observed") -> RuntimeState:
        with self._lock:
            self.anomaly_streak += 1
            self.recovery_streak = 0

            if self.current_state == RuntimeState.NORMAL:
                return self.transition_to(RuntimeState.DEGRADED, reason=reason, source=source)
            if self.current_state == RuntimeState.DEGRADED:
                return self.transition_to(RuntimeState.DRIFT, reason=reason, source=source)
            if self.current_state == RuntimeState.DRIFT:
                return self.transition_to(RuntimeState.COMPROMISE, reason=reason, source=source)
            if self.current_state == RuntimeState.RECOVERY:
                return self.transition_to(RuntimeState.DEGRADED, reason=reason, source=source)

            return self.current_state

    def record_recovery(self, source: str, reason: str = "recovery observed") -> RuntimeState:
        with self._lock:
            self.recovery_streak += 1
            self.anomaly_streak = 0

            if self.current_state == RuntimeState.COMPROMISE:
                return self.transition_to(RuntimeState.RECOVERY, reason=reason, source=source)
            if self.current_state == RuntimeState.DRIFT:
                return self.transition_to(RuntimeState.DEGRADED, reason=reason, source=source)
            if self.current_state in {RuntimeState.DEGRADED, RuntimeState.RECOVERY}:
                return self.transition_to(RuntimeState.NORMAL, reason=reason, source=source)

            return self.current_state
