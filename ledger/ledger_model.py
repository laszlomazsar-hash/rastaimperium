"""Append-only ledger schemas and deterministic replay interface."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping, Protocol, Sequence

from runtime.event_schema import RuntimeEvent


@dataclass(frozen=True)
class LedgerReceipt:
    receipt_id: str
    event_id: str
    record_hash: str
    prev_record_hash: str | None
    appended_at_utc: str
    schema_version: str


@dataclass(frozen=True)
class LedgerRecord:
    sequence: int
    event: RuntimeEvent
    record_hash: str
    prev_record_hash: str | None
    receipt: LedgerReceipt


class LedgerReplayer(Protocol):
    """Reconstruct deterministic state from ordered append-only events."""

    def replay(self, ordered_records: Sequence[LedgerRecord]) -> Mapping[str, Any]:
        """Build state solely from ordered ledger records."""
