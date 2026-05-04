"""Invariant family registry."""

from __future__ import annotations

from core.invariant_families import constraint_consistency, lyapunov, mpc_feasibility
from core.invariants import Invariant


def build_all() -> list[Invariant]:
    """Build all supported invariant families."""

    return [
        lyapunov.build_invariant(),
        mpc_feasibility.build_invariant(),
        constraint_consistency.build_invariant(),
    ]
