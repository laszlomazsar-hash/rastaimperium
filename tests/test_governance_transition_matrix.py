from src.governance.fsm.transition_matrix import apply_transition, is_transition_allowed


def test_transition_matrix_allows_declared_edges() -> None:
    assert is_transition_allowed("INGESTED", "NORMALIZED")
    assert is_transition_allowed("CORRELATED", "ARCHIVED")


def test_transition_matrix_enforces_any_to_contested() -> None:
    assert is_transition_allowed("INGESTED", "CONTESTED")
    assert is_transition_allowed("ARCHIVED", "CONTESTED")


def test_apply_transition_rejects_illegal_and_returns_failure_audit_payload() -> None:
    result = apply_transition(
        "INGESTED",
        {
            "to_state": "ARCHIVED",
            "request_id": "req-1",
            "operator_id": "op-1",
            "actor_key_id": "key-1",
            "service_principal": "svc://fsm",
            "cert_profile": "proof-v1",
        },
    )

    assert result.applied is False
    assert result.state == "INGESTED"
    assert result.audit_event["event_type"] == "STATE_TRANSITION_REJECTED"
    assert result.audit_event["reason"] == "illegal_transition"
    assert result.audit_event["to_state"] == "ARCHIVED"
    assert result.audit_event["request_id"] == "req-1"
