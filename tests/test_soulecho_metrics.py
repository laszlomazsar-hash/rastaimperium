import logging

from src.soulecho.metrics import (
    TrendPolicy,
    anomaly_alerts,
    evaluate_trend,
    global_coherence,
)


def test_global_coherence_average() -> None:
    assert global_coherence([95, 85, 100]) == 93.33


def test_anomaly_alerts_below_threshold() -> None:
    alerts = anomaly_alerts({"L1": 90, "L2": 79})
    assert alerts == ["L2 deviated to 79%"]


def test_evaluate_trend_uses_default_theil_sen_within_window() -> None:
    result = evaluate_trend([1, 2, 3, 4, 5], policy=TrendPolicy(trend_window_max_for_theil_sen=5))
    assert result.estimator_mode == "theil_sen"
    assert result.slope == 1.0


def test_evaluate_trend_switches_to_fallback_when_window_exceeds_threshold() -> None:
    result = evaluate_trend([float(i) for i in range(7)], policy=TrendPolicy(trend_window_max_for_theil_sen=6))
    assert result.estimator_mode == "ols"
    assert result.slope == 1.0


def test_evaluate_trend_switches_to_fallback_for_unsupported_default_mode() -> None:
    result = evaluate_trend([1, 2, 3], policy=TrendPolicy(trend_mode_default="unknown", trend_mode_fallback="ols"))
    assert result.estimator_mode == "ols"


def test_evaluate_trend_logs_mode_selected_per_cycle(caplog) -> None:
    caplog.set_level(logging.INFO)

    evaluate_trend([1, 2, 3], policy=TrendPolicy())

    assert "Trend estimator mode selected for evaluation cycle" in caplog.text
    assert "mode=theil_sen" in caplog.text
