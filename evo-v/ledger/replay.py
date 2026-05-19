"""Deterministic replay from ordered ledger records only."""

from __future__ import annotations

from typing import Any, Callable, Iterable, Mapping


def rebuild_state(
    initial_state: Mapping[str, Any],
    records: Iterable[Mapping[str, Any]],
    apply_transition: Callable[[dict[str, Any], Mapping[str, Any]], dict[str, Any]],
) -> dict[str, Any]:
    """Rebuild state by applying ordered ledger entries deterministically."""
    state = dict(initial_state)
    expected_sequence = 0
    prev_hash = None
    for record in records:
        sequence = record["sequence"]
        if sequence != expected_sequence:
            raise ValueError(f"Non-contiguous sequence at {sequence}; expected {expected_sequence}")
        if expected_sequence > 0 and record.get("previous_hash") != prev_hash:
            raise ValueError("Hash-link mismatch during replay")
        state = apply_transition(state, record["payload"])
        prev_hash = record.get("record_hash")
        expected_sequence += 1
"""Replay placeholder for deterministic state reconstruction."""

from typing import Iterable

from runtime.event import Event
from runtime.reducer import apply_event
from runtime.state import RuntimeState


def replay(initial: RuntimeState, events: Iterable[Event]) -> RuntimeState:
    """Apply events in encounter order with a pure reducer."""

    state = initial
    for event in events:
        state = apply_event(state, event)
    return state
