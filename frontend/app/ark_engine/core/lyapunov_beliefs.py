"""Lyapunov belief derivation from frozen hypotheses only."""

from __future__ import annotations

from dataclasses import dataclass
from math import exp
from typing import List


@dataclass(frozen=True)
class FrozenHypothesis:
    """Immutable hypothesis snapshot used for replay-safe derivation."""

    hypothesis_id: str
    log_belief: float


@dataclass(frozen=True)
class FrozenBeliefSnapshot:
    """Frozen state required to derive normalized belief vectors."""

    hypotheses: List[FrozenHypothesis]


class LyapunovBeliefPipeline:
    """Derives normalized beliefs using frozen log-beliefs only."""

    @staticmethod
    def derive_belief_vector(snapshot: FrozenBeliefSnapshot) -> List[float]:
        if not snapshot.hypotheses:
            return []

        # Deterministic ordering guards replay behavior even if input order drifts.
        ordered = sorted(snapshot.hypotheses, key=lambda h: h.hypothesis_id)

        log_beliefs = [hyp.log_belief for hyp in ordered]
        max_log_belief = max(log_beliefs)
        weights = [exp(value - max_log_belief) for value in log_beliefs]
        total = sum(weights)

        if total == 0.0:
            uniform = 1.0 / len(weights)
            return [uniform for _ in weights]

        return [weight / total for weight in weights]
