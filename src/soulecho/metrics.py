from __future__ import annotations

from dataclasses import dataclass
from statistics import mean
from typing import Iterable, Sequence


ENERGY_SCHEMA_VERSION = "1.0.0"


@dataclass(frozen=True)
class EnergyComponentBreakdown:
    """Normalized energy components in a stable [0, 1] domain."""

    schema_version: str
    drift_avg: float
    variance_avg: float
    drift_weight: float
    variance_weight: float
    weighted_penalty: float
    energy_score: float


def _clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


def normalized_drift_i(actual_score: float, predicted_score: float) -> float:
    """drift_i := |actual_i - predicted_i| / 100 in [0, 1]."""

    return _clamp01(abs(actual_score - predicted_score) / 100.0)


def normalized_variance_i(actual_score: float, cohort_mean_score: float) -> float:
    """variance_i := ((actual_i - mean(cohort)) / 100)^2 in [0, 1]."""

    deviation = (actual_score - cohort_mean_score) / 100.0
    return _clamp01(deviation * deviation)


def compute_energy_breakdown(
    actual_scores: Sequence[float],
    predicted_scores: Sequence[float],
    drift_weight: float = 0.6,
    variance_weight: float = 0.4,
) -> EnergyComponentBreakdown:
    if len(actual_scores) != len(predicted_scores):
        raise ValueError("actual_scores and predicted_scores must have matching lengths")
    if not actual_scores:
        return EnergyComponentBreakdown(
            schema_version=ENERGY_SCHEMA_VERSION,
            drift_avg=0.0,
            variance_avg=0.0,
            drift_weight=drift_weight,
            variance_weight=variance_weight,
            weighted_penalty=0.0,
            energy_score=1.0,
        )

    cohort_mean = mean(actual_scores)
    drift_values = [normalized_drift_i(actual, predicted) for actual, predicted in zip(actual_scores, predicted_scores)]
    variance_values = [normalized_variance_i(actual, cohort_mean) for actual in actual_scores]

    drift_avg = _clamp01(mean(drift_values))
    variance_avg = _clamp01(mean(variance_values))

    weight_total = drift_weight + variance_weight
    if weight_total <= 0:
        drift_coeff, variance_coeff = 0.5, 0.5
    else:
        drift_coeff = drift_weight / weight_total
        variance_coeff = variance_weight / weight_total

    weighted_penalty = _clamp01((drift_avg * drift_coeff) + (variance_avg * variance_coeff))
    energy_score = _clamp01(1.0 - weighted_penalty)

    return EnergyComponentBreakdown(
        schema_version=ENERGY_SCHEMA_VERSION,
        drift_avg=round(drift_avg, 6),
        variance_avg=round(variance_avg, 6),
        drift_weight=round(drift_coeff, 6),
        variance_weight=round(variance_coeff, 6),
        weighted_penalty=round(weighted_penalty, 6),
        energy_score=round(energy_score, 6),
    )
