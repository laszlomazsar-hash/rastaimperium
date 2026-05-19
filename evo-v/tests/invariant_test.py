"""Invariant tests for deterministic event/state semantics."""

from __future__ import annotations

from copy import deepcopy

import pytest

from replay_test import AppendOnlyLedger, _empty_state, reduce_event


def test_hidden_state_rejection_state_changes_only_through_events() -> None:
    initial = _empty_state()

    with pytest.raises(ValueError, match="unsupported event_type"):
        reduce_event(initial, {"event_type": "DIRECT_STATE_MUTATION", "to_state": "ARCHIVED"})

    assert initial == _empty_state()


def test_append_only_enforcement_no_update_or_delete_operations() -> None:
    state = _empty_state()
    ledger = AppendOnlyLedger()

    insert_event = {"event_type": "RECORD_INSERT", "record_id": "r1", "payload": {"n": 1}}
    state = reduce_event(state, insert_event)
    ledger.append(insert_event)

    with pytest.raises(ValueError, match="unsupported event_type"):
        reduce_event(state, {"event_type": "RECORD_UPDATE", "record_id": "r1", "payload": {"n": 2}})

    with pytest.raises(ValueError, match="unsupported event_type"):
        reduce_event(state, {"event_type": "RECORD_DELETE", "record_id": "r1"})

    replayed = ledger.replay(_empty_state())
    assert replayed == state


def test_illegal_transition_rejection_path() -> None:
    starting = _empty_state()
    event = {"event_type": "STATE_TRANSITION", "to_state": "ARCHIVED"}

    with pytest.raises(ValueError, match="illegal transition"):
        reduce_event(starting, deepcopy(event))

    assert starting == _empty_state()
