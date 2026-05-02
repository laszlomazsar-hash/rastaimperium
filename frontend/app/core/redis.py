import redis.asyncio as redis
from app.core.config import settings

class RedisManager:
    def __init__(self):
        self.redis_client = None

    async def connect(self):
        """Open the connection to the memory using the modern redis-py."""
        self.redis_client = redis.from_url(
            settings.REDIS_URL, 
            encoding="utf-8", 
            decode_responses=True
        )
        # Check the connection
        await self.redis_client.ping()
        print("Modern Redis memory is connected and flowing.")

    async def disconnect(self):
        """Safely close the connection."""
        if self.redis_client:
            await self.redis_client.close()
            print("Redis memory is resting.")

redis_manager = RedisManager()