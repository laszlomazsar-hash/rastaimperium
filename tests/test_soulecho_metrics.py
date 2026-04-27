from src.soulecho.metrics import TrendPolicy, analyze_trend, anomaly_alerts, global_coherence


def test_global_coherence_average() -> None:
    assert global_coherence([95, 85, 100]) == 93.33


def test_anomaly_alerts_below_threshold() -> None:
    alerts = anomaly_alerts({"L1": 90, "L2": 79})
    assert alerts == ["L2 deviated to 79%"]


def test_analyze_trend_applies_minimum_sample_gate() -> None:
    analysis = analyze_trend([1.0, 1.2, 1.3], TrendPolicy(min_samples=5))
    assert analysis.trend == "insufficient_data"
    assert analysis.slope_confidence == 0.0


def test_analyze_trend_uses_policy_selected_theil_sen_estimator() -> None:
    trace = [1.0, 1.1, 1.2, 1.3, 8.5, 1.4, 1.5, 1.6]
    analysis = analyze_trend(trace, TrendPolicy(estimator="theil_sen", confidence_threshold=0.2))

    assert analysis.estimator == "theil_sen"
    assert analysis.trend == "up"
    payload = analysis.observability_payload()
    assert payload["estimator"] == "theil_sen"
    assert "slope_confidence" in payload
