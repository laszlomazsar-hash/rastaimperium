from fastapi import APIRouter

from core.codex_engine import CodexEngine
from state import state_tracker

router = APIRouter()
engine = CodexEngine()


@router.get("/heartbeat")
async def heartbeat() -> dict:
    snapshot = engine.audit_state()
    status = "healthy" if snapshot["active_sandboxes"] >= 0 else "degraded"
    state_tracker.transition_to(
        status,
        reason="Heartbeat state check completed",
        source="health",
    )
    return {"status": "ok", "snapshot": snapshot, "state": state_tracker.state_payload()}


@router.get("/state")
async def state() -> dict:
    return state_tracker.state_payload()


@router.get("/epistemic")
async def epistemic() -> dict:
    return state_tracker.epistemic_summary()
