from __future__ import annotations

import logging

from app.ark_engine.core.self_check import TrendInferencePolicy, infer_stability_trend


def test_theil_sen_uses_last_n_points_only() -> None:
    history = [100.0, 100.0, 100.0, 1.0, 2.0, 3.0]
    policy = TrendInferencePolicy(stability_window_max=3, theil_sen_max_points=10, compute_budget_ops=10_000)

    result = infer_stability_trend(history, policy=policy)

    assert result.window_size == 3
    assert result.estimator_mode == "theil_sen"
    assert round(result.slope, 2) == 1.0


def test_falls_back_to_linear_when_window_exceeds_theil_sen_threshold() -> None:
    history = [float(i) for i in range(30)]
    policy = TrendInferencePolicy(stability_window_max=30, theil_sen_max_points=20, compute_budget_ops=10_000)

    result = infer_stability_trend(history, policy=policy)

    assert result.estimator_mode == "linear"
    assert result.window_size == 30


def test_falls_back_to_linear_when_compute_budget_exceeded() -> None:
    history = [float(i) for i in range(15)]
    policy = TrendInferencePolicy(stability_window_max=15, theil_sen_max_points=50, compute_budget_ops=40)

    result = infer_stability_trend(history, policy=policy)

    assert result.estimator_mode == "linear"


def test_emits_estimator_mode_and_window_in_logs(caplog) -> None:
    caplog.set_level(logging.INFO)
    policy = TrendInferencePolicy(stability_window_max=5, theil_sen_max_points=10, compute_budget_ops=10_000)

    result = infer_stability_trend([1.0, 2.0, 3.0, 4.0, 5.0], policy=policy)

    assert result.estimator_mode == "theil_sen"
    record = next(r for r in caplog.records if r.msg == "stability_trend_inference_complete")
    assert record.estimator_mode == "theil_sen"
    assert record.window_size == 5
