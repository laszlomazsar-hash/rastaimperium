"""Deterministic control updates for nonsmooth boundary states."""

from __future__ import annotations

from dataclasses import dataclass, field
from math import sqrt
from typing import Iterable, Sequence


@dataclass(frozen=True)
class SubgradientCandidate:
    """Subgradient candidate emitted at a boundary point."""

    descriptor: str
    vector: tuple[float, ...]


@dataclass(frozen=True)
class DeterministicSelectionPolicy:
    """Versioned policy for selecting a boundary subgradient."""

    version: str = "1.0.0"
    rule: str = "minimum_norm_then_lexicographic"


@dataclass(frozen=True)
class ControlTickLog:
    """Replay-friendly log of each control tick."""

    tick: int
    boundary_state: str
    nonsmooth_mode: bool
    selected_subgradient_descriptor: str
    selected_subgradient_vector: tuple[float, ...]
    selection_rule: str
    selection_rule_version: str


@dataclass
class NonsmoothControlUpdater:
    """Applies deterministic subgradient selection at boundary points."""

    policy: DeterministicSelectionPolicy = field(default_factory=DeterministicSelectionPolicy)
    tick_logs: list[ControlTickLog] = field(default_factory=list)
    _tick: int = 0

    def select_subgradient(self, candidates: Iterable[SubgradientCandidate]) -> SubgradientCandidate:
        """Choose a candidate via minimum-norm then lexicographic tie-break."""

        candidate_list = list(candidates)
        if not candidate_list:
            raise ValueError("At least one subgradient candidate is required.")

        return min(
            candidate_list,
            key=lambda item: (
                _l2_norm(item.vector),
                tuple(item.vector),
                item.descriptor,
            ),
        )

    def update_control(
        self,
        boundary_state: str,
        candidates: Sequence[SubgradientCandidate],
        *,
        nonsmooth_mode: bool,
    ) -> tuple[float, ...]:
        """Return the selected control update vector and log deterministic selection."""

        selected = self.select_subgradient(candidates) if nonsmooth_mode else candidates[0]

        self._tick += 1
        self.tick_logs.append(
            ControlTickLog(
                tick=self._tick,
                boundary_state=boundary_state,
                nonsmooth_mode=nonsmooth_mode,
                selected_subgradient_descriptor=selected.descriptor,
                selected_subgradient_vector=selected.vector,
                selection_rule=self.policy.rule,
                selection_rule_version=self.policy.version,
            )
        )
        return selected.vector


def _l2_norm(vector: Sequence[float]) -> float:
    return sqrt(sum(component * component for component in vector))
