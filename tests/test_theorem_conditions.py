import pytest

from src.ark_safety.theorem_conditions import (
    Assumptions,
    EnergyComponents,
    PolicyParameters,
    SystemState,
    proposition_budget_progress,
    proposition_safety_invariant,
    unfold_trajectory,
    update_map,
)


def _base_assumptions() -> Assumptions:
    return Assumptions(
        bounded_inputs=True,
        deterministic_scheduling=True,
        operation_budget=True,
        no_external_adversarial_writes=True,
        normalized_beliefs=True,
    )


def _base_state() -> SystemState:
    return SystemState(
        beliefs=(0.6, 0.4),
        topology_size=5,
        contradiction=0.2,
        entropy=0.3,
        energy=EnergyComponents(cognitive=0.5, social=0.2, operational=0.1),
    )


def test_update_map_and_invariant_hold_under_assumptions() -> None:
    state = _base_state()
    params = PolicyParameters(alpha=0.2, beta=0.4, gamma=0.3, contradiction_cap=0.5, entropy_cap=0.6)

    next_state = update_map(state, params, input_signal=(0.55, 0.45), budget_remaining=3)
    proof = proposition_safety_invariant(
        state=state,
        next_state=next_state,
        assumptions=_base_assumptions(),
        params=params,
        max_topology_size=10,
    )

    assert abs(sum(next_state.beliefs) - 1.0) < 1e-9
    assert proof.holds is True


def test_runtime_assertions_reject_non_normalized_beliefs() -> None:
    invalid_state = SystemState(
        beliefs=(0.9, 0.9),
        topology_size=5,
        contradiction=0.2,
        entropy=0.2,
        energy=EnergyComponents(cognitive=0.3, social=0.2, operational=0.1),
    )

    with pytest.raises(AssertionError, match="belief vector must sum to 1"):
        unfold_trajectory(
            initial_state=invalid_state,
            params=PolicyParameters(alpha=0.2, beta=0.2, gamma=0.2, contradiction_cap=0.8, entropy_cap=0.8),
            assumptions=_base_assumptions(),
            input_stream=[(0.5, 0.5)],
            budget_limit=2,
            max_topology_size=10,
        )


def test_budget_progress_proposition_fails_when_steps_exceed_limit() -> None:
    result = proposition_budget_progress(steps_executed=5, budget_limit=4, assumptions=_base_assumptions())
    assert result.holds is False
    assert "exceeded" in result.reason
