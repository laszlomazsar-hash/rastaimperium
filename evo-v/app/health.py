"""Health and invariant endpoints for EVO-V."""

from __future__ import annotations

import time

from fastapi import APIRouter

from state import STATE, state_machine

health_router = APIRouter()


class HealthState:
    """Mutable health heartbeat state shared across health endpoints."""

    def __init__(self) -> None:
        self.last_heartbeat_at: float | None = None

    def mark_heartbeat(self) -> None:
        self.last_heartbeat_at = time.time()


health_state = HealthState()


def invariant_check() -> ProofTreeNode:
    """Evaluate all invariant families into a compositional proof tree."""

    family_nodes = [family.evaluate() for family in build_all()]
    overall_status = and_aggregate([node.status for node in family_nodes])

    reason = None
    if overall_status is ObligationStatus.FAILED:
        reason = "At least one invariant family failed"
    elif overall_status is ObligationStatus.UNKNOWN:
        reason = "At least one invariant family is unknown"

    return ProofTreeNode(
        name="runtime_invariants",
        status=overall_status,
        reason=reason,
        children=family_nodes,
    )


def _proof_metadata(root: ProofTreeNode) -> dict[str, object]:
    family_summaries = [summarize_tree(family) for family in root.children]
    return {
        "overall": summarize_tree(root),
        "families": family_summaries,
    }


@health_router.get("/health")
def health() -> dict[str, object]:
    STATE.mark_check()
    proof_tree = invariant_check()
    alive = proof_tree.status is ObligationStatus.VERIFIED

    return {
        "alive": alive,
        "verdict": proof_tree.status.value,
        "proof": proof_tree.to_dict(),
        "proof_meta": _proof_metadata(proof_tree),
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
        "verdict": proof_tree.status.value,
        "proof_meta": _proof_metadata(proof_tree),
    }
