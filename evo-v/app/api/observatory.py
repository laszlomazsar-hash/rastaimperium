"""Compatibility wrapper for legacy evo-v import paths."""

from core.runtime_state import get_engine, runtime_state


async def heartbeat() -> dict:
    snapshot = get_engine().audit_state()
    runtime_state.set_watchdog("nominal")
    return {"status": "ok", "snapshot": snapshot}
