from src.codex.compliance import ComplianceEngine, EvidenceStatus, SafetyState


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_unknown_policy_mapping_by_criticality_tier() -> None:
    engine = ComplianceEngine()

    low_state = engine.evaluate_invariant("latency", "low", EvidenceStatus.UNKNOWN)
    medium_state = engine.evaluate_invariant("queue_depth", "medium", EvidenceStatus.UNKNOWN)
    high_state = engine.evaluate_invariant("ledger_integrity", "high", EvidenceStatus.UNKNOWN)

    assert low_state is SafetyState.SAFE
    assert medium_state is SafetyState.DEGRADED
    assert high_state is SafetyState.DEGRADED


def test_sustained_unknown_transitions_to_compromise() -> None:
    engine = ComplianceEngine()

    first = engine.evaluate_invariant("ledger_integrity", "high", EvidenceStatus.UNKNOWN)
    second = engine.evaluate_invariant("ledger_integrity", "high", EvidenceStatus.UNKNOWN)

    assert first is SafetyState.DEGRADED
    assert second is SafetyState.COMPROMISE


def test_unknown_logs_cause_code_and_confidence_metadata() -> None:
    engine = ComplianceEngine()

    state = engine.evaluate_invariant(
        invariant="consensus_finality",
        criticality_tier="medium",
        evidence_status=EvidenceStatus.UNKNOWN,
        cause_code="TELEMETRY_GAP",
        confidence=0.42,
    )
    log = engine.audit_log[-1]

    assert state is SafetyState.DEGRADED
    assert log.metadata["cause_code"] == "TELEMETRY_GAP"
    assert log.metadata["confidence"] == 0.42
    assert log.metadata["evidence_status"] == "UNKNOWN"
