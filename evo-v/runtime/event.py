"""Deterministic event model placeholders for evo-v runtime."""

from dataclasses import dataclass
from typing import Any, Mapping


@dataclass(frozen=True)
class Event:
    """Append-only event envelope with explicit sequence and type."""

    sequence: int
    event_type: str
    payload: Mapping[str, Any]
