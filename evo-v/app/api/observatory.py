from fastapi import APIRouter

from core.codex_engine import CodexEngine

router = APIRouter()
engine = CodexEngine()


@router.get("/heartbeat")
async def heartbeat() -> dict:
    snapshot = engine.audit_state()
    return {"status": "ok", "snapshot": snapshot}
