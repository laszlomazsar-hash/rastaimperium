"""Runtime state tracking for EVO-V deployment health."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
import threading
import time
from typing import Any


class ProofStatus(str, Enum):
    """State machine values for proof verification outcomes."""

    VALID = "valid"
    UNKNOWN = "unknown"
    INVALID = "invalid"


class RuntimeMode(str, Enum):
    """High-level runtime mode used for watchdog transitions."""

    NORMAL = "NORMAL"
    COMPROMISE = "COMPROMISE"


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


STATE = RuntimeState()
