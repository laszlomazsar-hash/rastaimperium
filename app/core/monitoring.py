from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone

from app.core.calibration import AsymptoticLabelCalibrator


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
    asymptotic_label_calibrator: AsymptoticLabelCalibrator = field(default_factory=AsymptoticLabelCalibrator)

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

    def record_calibration_dataset(
        self,
        probabilities: list[float],
        labels: list[int],
        *,
        dataset_scope: str,
        update_cadence: str = "weekly",
    ) -> dict[str, object]:
        return self.asymptotic_label_calibrator.fit(
            probabilities,
            labels,
            dataset_scope=dataset_scope,
            update_cadence=update_cadence,
        )

    def monitor_calibration_drift(self, probabilities: list[float], labels: list[int]) -> dict[str, object]:
        return self.asymptotic_label_calibrator.monitor_drift(probabilities, labels)

    def health_payload(self) -> dict[str, object]:
        calibration = self.asymptotic_label_calibrator.observability_payload()
        return {
            "status": "ok" if self.app_started else "starting",
            "started": self.app_started,
            "startup_completed_at": self.startup_completed_at,
            "redis_connected": self.redis_connected,
            "notes": self.health_notes[-5:],
            "calibration": calibration,
        }

    def live_payload(self) -> dict[str, object]:
        return {"status": "alive", "timestamp": _utc_iso_now()}

    def ready_payload(self) -> dict[str, object]:
        ready = self.app_started
        calibration = self.asymptotic_label_calibrator.observability_payload()
        return {
            "status": "ready" if ready else "not_ready",
            "ready": ready,
            "checks": {
                "startup": self.app_started,
                "redis": self.redis_connected,
                "calibration": calibration["status"] in {"healthy", "insufficient_data"},
            },
            "calibration": calibration,
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
