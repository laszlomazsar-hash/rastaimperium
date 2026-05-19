"""Deterministic runtime event schema and transition engine interfaces."""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
import json
from typing import Any, Mapping, Protocol
import unicodedata


CANONICAL_JSON_SEPARATORS = (",", ":")


@dataclass(frozen=True)
class RuntimeEvent:
    """Canonical event shape used by deterministic runtime flows."""

    event_id: str
    event_type: str
    subject_id: str
    payload: Mapping[str, Any]
    ts_utc: str
    prev_hash: str | None
    schema_version: str


def _normalize_for_canonical_json(value: Any) -> Any:
    if isinstance(value, str):
        return unicodedata.normalize("NFC", value)
    if isinstance(value, Decimal):
        return format(value, "f")
    if isinstance(value, list):
        return [_normalize_for_canonical_json(item) for item in value]
    if isinstance(value, tuple):
        return [_normalize_for_canonical_json(item) for item in value]
    if isinstance(value, dict):
        return {
            unicodedata.normalize("NFC", key): _normalize_for_canonical_json(val)
            for key, val in value.items()
        }
    return value


def canonical_event_json(event: RuntimeEvent) -> str:
    """Serialize events using deterministic canonical JSON rules.

    Rules:
    - lexicographic key ordering
    - explicit nulls
    - UTF-8 NFC normalized strings
    - compact JSON formatting
    - fixed decimal representation via ``Decimal -> str``
    """

    normalized = _normalize_for_canonical_json(
        {
            "event_id": event.event_id,
            "event_type": event.event_type,
            "subject_id": event.subject_id,
            "payload": event.payload,
            "ts_utc": event.ts_utc,
            "prev_hash": event.prev_hash,
            "schema_version": event.schema_version,
        }
    )
    return json.dumps(
        normalized,
        sort_keys=True,
        ensure_ascii=False,
        separators=CANONICAL_JSON_SEPARATORS,
        allow_nan=False,
    )


@dataclass(frozen=True)
class TransitionArtifact:
    """Deterministic artifact emitted for validated transitions."""

    event_id: str
    prior_state_hash: str
    new_state_hash: str
    transition_hash: str


class TransitionEngine(Protocol):
    """Apply validated events and return a new state plus transition artifact."""

    def apply_validated_event(
        self,
        event: RuntimeEvent,
        current_state: Mapping[str, Any],
    ) -> tuple[Mapping[str, Any], TransitionArtifact]:
        """Apply an event that has already passed governance validation."""
