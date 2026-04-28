from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
import os
import time


COMPROMISE_MAX_SECONDS = 30.0

from app.core.calibration import AsymptoticLabelCalibrator


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

    def record_representation_quality_tick(
        self,
        *,
        ess_floor: float,
        resampling_variance: float,
        predictive_log_loss_gap: float,
        transport_drift_residual: float,
    ) -> RepresentationQualitySnapshot:
        """Emit per-tick representation quality with policy-mapped remediation."""
        self.representation_tick += 1
        metrics = {
            "ess_floor": ess_floor,
            "resampling_variance": resampling_variance,
            "predictive_log_loss_gap": predictive_log_loss_gap,
            "transport_drift_residual": transport_drift_residual,
        }
        policy = self.representation_policy

        failed_proxies: list[str] = []
        warn_proxies: list[str] = []

        def _evaluate_proxy(name: str, value: float, warn_limit: float, fail_limit: float, low_is_bad: bool) -> None:
            if low_is_bad:
                if value < fail_limit:
                    failed_proxies.append(name)
                elif value < warn_limit:
                    warn_proxies.append(name)
                return

            if value > fail_limit:
                failed_proxies.append(name)
            elif value > warn_limit:
                warn_proxies.append(name)

        _evaluate_proxy(
            "ess_floor",
            ess_floor,
            policy.ess_floor_warn,
            policy.ess_floor_fail,
            low_is_bad=True,
        )
        _evaluate_proxy(
            "resampling_variance",
            resampling_variance,
            policy.resampling_variance_warn,
            policy.resampling_variance_fail,
            low_is_bad=False,
        )
        _evaluate_proxy(
            "predictive_log_loss_gap",
            predictive_log_loss_gap,
            policy.predictive_log_loss_gap_warn,
            policy.predictive_log_loss_gap_fail,
            low_is_bad=False,
        )
        _evaluate_proxy(
            "transport_drift_residual",
            transport_drift_residual,
            policy.transport_drift_residual_warn,
            policy.transport_drift_residual_fail,
            low_is_bad=False,
        )

        status = "ok"
        if failed_proxies:
            status = "fail"
            self.representation_fail_count += 1
        elif warn_proxies:
            status = "warn"
            self.representation_warn_count += 1
        else:
            self.representation_ok_count += 1

        remediation_actions: list[str] = []
        if status == "fail":
            if "ess_floor" in failed_proxies or "resampling_variance" in failed_proxies:
                remediation_actions.append("increase_particles")
            if "predictive_log_loss_gap" in failed_proxies or "transport_drift_residual" in failed_proxies:
                remediation_actions.append("switch_mode")
            remediation_actions.append("safe_fallback")

        snapshot = RepresentationQualitySnapshot(
            tick=self.representation_tick,
            status=status,
            metrics=metrics,
            failed_proxies=failed_proxies,
            warn_proxies=warn_proxies,
            remediation_actions=remediation_actions,
            observed_at=_utc_iso_now(),
            policy_thresholds={
                "ess_floor_warn": policy.ess_floor_warn,
                "ess_floor_fail": policy.ess_floor_fail,
                "resampling_variance_warn": policy.resampling_variance_warn,
                "resampling_variance_fail": policy.resampling_variance_fail,
                "predictive_log_loss_gap_warn": policy.predictive_log_loss_gap_warn,
                "predictive_log_loss_gap_fail": policy.predictive_log_loss_gap_fail,
                "transport_drift_residual_warn": policy.transport_drift_residual_warn,
                "transport_drift_residual_fail": policy.transport_drift_residual_fail,
            },
        )
        self.last_representation_snapshot = snapshot
        return snapshot

    def health_payload(self) -> dict[str, object]:
        self.enforce_compromise_timeout()
        return {
            "status": "ok" if self.app_started else "starting",
            "started": self.app_started,
            "startup_completed_at": self.startup_completed_at,
            "redis_connected": self.redis_connected,
            "notes": self.health_notes[-5:],
            **observability,
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

    def metrics_payload(self) -> dict[str, object]:
        payload: dict[str, int | float | str | None | list[str] | dict[str, float]] = {
            "enterprise_intake_submissions": self.enterprise_intake_submissions,
            "webhook_events_processed": self.webhook_events_processed,
            "subscription_sync_events": self.subscription_sync_events,
            "payment_failures": self.payment_failures,
            "representation_tick": self.representation_tick,
            "representation_ok_count": self.representation_ok_count,
            "representation_warn_count": self.representation_warn_count,
            "representation_fail_count": self.representation_fail_count,
        }
        if self.last_representation_snapshot:
            payload["representation_quality_status"] = self.last_representation_snapshot.status
            payload["representation_failed_proxies"] = self.last_representation_snapshot.failed_proxies
            payload["representation_warn_proxies"] = self.last_representation_snapshot.warn_proxies
            payload["representation_remediation_actions"] = self.last_representation_snapshot.remediation_actions
            payload["representation_policy_thresholds"] = self.last_representation_snapshot.policy_thresholds
            payload["representation_metrics"] = self.last_representation_snapshot.metrics
        return payload

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
        status_value = {"ok": 0, "warn": 1, "fail": 2}.get(str(metrics.get("representation_quality_status", "ok")), 0)
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
            "# HELP rasta_representation_tick Total representation-quality ticks emitted.",
            "# TYPE rasta_representation_tick counter",
            f"rasta_representation_tick {metrics['representation_tick']}",
            "# HELP rasta_representation_status Representation quality status: ok=0, warn=1, fail=2.",
            "# TYPE rasta_representation_status gauge",
            f"rasta_representation_status {status_value}",
            "# HELP rasta_representation_fail_count Total representation-quality failures.",
            "# TYPE rasta_representation_fail_count counter",
            f"rasta_representation_fail_count {metrics['representation_fail_count']}",
        ]
        representation_metrics = metrics.get("representation_metrics") or {}
        if isinstance(representation_metrics, dict):
            for proxy in (
                "ess_floor",
                "resampling_variance",
                "predictive_log_loss_gap",
                "transport_drift_residual",
            ):
                if proxy in representation_metrics:
                    lines.append(f"rasta_representation_proxy{{name=\"{proxy}\"}} {representation_metrics[proxy]}")
        return "\n".join(lines) + "\n"


monitoring_state = MonitoringState()
