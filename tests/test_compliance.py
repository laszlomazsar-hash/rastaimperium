from src.codex.compliance import (
    ComplianceEngine,
    DeterministicExecutionProfile,
    ReplayVerificationPolicy,
)


def _approved_profile() -> DeterministicExecutionProfile:
    return DeterministicExecutionProfile(
        name="cpu-single-thread",
        library_versions={"numpy": "2.0.2", "pandas": "2.2.3"},
        thread_counts={"omp": 1, "mkl": 1},
        deterministic_flags={"cudnn_deterministic": True, "pythonhashseed": True},
    )


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_manifest_binding_is_tied_to_execution_profile_hash() -> None:
    engine = ComplianceEngine()
    profile = _approved_profile()
    profile_hash = engine.approve_execution_profile(profile)

    binding = engine.bind_manifest_to_execution_profile({"run_id": "abc123"}, profile.name)

    assert binding.profile_hash == profile_hash
    assert binding.profile_name == profile.name


def test_epsilon_is_configured_per_profile_and_metric_type() -> None:
    engine = ComplianceEngine()
    profile = _approved_profile()
    engine.approve_execution_profile(profile)

    engine.set_profile_epsilon(profile.name, "latency_ms", 0.05)
    engine.set_profile_epsilon(profile.name, "accuracy", 0.001)

    assert engine.epsilon_for(profile.name, "latency_ms") == 0.05
    assert engine.epsilon_for(profile.name, "accuracy") == 0.001




def test_replay_verification_uses_bound_profile_hash_when_name_is_reapproved() -> None:
    engine = ComplianceEngine()
    original_profile = _approved_profile()
    engine.approve_execution_profile(original_profile)

    manifest = {"run_id": "abc123", "model": "v1"}
    engine.bind_manifest_to_execution_profile(manifest, original_profile.name)

    reapproved_profile = DeterministicExecutionProfile(
        name=original_profile.name,
        library_versions={"numpy": "2.1.0", "pandas": "2.2.3"},
        thread_counts={"omp": 2, "mkl": 1},
        deterministic_flags={"cudnn_deterministic": True, "pythonhashseed": False},
    )
    engine.approve_execution_profile(reapproved_profile)

    result = engine.verify_replay_profile(manifest, reapproved_profile)

    assert result.passed is False
    assert set(result.mismatches) == {
        "library_versions.numpy",
        "thread_counts.omp",
        "deterministic_flags.pythonhashseed",
    }

def test_replay_verification_fails_when_profile_mismatch_exceeds_policy() -> None:
    engine = ComplianceEngine()
    profile = _approved_profile()
    engine.approve_execution_profile(profile)

    manifest = {"run_id": "abc123", "model": "v1"}
    engine.bind_manifest_to_execution_profile(manifest, profile.name)

    drifted_profile = DeterministicExecutionProfile(
        name="cpu-single-thread",
        library_versions={"numpy": "2.1.0", "pandas": "2.2.3"},
        thread_counts={"omp": 2, "mkl": 1},
        deterministic_flags={"cudnn_deterministic": True, "pythonhashseed": False},
    )

    result = engine.verify_replay_profile(
        manifest,
        drifted_profile,
        policy=ReplayVerificationPolicy(max_profile_mismatches=2),
    )

    assert result.passed is False
    assert result.mismatch_count == 3
    assert "library_versions.numpy" in result.mismatches
    assert "thread_counts.omp" in result.mismatches
    assert "deterministic_flags.pythonhashseed" in result.mismatches
