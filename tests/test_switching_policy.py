import pytest

from src.soulecho.switching import SwitchPolicy, evaluate_switch


def test_policy_constraints_for_lambda_and_epsilon_switch() -> None:
    with pytest.raises(ValueError):
        SwitchPolicy(lambda_weight=-0.1)
    with pytest.raises(ValueError):
        SwitchPolicy(lambda_weight=1.1)
    with pytest.raises(ValueError):
        SwitchPolicy(epsilon_switch=-0.01)
    with pytest.raises(ValueError):
        SwitchPolicy(epsilon_switch=1.01)


def test_js_and_support_penalty_are_normalized_to_unit_interval() -> None:
    diagnostics = evaluate_switch(
        current_mode="particle",
        js=1.6,
        support_penalty=-0.25,
        policy=SwitchPolicy(lambda_weight=0.5, epsilon_switch=0.5),
    )

    assert diagnostics.components["js"] == 1.0
    assert diagnostics.components["support_penalty"] == 0.0


def test_switch_diagnostics_emit_component_breakdown_and_combined_score() -> None:
    diagnostics = evaluate_switch(
        current_mode="particle",
        js=0.7,
        support_penalty=0.2,
        policy=SwitchPolicy(lambda_weight=0.25, epsilon_switch=0.3),
    )

    assert diagnostics.combined_score == pytest.approx(0.325)
    assert diagnostics.components["weighted_js"] == pytest.approx(0.175)
    assert diagnostics.components["weighted_support_penalty"] == pytest.approx(0.15)


def test_sparse_support_calibration_particle_to_parametric_transition() -> None:
    diagnostics = evaluate_switch(
        current_mode="particle",
        js=0.08,
        support_penalty=0.95,
        policy=SwitchPolicy(lambda_weight=0.1, epsilon_switch=0.6),
    )

    assert diagnostics.should_switch is True
    assert diagnostics.to_mode == "parametric"


def test_sparse_support_calibration_parametric_to_particle_transition() -> None:
    diagnostics = evaluate_switch(
        current_mode="parametric",
        js=0.92,
        support_penalty=0.8,
        policy=SwitchPolicy(lambda_weight=0.8, epsilon_switch=0.85),
    )

    assert diagnostics.should_switch is True
    assert diagnostics.to_mode == "particle"
