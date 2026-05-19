"""Deterministic control policy utilities for solver-backed action selection."""

from __future__ import annotations

from dataclasses import dataclass
import json
from typing import Any, Callable, Dict, Iterable, List, Mapping, MutableMapping, Optional, Sequence


@dataclass(frozen=True)
class SolverDiagnostics:
    """Per-tick solver diagnostics payload."""

    iterations: int
    timeout: bool
    fallback_used: bool


@dataclass(frozen=True)
class PolicyConfig:
    """Static policy limits to avoid control divergence."""

    horizon: int
    candidate_budget: int
    max_solver_iterations: int
    stabilizing_action: str = "hold"


@dataclass(frozen=True)
class WarmStartState:
    """Contract for solver warm-start state between ticks."""

    horizon: int
    candidate_budget: int
    max_solver_iterations: int
    previous_action: str
    solver_state: Mapping[str, Any]


@dataclass(frozen=True)
class TickDecision:
    """Selected action and metadata for a control tick."""

    tick: int
    action: str
    diagnostics: SolverDiagnostics
    warm_start: WarmStartState


@dataclass(frozen=True)
class ActionCandidate:
    """Candidate action with scalar utility score."""

    action: str
    score: float


SolverFn = Callable[
    [Sequence[ActionCandidate], int, int, Optional[Mapping[str, Any]]],
    Mapping[str, Any],
]


class DeterministicSolverPolicy:
    """Policy wrapper that enforces deterministic solver execution semantics."""

    def __init__(self, config: PolicyConfig) -> None:
        if config.horizon <= 0:
            raise ValueError("horizon must be positive")
        if config.candidate_budget <= 0:
            raise ValueError("candidate_budget must be positive")
        if config.max_solver_iterations <= 0:
            raise ValueError("max_solver_iterations must be positive")
        self._config = config

    @property
    def config(self) -> PolicyConfig:
        return self._config

    def decide(
        self,
        tick: int,
        candidates: Iterable[ActionCandidate],
        solver_fn: SolverFn,
        warm_start: Optional[WarmStartState] = None,
    ) -> TickDecision:
        ordered = self._ordered_candidates(candidates)
        limited = ordered[: self._config.candidate_budget]
        fallback_action = self._config.stabilizing_action

        timeout = False
        fallback_used = False
        iterations = 0
        solver_state: Mapping[str, Any] = {}

        solver_warm = self._validated_warm_start(warm_start)

        try:
            raw = solver_fn(
                limited,
                self._config.horizon,
                self._config.max_solver_iterations,
                solver_warm,
            )
            timeout = bool(raw.get("timeout", False))
            iterations = int(raw.get("iterations", 0))
            solver_state = raw.get("solver_state", {}) or {}
            action = str(raw.get("action", "")) or fallback_action
            if timeout:
                action = fallback_action
                fallback_used = True
        except TimeoutError:
            timeout = True
            fallback_used = True
            action = fallback_action
        except Exception:
            # Solver failures degrade to stabilizing action to preserve control continuity.
            timeout = True
            fallback_used = True
            action = fallback_action

        if iterations > self._config.max_solver_iterations:
            iterations = self._config.max_solver_iterations

        diagnostics = SolverDiagnostics(
            iterations=iterations,
            timeout=timeout,
            fallback_used=fallback_used,
        )
        next_warm_start = WarmStartState(
            horizon=self._config.horizon,
            candidate_budget=self._config.candidate_budget,
            max_solver_iterations=self._config.max_solver_iterations,
            previous_action=action,
            solver_state=dict(solver_state),
        )
        return TickDecision(
            tick=tick,
            action=action,
            diagnostics=diagnostics,
            warm_start=next_warm_start,
        )

    def _validated_warm_start(
        self,
        warm_start: Optional[WarmStartState],
    ) -> Optional[Mapping[str, Any]]:
        if warm_start is None:
            return None
        if (
            warm_start.horizon != self._config.horizon
            or warm_start.candidate_budget != self._config.candidate_budget
            or warm_start.max_solver_iterations != self._config.max_solver_iterations
        ):
            return None
        return {
            "previous_action": warm_start.previous_action,
            "solver_state": dict(warm_start.solver_state),
        }

    def _ordered_candidates(self, candidates: Iterable[ActionCandidate]) -> List[ActionCandidate]:
        dedup: MutableMapping[str, ActionCandidate] = {}
        for candidate in candidates:
            key = self._stable_action_key(candidate.action)
            current = dedup.get(key)
            if current is None or candidate.score > current.score:
                dedup[key] = ActionCandidate(action=key, score=candidate.score)

        return sorted(
            dedup.values(),
            key=lambda item: (-item.score, self._stable_action_key(item.action)),
        )

    def _stable_action_key(self, action: Any) -> str:
        if isinstance(action, str):
            return action
        if isinstance(action, (dict, list, tuple)):
            return json.dumps(action, sort_keys=True, separators=(",", ":"))
        return str(action)
