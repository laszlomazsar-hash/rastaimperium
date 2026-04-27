from src.codex.compliance import AuditRecord, ComplianceEngine


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record.digest == record.cert_hash
    assert len(record.prev_cert_hash) == 64
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_temporal_integrity_verifier_detects_reordering() -> None:
    engine = ComplianceEngine()
    first = engine.append_audit_record("admin", "init", "II", {"step": 1})
    second = engine.append_audit_record("admin", "deploy", "IV", {"step": 2})

    report = engine.verify_temporal_integrity([second, first])

    assert report["valid"] is False
    assert any("Broken linkage" in error for error in report["errors"])


def test_temporal_integrity_verifier_detects_missing_certificate() -> None:
    engine = ComplianceEngine()
    first = engine.append_audit_record("admin", "init", "II", {"step": 1})
    engine.append_audit_record("admin", "deploy", "IV", {"step": 2})
    third = engine.append_audit_record("admin", "rollout", "IV", {"step": 3})

    report = engine.verify_temporal_integrity([first, third])

    assert report["valid"] is False
    assert any("Certificate index mismatch" in error for error in report["errors"])


def test_periodic_checkpoint_anchoring() -> None:
    engine = ComplianceEngine(checkpoint_interval=2)

    engine.append_audit_record("admin", "init", "II", {"step": 1})
    second = engine.append_audit_record("admin", "deploy", "IV", {"step": 2})

    assert len(engine.checkpoints) == 1
    assert engine.checkpoints[0].cert_hash == second.cert_hash


def test_external_anchor_on_manual_checkpoint() -> None:
    engine = ComplianceEngine()
    engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.7"})

    checkpoint = engine.anchor_checkpoint(external_anchor="btc:000000000000000000abc")

    assert checkpoint.external_anchor == "btc:000000000000000000abc"


def test_verifier_detects_tampered_hash() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})
    tampered = AuditRecord(**{**record.__dict__, "cert_hash": "0" * 64, "digest": "0" * 64})

    report = engine.verify_temporal_integrity([tampered])

    assert report["valid"] is False
    assert any("Hash mismatch" in error for error in report["errors"])
