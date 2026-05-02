"""Runtime and transition state for EVO-V health/watchdog workflows."""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
import threading
import time
from typing import Any, Deque


class ProofStatus(str, Enum):
    UNKNOWN = "UNKNOWN"
    VALID = "VALID"
    INVALID = "INVALID"


class RuntimeMode(str, Enum):
    NORMAL = "NORMAL"
    COMPROMISE = "COMPROMISE"


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

    def as_dict(self) -> dict[str, object]:
        return {
            "current_state": self.current_state,
            "previous_state": self.previous_state,
            "last_transition_at": self.last_transition_at.isoformat() if self.last_transition_at else None,
            "transition_history": [transition.as_dict() for transition in self.transition_history],
        }


@dataclass
class RuntimeState:
    """Shared mutable state used by health and watchdog checks."""

    boot_time: float = field(default_factory=time.time)
    last_check: float | None = None
    failure_count: int = 0
    last_failure: str | None = None
    watchdog_started: bool = False
    proof_status: ProofStatus = ProofStatus.UNKNOWN
    proof_failure_count: int = 0
    proof_last_failure: str | None = None
    proof_last_checked: float | None = None
    proof_attack_evidence: list[dict[str, Any]] = field(default_factory=list)
    mode: RuntimeMode = RuntimeMode.NORMAL
    lock: threading.Lock = field(default_factory=threading.Lock)

    def mark_check(self) -> None:
        with self.lock:
            self.last_check = time.time()

    def mark_failure(self, reason: str) -> None:
        with self.lock:
            self.failure_count += 1
            self.last_failure = reason

    def mark_watchdog_started(self) -> bool:
        with self.lock:
            if self.watchdog_started:
                return False
            self.watchdog_started = True
            return True

    def update_proof_status(self, status: ProofStatus) -> None:
        with self.lock:
            self.proof_status = status
            self.proof_last_checked = time.time()

    def record_proof_attack(self, reason: str, evidence: dict[str, Any]) -> None:
        with self.lock:
            self.proof_status = ProofStatus.INVALID
            self.proof_failure_count += 1
            self.proof_last_failure = reason
            self.proof_last_checked = time.time()
            self.mode = RuntimeMode.COMPROMISE
            payload = {
                "timestamp": self.proof_last_checked,
                "reason": reason,
                "evidence": evidence,
            }
            self.proof_attack_evidence.append(payload)

    def proof_snapshot(self) -> dict[str, Any]:
        with self.lock:
            return {
                "proof_status": self.proof_status.value,
                "proof_failure_count": self.proof_failure_count,
                "proof_last_failure": self.proof_last_failure,
                "proof_last_checked": self.proof_last_checked,
                "mode": self.mode.value,
                "attack_evidence": list(self.proof_attack_evidence[-50:]),
            }


state_machine = StateMachine()
STATE = RuntimeState()
