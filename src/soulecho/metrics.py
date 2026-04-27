from __future__ import annotations

import logging
from dataclasses import dataclass
from statistics import mean, median
from typing import Iterable

logger = logging.getLogger(__name__)


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


@dataclass(frozen=True)
class TrendPolicy:
    trend_mode_default: str = "theil_sen"
    trend_mode_fallback: str = "ols"
    trend_window_max_for_theil_sen: int = 256


@dataclass(frozen=True)
class TrendEvaluation:
    slope: float
    estimator_mode: str
    window_size: int


def evaluate_trend(values: Iterable[float], policy: TrendPolicy = TrendPolicy()) -> TrendEvaluation:
    series = list(values)
    window_size = len(series)
    mode = _select_estimator_mode(policy=policy, window_size=window_size)

    if window_size < 2:
        slope = 0.0
    elif mode == "theil_sen":
        slope = _theil_sen_slope(series)
    else:
        slope = _ols_slope(series)

    logger.info(
        "Trend estimator mode selected for evaluation cycle: mode=%s window_size=%s",
        mode,
        window_size,
    )
    return TrendEvaluation(slope=round(slope, 6), estimator_mode=mode, window_size=window_size)


def _select_estimator_mode(policy: TrendPolicy, window_size: int) -> str:
    default_mode = policy.trend_mode_default
    fallback_mode = policy.trend_mode_fallback

    supported = {"theil_sen", "ols"}
    if default_mode not in supported:
        return fallback_mode

    if default_mode == "theil_sen" and window_size > policy.trend_window_max_for_theil_sen:
        return fallback_mode

    return default_mode


def _ols_slope(series: list[float]) -> float:
    n = len(series)
    x_mean = (n - 1) / 2
    y_mean = mean(series)
    numerator = sum((index - x_mean) * (value - y_mean) for index, value in enumerate(series))
    denominator = sum((index - x_mean) ** 2 for index in range(n))
    return 0.0 if denominator == 0 else numerator / denominator


def _theil_sen_slope(series: list[float]) -> float:
    slopes: list[float] = []
    for i, start in enumerate(series[:-1]):
        for j in range(i + 1, len(series)):
            slopes.append((series[j] - start) / (j - i))
    return 0.0 if not slopes else float(median(slopes))
