from src.codex.compliance import ComplianceEngine, ReplayResult


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_numeric_tolerance_profile_accepts_small_drift() -> None:
    engine = ComplianceEngine()
    evaluation = engine.evaluate_replay_acceptance(
        ReplayResult(hash_match=True, max_abs_error=1e-7, p_value=0.999)
    )
    assert evaluation["profile"] == "numeric-tolerance"
    assert evaluation["accepted"] is True


def test_runtime_diagnostics_report_active_profile() -> None:
    engine = ComplianceEngine()
    diagnostics = engine.runtime_diagnostics()
    assert diagnostics["active_profile"] == "numeric-tolerance"
    assert diagnostics["environment_constraints"]
