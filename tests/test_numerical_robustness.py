from __future__ import annotations

import math

from codex.numerical import (
    FiniteDifferenceScalePolicy,
    central_difference_estimate,
    replay_derivative_estimate,
    verify_derivative_estimate,
)


def test_scale_policy_is_versioned_and_captured_in_audit_artifact() -> None:
    policy = FiniteDifferenceScalePolicy(version="2026.04.1", scales={"x": 1.0, "y": 10.0})
    _, artifact = central_difference_estimate(
        fn=lambda p: p["x"] ** 2 + 3.0 * p["y"],
        point={"x": 2.0, "y": -5.0},
        h_base=1e-4,
        scale_policy=policy,
    )

    assert artifact["scale_version"] == "2026.04.1"
    assert artifact["scale_policy"] == {"x": 1.0, "y": 10.0}
    assert artifact["h_by_coordinate"] == {"x": 1e-4, "y": 1e-3}


def test_replay_and_verification_use_identical_step_sizes() -> None:
    policy = FiniteDifferenceScalePolicy(version="2026.04.1", scales={"x": 1.0, "y": 100.0})

    def fn(point: dict[str, float]) -> float:
        return point["x"] ** 3 + 0.5 * point["y"] ** 2

    origin = {"x": 1.2, "y": -0.4}
    gradient, artifact = central_difference_estimate(fn, origin, h_base=1e-5, scale_policy=policy)
    replay = replay_derivative_estimate(fn, origin, artifact)
    verification = verify_derivative_estimate(fn, origin, artifact)

    assert replay == verification
    assert replay == gradient


def test_sensitivity_is_stable_across_coordinate_scales() -> None:
    # Function with strongly different coordinate magnitudes.
    def fn(point: dict[str, float]) -> float:
        return 4.0 * point["x"] ** 2 + 2.0 * point["x"] * point["y"] + 1e-3 * point["y"] ** 2

    test_point = {"x": 2.5, "y": 900.0}
    expected = {
        "x": 8.0 * test_point["x"] + 2.0 * test_point["y"],
        "y": 2.0 * test_point["x"] + 2e-3 * test_point["y"],
    }

    baseline_policy = FiniteDifferenceScalePolicy(version="2026.04.1", scales={"x": 1.0, "y": 1.0})
    adjusted_policy = FiniteDifferenceScalePolicy(version="2026.04.2", scales={"x": 0.1, "y": 100.0})

    baseline, _ = central_difference_estimate(fn, test_point, h_base=1e-5, scale_policy=baseline_policy)
    adjusted, _ = central_difference_estimate(fn, test_point, h_base=1e-5, scale_policy=adjusted_policy)

    for coordinate in ("x", "y"):
        assert math.isclose(baseline[coordinate], expected[coordinate], rel_tol=1e-7, abs_tol=1e-6)
        assert math.isclose(adjusted[coordinate], expected[coordinate], rel_tol=1e-7, abs_tol=1e-6)
        assert math.isclose(baseline[coordinate], adjusted[coordinate], rel_tol=1e-8, abs_tol=1e-7)
