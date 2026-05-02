from __future__ import annotations

import random

import pytest

from src.soulecho.metrics import (
    bounded_drift,
    bounded_energy_index,
    bounded_variance_term,
    normalize_component_weights,
)


def test_bounded_drift_clamps_into_unit_interval() -> None:
    assert bounded_drift(-5, scale=10) == 0.0
    assert bounded_drift(3, scale=10) == 0.3
    assert bounded_drift(25, scale=10) == 1.0


def test_bounded_variance_term_clamps_into_unit_interval() -> None:
    assert bounded_variance_term(-0.2) == 0.0
    assert bounded_variance_term(0.4) == 0.4
    assert bounded_variance_term(1.5) == 1.0


def test_weight_normalization() -> None:
    weights = normalize_component_weights(2.0, 3.0)
    assert weights == pytest.approx((0.4, 0.6))
    assert sum(weights) == pytest.approx(1.0)


def test_weight_normalization_zero_total_defaults_to_equal_split() -> None:
    weights = normalize_component_weights(0.0, 0.0, 0.0)
    assert weights == pytest.approx((1 / 3, 1 / 3, 1 / 3))


def test_weight_normalization_rejects_negative_values() -> None:
    with pytest.raises(ValueError):
        normalize_component_weights(0.2, -0.1)


def test_bounded_energy_is_always_within_declared_range_property() -> None:
    random.seed(42)
    for _ in range(1_000):
        raw_drift = random.uniform(-5_000, 5_000)
        variance = random.uniform(-50, 50)
        drift_scale = random.uniform(0.01, 1_000)
        drift_weight = random.uniform(0, 100)
        variance_weight = random.uniform(0, 100)

        energy = bounded_energy_index(
            raw_drift,
            variance,
            drift_scale=drift_scale,
            drift_weight=drift_weight,
            variance_weight=variance_weight,
        )
        assert 0.0 <= energy <= 1.0


def test_bounded_energy_uses_convex_upper_bound() -> None:
    energy = bounded_energy_index(
        raw_drift=1_000,
        variance=10,
        drift_scale=1.0,
        drift_weight=9,
        variance_weight=1,
    )
    assert energy == pytest.approx(1.0)
