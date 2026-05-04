from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping

CANONICAL_RAW_FIELDS: tuple[str, ...] = ("id", "raw", "source", "timestamp")


@dataclass(frozen=True)
class FrozenHypothesis:
    """Immutable snapshot of a hypothesis using only canonical raw fields."""

    id: str
    raw: str
    source: str
    timestamp: str

    @classmethod
    def from_mapping(cls, payload: Mapping[str, Any]) -> "FrozenHypothesis":
        values = {field: payload.get(field, "") for field in CANONICAL_RAW_FIELDS}
        return cls(**values)


def freeze_state(state: Mapping[str, Any]) -> dict[str, Any]:
    """Freeze hypothesis state while preserving only canonical raw fields.

    Any non-canonical fields (including "belief") are removed from the frozen view.
    """

    hypotheses = state.get("hypotheses", [])
    frozen_hypotheses = [
        FrozenHypothesis.from_mapping(item).__dict__
        for item in hypotheses
        if isinstance(item, Mapping)
    ]

    return {
        "hypotheses": frozen_hypotheses,
    }
