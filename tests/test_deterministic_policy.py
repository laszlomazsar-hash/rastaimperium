from app.ark_engine.core.deterministic_policy import (
    ActionCandidate,
    DeterministicSolverPolicy,
    PolicyConfig,
    WarmStartState,
)


def test_policy_uses_fixed_limits_and_deterministic_ordering() -> None:
    seen = {}

    def solver(candidates, horizon, max_iterations, warm_start):
        seen["horizon"] = horizon
        seen["max_iterations"] = max_iterations
        seen["warm_start"] = warm_start
        seen["actions"] = [candidate.action for candidate in candidates]
        return {
            "action": candidates[0].action,
            "iterations": 7,
            "timeout": False,
            "solver_state": {"seed": 1},
        }

    policy = DeterministicSolverPolicy(
        PolicyConfig(horizon=8, candidate_budget=3, max_solver_iterations=12, stabilizing_action="hold")
    )

    decision = policy.decide(
        tick=1,
        candidates=[
            ActionCandidate(action="b", score=0.8),
            ActionCandidate(action="a", score=0.8),
            ActionCandidate(action="a", score=0.7),
            ActionCandidate(action="c", score=0.1),
        ],
        solver_fn=solver,
    )

    assert seen["horizon"] == 8
    assert seen["max_iterations"] == 12
    assert seen["actions"] == ["a", "b", "c"]
    assert decision.action == "a"
    assert decision.diagnostics.iterations == 7
    assert decision.diagnostics.timeout is False
    assert decision.diagnostics.fallback_used is False


def test_policy_rejects_incompatible_warm_start_and_falls_back_on_timeout() -> None:
    observed = {}

    def solver(_candidates, _horizon, _max_iterations, warm_start):
        observed["warm_start"] = warm_start
        return {"timeout": True, "iterations": 99, "action": "unsafe"}

    policy = DeterministicSolverPolicy(
        PolicyConfig(horizon=5, candidate_budget=2, max_solver_iterations=10, stabilizing_action="stabilize")
    )

    incompatible = WarmStartState(
        horizon=3,
        candidate_budget=2,
        max_solver_iterations=10,
        previous_action="x",
        solver_state={"n": 1},
    )

    decision = policy.decide(
        tick=2,
        candidates=[ActionCandidate(action="go", score=1.0)],
        solver_fn=solver,
        warm_start=incompatible,
    )

    assert observed["warm_start"] is None
    assert decision.action == "stabilize"
    assert decision.diagnostics.timeout is True
    assert decision.diagnostics.fallback_used is True
    assert decision.diagnostics.iterations == 10


def test_policy_passes_compatible_warm_start_contract() -> None:
    seen = {}

    def solver(_candidates, _horizon, _max_iterations, warm_start):
        seen["warm_start"] = warm_start
        return {"action": "go", "iterations": 1, "timeout": False}

    policy = DeterministicSolverPolicy(
        PolicyConfig(horizon=4, candidate_budget=2, max_solver_iterations=9, stabilizing_action="hold")
    )

    warm_start = WarmStartState(
        horizon=4,
        candidate_budget=2,
        max_solver_iterations=9,
        previous_action="hold",
        solver_state={"basis": [1, 2, 3]},
    )

    _ = policy.decide(
        tick=3,
        candidates=[ActionCandidate(action="go", score=0.9)],
        solver_fn=solver,
        warm_start=warm_start,
    )

    assert seen["warm_start"] == {
        "previous_action": "hold",
        "solver_state": {"basis": [1, 2, 3]},
    }
