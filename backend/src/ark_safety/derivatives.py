from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, List, Sequence


@dataclass(frozen=True)
class ProbeObservation:
    direction: str
    requested_point: List[float]
    evaluated_point: List[float]
    projected: bool
    shrunk_step: bool


@dataclass(frozen=True)
class DerivativeEstimate:
    value: float
    confidence: float
    probes: List[ProbeObservation]


class BoxSafetyManifold:
    """Axis-aligned admissible domain with deterministic clipping projection."""

    def __init__(self, lower: Sequence[float], upper: Sequence[float]) -> None:
        if len(lower) != len(upper):
            raise ValueError("lower and upper must share dimensionality")
        if any(lo > hi for lo, hi in zip(lower, upper)):
            raise ValueError("each lower bound must be <= upper bound")
        self._lower = [float(v) for v in lower]
        self._upper = [float(v) for v in upper]

    def is_admissible(self, point: Sequence[float]) -> bool:
        return all(lo <= x <= hi for x, lo, hi in zip(point, self._lower, self._upper))

    def project(self, point: Sequence[float]) -> List[float]:
        # Deterministic coordinate-wise projection order.
        return [min(max(float(x), lo), hi) for x, lo, hi in zip(point, self._lower, self._upper)]


class SafetyAwareDerivativeEstimator:
    """Finite-difference derivative estimator constrained by a safety manifold."""

    def __init__(self, manifold: BoxSafetyManifold) -> None:
        self._manifold = manifold

    def estimate_axis_derivative(
        self,
        V: Callable[[Sequence[float]], float],
        theta: Sequence[float],
        axis: int,
        h: float,
    ) -> DerivativeEstimate:
        if h <= 0:
            raise ValueError("h must be strictly positive")

        theta_local = [float(v) for v in theta]
        minus_probe = self._prepare_probe(theta_local, axis, -abs(h))
        plus_probe = self._prepare_probe(theta_local, axis, abs(h))

        # Deterministic probe order: minus first, then plus.
        v_minus = V(minus_probe.evaluated_point)
        v_plus = V(plus_probe.evaluated_point)

        denom = plus_probe.evaluated_point[axis] - minus_probe.evaluated_point[axis]
        if denom == 0.0:
            derivative = 0.0
        else:
            derivative = (v_plus - v_minus) / denom

        confidence = 1.0
        for probe in (minus_probe, plus_probe):
            if probe.projected:
                confidence *= 0.75
            if probe.shrunk_step:
                confidence *= 0.9

        return DerivativeEstimate(value=derivative, confidence=round(confidence, 6), probes=[minus_probe, plus_probe])

    def _prepare_probe(self, theta: List[float], axis: int, delta: float) -> ProbeObservation:
        requested = list(theta)
        requested[axis] += delta
        evaluated = list(requested)
        projected = False
        shrunk_step = False

        if not self._manifold.is_admissible(evaluated):
            projected_candidate = self._manifold.project(evaluated)
            if projected_candidate != evaluated:
                evaluated = projected_candidate
                projected = True
            else:
                # Fallback: deterministically shrink toward theta midpoint by half-step.
                evaluated[axis] = theta[axis] + (delta * 0.5)
                evaluated = self._manifold.project(evaluated)
                shrunk_step = True

        return ProbeObservation(
            direction="plus" if delta > 0 else "minus",
            requested_point=requested,
            evaluated_point=evaluated,
            projected=projected,
            shrunk_step=shrunk_step,
        )
