import pytest
from src.ark_safety.derivatives import BoxSafetyManifold, SafetyAwareDerivativeEstimator


def test_boundary_probe_projection_reduces_confidence_and_logs_probe_adjustments() -> None:
    manifold = BoxSafetyManifold(lower=[0.0], upper=[1.0])
    estimator = SafetyAwareDerivativeEstimator(manifold)

    estimate = estimator.estimate_axis_derivative(
        V=lambda t: t[0] ** 2,
        theta=[0.0],
        axis=0,
        h=0.2,
    )

    minus_probe, plus_probe = estimate.probes
    assert minus_probe.requested_point == [-0.2]
    assert minus_probe.evaluated_point == [0.0]
    assert minus_probe.projected is True
    assert minus_probe.shrunk_step is False

    assert plus_probe.requested_point == [0.2]
    assert plus_probe.evaluated_point == [0.2]
    assert plus_probe.projected is False

    assert estimate.value == pytest.approx(0.2)
    assert estimate.confidence < 1.0


def test_probe_order_is_deterministic_minus_then_plus() -> None:
    manifold = BoxSafetyManifold(lower=[0.0], upper=[1.0])
    estimator = SafetyAwareDerivativeEstimator(manifold)
    visited: list[float] = []

    def observe(theta: list[float]) -> float:
        visited.append(theta[0])
        return theta[0]

    estimator.estimate_axis_derivative(
        V=observe,
        theta=[0.5],
        axis=0,
        h=0.1,
    )

    assert visited == [0.4, 0.6]
