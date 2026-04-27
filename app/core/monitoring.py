from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone


def _utc_iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass(frozen=True)
class RepresentationQualityThresholds:
    """Policy thresholds that approximate epsilon_repr via computable proxies."""

    ess_floor_warn: float = 0.5
    ess_floor_fail: float = 0.35
    resampling_variance_warn: float = 0.9
    resampling_variance_fail: float = 1.25
    predictive_log_loss_gap_warn: float = 0.12
    predictive_log_loss_gap_fail: float = 0.2
    transport_drift_residual_warn: float = 0.08
    transport_drift_residual_fail: float = 0.12


@dataclass
class RepresentationQualitySnapshot:
    tick: int
    status: str
    metrics: dict[str, float]
    failed_proxies: list[str]
    warn_proxies: list[str]
    remediation_actions: list[str]
    observed_at: str
    policy_thresholds: dict[str, float]


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
    representation_policy: RepresentationQualityThresholds = field(default_factory=RepresentationQualityThresholds)
    representation_tick: int = 0
    representation_ok_count: int = 0
    representation_warn_count: int = 0
    representation_fail_count: int = 0
    last_representation_snapshot: RepresentationQualitySnapshot | None = None

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
