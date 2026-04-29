from fastapi import APIRouter
from fastapi import HTTPException

from core.runtime_state import get_engine, runtime_state

router = APIRouter()


@router.post("/provision")
def provision_instance(agent_name: str) -> dict:
    try:
        agent, sandbox = get_engine().provision_agent(agent_name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    runtime_state.transition_to(
        "provisioning",
        f"Provisioning requested for agent '{agent_name}'.",
    )
    agent, sandbox = get_engine().provision_agent(agent_name)
    runtime_state.transition_to(
        "active",
        f"Agent '{agent_name}' provisioned and sandbox attached.",
    )

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
