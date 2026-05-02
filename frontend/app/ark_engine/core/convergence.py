"""Empirical convergence-mode detection for trajectory telemetry."""

from __future__ import annotations

from dataclasses import dataclass
from math import sqrt
from statistics import mean
from typing import Any, Dict, List, Sequence, Tuple

State = Sequence[float]


@dataclass(frozen=True)
class ConvergenceMetrics:
    state_distance_decay: float
    periodicity_score: float
    bounded_aperiodicity_indicator: float
    radius_mean: float
    radius_std: float


@dataclass(frozen=True)
class ModeAssessment:
    mode: str
    confidence: float
    metrics: ConvergenceMetrics

    def as_telemetry(self) -> Dict[str, Any]:
        return {
            "current_mode": self.mode,
            "confidence": round(self.confidence, 4),
            "supporting_metrics": {
                "state_distance_decay": round(self.metrics.state_distance_decay, 4),
                "periodicity_score": round(self.metrics.periodicity_score, 4),
                "bounded_aperiodicity_indicator": round(self.metrics.bounded_aperiodicity_indicator, 4),
                "radius_mean": round(self.metrics.radius_mean, 4),
                "radius_std": round(self.metrics.radius_std, 4),
            },
        }


class RollingWindowConvergenceDetector:
    """Classifies trajectory mode from rolling-window empirical metrics."""

    def __init__(
        self,
        window_size: int = 24,
        min_confidence: float = 0.55,
        decay_threshold: float = 0.35,
        periodicity_threshold: float = 0.7,
        bounded_threshold: float = 0.55,
    ) -> None:
        self.window_size = max(8, window_size)
        self.min_confidence = min_confidence
        self.decay_threshold = decay_threshold
        self.periodicity_threshold = periodicity_threshold
        self.bounded_threshold = bounded_threshold

    def detect(self, trajectory: Sequence[State]) -> Dict[str, Any]:
        if len(trajectory) < 4:
            assessment = ModeAssessment(
                mode="insufficient_data",
                confidence=0.0,
                metrics=ConvergenceMetrics(0.0, 0.0, 0.0, 0.0, 0.0),
            )
            return assessment.as_telemetry()

        windows = self._rolling_windows(trajectory)
        assessments = [self._assess_window(window) for window in windows]
        current = assessments[-1]
        if current.confidence < self.min_confidence:
            current = ModeAssessment(mode="undetermined", confidence=current.confidence, metrics=current.metrics)

        telemetry = current.as_telemetry()
        telemetry["window_count"] = len(windows)
        telemetry["window_assessments"] = [
            {
                "mode": assessment.mode,
                "confidence": round(assessment.confidence, 4),
                "supporting_metrics": {
                    "state_distance_decay": round(assessment.metrics.state_distance_decay, 4),
                    "periodicity_score": round(assessment.metrics.periodicity_score, 4),
                    "bounded_aperiodicity_indicator": round(assessment.metrics.bounded_aperiodicity_indicator, 4),
                },
            }
            for assessment in assessments
        ]
        return telemetry

    def _rolling_windows(self, trajectory: Sequence[State]) -> List[Sequence[State]]:
        if len(trajectory) <= self.window_size:
            return [trajectory]
        return [trajectory[idx : idx + self.window_size] for idx in range(0, len(trajectory) - self.window_size + 1)]

    def _assess_window(self, window: Sequence[State]) -> ModeAssessment:
        metrics = self._metrics(window)

        if metrics.state_distance_decay >= self.decay_threshold and metrics.periodicity_score < self.periodicity_threshold:
            confidence = (metrics.state_distance_decay + (1.0 - metrics.periodicity_score)) / 2
            return ModeAssessment(mode="fixed_point", confidence=min(1.0, confidence), metrics=metrics)

        if metrics.periodicity_score >= self.periodicity_threshold:
            confidence = (metrics.periodicity_score + (1.0 - max(0.0, metrics.state_distance_decay))) / 2
            return ModeAssessment(mode="periodic", confidence=min(1.0, confidence), metrics=metrics)

        if metrics.bounded_aperiodicity_indicator >= self.bounded_threshold:
            confidence = (
                metrics.bounded_aperiodicity_indicator
                + (1.0 - metrics.periodicity_score)
                + (1.0 - max(0.0, metrics.state_distance_decay))
            ) / 3
            return ModeAssessment(mode="bounded_aperiodic", confidence=min(1.0, confidence), metrics=metrics)

        confidence = max(0.0, 1.0 - metrics.bounded_aperiodicity_indicator)
        return ModeAssessment(mode="divergent", confidence=confidence, metrics=metrics)

    def _metrics(self, window: Sequence[State]) -> ConvergenceMetrics:
        deltas = [_distance(window[idx + 1], window[idx]) for idx in range(len(window) - 1)]
        split = max(1, len(deltas) // 2)
        first_half = mean(deltas[:split])
        second_half = mean(deltas[split:]) if deltas[split:] else deltas[-1]
        decay = _safe_div(first_half - second_half, max(first_half, 1e-6))

        periodicity = self._periodicity_score(window)

        centroid = _centroid(window)
        radii = [_distance(state, centroid) for state in window]
        radius_mean = mean(radii)
        radius_std = _stddev(radii)
        bounded_indicator = _safe_div(radius_mean, radius_mean + radius_std + 1e-6) * (1.0 - periodicity)

        return ConvergenceMetrics(
            state_distance_decay=max(-1.0, min(1.0, decay)),
            periodicity_score=max(0.0, min(1.0, periodicity)),
            bounded_aperiodicity_indicator=max(0.0, min(1.0, bounded_indicator)),
            radius_mean=radius_mean,
            radius_std=radius_std,
        )

    def _periodicity_score(self, window: Sequence[State]) -> float:
        if len(window) < 6:
            return 0.0

        scale = mean([_distance(window[idx + 1], window[idx]) for idx in range(len(window) - 1)]) + 1e-6
        max_lag = min(len(window) // 2, 8)
        best = 0.0

        for lag in range(2, max_lag + 1):
            distances = [_distance(window[idx], window[idx - lag]) for idx in range(lag, len(window))]
            if not distances:
                continue
            normalized = [max(0.0, 1.0 - _safe_div(dist, scale)) for dist in distances]
            best = max(best, mean(normalized))

        return best


def _safe_div(numerator: float, denominator: float) -> float:
    if denominator == 0:
        return 0.0
    return numerator / denominator


def _distance(a: State, b: State) -> float:
    size = min(len(a), len(b))
    if size == 0:
        return 0.0
    return sqrt(sum((a[idx] - b[idx]) ** 2 for idx in range(size)))


def _centroid(points: Sequence[State]) -> Tuple[float, ...]:
    dim = min(len(point) for point in points)
    if dim == 0:
        return (0.0,)
    return tuple(mean(point[idx] for point in points) for idx in range(dim))


def _stddev(values: Sequence[float]) -> float:
    if len(values) < 2:
        return 0.0
    mu = mean(values)
    return sqrt(sum((value - mu) ** 2 for value in values) / len(values))
