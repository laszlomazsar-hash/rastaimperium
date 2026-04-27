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


def test_geometric_metric_uses_approx_wasserstein_within_budget() -> None:
    engine = ComplianceEngine(geometry_budget_per_tick=64)
    result = engine.evaluate_geometric_metric(
        baseline=[0.0, 1.0, 2.0, 3.0],
        current=[1.0, 2.0, 3.0, 4.0],
        tick_id="tick-001",
    )

    assert result["mode"] == "approx_wasserstein"
    assert result["samples"] >= 2
    assert result["value"] > 0
    assert engine.audit_log[-1].metadata["mode"] == "approx_wasserstein"


def test_geometric_metric_falls_back_when_budget_exceeded() -> None:
    engine = ComplianceEngine(geometry_budget_per_tick=16)
    result = engine.evaluate_geometric_metric(
        baseline=[0.0, 1.0, 2.0, 3.0],
        current=[1.0, 2.0, 3.0, 4.0],
        tick_id="tick-002",
    )

    assert result["mode"] == "fallback_mean_delta"
    assert result["value"] == 1.0
    assert engine.audit_log[-1].metadata["tick_id"] == "tick-002"
