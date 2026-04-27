from fastapi import APIRouter

from core.runtime_state import engine, runtime_state

router = APIRouter()


@router.get("/heartbeat")
async def heartbeat() -> dict:
    snapshot = engine.audit_state()
    runtime_state.set_watchdog("nominal")
    return {"status": "ok", "snapshot": snapshot}
