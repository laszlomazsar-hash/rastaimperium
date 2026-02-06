import json
from fastapi import APIRouter
from app.core.redis import redis_manager

router = APIRouter()

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