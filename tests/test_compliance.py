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


def test_fault_model_excludes_out_of_scope_fault_classes() -> None:
    engine = ComplianceEngine()
    status = engine.observability_status()

    assert status["fault_model"]["excluded_fault_classes"] == [
        "disk_corruption",
        "arbitrary_memory_mutation",
        "policy_tampering",
    ]
    assert status["collapse_resistance"]["theorem"]


def test_integrity_validation_flags_policy_or_state_drift() -> None:
    engine = ComplianceEngine()
    baseline_state = {"epoch": 1, "trace_coverage": {"L1": 100.0}}
    baseline_policy = {"articles": ["II", "III", "IV"], "rollback_threshold": 80.0}
    engine.capture_integrity_baseline(baseline_state, baseline_policy)

    violations = engine.validate_integrity(
        persisted_state={"epoch": 2, "trace_coverage": {"L1": 100.0}},
        policy=baseline_policy,
    )
    status = engine.observability_status()

    assert any(v.code == "persisted_state_integrity_failure" for v in violations)
    assert status["integrity"]["violation_count"] == 1
    assert status["collapse_resistance"]["valid"] is False
    assert engine.should_trigger_rollback() is True
