"""Lyapunov-style health obligations."""

from __future__ import annotations

import gc

from core.invariants import Invariant, Obligation, ObligationStatus


def _memory_guard() -> tuple[ObligationStatus, str | None]:
    memory_ok = gc.isenabled()
    if memory_ok:
        return ObligationStatus.VERIFIED, None
    return ObligationStatus.FAILED, "Python garbage collection is disabled"


def build_invariant() -> Invariant:
    return Invariant(
        name="lyapunov",
        obligations=[
            Obligation(name="gc_memory_guard", evaluator=_memory_guard),
        ],
    )
