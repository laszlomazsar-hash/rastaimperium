from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Sequence


@dataclass(frozen=True)
class DirectionalProbe:
    """Directional evidence used to compute the executable control signal estimator g_hat."""

    direction: float
    confidence: float


@dataclass(frozen=True)
class ControlDecision:
    """Result of evaluating control intent from directional probes."""

    g_hat: float
    action: str


SAFE_BAND = 0.20


def _clamp_unit(value: float) -> float:
    return max(0.0, min(1.0, value))


def estimate_g_hat(probes: Sequence[DirectionalProbe] | Iterable[DirectionalProbe]) -> float:
    """
    Compute a single estimator g_hat directly from directional probes.

    Semantics: this control path uses one estimator only; there is no finite candidate
    set and no argmin-based selector stage.
    """

    probe_list = list(probes)
    if not probe_list:
        return 0.0

    weighted_sum = sum(probe.direction * _clamp_unit(probe.confidence) for probe in probe_list)
    confidence_mass = sum(_clamp_unit(probe.confidence) for probe in probe_list)
    if confidence_mass == 0.0:
        return 0.0

    return weighted_sum / confidence_mass


def decide_action(probes: Sequence[DirectionalProbe] | Iterable[DirectionalProbe]) -> ControlDecision:
    """Map the single estimator g_hat to deterministic executable control actions."""

    g_hat = estimate_g_hat(probes)
    if g_hat > SAFE_BAND:
        action = "expand"
    elif g_hat < -SAFE_BAND:
        action = "recover"
    else:
        action = "steady"

    return ControlDecision(g_hat=g_hat, action=action)
