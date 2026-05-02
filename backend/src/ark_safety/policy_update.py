from __future__ import annotations

from dataclasses import dataclass, field
from math import sqrt
from typing import Callable, List, Sequence


@dataclass(frozen=True)
class PolicyUpdateConfig:
    """Deterministic policy-update limits for bounded runtime."""

    max_backtrack_steps: int = 12
    eta_min: float = 1e-4
    backtrack_ratio: float = 0.5
    initial_eta: float = 1.0
    singular_tolerance: float = 1e-10
    ridge: float = 1e-6


@dataclass(frozen=True)
class BacktrackAttempt:
    step_index: int
    eta: float
    feasible: bool
    note: str


@dataclass(frozen=True)
class PolicyUpdateResult:
    proposed_step: List[float]
    eta_used: float
    feasible: bool
    used_fallback: bool
    fallback_reason: str | None
    backtrack_attempts: List[BacktrackAttempt] = field(default_factory=list)


def compute_bounded_policy_step(
    fisher_matrix: Sequence[Sequence[float]],
    gradient: Sequence[float],
    is_feasible: Callable[[Sequence[float]], bool],
    config: PolicyUpdateConfig | None = None,
    fallback: str = "projected_small_step",
) -> PolicyUpdateResult:
    """Compute a deterministic, bounded-runtime policy step.

    Backtracking loops are capped by ``max_backtrack_steps`` and minimum step size
    is controlled by ``eta_min``.
    """

    cfg = config or PolicyUpdateConfig()
    direction = _safe_natural_direction(fisher_matrix, gradient, cfg)

    attempts: List[BacktrackAttempt] = []
    eta = cfg.initial_eta

    for step_index in range(cfg.max_backtrack_steps + 1):
        bounded_eta = max(eta, cfg.eta_min)
        candidate = [bounded_eta * value for value in direction]
        feasible = is_feasible(candidate)
        attempts.append(
            BacktrackAttempt(
                step_index=step_index,
                eta=bounded_eta,
                feasible=feasible,
                note="feasible" if feasible else "infeasible_backtrack",
            )
        )
        if feasible:
            return PolicyUpdateResult(
                proposed_step=candidate,
                eta_used=bounded_eta,
                feasible=True,
                used_fallback=False,
                fallback_reason=None,
                backtrack_attempts=attempts,
            )

        if bounded_eta <= cfg.eta_min:
            break
        eta *= cfg.backtrack_ratio

    fallback_reason = "feasibility_not_reached_after_backtracking"
    fallback_step = _deterministic_fallback(gradient, cfg, fallback)
    attempts.append(
        BacktrackAttempt(
            step_index=len(attempts),
            eta=cfg.eta_min,
            feasible=False,
            note=f"fallback:{fallback_reason}:{fallback}",
        )
    )
    return PolicyUpdateResult(
        proposed_step=fallback_step,
        eta_used=cfg.eta_min,
        feasible=False,
        used_fallback=True,
        fallback_reason=fallback_reason,
        backtrack_attempts=attempts,
    )


def _safe_natural_direction(
    fisher_matrix: Sequence[Sequence[float]],
    gradient: Sequence[float],
    cfg: PolicyUpdateConfig,
) -> List[float]:
    try:
        return _solve_linear_system_with_ridge(fisher_matrix, gradient, cfg)
    except ValueError:
        # Singular update path: deterministic hold-state-equivalent direction.
        return [0.0 for _ in gradient]


def _solve_linear_system_with_ridge(
    matrix: Sequence[Sequence[float]],
    vector: Sequence[float],
    cfg: PolicyUpdateConfig,
) -> List[float]:
    n = len(vector)
    if any(len(row) != n for row in matrix):
        raise ValueError("Fisher matrix must be square and match gradient dimension")

    augmented = []
    for i, row in enumerate(matrix):
        regularized = [float(v) for v in row]
        regularized[i] += cfg.ridge
        augmented.append(regularized + [float(vector[i])])

    for col in range(n):
        pivot_row = max(range(col, n), key=lambda r: abs(augmented[r][col]))
        pivot = augmented[pivot_row][col]
        if abs(pivot) <= cfg.singular_tolerance:
            raise ValueError("Singular Fisher update")

        if pivot_row != col:
            augmented[col], augmented[pivot_row] = augmented[pivot_row], augmented[col]

        pivot = augmented[col][col]
        for j in range(col, n + 1):
            augmented[col][j] /= pivot

        for row in range(col + 1, n):
            factor = augmented[row][col]
            for j in range(col, n + 1):
                augmented[row][j] -= factor * augmented[col][j]

    solution = [0.0] * n
    for row in range(n - 1, -1, -1):
        value = augmented[row][n] - sum(augmented[row][c] * solution[c] for c in range(row + 1, n))
        solution[row] = value

    return solution


def _deterministic_fallback(gradient: Sequence[float], cfg: PolicyUpdateConfig, fallback: str) -> List[float]:
    if fallback == "hold_state":
        return [0.0 for _ in gradient]

    norm = sqrt(sum(value * value for value in gradient))
    if norm == 0.0:
        return [0.0 for _ in gradient]

    scaled = [value / norm for value in gradient]
    return [cfg.eta_min * value for value in scaled]
