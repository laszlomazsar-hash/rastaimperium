"""Self-check helpers for stability heuristics.

Control law notes
-----------------
The controller uses three scalar terms over stability ``s``:

* ``C(s)``: tracking cost around the nominal operating point ``s=1``.
* ``R(s)``: risk barrier for low/high instability zones.
* ``D(s)``: damping term to discourage oscillatory corrections.

Differentiability / Lipschitz conditions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* In ``subgradient`` mode, ``C`` and ``D`` use absolute-value style penalties and
  ``R`` uses hinge penalties. These are globally Lipschitz, and their gradients
  are interpreted as valid Clarke subgradients at non-smooth points.
* In ``smooth`` mode, each non-smooth primitive is replaced by a pseudo-Huber
  surrogate parameterized by ``smoothing_strength`` in ``[0, 1]``. For any
  ``smoothing_strength > 0``, all gradients are continuous and bounded.

Non-smooth point behavior
~~~~~~~~~~~~~~~~~~~~~~~~~
* ``subgradient`` mode picks a neutral subgradient of ``0.0`` at kink points.
* ``smooth`` mode uses the differentiable surrogate with epsilon tied to
  ``smoothing_strength``.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

LOW_STABILITY_BOUNDARY = 0.6
HIGH_STABILITY_BOUNDARY = 1.2
NOMINAL_STABILITY = 1.0


@dataclass(frozen=True)
class GradientPolicy:
    """Policy controlling treatment of non-smooth gradients.

    ``smoothing_strength`` is clamped to ``[0, 1]`` and controls the surrogate
    sharpness in ``smooth`` mode, and boundary hysteresis width in action logic.
    """

    mode: Literal["subgradient", "smooth"] = "subgradient"
    smoothing_strength: float = 0.0

    def __post_init__(self) -> None:
        if self.mode not in {"subgradient", "smooth"}:
            raise ValueError("mode must be 'subgradient' or 'smooth'")
        if not 0.0 <= self.smoothing_strength <= 1.0:
            raise ValueError("smoothing_strength must be in [0, 1]")


DEFAULT_POLICY = GradientPolicy()


def _epsilon(policy: GradientPolicy) -> float:
    return 1e-6 + 1e-1 * policy.smoothing_strength


def _abs_value(x: float, policy: GradientPolicy) -> float:
    if policy.mode == "smooth":
        eps = _epsilon(policy)
        return (x * x + eps * eps) ** 0.5 - eps
    return abs(x)


def _abs_grad(x: float, policy: GradientPolicy) -> float:
    if policy.mode == "smooth":
        eps = _epsilon(policy)
        return x / ((x * x + eps * eps) ** 0.5)
    if x > 0:
        return 1.0
    if x < 0:
        return -1.0
    return 0.0


def _hinge_value(x: float, policy: GradientPolicy) -> float:
    if policy.mode == "smooth":
        eps = _epsilon(policy)
        return ((x * x + eps * eps) ** 0.5 + x) / 2.0
    return max(0.0, x)


def _hinge_grad(x: float, policy: GradientPolicy) -> float:
    if policy.mode == "smooth":
        eps = _epsilon(policy)
        return 0.5 * (1.0 + x / ((x * x + eps * eps) ** 0.5))
    if x > 0:
        return 1.0
    if x < 0:
        return 0.0
    return 0.0


def C(stability: float, policy: GradientPolicy = DEFAULT_POLICY) -> float:
    """Tracking cost around nominal stability."""

    return _abs_value(stability - NOMINAL_STABILITY, policy)


def R(stability: float, policy: GradientPolicy = DEFAULT_POLICY) -> float:
    """Barrier cost for low/high risk operating regions."""

    return _hinge_value(LOW_STABILITY_BOUNDARY - stability, policy) + _hinge_value(
        stability - HIGH_STABILITY_BOUNDARY,
        policy,
    )


def D(stability: float, policy: GradientPolicy = DEFAULT_POLICY) -> float:
    """Damping penalty used in controller correction term."""

    return 0.5 * _abs_value(stability - NOMINAL_STABILITY, policy)


def control_gradient(stability: float, policy: GradientPolicy = DEFAULT_POLICY) -> float:
    """Gradient of the aggregate control objective C + R + D."""

    dc = _abs_grad(stability - NOMINAL_STABILITY, policy)
    dr = -_hinge_grad(LOW_STABILITY_BOUNDARY - stability, policy) + _hinge_grad(
        stability - HIGH_STABILITY_BOUNDARY,
        policy,
    )
    dd = 0.5 * _abs_grad(stability - NOMINAL_STABILITY, policy)
    return dc + dr + dd


def _boundary_margin(policy: GradientPolicy) -> float:
    return 0.01 + 0.09 * policy.smoothing_strength


def control_action(stability: float, policy: GradientPolicy = DEFAULT_POLICY) -> str:
    """Policy action with hysteresis near non-smooth boundaries.

    The hysteresis band prevents action chatter around low/high thresholds.
    """

    margin = _boundary_margin(policy)
    if stability < LOW_STABILITY_BOUNDARY - margin:
        return "recover"
    if stability > HIGH_STABILITY_BOUNDARY + margin:
        return "expand"
    return "steady"


def self_check(memory, policy: GradientPolicy = DEFAULT_POLICY) -> str:
    return control_action(memory.stability, policy=policy)
