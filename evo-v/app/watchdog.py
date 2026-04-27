import logging
import os
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Any

logger = logging.getLogger(__name__)


class WatchdogState(str, Enum):
    HEALTHY = "HEALTHY"
    DEGRADED = "DEGRADED"
    DRIFT = "DRIFT"
    COMPROMISE = "COMPROMISE"
    RECOVERY = "RECOVERY"


@dataclass
class WatchdogConfig:
    interval_seconds: float = field(default_factory=lambda: float(os.getenv("EVO_WATCHDOG_INTERVAL_SECONDS", "5")))
    retry_count: int = field(default_factory=lambda: int(os.getenv("EVO_WATCHDOG_RETRY_COUNT", "3")))
    stale_heartbeat_seconds: float = field(
        default_factory=lambda: float(os.getenv("EVO_WATCHDOG_STALE_HEARTBEAT_SECONDS", "30"))
    )


@dataclass
class LayeredWatchdog:
    config: WatchdogConfig = field(default_factory=WatchdogConfig)
    state: WatchdogState = WatchdogState.HEALTHY
    counters: dict[str, int] = field(
        default_factory=lambda: {
            "route_integrity": 0,
            "heartbeat_freshness": 0,
            "invariant_failures": 0,
            "repeated_anomaly_threshold": 0,
            "compromise_cycles": 0,
        }
    )

    def evaluate(self, snapshot: dict[str, Any]) -> None:
        """Evaluate layered anomaly checks and mutate watchdog state."""
        self._check_route_integrity(snapshot)
        self._check_heartbeat_freshness(snapshot)
        self._check_invariants(snapshot)
        self._check_repeated_anomaly_threshold()

    def _check_route_integrity(self, snapshot: dict[str, Any]) -> None:
        if snapshot.get("route_integrity_ok", True):
            return

        self._record_non_fatal("route_integrity", WatchdogState.DEGRADED, "route-integrity-anomaly")

    def _check_heartbeat_freshness(self, snapshot: dict[str, Any]) -> None:
        heartbeat_ts = snapshot.get("last_heartbeat")
        if heartbeat_ts is None:
            self._record_non_fatal("heartbeat_freshness", WatchdogState.DEGRADED, "heartbeat-missing")
            return

        age_seconds = max(0.0, time.time() - float(heartbeat_ts))
        if age_seconds > self.config.stale_heartbeat_seconds:
            self._record_non_fatal(
                "heartbeat_freshness",
                WatchdogState.DRIFT,
                "heartbeat-stale",
                age_seconds=round(age_seconds, 3),
                stale_threshold=self.config.stale_heartbeat_seconds,
            )

    def _check_invariants(self, snapshot: dict[str, Any]) -> None:
        if snapshot.get("invariants_ok", True):
            return

        self.counters["invariant_failures"] += 1
        self._record_state_transition(WatchdogState.COMPROMISE, "invariant-break")
        self._record_state_transition(WatchdogState.RECOVERY, "invariant-break")
        self.counters["compromise_cycles"] += 1

        if self._restart_criteria_met():
            self._log_event(
                "fatal-restart",
                severity="critical",
                invariant_failures=self.counters["invariant_failures"],
                compromise_cycles=self.counters["compromise_cycles"],
                retry_count=self.config.retry_count,
            )
            os._exit(1)

    def _check_repeated_anomaly_threshold(self) -> None:
        non_fatal_total = (
            self.counters["route_integrity"] + self.counters["heartbeat_freshness"]
        )
        if non_fatal_total < self.config.retry_count:
            return

        self.counters["repeated_anomaly_threshold"] += 1
        self._record_non_fatal(
            "repeated_anomaly_threshold",
            WatchdogState.DRIFT,
            "repeated-anomaly-threshold",
            non_fatal_total=non_fatal_total,
            retry_count=self.config.retry_count,
        )

    def _restart_criteria_met(self) -> bool:
        return self.counters["compromise_cycles"] >= self.config.retry_count

    def _record_non_fatal(
        self,
        counter_key: str,
        next_state: WatchdogState,
        event_type: str,
        **details: Any,
    ) -> None:
        self.counters[counter_key] += 1
        self._record_state_transition(next_state, event_type)
        self._log_event(
            event_type,
            severity="warning",
            counter_key=counter_key,
            counter_value=self.counters[counter_key],
            state=self.state,
            **details,
        )

    def _record_state_transition(self, next_state: WatchdogState, reason: str) -> None:
        previous = self.state
        if previous == next_state:
            return

        self.state = next_state
        self._log_event(
            "state-transition",
            severity="info",
            previous_state=previous,
            next_state=next_state,
            reason=reason,
        )

    def _log_event(self, event_type: str, severity: str, **fields: Any) -> None:
        payload = {
            "event": event_type,
            "severity": severity,
            "state": self.state,
            **fields,
        }
        logger.log(_severity_to_level(severity), "watchdog_event", extra={"watchdog": payload})


def _severity_to_level(severity: str) -> int:
    return {
        "debug": logging.DEBUG,
        "info": logging.INFO,
        "warning": logging.WARNING,
        "error": logging.ERROR,
        "critical": logging.CRITICAL,
    }.get(severity.lower(), logging.INFO)
