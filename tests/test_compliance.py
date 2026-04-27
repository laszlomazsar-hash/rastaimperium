from src.codex.compliance import ComplianceEngine


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record.profile_id == "A"
    assert record.metadata["profile_id"] == "A"
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_profile_id_is_in_stability_and_verification_artifacts() -> None:
    engine = ComplianceEngine(runtime_profile="B")
    graph = engine.trace_coverage_graph()
    artifact = engine.verification_artifact()

    assert all(entry["profile_id"] == "B" for entry in graph)
    assert artifact.profile_id == "B"
    assert all(entry["profile_id"] == "B" for entry in artifact.trace_coverage)


def test_profile_c_invalidates_certification_and_disables_certificate_generation() -> None:
    engine = ComplianceEngine(runtime_profile="C")

    assert engine.certification_mode_allowed_profiles == {"A", "B"}
    assert engine.certification_status == "invalid"
    assert engine.certificate_generation_enabled is False

    artifact = engine.verification_artifact()
    assert artifact.profile_id == "C"
    assert artifact.certification_status == "invalid"


def test_ci_guard_rejects_certified_artifact_for_profile_c() -> None:
    engine = ComplianceEngine(runtime_profile="C")
    artifact = engine.verification_artifact()

    assert not (
        artifact.profile_id == "C" and artifact.certification_status == "certified"
    ), "Profile C artifacts must never be marked certified."
