"""Reducer placeholder for deterministic event application."""

from .event import Event
from .state import RuntimeState


def apply_event(state: RuntimeState, event: Event) -> RuntimeState:
    """Return unchanged state until transition rules are implemented."""

    _ = event
    return state
