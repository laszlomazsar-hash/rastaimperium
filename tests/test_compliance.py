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


def test_subgradient_step_size_policy_is_stable() -> None:
    engine = ComplianceEngine()

    approx_small = engine.approximate_subgradient(lambda x: x * x, 1.0, profile="strict")
    approx_large = engine.approximate_subgradient(lambda x: x * x, 1_000.0, profile="strict")

    assert abs(approx_small - 2.0) < 5e-3
    assert abs(approx_large - 2_000.0) < 1.0


def test_subgradient_deterministic_fallback_near_constraint() -> None:
    engine = ComplianceEngine()

    bounded_grad = engine.approximate_subgradient(lambda x: x * x, 0.0, upper_bound=0.0)
    forward_grad = engine.approximate_subgradient(lambda x: x * x, 0.0, profile="strict")

    assert abs(bounded_grad + 1e-4) < 1e-8
    assert forward_grad == 0.0


def test_probe_config_versioned_and_reproducible_across_certified_profiles() -> None:
    engine = ComplianceEngine()

    strict_probe = engine.probe_config_artifact("strict")
    balanced_probe = engine.probe_config_artifact("balanced")

    assert strict_probe["version"] == "subgradient_probe/v1"
    assert strict_probe == balanced_probe

    record = engine.append_audit_record(
        actor="auditor",
        action="certification_check",
        article="IV",
        metadata={"run": "smoke"},
        policy_profile="strict",
    )
    assert record.metadata["policy_profile"] == "strict"
    assert "probe_config" in record.metadata
    assert record.metadata["probe_config"]["version"] == "subgradient_probe/v1"
