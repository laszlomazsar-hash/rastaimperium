from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, Sequence


@dataclass(frozen=True)
class EnergyComponents:
    """Normalized energy terms used by the controller dynamics."""

    cognitive: float
    social: float
    operational: float

    @property
    def total(self) -> float:
        return self.cognitive + self.social + self.operational


@dataclass(frozen=True)
class SystemState:
    """Exact state vector used by theorem checks."""

    beliefs: tuple[float, ...]
    topology_size: int
    contradiction: float
    entropy: float
    energy: EnergyComponents


@dataclass(frozen=True)
class PolicyParameters:
    """Admissible control parameters for the deterministic update map."""

    alpha: float
    beta: float
    gamma: float
    contradiction_cap: float
    entropy_cap: float


@dataclass(frozen=True)
class Assumptions:
    """Runtime-checkable assumptions A1..A5."""

    bounded_inputs: bool
    deterministic_scheduling: bool
    operation_budget: bool
    no_external_adversarial_writes: bool
    normalized_beliefs: bool


@dataclass(frozen=True)
class PropositionResult:
    holds: bool
    reason: str


EPSILON = 1e-9


def _in_unit_interval(value: float) -> bool:
    return -EPSILON <= value <= 1.0 + EPSILON


def assert_admissible_policy(params: PolicyParameters) -> None:
    assert 0.0 <= params.alpha <= 1.0, "alpha must be in [0, 1]"
    assert 0.0 <= params.beta <= 1.0, "beta must be in [0, 1]"
    assert 0.0 <= params.gamma <= 1.0, "gamma must be in [0, 1]"
    assert params.alpha + params.beta + params.gamma <= 1.0 + EPSILON, (
        "alpha + beta + gamma must be <= 1"
    )
    assert params.contradiction_cap >= 0.0, "contradiction_cap must be non-negative"
    assert params.entropy_cap >= 0.0, "entropy_cap must be non-negative"


def assert_runtime_assumptions(state: SystemState, assumptions: Assumptions, max_topology_size: int) -> None:
    assert assumptions.bounded_inputs, "A1 violated: bounded inputs must hold"
    assert assumptions.deterministic_scheduling, "A2 violated: deterministic scheduling must hold"
    assert assumptions.operation_budget, "A3 violated: operation budget must hold"
    assert assumptions.no_external_adversarial_writes, (
        "A4 violated: no external adversarial writes must hold"
    )
    assert assumptions.normalized_beliefs, "A5 violated: beliefs must be normalized"

    assert state.topology_size > 0, "topology size must be positive"
    assert state.topology_size <= max_topology_size, "topology size exceeds bounded-input cap"
    assert _in_unit_interval(state.contradiction), "contradiction must be in [0, 1]"
    assert _in_unit_interval(state.entropy), "entropy must be in [0, 1]"
    assert all(_in_unit_interval(v) for v in state.beliefs), "belief entries must be in [0, 1]"
    assert abs(sum(state.beliefs) - 1.0) <= 1e-6, "belief vector must sum to 1"
    assert state.energy.total >= 0.0, "total energy must be non-negative"


def update_map(
    state: SystemState,
    params: PolicyParameters,
    *,
    input_signal: Sequence[float],
    budget_remaining: int,
) -> SystemState:
    """Deterministic one-step update map F(s_t, u_t, theta)."""

    assert_admissible_policy(params)
    assert budget_remaining > 0, "operation budget exhausted"
    assert len(input_signal) == len(state.beliefs), "input dimension must match beliefs"
    assert all(_in_unit_interval(v) for v in input_signal), "input entries must be in [0, 1]"

    mixed = tuple(
        max(0.0, min(1.0, (1.0 - params.alpha) * b + params.alpha * u))
        for b, u in zip(state.beliefs, input_signal)
    )
    normalization = sum(mixed)
    next_beliefs = mixed if normalization <= EPSILON else tuple(v / normalization for v in mixed)

    avg_shift = sum(abs(n - o) for n, o in zip(next_beliefs, state.beliefs)) / len(next_beliefs)
    next_contradiction = min(1.0, max(0.0, (1.0 - params.beta) * state.contradiction + params.beta * avg_shift))
    next_entropy = min(1.0, max(0.0, (1.0 - params.gamma) * state.entropy + params.gamma * avg_shift))

    return SystemState(
        beliefs=next_beliefs,
        topology_size=state.topology_size,
        contradiction=next_contradiction,
        entropy=next_entropy,
        energy=state.energy,
    )


def proposition_safety_invariant(
    *,
    state: SystemState,
    next_state: SystemState,
    assumptions: Assumptions,
    params: PolicyParameters,
    max_topology_size: int,
) -> PropositionResult:
    """If A1..A5 hold, then bounded-state safety invariant holds after one update."""

    try:
        assert_admissible_policy(params)
        assert_runtime_assumptions(state, assumptions, max_topology_size)
        assert_runtime_assumptions(next_state, assumptions, max_topology_size)
    except AssertionError as exc:
        return PropositionResult(False, str(exc))

    if next_state.contradiction <= params.contradiction_cap + EPSILON and next_state.entropy <= params.entropy_cap + EPSILON:
        return PropositionResult(True, "P1 holds: contradiction and entropy remain within policy caps")
    return PropositionResult(False, "P1 violated: contradiction or entropy exceeded policy caps")


def proposition_budget_progress(*, steps_executed: int, budget_limit: int, assumptions: Assumptions) -> PropositionResult:
    """If A2..A4 hold, then execution cannot exceed declared budget."""

    if not (assumptions.deterministic_scheduling and assumptions.operation_budget and assumptions.no_external_adversarial_writes):
        return PropositionResult(False, "A2..A4 preconditions not satisfied")

    if steps_executed <= budget_limit:
        return PropositionResult(True, "P2 holds: execution stayed within operation budget")
    return PropositionResult(False, "P2 violated: execution exceeded operation budget")


def unfold_trajectory(
    *,
    initial_state: SystemState,
    params: PolicyParameters,
    assumptions: Assumptions,
    input_stream: Iterable[Sequence[float]],
    budget_limit: int,
    max_topology_size: int,
) -> list[SystemState]:
    """Run deterministic evolution with per-step runtime assertions."""

    assert_admissible_policy(params)
    states = [initial_state]
    assert_runtime_assumptions(initial_state, assumptions, max_topology_size)

    for i, signal in enumerate(input_stream, start=1):
        assert i <= budget_limit, "operation budget exceeded during trajectory"
        next_state = update_map(states[-1], params, input_signal=signal, budget_remaining=budget_limit - i + 1)
        assert_runtime_assumptions(next_state, assumptions, max_topology_size)
        states.append(next_state)

    return states
