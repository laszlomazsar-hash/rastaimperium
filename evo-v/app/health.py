"""Health and invariant endpoints for EVO-V."""

from __future__ import annotations

import asyncio
import gc
import time

from fastapi import APIRouter

from state import STATE, state_machine

health_router = APIRouter()


def invariant_check() -> dict[str, bool]:
    """Minimal invariants required for EVO-V to be considered alive."""

    loop_running = False
    try:
        loop_running = asyncio.get_running_loop().is_running()
    except RuntimeError:
        loop_running = False

    return {
        "route_alive": True,
        "memory_ok": gc.isenabled(),
        "event_loop_ok": loop_running,
    }


@health_router.get("/health")
def health() -> dict[str, object]:
    STATE.mark_check()
    invariants = invariant_check()
    alive = all(invariants.values())

    return {
        "alive": alive,
        "invariants": invariants,
        "uptime": time.time() - STATE.boot_time,
        "failure_count": STATE.failure_count,
        "last_failure": STATE.last_failure,
    }


@health_router.get("/state")
def state() -> dict[str, object]:
    """Expose deployment mode and finite-state transitions."""

    runtime = state_machine.as_dict()
    return {
        "mode": "deterministic-runtime",
        "current_state": runtime["current_state"],
        "previous_state": runtime["previous_state"],
        "last_transition_at": runtime["last_transition_at"],
        "transition_history": runtime["transition_history"],
        "boot_time": STATE.boot_time,
        "last_check": STATE.last_check,
        "failure_count": STATE.failure_count,
        "last_failure": STATE.last_failure,
    }
