from __future__ import annotations

import math

import pytest

from app.ark_engine.core.self_check import (
    C,
    D,
    R,
    GradientPolicy,
    control_action,
    control_gradient,
)


def test_policy_rejects_out_of_bounds_smoothing_strength() -> None:
    with pytest.raises(ValueError):
        GradientPolicy(mode="smooth", smoothing_strength=-0.1)
    with pytest.raises(ValueError):
        GradientPolicy(mode="smooth", smoothing_strength=1.1)


def test_subgradient_is_defined_at_nonsmooth_points() -> None:
    policy = GradientPolicy(mode="subgradient", smoothing_strength=0.0)

    # Exactly at all kinks: nominal point and both barriers.
    assert math.isfinite(control_gradient(1.0, policy))
    assert math.isfinite(control_gradient(0.6, policy))
    assert math.isfinite(control_gradient(1.2, policy))


def test_smooth_surrogate_has_bounded_continuous_like_response() -> None:
    policy = GradientPolicy(mode="smooth", smoothing_strength=0.8)

    left = control_gradient(0.6 - 1e-6, policy)
    right = control_gradient(0.6 + 1e-6, policy)
    assert abs(left - right) < 1e-2

    assert C(1.0, policy) >= 0.0
    assert R(0.6, policy) >= 0.0
    assert D(1.0, policy) >= 0.0


def test_controller_action_stable_near_nonsmooth_boundaries() -> None:
    policy = GradientPolicy(mode="smooth", smoothing_strength=0.7)

    # Near 0.6 and 1.2 boundaries we should avoid chatter and stay steady.
    for s in (0.595, 0.605, 1.195, 1.205):
        assert control_action(s, policy) == "steady"

    assert control_action(0.45, policy) == "recover"
    assert control_action(1.35, policy) == "expand"
