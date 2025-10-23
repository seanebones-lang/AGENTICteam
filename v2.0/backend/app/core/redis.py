import redis
from typing import Optional, Dict, Any
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

class RedisClient:
    """Redis client for caching and session management."""
    
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self._connect()
    
    def _connect(self):
        """Connect to Redis."""
        try:
            self.redis_client = redis.from_url(
                settings.redis_url,
                max_connections=settings.redis_max_connections,
                decode_responses=True
            )
            # Test connection
            self.redis_client.ping()
            logger.info("Connected to Redis successfully")
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            self.redis_client = None
    
    def is_connected(self) -> bool:
        """Check if Redis is connected."""
        if not self.redis_client:
            return False
        try:
            self.redis_client.ping()
            return True
        except:
            return False
    
    async def get(self, key: str) -> Optional[str]:
        """Get value from Redis."""
        if not self.is_connected():
            return None
        try:
            return self.redis_client.get(key)
        except Exception as e:
            logger.error(f"Redis GET error: {e}")
            return None
    
    async def set(self, key: str, value: str, expire: Optional[int] = None) -> bool:
        """Set value in Redis."""
        if not self.is_connected():
            return False
        try:
            return self.redis_client.set(key, value, ex=expire)
        except Exception as e:
            logger.error(f"Redis SET error: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """Delete key from Redis."""
        if not self.is_connected():
            return False
        try:
            return bool(self.redis_client.delete(key))
        except Exception as e:
            logger.error(f"Redis DELETE error: {e}")
            return False
    
    async def get_json(self, key: str) -> Optional[Dict[str, Any]]:
        """Get JSON value from Redis."""
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return None
        return None
    
    async def set_json(self, key: str, value: Dict[str, Any], expire: Optional[int] = None) -> bool:
        """Set JSON value in Redis."""
        try:
            json_value = json.dumps(value)
            return await self.set(key, json_value, expire)
        except Exception as e:
            logger.error(f"Redis SET JSON error: {e}")
            return False
    
    async def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """Increment a counter in Redis."""
        if not self.is_connected():
            return None
        try:
            return self.redis_client.incrby(key, amount)
        except Exception as e:
            logger.error(f"Redis INCREMENT error: {e}")
            return None
    
    async def expire(self, key: str, seconds: int) -> bool:
        """Set expiration for a key."""
        if not self.is_connected():
            return False
        try:
            return bool(self.redis_client.expire(key, seconds))
        except Exception as e:
            logger.error(f"Redis EXPIRE error: {e}")
            return False

# Global Redis client instance
redis_client = RedisClient()
