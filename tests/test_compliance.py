import pytest

from src.codex.compliance import (
    CalibrationReplayError,
    ComplianceEngine,
    DATASET_SNAPSHOT_FORMAT_VERSION,
    DatasetSnapshot,
    LINEAGE_SCHEMA_VERSION,
    LineageVerificationError,
    build_trust_root,
    create_lineage_record,
    verify_lineage_record,
)


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
def test_override_precedence_manual_controls_predicates() -> None:
    engine = ComplianceEngine()
    metrics = {"min_trace_coverage": 70.0, "error_rate_pct": 12.0, "p95_latency_ms": 3_200.0}

    assert engine.evaluate_override_state(metrics, manual_override="force_off") is False
    assert engine.override_history[-1]["reason_code"] == "MANUAL_FORCE_OFF"

    assert engine.evaluate_override_state(metrics, manual_override="force_on") is True
    assert engine.override_history[-1]["reason_code"] == "MANUAL_FORCE_ON_APPLIED"


def test_override_recovery_path_obeys_min_hold_and_cooldown() -> None:
    engine = ComplianceEngine(override_cooldown_ticks=1, override_min_hold_ticks=3)
    emergency = {"min_trace_coverage": 72.0, "error_rate_pct": 0.0, "p95_latency_ms": 0.0}
    recovered = {"min_trace_coverage": 96.0, "error_rate_pct": 0.1, "p95_latency_ms": 120.0}

    assert engine.evaluate_override_state(emergency) is True

    # Min-hold blocks immediate recovery.
    assert engine.evaluate_override_state(recovered) is True
    assert engine.override_history[-1]["reason_code"] == "MIN_HOLD_SUPPRESSED"

    assert engine.evaluate_override_state(recovered) is True
    assert engine.override_history[-1]["reason_code"] == "MIN_HOLD_SUPPRESSED"

    # Recovery is applied once min-hold has elapsed.
    assert engine.evaluate_override_state(recovered) is False
    assert engine.override_history[-1]["reason_code"] == "PREDICATE_CLEAR_APPLIED"


def test_predicate_inputs_are_bounded_in_override_log() -> None:
    engine = ComplianceEngine()
    engine.evaluate_override_state(
        {
            "min_trace_coverage": -12.0,
            "error_rate_pct": 155.0,
            "p95_latency_ms": 999_999.0,
        }
    )

    inputs = engine.override_history[-1]["predicate_inputs"]
    assert inputs["min_trace_coverage"] == 0.0
    assert inputs["error_rate_pct"] == 100.0
    assert inputs["p95_latency_ms"] == 60_000.0
