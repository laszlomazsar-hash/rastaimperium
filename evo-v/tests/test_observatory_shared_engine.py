import asyncio

from api.observatory import heartbeat, state
from core.runtime_state import engine, runtime_state


def test_observatory_uses_shared_runtime_engine_state() -> None:
    engine.agents.clear()
    engine.sandboxes.clear()
    runtime_state.set_watchdog("monitoring")

    initial_heartbeat = asyncio.run(heartbeat())
    assert initial_heartbeat["snapshot"]["active_sandboxes"] == 0

    engine.provision_agent("alpha")

    heartbeat_after_provision = asyncio.run(heartbeat())
    state_after_provision = asyncio.run(state())

    assert heartbeat_after_provision["snapshot"]["active_sandboxes"] == 1
    assert heartbeat_after_provision["snapshot"]["agents"] == ["alpha"]
    assert state_after_provision["snapshot"]["active_sandboxes"] == 1
    assert state_after_provision["snapshot"]["agents"] == ["alpha"]
