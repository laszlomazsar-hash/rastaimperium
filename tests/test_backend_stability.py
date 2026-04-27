import json
from pathlib import Path

from app.core.monitoring import MonitoringState
from app.core.monitoring import StabilityPolicy, stability_trend
from src.admin.payment_sync import complete_payment_sync
from src.payment.stripe_webhook_handler import BillingUsage, calculate_usage_cost, plan_catalog
from src.soulecho.dashboard import SoulEchoDashboardService


def test_monitoring_metrics_flow_and_prometheus_payload() -> None:
    state = MonitoringState()
    state.mark_startup()
    state.mark_intake_submission()
    state.mark_webhook("customer.subscription.updated")
    state.mark_webhook("invoice.payment_failed")

    metrics = state.metrics_payload()
    assert metrics["enterprise_intake_submissions"] == 1
    assert metrics["webhook_events_processed"] == 2
    assert metrics["subscription_sync_events"] == 1
    assert metrics["payment_failures"] == 1

    payload = state.prometheus()
    assert "rasta_webhook_events_processed 2" in payload
    assert "rasta_subscription_sync_events 1" in payload


def test_subscription_sync_dashboard_and_stripe_catalog() -> None:
    sync = complete_payment_sync()
    assert sync.webhook_processed is True
    assert sync.db_synced is True

    dashboard = SoulEchoDashboardService()
    widgets = dashboard.subscription_widgets("enterprise", workspace="workspace-1")
    assert any(widget.key == "enterprise_metrics" and widget.visible for widget in widgets)

    cost = calculate_usage_cost(BillingUsage(api_calls=1000, tokens=20000, seats=2))
    assert cost > 0
    assert "mid_tier" in plan_catalog()


def test_blueprint_v36_coverage_layers_are_functional() -> None:
    blueprint = json.loads(Path("config/blueprint-v3.5.json").read_text())
    assert blueprint["version"] == "3.6.0"

    expected_layers = {"enterprise", "dashboard", "codex", "checkout", "admin", "observability"}
    coverage = blueprint["blueprintCoverage"]
    assert set(coverage.keys()) == expected_layers
    assert all(layer["functional"] is True for layer in coverage.values())


def test_stability_trend_metadata_and_epistemic_diagnostic_outputs() -> None:
    state = MonitoringState()
    trend = state.assess_stability([0.7, 0.75, 0.8, 0.81, 0.83], policy=StabilityPolicy(mode="short", short_window=3))

    assert trend.slope == 0.015
    assert trend.mode_used == "short"
    assert trend.window_used == 3

    epistemic = state.epistemic_payload()
    latest = epistemic["latest_stability_assessment"]
    assert latest is not None
    assert latest["mode_used"] == "short"
    assert latest["window_used"] == 3

    diagnostic = state.diagnostic_payload()
    assert "epistemic" in diagnostic
    assert diagnostic["epistemic"]["latest_stability_assessment"]["mode_used"] == "short"


def test_stability_trend_mode_selection_is_deterministic_for_policy_settings() -> None:
    samples = [0.88, 0.9, 0.91, 0.89, 0.92, 0.93, 0.94, 0.95, 0.96]
    auto_policy = StabilityPolicy(mode="auto", short_window=3, long_window=6, min_points_for_long=6)

    first = stability_trend(samples, auto_policy)
    second = stability_trend(samples, auto_policy)
    assert first.mode_used == "long"
    assert second.mode_used == "long"
    assert first.window_used == 6
    assert second.window_used == 6
