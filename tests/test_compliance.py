from src.codex.compliance import ComplianceEngine, Perturbation, ViolationFinding


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_adversarial_verification_uses_deterministic_order_and_budget() -> None:
    engine = ComplianceEngine()
    engine.set_max_perturbations_per_tick(2)
    engine.set_perturbation_catalog(
        "trace_coverage",
        [
            Perturbation(id="z_case", description="last", impact_weight=0.4),
            Perturbation(id="a_case", description="first", impact_weight=0.9),
            Perturbation(id="m_case", description="middle", impact_weight=0.8),
        ],
    )

    report = engine.run_adversarial_verification(invariant_class="trace_coverage", tick=7, max_perturbations=99)

    assert report.tested_perturbations == ["a_case", "m_case"]


def test_adversarial_verification_scores_confidence_and_logs_worst_case() -> None:
    engine = ComplianceEngine()

    def evaluator(perturbation: Perturbation) -> ViolationFinding | None:
        if perturbation.id == "metadata_order_shuffle":
            return ViolationFinding(
                perturbation_id=perturbation.id,
                severity_score=0.2,
                confidence=0.6,
                reason="low",
            )
        if perturbation.id == "actor_impersonation":
            return ViolationFinding(
                perturbation_id=perturbation.id,
                severity_score=0.8,
                confidence=0.9,
                reason="high",
            )
        return None

    report = engine.run_adversarial_verification(invariant_class="audit_integrity", tick=11, evaluator=evaluator)

    assert len(report.violations) == 2
    assert report.worst_case_candidate is not None
    assert report.worst_case_candidate.perturbation_id == "actor_impersonation"
    assert report.worst_case_candidate.severity_score == 0.8
    assert report.worst_case_candidate.confidence == 0.9
    assert engine.verification_log[-1] == report
