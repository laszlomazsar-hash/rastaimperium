from __future__ import annotations

from copy import deepcopy

from src.governance.fsm.transition_matrix import apply_transition


VERSION_BUNDLE = {
    "schema_version": "event.v1",
    "ruleset_version": "policy.rules.v1",
    "governance_version": "governance.v1",
    "canon_spec_version": "canon.v1",
    "cert_profile": "proof.v1",
}


def _append_transition_with_commit(
    state: str,
    transition_event: dict[str, str],
    ledger: list[dict[str, object]],
) -> str:
    result = apply_transition(state, transition_event)
    ledger.append(result.audit_event)
    ledger.append(
        {
            "event_type": "COMMIT_FINALIZED",
            "from_state": state,
            "to_state": result.state,
            "applied": result.applied,
            "request_id": transition_event["request_id"],
            "version_bundle": deepcopy(VERSION_BUNDLE),
        }
    )
    return result.state


def _state_from_ledger(initial_state: str, ledger: list[dict[str, object]]) -> dict[str, object]:
    state = initial_state
    transition_history: list[dict[str, str]] = []
    rejected_history: list[dict[str, str]] = []

    for event in ledger:
        event_type = event["event_type"]
        if event_type == "STATE_TRANSITION":
            state = str(event["to_state"])
            transition_history.append(
                {
                    "from_state": str(event["from_state"]),
                    "to_state": str(event["to_state"]),
                }
            )
        elif event_type == "STATE_TRANSITION_REJECTED":
            rejected_history.append(
                {
                    "from_state": str(event["from_state"]),
                    "to_state": str(event["to_state"]),
                    "reason": str(event["reason"]),
                    "request_id": str(event["request_id"]),
                }
            )

    return {
        "state": state,
        "transition_history": transition_history,
        "rejected_history": rejected_history,
    }


def test_transition_ledger_replay_reconstructs_identical_state() -> None:
    state = "INGESTED"
    ledger: list[dict[str, object]] = []

    fixed_sequence = [
        {"to_state": "NORMALIZED", "request_id": "req-1"},
        {"to_state": "VERIFIED", "request_id": "req-2"},
        {"to_state": "CORRELATED", "request_id": "req-3"},
        {"to_state": "ARCHIVED", "request_id": "req-4"},
    ]

    for event in fixed_sequence:
        transition_event = {
            **event,
            "operator_id": "op-1",
            "actor_key_id": "key-1",
            "service_principal": "svc://fsm",
            "cert_profile": VERSION_BUNDLE["cert_profile"],
        }
        state = _append_transition_with_commit(state, transition_event, ledger)

    original_state = _state_from_ledger("INGESTED", ledger)
    replayed_state = _state_from_ledger("INGESTED", deepcopy(ledger))

    assert original_state == replayed_state
    assert all(event["event_type"] == "COMMIT_FINALIZED" for event in ledger[1::2])


def test_illegal_transition_rejected_and_failure_audit_appended_to_ledger() -> None:
    ledger: list[dict[str, object]] = []
    state = "INGESTED"

    illegal_event = {
        "to_state": "ARCHIVED",
        "request_id": "req-illegal",
        "operator_id": "op-1",
        "actor_key_id": "key-1",
        "service_principal": "svc://fsm",
        "cert_profile": VERSION_BUNDLE["cert_profile"],
    }
    state = _append_transition_with_commit(state, illegal_event, ledger)

    assert state == "INGESTED"
    assert ledger[0]["event_type"] == "STATE_TRANSITION_REJECTED"
    assert ledger[0]["reason"] == "illegal_transition"
    assert ledger[1]["event_type"] == "COMMIT_FINALIZED"
    assert ledger[1]["applied"] is False

    replayed = _state_from_ledger("INGESTED", ledger)
    assert replayed["state"] == "INGESTED"
    assert replayed["transition_history"] == []
    assert replayed["rejected_history"] == [
        {
            "from_state": "INGESTED",
            "to_state": "ARCHIVED",
            "reason": "illegal_transition",
            "request_id": "req-illegal",
        }
    ]
