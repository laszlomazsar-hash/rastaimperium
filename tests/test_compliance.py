from src.codex.compliance import ComplianceEngine


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert len(record.record_id) == 12
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_collision_resolution_is_deterministic_and_audited(monkeypatch) -> None:
    engine = ComplianceEngine(id_hex_chars=4)
    original_candidate = engine._candidate_id

    def force_compact_collision(digest: str, counter: int) -> str:
        if counter == 0:
            return "beef"
        return original_candidate(digest, counter)

    monkeypatch.setattr(engine, "_candidate_id", force_compact_collision)

    first = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})
    second = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6.1"})

    assert first.record_id == "beef"
    assert second.record_id != "beef"
    assert engine.collision_count == 1
    assert any(record.action == "id_collision_resolved" for record in engine.audit_log)


def test_id_state_assumptions_and_runtime_validation() -> None:
    engine = ComplianceEngine(id_namespace="symbolic-test", id_hex_chars=6)
    engine.append_audit_record("admin", "release", "IV", {"release": "v3.7"})

    assumptions = engine.id_state_assumptions()

    assert assumptions["namespace"] == "symbolic-test"
    assert assumptions["id_hex_chars"] == 6
    assert assumptions["id_domain_size"] == 16**6
    assert assumptions["collision_probability_upper_bound"] == 1 / (16**6)
    assert engine.validate_runtime_state() is True
