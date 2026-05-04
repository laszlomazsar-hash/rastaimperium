"""Compatibility wrapper for legacy evo-v import paths."""

from core.runtime_state import get_engine, runtime_state


def provision_instance(agent_name: str) -> dict:
    agent, sandbox = get_engine().provision_agent(agent_name)
    provisioning_snapshot = runtime_state.snapshot() or {}
    state_value = provisioning_snapshot.get(
        "state",
        provisioning_snapshot.get("current_state", runtime_state.current_state),
    )
    return {
        "agent_id": id(agent),
        "sandbox_id": id(sandbox),
        "status": agent.status,
        "state": state_value,
    }
