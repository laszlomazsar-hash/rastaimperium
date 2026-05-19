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
