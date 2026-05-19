"""Replay parity tests for deterministic reducer + append-only ledger."""

from __future__ import annotations

from copy import deepcopy


def _apply_transition(state: str, target: str) -> str:
    allowed = {
        "INGESTED": {"NORMALIZED"},
        "NORMALIZED": {"VERIFIED"},
        "VERIFIED": {"CORRELATED"},
        "CORRELATED": {"ARCHIVED"},
        "ARCHIVED": set(),
        "CONTESTED": set(),
    }
    if target == "CONTESTED" or target in allowed.get(state, set()):
        return target
    raise ValueError(f"illegal transition {state}->{target}")


def reduce_event(state: dict, event: dict) -> dict:
    """Pure reducer: state only changes from explicit events."""
    next_state = deepcopy(state)
    event_type = event["event_type"]

    if event_type == "RECORD_INSERT":
        if event["record_id"] in next_state["records"]:
            raise ValueError("duplicate record_id")
        next_state["records"][event["record_id"]] = event["payload"]
    elif event_type == "STATE_TRANSITION":
        next_state["lifecycle_state"] = _apply_transition(
            next_state["lifecycle_state"],
            event["to_state"],
        )
    elif event_type == "COMMIT_FINALIZED":
        next_state["commit_finalized"] = True
    else:
        raise ValueError(f"unsupported event_type {event_type}")

    return next_state


class AppendOnlyLedger:
    def __init__(self) -> None:
        self._events: list[dict] = []

    def append(self, event: dict) -> None:
        self._events.append(deepcopy(event))

    def replay(self, initial_state: dict) -> dict:
        state = deepcopy(initial_state)
        for event in self._events:
            state = reduce_event(state, event)
        return state


def _empty_state() -> dict:
    return {
        "lifecycle_state": "INGESTED",
        "records": {},
        "commit_finalized": False,
    }


def test_replay_parity_fixed_sequence() -> None:
    events = [
        {"event_type": "RECORD_INSERT", "record_id": "r1", "payload": {"n": 1}},
        {"event_type": "STATE_TRANSITION", "to_state": "NORMALIZED"},
        {"event_type": "STATE_TRANSITION", "to_state": "VERIFIED"},
        {"event_type": "COMMIT_FINALIZED"},
    ]

    ledger = AppendOnlyLedger()
    state = _empty_state()

    for event in events:
        state = reduce_event(state, event)
        ledger.append(event)

    expected_final_state = state
    replayed_state = ledger.replay(_empty_state())

    assert replayed_state == expected_final_state
