from src.codex.compliance import ComplianceEngine, PolicyState


def test_governance_diagnostics_confidence_formula_and_metadata_version() -> None:
    engine = ComplianceEngine()
    policy_state = PolicyState(
        rules_evaluated=10,
        rules_matched=8,
        violations=1,
        escalations=2,
    )

    payload = engine.compute_governance_diagnostics(policy_state)

    assert payload["policy_metadata"]["confidence_formula_version"] == "policy_confidence.v1"
    assert payload["policy_metadata"]["confidence_formula"] == (
        "0.70*match_rate + 0.20*compliance_rate + 0.10*non_escalation_rate"
    )
    assert payload["diagnostics"]["confidence"] == 0.82
    assert payload["diagnostics"]["rule_match_strength"] == "moderate"


def test_governance_diagnostics_are_strictly_replayable_for_identical_inputs() -> None:
    engine = ComplianceEngine()
    same_state = PolicyState(
        rules_evaluated=12,
        rules_matched=11,
        violations=0,
        escalations=1,
    )

    payload_one = engine.compute_governance_diagnostics(same_state)
    payload_two = engine.compute_governance_diagnostics(same_state)

    assert payload_one == payload_two
