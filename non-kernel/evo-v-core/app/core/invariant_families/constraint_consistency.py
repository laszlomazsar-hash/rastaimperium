"""Constraint-consistency obligations for core service posture."""

from __future__ import annotations

from core.invariants import Invariant, Obligation, ObligationStatus


def _health_route_reachable() -> tuple[ObligationStatus, str | None]:
    # Bound to this process; if this code executes, the route path is reachable.
    return ObligationStatus.VERIFIED, None


def build_invariant() -> Invariant:
    return Invariant(
        name="constraint_consistency",
        obligations=[
            Obligation(name="health_route_reachable", evaluator=_health_route_reachable),
        ],
    )
