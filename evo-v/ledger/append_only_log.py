"""Append-only ledger API.

This module exposes a strict append interface that allows adding records only.
It intentionally does not provide mutation or deletion helpers.
"""

from __future__ import annotations

from typing import Any, Mapping


class AppendOnlyLog:
    """In-memory append-only log facade.

    The log stores immutable record snapshots by appending new entries to an
    internal sequence. Existing entries are never mutated or removed.
    """

    def __init__(self) -> None:
        self._records: list[dict[str, Any]] = []

    def append(self, record: Mapping[str, Any]) -> dict[str, Any]:
        """Append a new record and return the stored snapshot."""
        snapshot = dict(record)
        self._records.append(snapshot)
        return snapshot

    def records(self) -> tuple[dict[str, Any], ...]:
        """Return an immutable view of ordered records."""
        return tuple(self._records)
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
