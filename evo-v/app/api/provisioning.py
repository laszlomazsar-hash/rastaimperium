from fastapi import APIRouter

from core.engine_runtime import engine

router = APIRouter()


@router.post("/provision")
def provision_instance(agent_name: str) -> dict:
    agent, sandbox = engine.provision_agent(agent_name)
    snapshot = engine.state.read_snapshot()
    return {
        "agent_id": id(agent),
        "sandbox_id": id(sandbox),
        "status": agent.status,
        "state": snapshot["state"],
    }
