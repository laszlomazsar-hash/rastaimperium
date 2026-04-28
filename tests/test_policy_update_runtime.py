from __future__ import annotations

import pytest

from src.ark_safety.policy_update import PolicyUpdateConfig, compute_bounded_policy_step


def test_ill_conditioned_fisher_uses_bounded_backtracking_without_fallback() -> None:
    fisher = [
        [1e-12, 0.0],
        [0.0, 1e12],
    ]
    gradient = [1.0, 1.0]

    def feasible(step: list[float]) -> bool:
        return abs(step[0]) <= 0.2 and abs(step[1]) <= 0.2

    result = compute_bounded_policy_step(
        fisher,
        gradient,
        is_feasible=feasible,
        config=PolicyUpdateConfig(max_backtrack_steps=8, eta_min=1e-3, initial_eta=1.0, backtrack_ratio=0.5),
    )

    assert result.used_fallback is True
    assert result.feasible is False
    assert result.fallback_reason == "feasibility_not_reached_after_backtracking"
    assert len(result.backtrack_attempts) <= 10
    assert result.eta_used >= 1e-3
    assert result.proposed_step[0] <= 0.2


def test_singular_or_unreachable_updates_trigger_deterministic_fallback_with_reason() -> None:
    fisher = [
        [1.0, 2.0],
        [2.0, 4.0],
    ]
    gradient = [3.0, 4.0]

    result = compute_bounded_policy_step(
        fisher,
        gradient,
        is_feasible=lambda _step: False,
        config=PolicyUpdateConfig(max_backtrack_steps=3, eta_min=1e-2, initial_eta=1.0, backtrack_ratio=0.5),
        fallback="projected_small_step",
    )

    assert result.used_fallback is True
    assert result.fallback_reason == "feasibility_not_reached_after_backtracking"
    assert len(result.backtrack_attempts) == 5
    assert result.proposed_step[0] == pytest.approx(0.006)
    assert result.proposed_step[1] == pytest.approx(0.008)
    assert result.backtrack_attempts[-1].note.startswith("fallback:")
