from fastapi import APIRouter
from fastapi import HTTPException

from core.runtime_state import engine, runtime_state

router = APIRouter()


@router.post("/provision")
def provision_instance(agent_name: str) -> dict:
    try:
        agent, sandbox = engine.provision_agent(agent_name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    runtime_state.transition_to(
        "provisioning",
        f"Provisioning requested for agent '{agent_name}'.",
    )
    agent, sandbox = engine.provision_agent(agent_name)
    runtime_state.transition_to(
        "active",
        f"Agent '{agent_name}' provisioned and sandbox attached.",
    )

    provisioning_snapshot = runtime_state.snapshot()
    state_value = provisioning_snapshot.get("state") if provisioning_snapshot else None
    if state_value is None:
        state_value = (
            provisioning_snapshot.get("current_state")
            if provisioning_snapshot
            else runtime_state.current_state
        )

    return {
        "agent_id": id(agent),
        "sandbox_id": id(sandbox),
        "status": agent.status,
        "state": state_value,
    }
