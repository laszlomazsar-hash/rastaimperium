from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Dict, Mapping


@dataclass(frozen=True)
class FiniteDifferenceScalePolicy:
    """Versioned coordinate scales for deterministic finite differences."""

    version: str
    scales: Mapping[str, float]

    def step_sizes(self, h_base: float, point: Mapping[str, float]) -> Dict[str, float]:
        return {coordinate: h_base * float(self.scales.get(coordinate, 1.0)) for coordinate in sorted(point)}


def _sorted_point(point: Mapping[str, float]) -> Dict[str, float]:
    return {coordinate: float(point[coordinate]) for coordinate in sorted(point)}


def central_difference_estimate(
    fn: Callable[[Mapping[str, float]], float],
    point: Mapping[str, float],
    h_base: float,
    scale_policy: FiniteDifferenceScalePolicy,
) -> tuple[Dict[str, float], Dict[str, object]]:
    ordered_point = _sorted_point(point)
    step_sizes = scale_policy.step_sizes(h_base, ordered_point)
    gradient = _estimate_gradient_with_steps(fn, ordered_point, step_sizes)
    artifact = {
        "method": "central_difference",
        "h_base": h_base,
        "scale_version": scale_policy.version,
        "scale_policy": {coordinate: float(scale_policy.scales.get(coordinate, 1.0)) for coordinate in sorted(ordered_point)},
        "h_by_coordinate": step_sizes,
    }
    return gradient, artifact


def replay_derivative_estimate(
    fn: Callable[[Mapping[str, float]], float],
    point: Mapping[str, float],
    artifact: Mapping[str, object],
) -> Dict[str, float]:
    ordered_point = _sorted_point(point)
    step_sizes = _extract_step_sizes(artifact, ordered_point)
    return _estimate_gradient_with_steps(fn, ordered_point, step_sizes)


def verify_derivative_estimate(
    fn: Callable[[Mapping[str, float]], float],
    point: Mapping[str, float],
    artifact: Mapping[str, object],
) -> Dict[str, float]:
    """Verification run uses the exact same per-coordinate step sizes as replay."""

    return replay_derivative_estimate(fn, point, artifact)


def _estimate_gradient_with_steps(
    fn: Callable[[Mapping[str, float]], float],
    point: Mapping[str, float],
    step_sizes: Mapping[str, float],
) -> Dict[str, float]:
    gradient: Dict[str, float] = {}
    for coordinate in sorted(point):
        step = float(step_sizes[coordinate])
        plus = dict(point)
        minus = dict(point)
        plus[coordinate] = point[coordinate] + step
        minus[coordinate] = point[coordinate] - step
        gradient[coordinate] = (fn(plus) - fn(minus)) / (2.0 * step)
    return gradient


def _extract_step_sizes(artifact: Mapping[str, object], point: Mapping[str, float]) -> Dict[str, float]:
    raw = artifact.get("h_by_coordinate")
    if not isinstance(raw, Mapping):
        raise ValueError("artifact must include h_by_coordinate mapping")

    step_sizes: Dict[str, float] = {}
    for coordinate in sorted(point):
        if coordinate not in raw:
            raise ValueError(f"artifact h_by_coordinate missing coordinate: {coordinate}")
        step_sizes[coordinate] = float(raw[coordinate])
    return step_sizes
