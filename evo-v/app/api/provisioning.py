from fastapi import APIRouter

from core.codex_engine import CodexEngine

router = APIRouter()
engine = CodexEngine()


@router.post("/provision")
def provision_instance(agent_name: str) -> dict:
    agent, sandbox = engine.provision_agent(agent_name)
    return {
        "agent_id": id(agent),
        "sandbox_id": id(sandbox),
        "status": agent.status,
    }
