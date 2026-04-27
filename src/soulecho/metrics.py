from __future__ import annotations

from dataclasses import dataclass
from math import exp, log
from statistics import mean
from typing import Iterable, Sequence


@dataclass(frozen=True)
class BeliefSnapshot:
    """Canonical state used for all derived belief computations."""

    id: str
    log_belief: float
    predictive_mean: float
    variance: float


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


def normalize_log_beliefs(log_beliefs: Iterable[float]) -> list[float]:
    """Softmax-normalize log-beliefs into stable probability weights."""

    values = list(log_beliefs)
    if not values:
        return []

    max_log_belief = max(values)
    scaled = [exp(value - max_log_belief) for value in values]
    normalization = sum(scaled)
    return [value / normalization for value in scaled]


def _derived_weights(snapshots: Sequence[BeliefSnapshot]) -> list[float]:
    return normalize_log_beliefs(snapshot.log_belief for snapshot in snapshots)


def compute_energy(snapshots: Iterable[BeliefSnapshot]) -> float:
    canonical = list(snapshots)
    if not canonical:
        return 0.0

    weights = _derived_weights(canonical)
    return sum(
        weight * ((snapshot.predictive_mean * snapshot.predictive_mean) + snapshot.variance)
        for snapshot, weight in zip(canonical, weights)
    )


def compute_entropy(snapshots: Iterable[BeliefSnapshot]) -> float:
    canonical = list(snapshots)
    if not canonical:
        return 0.0

    weights = _derived_weights(canonical)
    return -sum(weight * log(weight) for weight in weights if weight > 0.0)
