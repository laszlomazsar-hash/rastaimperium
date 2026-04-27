from __future__ import annotations

from collections import deque
from dataclasses import dataclass, field
from datetime import datetime, timezone
from statistics import mean
from typing import Deque, Iterable


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


@dataclass(frozen=True)
class StabilityPolicy:
    """Policy inputs for rolling stability checks."""

    horizon_length: int = 5
    consecutive_violations: int = 3
    expected_trend_bounds: dict[str, tuple[float, float]] = field(
        default_factory=lambda: {
            "E": (-0.1, 0.1),
            "H": (-0.1, 0.1),
            "L": (-0.1, 0.1),
        }
    )


@dataclass(frozen=True)
class StabilitySample:
    """Single runtime observation for the E/H/L channels."""

    E: float
    H: float
    L: float
    observed_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class StabilityMonitor:
    """Operational monitor for average-stability trend control."""

    policy: StabilityPolicy
    _samples: Deque[StabilitySample] = field(init=False)
    _consecutive_violation_windows: int = field(default=0, init=False)
    _logs: list[dict[str, object]] = field(default_factory=list, init=False)
    corrective_mode: bool = field(default=False, init=False)

    def __post_init__(self) -> None:
        self._samples = deque(maxlen=self.policy.horizon_length)

    def observe(self, E: float, H: float, L: float, observed_at: str | None = None) -> dict[str, object]:
        sample = StabilitySample(
            E=E,
            H=H,
            L=L,
            observed_at=observed_at or datetime.now(timezone.utc).isoformat(),
        )
        self._samples.append(sample)
        result = self._evaluate_window()
        self._logs.append(result)
        return result

    def _evaluate_window(self) -> dict[str, object]:
        trends = self.trend_estimator()
        violating_metrics = [
            metric
            for metric, trend in trends.items()
            if not self._within_expected_bounds(metric=metric, value=trend)
        ]
        violated = bool(violating_metrics)
        if violated:
            self._consecutive_violation_windows += 1
        else:
            self._consecutive_violation_windows = 0

        self.corrective_mode = self._consecutive_violation_windows >= self.policy.consecutive_violations
        return {
            "evaluated_at": datetime.now(timezone.utc).isoformat(),
            "horizon_length": self.policy.horizon_length,
            "samples_available": len(self._samples),
            "trend_estimator": trends,
            "violating_metrics": violating_metrics,
            "consecutive_violating_windows": self._consecutive_violation_windows,
            "corrective_mode": self.corrective_mode,
            "window_samples": [s.__dict__.copy() for s in self._samples],
        }

    def trend_estimator(self) -> dict[str, float]:
        if len(self._samples) < 2:
            return {"E": 0.0, "H": 0.0, "L": 0.0}
        first = self._samples[0]
        last = self._samples[-1]
        denominator = max(1, len(self._samples) - 1)
        return {
            "E": (last.E - first.E) / denominator,
            "H": (last.H - first.H) / denominator,
            "L": (last.L - first.L) / denominator,
        }

    def replay_log(self) -> list[dict[str, object]]:
        return [entry.copy() for entry in self._logs]

    def _within_expected_bounds(self, metric: str, value: float) -> bool:
        low, high = self.policy.expected_trend_bounds[metric]
        return low <= value <= high
