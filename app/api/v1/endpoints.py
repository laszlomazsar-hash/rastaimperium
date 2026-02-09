import json
from pathlib import Path
from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from app.core.redis import redis_manager
from app.ark_engine.api.routers.divine_guidance import router as divine_router

router = APIRouter()
router.include_router(divine_router, prefix="/divine", tags=["divine"])
REPO_ROOT = Path(__file__).resolve().parents[2]

@router.get("/wisdom")
async def get_wisdom():
    cache_key = "wisdom_archive"
    
    # Using the modern client
    cached_wisdom = await redis_manager.redis_client.get(cache_key)
    
    if cached_wisdom:
        return {
            "source": "Redis Memory",
            "data": json.loads(cached_wisdom)
        }

    wisdom_data = {
        "title": "The Root of the Imperium",
        "teachings": "The frequency of the King is the foundation of all movement.",
        "status": "Archived"
    }

    await redis_manager.redis_client.setex(cache_key, 3600, json.dumps(wisdom_data))

    return {
        "source": "Fresh Computation",
        "data": wisdom_data
    }

@router.get("/codex")
async def get_codex():
    codex_path = REPO_ROOT / "Codex.html"
    try:
        with open(codex_path, encoding="utf-8") as file:
            return HTMLResponse(file.read(), media_type="text/html")
    except FileNotFoundError:
        return HTMLResponse("Codex not found.", status_code=404)
