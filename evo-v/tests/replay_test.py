"""Replay placeholder tests."""

from runtime.event import Event
from runtime.state import RuntimeState
from ledger.replay import replay


def test_replay_with_placeholder_reducer_keeps_state() -> None:
    initial = RuntimeState(lifecycle="INGESTED", attributes={"k": "v"})
    events = [Event(sequence=0, event_type="RECORD_INSERT", payload={})]

    result = replay(initial, events)

    assert result == initial
