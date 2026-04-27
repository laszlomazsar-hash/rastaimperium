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
