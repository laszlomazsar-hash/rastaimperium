from fastapi import APIRouter

from core.engine_runtime import engine

router = APIRouter()


@router.get("/heartbeat")
async def heartbeat() -> dict:
    snapshot = engine.audit_state()
    return {"status": "ok", "snapshot": snapshot}
