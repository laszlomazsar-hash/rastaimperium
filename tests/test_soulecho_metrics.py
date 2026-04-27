from src.soulecho.metrics import StabilityMonitor, StabilityPolicy, anomaly_alerts, global_coherence


def test_global_coherence_average() -> None:
    assert global_coherence([95, 85, 100]) == 93.33


def test_anomaly_alerts_below_threshold() -> None:
    alerts = anomaly_alerts({"L1": 90, "L2": 79})
    assert alerts == ["L2 deviated to 79%"]


def test_stability_monitor_triggers_corrective_mode_after_consecutive_violations() -> None:
    policy = StabilityPolicy(
        horizon_length=3,
        consecutive_violations=2,
        expected_trend_bounds={"E": (-0.05, 0.05), "H": (-0.05, 0.05), "L": (-0.05, 0.05)},
    )
    monitor = StabilityMonitor(policy=policy)

    monitor.observe(E=0.40, H=0.50, L=0.55, observed_at="2026-01-01T00:00:00+00:00")
    assert monitor.corrective_mode is False

    first_violation = monitor.observe(E=0.55, H=0.50, L=0.55, observed_at="2026-01-01T00:01:00+00:00")
    assert first_violation["violating_metrics"] == ["E"]
    assert first_violation["corrective_mode"] is False

    second_violation = monitor.observe(E=0.70, H=0.50, L=0.55, observed_at="2026-01-01T00:02:00+00:00")
    assert second_violation["violating_metrics"] == ["E"]
    assert second_violation["corrective_mode"] is True
    assert monitor.corrective_mode is True


def test_stability_monitor_replay_log_records_evaluations() -> None:
    monitor = StabilityMonitor(policy=StabilityPolicy(horizon_length=2, consecutive_violations=1))
    monitor.observe(E=0.10, H=0.10, L=0.10, observed_at="2026-01-01T00:00:00+00:00")
    monitor.observe(E=0.30, H=0.10, L=0.10, observed_at="2026-01-01T00:01:00+00:00")

    logs = monitor.replay_log()
    assert len(logs) == 2
    assert logs[-1]["samples_available"] == 2
    assert logs[-1]["window_samples"][-1]["observed_at"] == "2026-01-01T00:01:00+00:00"
