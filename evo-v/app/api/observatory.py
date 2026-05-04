"""Heartbeat compatibility wrapper.

Expected packaging mode sets ``PYTHONPATH`` so ``app`` is importable (for example,
project root containing ``app/``). Runtime state is resolved from
``app.core.runtime_state`` first, with a legacy fallback to ``core.runtime_state``
for dual-layout deployments.
"""

from app.health import health_state
try:
    from app.core.runtime_state import get_engine, runtime_state
except ModuleNotFoundError:
    from core.runtime_state import get_engine, runtime_state


async def heartbeat() -> dict:
    engine = get_engine()
    snapshot = engine.audit_state()
    runtime_state.set_watchdog("nominal")
    # Update shared health singleton before responding to heartbeat probes.
    health_state.mark_heartbeat()
    return {"status": "ok", "snapshot": snapshot}
