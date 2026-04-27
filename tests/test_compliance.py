from src.codex.compliance import ComplianceEngine


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_proxy_threshold_calibration_metadata_tracks_scope_and_version() -> None:
    engine = ComplianceEngine()
    initial = engine.calibration_status()

    metadata = engine.calibrate_proxy_thresholds(
        dataset_scope="enterprise:tenant_a",
        baseline_window="2026-01-01..2026-03-31",
        policy_limit=0.15,
    )

    assert metadata.threshold_version != initial["threshold_version"]
    assert metadata.calibrated_at
    assert metadata.dataset_scope == "enterprise:tenant_a"
    assert metadata.baseline_window == "2026-01-01..2026-03-31"
    assert metadata.policy_limit == 0.15


def test_proxy_residual_drift_trigger_and_observability_status() -> None:
    engine = ComplianceEngine()
    engine.calibrate_proxy_thresholds(
        dataset_scope="rolling:90d",
        baseline_window="2026-Q1",
        policy_limit=0.2,
    )

    assert engine.evaluate_proxy_residual_drift(0.12) is False
    assert engine.calibration_status()["recalibration_required"] is False

    assert engine.evaluate_proxy_residual_drift(0.25) is True
    status = engine.calibration_status()
    assert status["latest_residual_drift"] == 0.25
    assert status["recalibration_required"] is True
