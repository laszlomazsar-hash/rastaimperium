import json
from pathlib import Path

import pytest

from app.core.monitoring import MonitoringState
from src.ark_safety.main import telemetry_coverage
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
    health = state.health_payload()
    assert "stability" in health
    assert "trend_slope" in health["stability"]
    assert "trend_confidence" in health["stability"]


def test_monitoring_stability_requires_consecutive_windows() -> None:
    state = MonitoringState(
        stability_window_size=4,
        stability_min_slope_magnitude=0.05,
        stability_required_consecutive_windows=3,
    )

    state._stability_status = "stable"
    for sample in [6.0, 4.0, 2.0]:
        state._record_stability_sample(sample)
    assert state.observability_payload()["stability"]["status"] == "stable"

    state._record_stability_sample(0.0)
    assert state.observability_payload()["stability"]["status"] == "unstable"

    state._record_stability_sample(-2.0)
    assert state.observability_payload()["stability"]["status"] == "unstable"

    for sample in [0.0, 2.0, 4.0, 6.0]:
        state._record_stability_sample(sample)
    assert state.observability_payload()["stability"]["status"] == "stable"


def test_subscription_sync_dashboard_and_stripe_catalog() -> None:
    sync = complete_payment_sync()
    assert sync.webhook_processed is True
    assert sync.db_synced is True

    dashboard = SoulEchoDashboardService()
    stream = dashboard.stream_payload()
    assert stream["energy_schema_version"] == "1.0.0"
    assert "drift_avg" in stream["energy_components"]

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


def test_probe_rules_validate_required_keys_not_full_body_matches() -> None:
    manifest = json.loads(Path("config/rastaimperium-backend-v3.6.0.json").read_text())
    rules = manifest["monitoring"]["probe_rules"]

    assert rules["contract_version_policy"]["version_field"] == "schema_version"
    assert rules["contract_version_policy"]["major_version"] == 1
    assert "additive fields only" in rules["contract_version_policy"]["compatibility"]

    endpoint_rules = rules["endpoints"]
    assert endpoint_rules["/health"]["required_keys"] == ["schema_version", "status"]
    assert endpoint_rules["/state"]["required_keys"] == [
        "schema_version",
        "rollback_ready",
        "trace_coverage",
    ]
    assert endpoint_rules["/epistemic"]["required_keys"] == [
        "schema_version",
        "audit_log_entries",
        "trace_layers_monitored",
    ]
    assert "do not full-body match" in rules["matching_strategy"]
def test_compromise_state_payload_has_duration_and_restart_reason() -> None:
    state = MonitoringState()
    state.enter_compromise("temporary redis split", recoverable=True)
    payload = state.state_payload()
    assert payload["watchdog_state"] == "COMPROMISE"
    assert payload["compromise_started_at"] is not None
    assert isinstance(payload["compromise_duration_seconds"], float)
    assert payload["restart_trigger_reason"] is None


def test_non_recoverable_route_invariant_triggers_restart(monkeypatch: pytest.MonkeyPatch) -> None:
    state = MonitoringState()
    calls: list[int] = []

    def fake_exit(code: int) -> None:
        calls.append(code)
        raise SystemExit(code)

    monkeypatch.setattr("app.core.monitoring.os._exit", fake_exit)
    with pytest.raises(SystemExit):
        state.evaluate_route_integrity(required_routes={"/healthz"}, current_routes=None)
    assert calls == [1]
    assert state.restart_trigger_reason == "ROUTE_TABLE_CORRUPTION"
