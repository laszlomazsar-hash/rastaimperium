"""Deterministic ledger persistence with ordering and hash-link fields."""

from __future__ import annotations

import hashlib
import json
from typing import Any, Mapping


GENESIS_HASH = "0" * 64


class LedgerStore:
    """Persists ordered records with deterministic sequence and hash links."""

    def __init__(self) -> None:
        self._records: list[dict[str, Any]] = []

    def append(self, payload: Mapping[str, Any]) -> dict[str, Any]:
        """Append payload as next ledger record with deterministic metadata."""
        sequence = len(self._records)
        prev_hash = self._records[-1]["record_hash"] if self._records else GENESIS_HASH
        payload_snapshot = _canonical_data(dict(payload))
        record_body = {
            "sequence": sequence,
            "previous_hash": prev_hash,
            "payload": payload_snapshot,
        }
        record_hash = _digest(record_body)
        record = {
            **record_body,
            "record_hash": record_hash,
        }
        self._records.append(record)
        return record

    def records(self) -> tuple[dict[str, Any], ...]:
        return tuple(self._records)


def _canonical_data(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: _canonical_data(value[key]) for key in sorted(value)}
    if isinstance(value, list):
        return [_canonical_data(item) for item in value]
    return value


def _digest(value: Mapping[str, Any]) -> str:
    blob = json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(blob.encode("utf-8")).hexdigest()
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
