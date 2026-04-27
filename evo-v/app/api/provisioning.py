from fastapi import APIRouter

from core.runtime_state import engine, runtime_state

router = APIRouter()


@router.post("/provision")
def provision_instance(agent_name: str) -> dict:
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
    }
