"""Runtime state tracking for EVO-V deployment health."""

from __future__ import annotations

from dataclasses import dataclass, field
import threading
import time


@dataclass
class RuntimeState:
    """Shared mutable state used by health and watchdog checks."""

    boot_time: float = field(default_factory=time.time)
    last_check: float | None = None
    failure_count: int = 0
    last_failure: str | None = None
    watchdog_started: bool = False
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


STATE = RuntimeState()
