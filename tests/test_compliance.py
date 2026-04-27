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


def test_candidate_update_rejects_when_loss_increases() -> None:
    engine = ComplianceEngine()
    result = engine.evaluate_candidate_trace_update({"L2": 70})

    assert result["gate_passed"] is False
    assert result["accepted"] is False
    assert result["L_new"] > result["L_old"]


def test_candidate_update_accepts_when_loss_decreases() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 60)

    result = engine.evaluate_candidate_trace_update({"L2": 88})

    assert result["gate_passed"] is True
    assert result["accepted"] is True
    assert result["L_new"] < result["L_old"]


def test_candidate_update_detects_revision_conflict(monkeypatch) -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 60)

    def force_conflict(*args, **kwargs):
        engine.set_trace_coverage("L3", 50)
        return 0.0

    monkeypatch.setattr(engine, "_loss", force_conflict)
    result = engine.evaluate_candidate_trace_update({"L2": 95})

    assert result["gate_passed"] is True
    assert result["accepted"] is False
    assert result["conflict"] is True
