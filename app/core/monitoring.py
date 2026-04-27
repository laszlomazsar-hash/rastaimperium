from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
import os
import time


COMPROMISE_MAX_SECONDS = 30.0


def _utc_iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class MonitoringState:
    app_started: bool = False
    startup_completed_at: str | None = None
    last_intake_at: str | None = None
    last_webhook_event_at: str | None = None
    last_webhook_event_type: str | None = None
    enterprise_intake_submissions: int = 0
    webhook_events_processed: int = 0
    subscription_sync_events: int = 0
    payment_failures: int = 0
    redis_connected: bool = False
    redis_error: str | None = None
    health_notes: list[str] = field(default_factory=list)
    watchdog_state: str = "HEALTHY"
    compromise_started_at: str | None = None
    compromise_started_monotonic: float | None = None
    restart_trigger_reason: str | None = None
    restart_triggered_at: str | None = None

    def mark_startup(self) -> None:
        self.app_started = True
        self.startup_completed_at = _utc_iso_now()

    def mark_redis_connected(self) -> None:
        self.redis_connected = True
        self.redis_error = None

    def mark_redis_error(self, error: Exception) -> None:
        self.redis_connected = False
        self.redis_error = str(error)
        self.health_notes.append("Redis unavailable; running in degraded mode")

    def mark_intake_submission(self) -> None:
        self.enterprise_intake_submissions += 1
        self.last_intake_at = _utc_iso_now()

    def mark_webhook(self, event_type: str) -> None:
        self.webhook_events_processed += 1
        self.last_webhook_event_at = _utc_iso_now()
        self.last_webhook_event_type = event_type

        if event_type.startswith("customer.subscription"):
            self.subscription_sync_events += 1
        if event_type == "invoice.payment_failed":
            self.payment_failures += 1

    def enter_compromise(self, reason: str, recoverable: bool = True) -> None:
        if self.watchdog_state != "COMPROMISE":
            self.watchdog_state = "COMPROMISE"
            self.compromise_started_at = _utc_iso_now()
            self.compromise_started_monotonic = time.monotonic()
        self.health_notes.append(f"COMPROMISE: {reason}")
        if not recoverable:
            self.trigger_restart(reason=reason)

    def mark_recovered(self) -> None:
        self.watchdog_state = "HEALTHY"
        self.compromise_started_at = None
        self.compromise_started_monotonic = None

    def compromise_duration_seconds(self) -> float:
        if self.compromise_started_monotonic is None:
            return 0.0
        return max(0.0, time.monotonic() - self.compromise_started_monotonic)

    def enforce_compromise_timeout(self) -> None:
        if self.watchdog_state != "COMPROMISE":
            return
        if self.compromise_duration_seconds() >= COMPROMISE_MAX_SECONDS:
            self.trigger_restart(reason="COMPROMISE_TIMEOUT")

    def evaluate_route_integrity(self, required_routes: set[str], current_routes: set[str] | None) -> None:
        if not isinstance(current_routes, set):
            self.enter_compromise("ROUTE_TABLE_CORRUPTION", recoverable=False)
            return
        missing = sorted(required_routes - current_routes)
        if missing:
            self.enter_compromise(
                f"MISSING_CRITICAL_ROUTES:{','.join(missing)}",
                recoverable=False,
            )

    def trigger_restart(self, reason: str) -> None:
        self.restart_trigger_reason = reason
        self.restart_triggered_at = _utc_iso_now()
        os._exit(1)

    def health_payload(self) -> dict[str, object]:
        self.enforce_compromise_timeout()
        return {
            "status": "ok" if self.app_started else "starting",
            "started": self.app_started,
            "startup_completed_at": self.startup_completed_at,
            "redis_connected": self.redis_connected,
            "notes": self.health_notes[-5:],
        }

    def state_payload(self) -> dict[str, object]:
        self.enforce_compromise_timeout()
        return {
            "watchdog_state": self.watchdog_state,
            "compromise_started_at": self.compromise_started_at,
            "compromise_duration_seconds": round(self.compromise_duration_seconds(), 3),
            "restart_trigger_reason": self.restart_trigger_reason,
            "restart_triggered_at": self.restart_triggered_at,
        }

    def live_payload(self) -> dict[str, object]:
        return {"status": "alive", "timestamp": _utc_iso_now()}

    def ready_payload(self) -> dict[str, object]:
        ready = self.app_started
        return {
            "status": "ready" if ready else "not_ready",
            "ready": ready,
            "checks": {
                "startup": self.app_started,
                "redis": self.redis_connected,
            },
        }

    def metrics_payload(self) -> dict[str, int]:
        return {
            "enterprise_intake_submissions": self.enterprise_intake_submissions,
            "webhook_events_processed": self.webhook_events_processed,
            "subscription_sync_events": self.subscription_sync_events,
            "payment_failures": self.payment_failures,
        }

    def prometheus(self) -> str:
        metrics = self.metrics_payload()
        lines = [
            "# HELP rasta_enterprise_intake_submissions Total enterprise intake submissions.",
            "# TYPE rasta_enterprise_intake_submissions counter",
            f"rasta_enterprise_intake_submissions {metrics['enterprise_intake_submissions']}",
            "# HELP rasta_webhook_events_processed Total payment webhook events processed.",
            "# TYPE rasta_webhook_events_processed counter",
            f"rasta_webhook_events_processed {metrics['webhook_events_processed']}",
            "# HELP rasta_subscription_sync_events Total subscription synchronization events.",
            "# TYPE rasta_subscription_sync_events counter",
            f"rasta_subscription_sync_events {metrics['subscription_sync_events']}",
            "# HELP rasta_payment_failures Total failed payment events.",
            "# TYPE rasta_payment_failures counter",
            f"rasta_payment_failures {metrics['payment_failures']}",
        ]
        return "\n".join(lines) + "\n"


monitoring_state = MonitoringState()
