from __future__ import annotations

import logging
from dataclasses import dataclass
from statistics import mean
from typing import Iterable, Protocol

logger = logging.getLogger(__name__)

ENERGY_SCHEMA_VERSION = "1.0"
METRIC_SCHEMA_VERSION = ENERGY_SCHEMA_VERSION


class HasLogBelief(Protocol):
    log_belief: float


@dataclass(frozen=True)
class EnergyComponentBreakdown:
    schema_version: str
    drift_avg: float
    variance_avg: float
    energy_score: float


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def normalized_drift_i(actual: float, predicted: float) -> float:
    return _clamp01(abs(actual - predicted) / 100.0)


def normalized_variance_i(actual: float, population_mean: float) -> float:
    return _clamp01(abs(actual - population_mean) / 100.0)


def compute_energy_breakdown(actual_scores: Iterable[float], predicted_scores: Iterable[float]) -> EnergyComponentBreakdown:
    actual = list(actual_scores)
    predicted = list(predicted_scores)
    if not actual or len(actual) != len(predicted):
        return EnergyComponentBreakdown(
            schema_version=ENERGY_SCHEMA_VERSION,
            drift_avg=0.0,
            variance_avg=0.0,
            energy_score=0.0,
        )

    population_mean = mean(actual)
    drift_values = [normalized_drift_i(a, p) for a, p in zip(actual, predicted)]
    variance_values = [normalized_variance_i(a, population_mean) for a in actual]
    drift_avg = round(mean(drift_values), 6)
    variance_avg = round(mean(variance_values), 6)
    return EnergyComponentBreakdown(
        schema_version=ENERGY_SCHEMA_VERSION,
        drift_avg=drift_avg,
        variance_avg=variance_avg,
        energy_score=round(_clamp01((drift_avg + variance_avg) / 2.0), 6),
    )


def energy_from_runtime_snapshot(snapshot_drift: float, hypotheses: Iterable[object]) -> float:
    return _clamp01(snapshot_drift / 100.0)


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]
