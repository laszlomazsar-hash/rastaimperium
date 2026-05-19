"""Invariant placeholder tests."""

from governance.invariants import sequences_are_strictly_increasing
from runtime.event import Event


def test_sequence_invariant_allows_strictly_increasing_sequences() -> None:
    events = [
        Event(sequence=1, event_type="A", payload={}),
        Event(sequence=2, event_type="B", payload={}),
    ]

    assert sequences_are_strictly_increasing(events)


def test_sequence_invariant_rejects_duplicate_sequence() -> None:
    events = [
        Event(sequence=1, event_type="A", payload={}),
        Event(sequence=1, event_type="B", payload={}),
    ]

    assert not sequences_are_strictly_increasing(events)
