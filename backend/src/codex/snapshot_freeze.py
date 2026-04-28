from __future__ import annotations

import hashlib
import json
from dataclasses import asdict, dataclass, is_dataclass
from typing import Any, Iterable, Mapping, NamedTuple


class FrozenHypothesis(NamedTuple):
    """Canonical frozen tuple used across snapshot serialization operations."""

    id: str
    payload: str


@dataclass(frozen=True)
class FrozenSnapshot:
    """Deterministic snapshot that preserves a canonical hypothesis order."""

    hypotheses: tuple[FrozenHypothesis, ...]

    @classmethod
    def freeze(cls, hypotheses: Iterable[object]) -> FrozenSnapshot:
        normalized = [_normalize_hypothesis(hypothesis) for hypothesis in hypotheses]
        _validate_unique_ids(normalized)

        canonical = sorted(normalized, key=lambda hypothesis: hypothesis["id"])
        frozen = tuple(
            FrozenHypothesis(
                id=hypothesis["id"],
                payload=json.dumps(hypothesis, sort_keys=True, separators=(",", ":")),
            )
            for hypothesis in canonical
        )
        return cls(hypotheses=frozen)

    def serialized(self) -> str:
        payload = [hypothesis._asdict() for hypothesis in self.hypotheses]
        return json.dumps(payload, sort_keys=True, separators=(",", ":"))

    def content_hash(self) -> str:
        return hashlib.sha256(self.serialized().encode("utf-8")).hexdigest()

    def log_entries(self) -> tuple[str, ...]:
        return tuple(hypothesis.payload for hypothesis in self.hypotheses)

    def replay_sequence(self) -> tuple[FrozenHypothesis, ...]:
        return self.hypotheses


def freeze_snapshot(hypotheses: Iterable[object]) -> FrozenSnapshot:
    return FrozenSnapshot.freeze(hypotheses)


def snapshot_hash(hypotheses: Iterable[object]) -> str:
    return freeze_snapshot(hypotheses).content_hash()


def snapshot_log(hypotheses: Iterable[object]) -> tuple[str, ...]:
    return freeze_snapshot(hypotheses).log_entries()


def snapshot_replay(hypotheses: Iterable[object]) -> tuple[FrozenHypothesis, ...]:
    return freeze_snapshot(hypotheses).replay_sequence()


def _normalize_hypothesis(hypothesis: object) -> dict[str, Any]:
    if is_dataclass(hypothesis):
        normalized: Any = asdict(hypothesis)
    elif isinstance(hypothesis, Mapping):
        normalized = dict(hypothesis)
    else:
        normalized = vars(hypothesis)

    hypothesis_id = normalized.get("id")
    if not isinstance(hypothesis_id, str) or not hypothesis_id:
        raise ValueError("Each hypothesis must define a non-empty string id")

    return normalized


def _validate_unique_ids(hypotheses: list[dict[str, Any]]) -> None:
    ids = [hypothesis["id"] for hypothesis in hypotheses]
    unique_ids = set(ids)
    if len(ids) != len(unique_ids):
        duplicates = sorted(hypothesis_id for hypothesis_id in unique_ids if ids.count(hypothesis_id) > 1)
        duplicate_list = ", ".join(duplicates)
        raise ValueError(f"Hypothesis ids must be unique before freeze: {duplicate_list}")
