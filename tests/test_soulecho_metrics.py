from src.soulecho.metrics import (
    anomaly_alerts,
    empirical_coverage,
    global_coherence,
    probabilistic_safety_margin,
    std_estimate,
)


def test_global_coherence_average() -> None:
    assert global_coherence([95, 85, 100]) == 93.33


def test_anomaly_alerts_below_threshold() -> None:
    alerts = anomaly_alerts({"L1": 90, "L2": 79})
    assert alerts == ["L2 deviated to 79%"]


def test_std_estimate_matches_sample_standard_deviation() -> None:
    values = [10.0, 12.0, 14.0]
    assert round(std_estimate(values), 5) == round(2.0, 5)


def test_probabilistic_safety_margin_gaussian_has_diagnostics() -> None:
    values = [90.0, 91.0, 89.5, 92.0, 88.0, 90.5, 91.5, 89.0, 90.2, 90.8] * 4
    result = probabilistic_safety_margin(values, confidence_level=0.95, error_model="gaussian")
    assert result.safety_margin > 0
    assert result.diagnostics.error_model == "gaussian"
    assert result.diagnostics.sample_size == len(values)
    assert "sample_size<30" not in result.diagnostics.failed_assumptions


def test_probabilistic_safety_margin_flags_stale_model_when_underpowered() -> None:
    values = [100.0, 100.0, 100.0]
    result = probabilistic_safety_margin(values, confidence_level=0.99, error_model="bootstrapped")
    assert result.diagnostics.stale_model is True
    assert "sample_size<50" in result.diagnostics.failed_assumptions
    assert "std_estimate==0" in result.diagnostics.failed_assumptions


def test_empirical_coverage_for_interval() -> None:
    values = [1, 2, 3, 4, 5]
    assert empirical_coverage(values, lower=2, upper=4) == 0.6
