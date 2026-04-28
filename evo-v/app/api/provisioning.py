from fastapi import APIRouter
from fastapi import HTTPException

from app.core.runtime_state import engine, runtime_state

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
    return {
        "agent_id": id(agent),
        "sandbox_id": id(sandbox),
        "status": agent.status,
        "state": snapshot["state"],
    }
