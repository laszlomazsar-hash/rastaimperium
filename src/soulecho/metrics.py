from __future__ import annotations

from statistics import mean
from typing import Iterable, Protocol


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


METRIC_SCHEMA_VERSION = "2.0.0"


class SupportsPredictiveMean(Protocol):
    predictive_mean: float


def drift_i(snapshot_drift: float, hypothesis: SupportsPredictiveMean) -> float:
    """Per-hypothesis drift from canonical fields.

    Formal equation: drift_i = |snapshot_drift - h.predictive_mean|
    """
    return abs(snapshot_drift - hypothesis.predictive_mean)


def energy_from_runtime_snapshot(
    snapshot_drift: float,
    hypotheses: Iterable[SupportsPredictiveMean],
) -> float:
    """Compute normalized energy from runtime hypothesis objects.

    E = 1 / (1 + mean_i(drift_i))
    """
    drifts = [drift_i(snapshot_drift, hypothesis) for hypothesis in hypotheses]
    if not drifts:
        return 0.0
    return round(1.0 / (1.0 + mean(drifts)), 4)
