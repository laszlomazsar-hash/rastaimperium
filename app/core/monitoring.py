from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Literal


def _utc_iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass(frozen=True)
class StabilityPolicy:
    mode: Literal["auto", "short", "long"] = "auto"
    short_window: int = 5
    long_window: int = 10
    min_points_for_long: int = 8


@dataclass(frozen=True)
class StabilityTrend:
    slope: float
    mode_used: Literal["short", "long"]
    window_used: int


@dataclass(frozen=True)
class StabilityAssessmentEvent:
    timestamp: str
    slope: float
    mode_used: Literal["short", "long"]
    window_used: int


def stability_trend(samples: list[float], policy: StabilityPolicy | None = None) -> StabilityTrend:
    """Estimate stability trend with explainable mode/window metadata."""
    chosen_policy = policy or StabilityPolicy()
    points = list(samples)
    if not points:
        return StabilityTrend(slope=0.0, mode_used="short", window_used=0)

    if chosen_policy.mode == "short":
        mode_used: Literal["short", "long"] = "short"
    elif chosen_policy.mode == "long":
        mode_used = "long"
    else:
        enough_for_long = len(points) >= max(chosen_policy.min_points_for_long, chosen_policy.long_window)
        mode_used = "long" if enough_for_long else "short"

    target_window = chosen_policy.long_window if mode_used == "long" else chosen_policy.short_window
    window_used = max(1, min(target_window, len(points)))
    window_points = points[-window_used:]

    if window_used < 2:
        return StabilityTrend(slope=0.0, mode_used=mode_used, window_used=window_used)

    slope = (window_points[-1] - window_points[0]) / (window_used - 1)
    return StabilityTrend(slope=round(slope, 6), mode_used=mode_used, window_used=window_used)


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
    stability_assessments: list[StabilityAssessmentEvent] = field(default_factory=list)

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

    def assess_stability(self, samples: list[float], policy: StabilityPolicy | None = None) -> StabilityTrend:
        trend = stability_trend(samples=samples, policy=policy)
        self.stability_assessments.append(
            StabilityAssessmentEvent(
                timestamp=_utc_iso_now(),
                slope=trend.slope,
                mode_used=trend.mode_used,
                window_used=trend.window_used,
            )
        )
        return trend

    def health_payload(self) -> dict[str, object]:
        return {
            "status": "ok" if self.app_started else "starting",
            "started": self.app_started,
            "startup_completed_at": self.startup_completed_at,
            "redis_connected": self.redis_connected,
            "notes": self.health_notes[-5:],
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

    def epistemic_payload(self) -> dict[str, object]:
        latest = self.stability_assessments[-1] if self.stability_assessments else None
        return {
            "stability_assessment_count": len(self.stability_assessments),
            "latest_stability_assessment": asdict(latest) if latest else None,
        }

    def diagnostic_payload(self) -> dict[str, object]:
        return {
            "metrics": self.metrics_payload(),
            "epistemic": self.epistemic_payload(),
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
