from src.ark_safety.main import OBSERVABILITY_SCHEMA_VERSION, epistemic, health, state


def test_observability_endpoints_include_schema_version() -> None:
    assert health()["schema_version"] == OBSERVABILITY_SCHEMA_VERSION
    assert state()["schema_version"] == OBSERVABILITY_SCHEMA_VERSION
    assert epistemic()["schema_version"] == OBSERVABILITY_SCHEMA_VERSION


def test_state_contract_required_fields() -> None:
    payload = state()
    for key in ("schema_version", "rollback_ready", "trace_coverage"):
        assert key in payload


def test_epistemic_contract_required_fields() -> None:
    payload = epistemic()
    for key in ("schema_version", "audit_log_entries", "trace_layers_monitored"):
        assert key in payload
