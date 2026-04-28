from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from threading import Lock
from typing import Any


@dataclass
class Hypothesis:
    """Mutable live hypothesis stored in the registry."""

    name: str
    value: Any


@dataclass(frozen=True)
class HypothesisSnapshot:
    """Immutable point-in-time snapshot of a hypothesis value."""

    name: str
    value: Any


@dataclass(frozen=True)
class FrozenHypothesisRegistry:
    hypotheses: tuple[HypothesisSnapshot, ...]


class HypothesisRegistry:
    def __init__(self) -> None:
        self._lock = Lock()
        self._hypotheses: list[Hypothesis] = []

    def add(self, hypothesis: Hypothesis) -> None:
        with self._lock:
            self._hypotheses.append(hypothesis)

    def freeze(self) -> FrozenHypothesisRegistry:
        with self._lock:
            ordered_hypotheses = tuple(self._hypotheses)
            snapshots = tuple(
                HypothesisSnapshot(name=h.name, value=deepcopy(h.value))
                for h in ordered_hypotheses
            )
        return FrozenHypothesisRegistry(hypotheses=snapshots)
