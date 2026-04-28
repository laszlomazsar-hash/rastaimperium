from app.core.monitoring import MonitoringState


def test_representation_quality_warn_and_fail_statuses_are_emitted_per_tick() -> None:
    state = MonitoringState()

    warn_snapshot = state.record_representation_quality_tick(
        ess_floor=0.49,
        resampling_variance=0.7,
        predictive_log_loss_gap=0.1,
        transport_drift_residual=0.05,
    )
    assert warn_snapshot.tick == 1
    assert warn_snapshot.status == "warn"
    assert warn_snapshot.warn_proxies == ["ess_floor"]
    assert warn_snapshot.failed_proxies == []
    assert warn_snapshot.remediation_actions == []

    fail_snapshot = state.record_representation_quality_tick(
        ess_floor=0.3,
        resampling_variance=1.4,
        predictive_log_loss_gap=0.22,
        transport_drift_residual=0.13,
    )
    assert fail_snapshot.tick == 2
    assert fail_snapshot.status == "fail"
    assert set(fail_snapshot.failed_proxies) == {
        "ess_floor",
        "resampling_variance",
        "predictive_log_loss_gap",
        "transport_drift_residual",
    }
    assert fail_snapshot.remediation_actions == ["increase_particles", "switch_mode", "safe_fallback"]

    payload = state.metrics_payload()
    assert payload["representation_quality_status"] == "fail"
    assert payload["representation_tick"] == 2
    assert payload["representation_warn_count"] == 1
    assert payload["representation_fail_count"] == 1
    assert payload["representation_metrics"] == {
        "ess_floor": 0.3,
        "resampling_variance": 1.4,
        "predictive_log_loss_gap": 0.22,
        "transport_drift_residual": 0.13,
    }


def test_representation_quality_prometheus_contains_status_and_proxy_metrics() -> None:
    state = MonitoringState()
    state.record_representation_quality_tick(
        ess_floor=0.72,
        resampling_variance=0.6,
        predictive_log_loss_gap=0.03,
        transport_drift_residual=0.02,
    )

    payload = state.prometheus()
    assert "rasta_representation_status 0" in payload
    assert "rasta_representation_tick 1" in payload
    assert 'rasta_representation_proxy{name="ess_floor"} 0.72' in payload
