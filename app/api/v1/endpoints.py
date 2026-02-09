import json
from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import FileResponse

from app.ark_engine.core.field_controller import IFieldController, seed_the_ark
from app.ark_engine.evo_v_nextgen import EvolutionaryCulturalOptimizer
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
    repo_root = Path(__file__).resolve().parents[3]
    codex_path = repo_root / "Codex.html"
    return FileResponse(codex_path, media_type="text/html")


@router.get("/manifest")
async def get_manifest():
    repo_root = Path(__file__).resolve().parents[3]
    manifest_path = repo_root / "Manifest.txt"
    return FileResponse(manifest_path, media_type="text/plain")


@router.get("/simulate")
async def get_simulation():
    optimizer = EvolutionaryCulturalOptimizer()
    initial_cultures = [
        {"name": "Roots", "values": ["integrity", "stewardship"], "energy": 0.82},
        {"name": "Zion", "values": ["vision", "joy"], "energy": 0.91},
    ]
    return optimizer.cultural_evolution_simulation(initial_cultures=initial_cultures, steps=10)


@router.get("/nuggets")
async def get_nuggets():
    controller = IFieldController()
    seed_the_ark(controller)
    return {
        "count": len(controller.ark.storage),
        "nuggets": [
            {
                "content": nugget.content,
                "resonance_weight": nugget.resonance_weight,
                "tags": sorted(nugget.tags),
            }
            for nugget in controller.ark.storage.values()
        ],
    }
