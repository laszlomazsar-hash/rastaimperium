"""Model-predictive-control feasibility obligations."""

from __future__ import annotations

import asyncio

from core.invariants import Invariant, Obligation, ObligationStatus


def _event_loop_running() -> tuple[ObligationStatus, str | None]:
    try:
        running = asyncio.get_running_loop().is_running()
    except RuntimeError:
        running = False

    if running:
        return ObligationStatus.VERIFIED, None
    return ObligationStatus.FAILED, "No running asyncio event loop in request context"


def build_invariant() -> Invariant:
    return Invariant(
        name="mpc_feasibility",
        obligations=[
            Obligation(name="event_loop_runtime", evaluator=_event_loop_running),
        ],
    )
