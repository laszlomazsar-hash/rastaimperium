from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from math import fsum, sqrt

from app.core.config import settings


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
    stability_window_size: int = settings.STABILITY_TREND_WINDOW_SIZE
    stability_min_slope_magnitude: float = settings.STABILITY_MIN_SLOPE_MAGNITUDE
    stability_required_consecutive_windows: int = settings.STABILITY_REQUIRED_CONSECUTIVE_WINDOWS
    _stability_series: list[float] = field(default_factory=list)
    _consecutive_rising_windows: int = 0
    _consecutive_falling_windows: int = 0
    _stability_status: str = "stable"

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
        self._record_stability_sample(self._stability_signal())

    def mark_webhook(self, event_type: str) -> None:
        self.webhook_events_processed += 1
        self.last_webhook_event_at = _utc_iso_now()
        self.last_webhook_event_type = event_type

        if event_type.startswith("customer.subscription"):
            self.subscription_sync_events += 1
        if event_type == "invoice.payment_failed":
            self.payment_failures += 1
        self._record_stability_sample(self._stability_signal())

    def _stability_signal(self) -> float:
        return float(self.enterprise_intake_submissions + self.subscription_sync_events - (2 * self.payment_failures))

    def _record_stability_sample(self, sample: float) -> None:
        self._stability_series.append(sample)
        max_samples = max(self.stability_window_size * 4, self.stability_window_size)
        if len(self._stability_series) > max_samples:
            self._stability_series = self._stability_series[-max_samples:]
        self._update_stability_status()

    def _windowed_trend(self) -> tuple[float, float]:
        if len(self._stability_series) < 2:
            return 0.0, 0.0
        window = self._stability_series[-self.stability_window_size :]
        n = len(window)
        if n < 2:
            return 0.0, 0.0

        x_mean = (n - 1) / 2
        y_mean = fsum(window) / n
        numerator = fsum((index - x_mean) * (value - y_mean) for index, value in enumerate(window))
        denominator = fsum((index - x_mean) ** 2 for index in range(n))
        slope = numerator / denominator if denominator else 0.0

        variance_y = fsum((value - y_mean) ** 2 for value in window)
        if variance_y <= 0 or denominator <= 0:
            return slope, 0.0

        confidence = abs(numerator) / sqrt(denominator * variance_y)
        confidence = max(0.0, min(1.0, confidence))
        return slope, confidence

    def _update_stability_status(self) -> None:
        slope, _ = self._windowed_trend()
        if abs(slope) < self.stability_min_slope_magnitude:
            self._consecutive_rising_windows = 0
            self._consecutive_falling_windows = 0
            return

        if slope < 0:
            self._consecutive_falling_windows += 1
            self._consecutive_rising_windows = 0
            if self._consecutive_falling_windows >= self.stability_required_consecutive_windows:
                self._stability_status = "unstable"
            return

        self._consecutive_rising_windows += 1
        self._consecutive_falling_windows = 0
        if self._consecutive_rising_windows >= self.stability_required_consecutive_windows:
            self._stability_status = "stable"

    def observability_payload(self) -> dict[str, object]:
        slope, confidence = self._windowed_trend()
        return {
            "stability": {
                "status": self._stability_status,
                "trend_slope": round(slope, 4),
                "trend_confidence": round(confidence, 4),
                "required_consecutive_windows": self.stability_required_consecutive_windows,
                "window_size": self.stability_window_size,
                "min_slope_magnitude": self.stability_min_slope_magnitude,
            }
        }

    def health_payload(self) -> dict[str, object]:
        observability = self.observability_payload()
        return {
            "status": "ok" if self.app_started else "starting",
            "started": self.app_started,
            "startup_completed_at": self.startup_completed_at,
            "redis_connected": self.redis_connected,
            "notes": self.health_notes[-5:],
            **observability,
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
