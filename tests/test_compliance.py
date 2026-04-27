from src.codex.compliance import ComplianceEngine, EscalationPath, InvariantTier


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_critical_invariant_uses_immediate_compromise() -> None:
    engine = ComplianceEngine()

    transition = engine.transition_safety_state(
        current_state="HEALTHY",
        invariant_tier=InvariantTier.CRITICAL,
        reason="root trust boundary violated",
    )

    assert transition.next_state == "COMPROMISE"
    assert transition.escalation is EscalationPath.IMMEDIATE_COMPROMISE
    assert "tier=critical" in transition.rationale
    assert "escalation=immediate_compromise" in transition.rationale


def test_non_critical_invariants_use_staged_degradation() -> None:
    engine = ComplianceEngine()

    for tier in (InvariantTier.HIGH, InvariantTier.MEDIUM, InvariantTier.INFORMATIONAL):
        transition = engine.transition_safety_state(
            current_state="HEALTHY",
            invariant_tier=tier,
            reason="validation drift",
        )

        assert transition.next_state == "DEGRADED"
        assert transition.escalation is EscalationPath.STAGED_DEGRADATION
        assert f"tier={tier.value}" in transition.rationale
        assert "non-critical violation => staged degradation" in transition.rationale


def test_string_tier_aliases_normalize_deterministically() -> None:
    engine = ComplianceEngine()

    assert engine.classify_invariant_tier("critical") is InvariantTier.CRITICAL
    assert engine.classify_invariant_tier("high") is InvariantTier.HIGH
    assert engine.classify_invariant_tier("medium") is InvariantTier.MEDIUM
    assert engine.classify_invariant_tier("info") is InvariantTier.INFORMATIONAL
