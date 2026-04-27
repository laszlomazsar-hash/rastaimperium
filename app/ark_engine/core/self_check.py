"""Self-check helpers for stability heuristics."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from statistics import median
from typing import Iterable, Sequence

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class TrendInferencePolicy:
    """Policy controls for trend inference under continuous execution."""

    stability_window_max: int = 60
    theil_sen_max_points: int = 80
    compute_budget_ops: int = 3000


@dataclass(frozen=True)
class TrendInferenceResult:
    slope: float
    intercept: float
    estimator_mode: str
    window_size: int


def _least_squares(values: Sequence[float]) -> tuple[float, float]:
    n = len(values)
    if n < 2:
        return 0.0, float(values[0]) if values else 0.0

    x_mean = (n - 1) / 2
    y_mean = sum(values) / n
    numerator = sum((idx - x_mean) * (value - y_mean) for idx, value in enumerate(values))
    denominator = sum((idx - x_mean) ** 2 for idx in range(n))
    slope = 0.0 if denominator == 0 else numerator / denominator
    intercept = y_mean - slope * x_mean
    return slope, intercept


def _theil_sen(values: Sequence[float]) -> tuple[float, float]:
    n = len(values)
    if n < 2:
        return 0.0, float(values[0]) if values else 0.0

    slopes: list[float] = []
    for i in range(n):
        y_i = values[i]
        for j in range(i + 1, n):
            slope = (values[j] - y_i) / (j - i)
            slopes.append(slope)
    slope = median(slopes) if slopes else 0.0
    intercept = median([value - slope * idx for idx, value in enumerate(values)])
    return slope, intercept


def infer_stability_trend(
    history: Iterable[float],
    policy: TrendInferencePolicy | None = None,
) -> TrendInferenceResult:
    """Infer stability trend using policy-bounded robust estimation."""

    active_policy = policy or TrendInferencePolicy()
    if active_policy.stability_window_max < 1:
        raise ValueError("stability_window_max must be >= 1")

    values = list(history)
    window_size = min(len(values), active_policy.stability_window_max)
    window = values[-window_size:] if window_size else []

    estimator_mode = "theil_sen"
    if window_size > active_policy.theil_sen_max_points:
        estimator_mode = "linear"
    else:
        estimated_ops = window_size * (window_size - 1) // 2
        if estimated_ops > active_policy.compute_budget_ops:
            estimator_mode = "linear"

    if estimator_mode == "theil_sen":
        slope, intercept = _theil_sen(window)
    else:
        slope, intercept = _least_squares(window)

    logger.info(
        "stability_trend_inference_complete",
        extra={
            "estimator_mode": estimator_mode,
            "window_size": window_size,
        },
    )
    return TrendInferenceResult(
        slope=slope,
        intercept=intercept,
        estimator_mode=estimator_mode,
        window_size=window_size,
    )


def self_check(memory) -> str:
    if memory.stability < 0.6:
        return "recover"
    if memory.stability > 1.2:
        return "expand"
    return "steady"
