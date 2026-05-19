"""Append-only log placeholder with deterministic ordering semantics."""

from runtime.event import Event


class AppendOnlyLog:
    """Minimal append-only log abstraction for evo-v."""

    def __init__(self) -> None:
        self._max_sequence = -1

    def accepts(self, event: Event) -> bool:
        """Require strict monotonic sequence order."""

        return event.sequence > self._max_sequence

    def commit(self, event: Event) -> None:
        if not self.accepts(event):
            raise ValueError("event sequence must be strictly increasing")
        self._max_sequence = event.sequence
