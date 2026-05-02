"""Compatibility wrapper for legacy evo-v import paths."""

from app.health import health_state
from core.runtime_state import get_engine, runtime_state

engine = get_engine()


async def heartbeat() -> dict:
    snapshot = engine.audit_state()
    runtime_state.set_watchdog("nominal")
    health_state.mark_heartbeat()
    return {"status": "ok", "snapshot": snapshot}
