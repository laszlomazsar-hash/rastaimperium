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


def test_register_likelihood_and_emit_diagnostics() -> None:
    engine = ComplianceEngine()
    engine.register_likelihood(
        regime="steady_state",
        model_class="classifier",
        likelihood_form="bernoulli",
        noise_model="label_noise<=5%",
        parameter_bounds={"temperature": (0.5, 2.0)},
    )
    engine.calibrate_regime(
        regime="steady_state",
        predicted_probabilities=[0.9, 0.8, 0.2, 0.1],
        observed_outcomes=[1.0, 1.0, 0.0, 0.0],
        bins=4,
    )

    diagnostics = engine.likelihood_diagnostics()

    assert "steady_state" in diagnostics["specifications"]
    assert diagnostics["calibration"]["steady_state"]["sample_size"] == 4
    assert diagnostics["calibration"]["steady_state"]["reliability_curve"]
    assert diagnostics["calibration"]["steady_state"]["error_curve"]
    assert diagnostics["calibration"]["steady_state"]["nll"] >= 0
