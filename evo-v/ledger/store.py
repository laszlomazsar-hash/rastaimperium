"""Storage placeholders for append-only deterministic ledger."""

from typing import List

from runtime.event import Event


class EventStore:
    """In-memory append-only store for deterministic placeholder usage."""

    def __init__(self) -> None:
        self._events: List[Event] = []

    def append(self, event: Event) -> None:
        self._events.append(event)

    def all_events(self) -> List[Event]:
        return list(self._events)
