import json
from pathlib import Path

from app.core.monitoring import MonitoringState
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
