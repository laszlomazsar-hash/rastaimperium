from app.ark_engine.core.governance import (
    BeliefGeometry,
    BeliefGeometryGovernancePolicy,
    DEFAULT_REGIONS,
    DEFAULT_SAFETY_ENVELOPE,
)


def _policy() -> BeliefGeometryGovernancePolicy:
    return BeliefGeometryGovernancePolicy(
        regions=DEFAULT_REGIONS,
        safety_envelope=DEFAULT_SAFETY_ENVELOPE,
        confidence_gate=0.6,
        hysteresis_delta=0.1,
    )


def test_region_driven_action_selection() -> None:
    decision = _policy().decide(BeliefGeometry(entropy=0.2, concentration=0.8, contradiction=0.1))

    assert decision.action == "proceed"
    assert decision.mode == "autonomous"
    assert decision.region == "stable_autonomy"


def test_confidence_gate_forces_fallback() -> None:
    decision = _policy().decide(BeliefGeometry(entropy=0.9, concentration=0.2, contradiction=0.8))

    assert decision.action == "hold"
    assert decision.mode == "safe"
    assert decision.gate_reason == "confidence_gate"


def test_hysteresis_prevents_unstable_switching() -> None:
    policy = _policy()

    first = policy.decide(BeliefGeometry(entropy=0.2, concentration=0.8, contradiction=0.1))
    second = policy.decide(BeliefGeometry(entropy=0.36, concentration=0.8, contradiction=0.26))

    assert first.mode == "autonomous"
    assert second.mode == "autonomous"
    assert second.gate_reason == "hysteresis"


def test_safety_envelope_overrides_action_independent_of_confidence() -> None:
    decision = _policy().decide(BeliefGeometry(entropy=0.25, concentration=0.05, contradiction=0.1))

    assert decision.action == "hold"
    assert decision.mode == "safe"
    assert decision.safety_override is True


def test_decision_log_supports_deterministic_replay() -> None:
    policy = _policy()
    inputs = [
        BeliefGeometry(entropy=0.2, concentration=0.8, contradiction=0.1),
        BeliefGeometry(entropy=0.6, concentration=0.4, contradiction=0.3),
        BeliefGeometry(entropy=0.85, concentration=0.6, contradiction=0.2),
    ]

    first_pass = [policy.decide(geometry) for geometry in inputs]
    replayed = policy.replay(policy.decision_log)

    assert [decision.action for decision in replayed] == [decision.action for decision in first_pass]
    assert [decision.mode for decision in replayed] == [decision.mode for decision in first_pass]
