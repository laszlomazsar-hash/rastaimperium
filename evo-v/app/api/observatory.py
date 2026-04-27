from fastapi import APIRouter

from core.codex_engine import CodexEngine
from health import health_state

router = APIRouter()
engine = CodexEngine()


@router.get("/heartbeat")
async def heartbeat() -> dict:
    health_state.mark_heartbeat()
    snapshot = engine.audit_state()
    return {"status": "ok", "snapshot": snapshot}
