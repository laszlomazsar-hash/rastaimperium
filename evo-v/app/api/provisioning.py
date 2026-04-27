from fastapi import APIRouter
from fastapi import HTTPException

from core.codex_engine import CodexEngine

router = APIRouter()
engine = CodexEngine()


@router.post("/provision")
def provision_instance(agent_name: str) -> dict:
    try:
        agent, sandbox = engine.provision_agent(agent_name)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return {
        "agent_id": id(agent),
        "sandbox_id": id(sandbox),
        "status": agent.status,
    }
