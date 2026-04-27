from src.ark_safety.main import STATE, SCHEMA_VERSION


def test_health_payload_includes_schema_and_state_summary() -> None:
    payload = STATE.health_payload(rollback_ready=False)

    assert payload["schema_version"] == SCHEMA_VERSION
    assert payload["status"] in {"ok", "degraded"}
    assert "state_summary" in payload
    assert set(payload["state_summary"]) >= {
        "state",
        "previous_state",
        "last_transition_at",
        "failure_count",
    }


def test_state_payload_contains_stable_contract_keys() -> None:
    payload = STATE.state_payload()

    assert payload["schema_version"] == SCHEMA_VERSION
    assert set(payload) >= {
        "state",
        "previous_state",
        "last_transition_at",
        "transition_history",
        "failure_count",
        "last_failure",
    }
    assert isinstance(payload["transition_history"], list)
