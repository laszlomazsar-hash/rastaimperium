from __future__ import annotations

from dataclasses import dataclass
from math import isfinite
from statistics import mean
from typing import Iterable, Literal


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


TrendEstimator = Literal["ols", "theil_sen"]


@dataclass(frozen=True)
class TrendPolicy:
    """Policy for deciding how trend slope is estimated and gated."""

    estimator: TrendEstimator = "ols"
    min_samples: int = 6
    confidence_threshold: float = 0.55
    slope_epsilon: float = 1e-3


@dataclass(frozen=True)
class TrendAnalysis:
    estimator: TrendEstimator
    sample_count: int
    slope: float
    slope_confidence: float
    trend: Literal["up", "down", "flat", "insufficient_data", "low_confidence"]

    def observability_payload(self) -> dict[str, float | int | str | bool]:
        trend_declared = self.trend in {"up", "down", "flat"}
        return {
            "trend": self.trend,
            "trend_declared": trend_declared,
            "estimator": self.estimator,
            "sample_count": self.sample_count,
            "slope": self.slope,
            "slope_confidence": self.slope_confidence,
        }


def analyze_trend(trace: Iterable[float], policy: TrendPolicy | None = None) -> TrendAnalysis:
    """Analyze trend using the selected estimator and confidence gating.

    The returned trend is only declared when both of these pass:
    1) minimum sample count
    2) confidence threshold
    """

    cfg = policy or TrendPolicy()
    values = [float(v) for v in trace if isfinite(float(v))]
    sample_count = len(values)

    if sample_count < cfg.min_samples:
        return TrendAnalysis(
            estimator=cfg.estimator,
            sample_count=sample_count,
            slope=0.0,
            slope_confidence=0.0,
            trend="insufficient_data",
        )

    if cfg.estimator == "theil_sen":
        slope = _theil_sen_slope(values)
        confidence = _sign_consistency_confidence(values, slope)
    else:
        slope = _ols_slope(values)
        confidence = _ols_confidence(values, slope)

    if confidence < cfg.confidence_threshold:
        trend = "low_confidence"
    elif abs(slope) <= cfg.slope_epsilon:
        trend = "flat"
    else:
        trend = "up" if slope > 0 else "down"

    return TrendAnalysis(
        estimator=cfg.estimator,
        sample_count=sample_count,
        slope=round(slope, 6),
        slope_confidence=round(max(0.0, min(1.0, confidence)), 6),
        trend=trend,
    )


def _ols_slope(values: list[float]) -> float:
    n = len(values)
    x_mean = (n - 1) / 2
    y_mean = mean(values)
    numerator = 0.0
    denominator = 0.0
    for x, y in enumerate(values):
        dx = x - x_mean
        numerator += dx * (y - y_mean)
        denominator += dx * dx
    if denominator == 0:
        return 0.0
    return numerator / denominator


def _ols_confidence(values: list[float], slope: float) -> float:
    n = len(values)
    x_mean = (n - 1) / 2
    y_mean = mean(values)
    ss_tot = sum((y - y_mean) ** 2 for y in values)
    if ss_tot == 0:
        return 1.0
    intercept = y_mean - slope * x_mean
    ss_res = sum((y - (intercept + slope * x)) ** 2 for x, y in enumerate(values))
    r2 = 1 - (ss_res / ss_tot)
    return max(0.0, min(1.0, r2))


def _theil_sen_slope(values: list[float]) -> float:
    slopes: list[float] = []
    for i in range(len(values) - 1):
        yi = values[i]
        for j in range(i + 1, len(values)):
            slopes.append((values[j] - yi) / (j - i))
    if not slopes:
        return 0.0
    slopes.sort()
    mid = len(slopes) // 2
    if len(slopes) % 2:
        return slopes[mid]
    return (slopes[mid - 1] + slopes[mid]) / 2


def _sign_consistency_confidence(values: list[float], slope: float) -> float:
    if len(values) < 2:
        return 0.0
    direction = 1 if slope > 0 else -1 if slope < 0 else 0
    if direction == 0:
        return 1.0
    matching = 0
    total = 0
    for i in range(len(values) - 1):
        delta = values[i + 1] - values[i]
        if delta == 0:
            continue
        total += 1
        if (delta > 0 and direction > 0) or (delta < 0 and direction < 0):
            matching += 1
    if total == 0:
        return 1.0
    return matching / total
