"""Governance invariant placeholders for deterministic-kernel checks."""

from typing import Iterable

from runtime.event import Event


def sequences_are_strictly_increasing(events: Iterable[Event]) -> bool:
    """Ensure global event ordering remains deterministic."""

    previous = -1
    for event in events:
        if event.sequence <= previous:
            return False
        previous = event.sequence
    return True
