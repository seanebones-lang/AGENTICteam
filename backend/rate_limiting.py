#!/usr/bin/env python3
"""
Advanced Rate Limiting System for Agent Marketplace
Implements tier-based rate limiting with Redis backend and sliding window algorithm
"""

import time
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple
from pydantic import BaseModel, Field
from enum import Enum
import hashlib

logger = logging.getLogger(__name__)

class RateLimitTier(str, Enum):
    SOLO = "solo"
    BASIC = "basic"
    SILVER = "silver"
    STANDARD = "standard"
    PREMIUM = "premium"
    ELITE = "elite"
    BYOK = "byok"

class RateLimitType(str, Enum):
    REQUESTS_PER_MINUTE = "requests_per_minute"
    REQUESTS_PER_HOUR = "requests_per_hour"
    REQUESTS_PER_DAY = "requests_per_day"
    AGENT_EXECUTIONS_PER_HOUR = "agent_executions_per_hour"
    CONCURRENT_EXECUTIONS = "concurrent_executions"
    TOKENS_PER_MINUTE = "tokens_per_minute"

class RateLimitResult(BaseModel):
    """Rate limit check result"""
    allowed: bool
    limit: int
    remaining: int
    reset_time: int  # Unix timestamp
    retry_after: Optional[int] = None  # Seconds to wait
    tier: str
    limit_type: str

class RateLimitConfig:
    """Rate limit configuration by tier"""
    
    TIER_LIMITS = {
        RateLimitTier.SOLO: {
            RateLimitType.REQUESTS_PER_MINUTE: 5,
            RateLimitType.REQUESTS_PER_HOUR: 50,
            RateLimitType.REQUESTS_PER_DAY: 500,
            RateLimitType.AGENT_EXECUTIONS_PER_HOUR: 10,
            RateLimitType.CONCURRENT_EXECUTIONS: 1,
            RateLimitType.TOKENS_PER_MINUTE: 1000
        },
        RateLimitTier.BASIC: {
            RateLimitType.REQUESTS_PER_MINUTE: 20,
            RateLimitType.REQUESTS_PER_HOUR: 500,
            RateLimitType.REQUESTS_PER_DAY: 5000,
            RateLimitType.AGENT_EXECUTIONS_PER_HOUR: 100,
            RateLimitType.CONCURRENT_EXECUTIONS: 3,
            RateLimitType.TOKENS_PER_MINUTE: 5000
        },
        RateLimitTier.SILVER: {
            RateLimitType.REQUESTS_PER_MINUTE: 50,
            RateLimitType.REQUESTS_PER_HOUR: 2000,
            RateLimitType.REQUESTS_PER_DAY: 20000,
            RateLimitType.AGENT_EXECUTIONS_PER_HOUR: 500,
            RateLimitType.CONCURRENT_EXECUTIONS: 5,
            RateLimitType.TOKENS_PER_MINUTE: 20000
        },
        RateLimitTier.STANDARD: {
            RateLimitType.REQUESTS_PER_MINUTE: 100,
            RateLimitType.REQUESTS_PER_HOUR: 5000,
            RateLimitType.REQUESTS_PER_DAY: 50000,
            RateLimitType.AGENT_EXECUTIONS_PER_HOUR: 1000,
            RateLimitType.CONCURRENT_EXECUTIONS: 10,
            RateLimitType.TOKENS_PER_MINUTE: 50000
        },
        RateLimitTier.PREMIUM: {
            RateLimitType.REQUESTS_PER_MINUTE: 200,
            RateLimitType.REQUESTS_PER_HOUR: 10000,
            RateLimitType.REQUESTS_PER_DAY: 100000,
            RateLimitType.AGENT_EXECUTIONS_PER_HOUR: 2000,
            RateLimitType.CONCURRENT_EXECUTIONS: 20,
            RateLimitType.TOKENS_PER_MINUTE: 100000
        },
        RateLimitTier.ELITE: {
            RateLimitType.REQUESTS_PER_MINUTE: 500,
            RateLimitType.REQUESTS_PER_HOUR: 25000,
            RateLimitType.REQUESTS_PER_DAY: 250000,
            RateLimitType.AGENT_EXECUTIONS_PER_HOUR: 5000,
            RateLimitType.CONCURRENT_EXECUTIONS: 50,
            RateLimitType.TOKENS_PER_MINUTE: 250000
        },
        RateLimitTier.BYOK: {
            RateLimitType.REQUESTS_PER_MINUTE: 1000,
            RateLimitType.REQUESTS_PER_HOUR: 50000,
            RateLimitType.REQUESTS_PER_DAY: 500000,
            RateLimitType.AGENT_EXECUTIONS_PER_HOUR: 10000,
            RateLimitType.CONCURRENT_EXECUTIONS: 100,
            RateLimitType.TOKENS_PER_MINUTE: 500000
        }
    }
    
    # Agent-specific limits (multiplier of base limits)
    AGENT_MULTIPLIERS = {
        "security-scanner": 1.0,
        "ticket-resolver": 1.0,
        "knowledge-base": 0.5,  # Lighter agent
        "incident-responder": 1.5,  # Heavier agent
        "data-processor": 2.0,  # Heavy processing
        "deployment-agent": 2.0,  # Heavy operations
        "audit-agent": 1.5,  # Complex analysis
        "report-generator": 1.5,  # Report generation
        "workflow-orchestrator": 2.0,  # Complex workflows
        "escalation-manager": 1.0
    }

class InMemoryRateLimiter:
    """In-memory rate limiter using sliding window algorithm"""
    
    def __init__(self):
        self._windows = {}  # key -> list of timestamps
        self._concurrent = {}  # key -> count
    
    def check_rate_limit(
        self,
        key: str,
        limit: int,
        window_seconds: int,
        limit_type: RateLimitType = RateLimitType.REQUESTS_PER_MINUTE
    ) -> RateLimitResult:
        """Check if request is within rate limit"""
        now = time.time()
        window_key = f"{key}:{limit_type.value}"
        
        # Handle concurrent executions differently
        if limit_type == RateLimitType.CONCURRENT_EXECUTIONS:
            current_count = self._concurrent.get(key, 0)
            allowed = current_count < limit
            
            return RateLimitResult(
                allowed=allowed,
                limit=limit,
                remaining=max(0, limit - current_count),
                reset_time=int(now + 60),  # Reset in 1 minute
                tier="unknown",
                limit_type=limit_type.value
            )
        
        # Initialize window if not exists
        if window_key not in self._windows:
            self._windows[window_key] = []
        
        # Remove old timestamps outside the window
        cutoff_time = now - window_seconds
        self._windows[window_key] = [
            timestamp for timestamp in self._windows[window_key]
            if timestamp > cutoff_time
        ]
        
        # Check if limit exceeded
        current_count = len(self._windows[window_key])
        allowed = current_count < limit
        
        if allowed:
            # Add current request timestamp
            self._windows[window_key].append(now)
        
        # Calculate reset time (when oldest request will expire)
        reset_time = int(now + window_seconds)
        if self._windows[window_key]:
            oldest_request = min(self._windows[window_key])
            reset_time = int(oldest_request + window_seconds)
        
        return RateLimitResult(
            allowed=allowed,
            limit=limit,
            remaining=max(0, limit - current_count - (1 if allowed else 0)),
            reset_time=reset_time,
            retry_after=int(reset_time - now) if not allowed else None,
            tier="unknown",
            limit_type=limit_type.value
        )
    
    def increment_concurrent(self, key: str):
        """Increment concurrent execution count"""
        self._concurrent[key] = self._concurrent.get(key, 0) + 1
    
    def decrement_concurrent(self, key: str):
        """Decrement concurrent execution count"""
        if key in self._concurrent:
            self._concurrent[key] = max(0, self._concurrent[key] - 1)
            if self._concurrent[key] == 0:
                del self._concurrent[key]

class RateLimitManager:
    """Advanced rate limiting manager with tier-based limits"""
    
    def __init__(self, use_redis: bool = False, redis_url: str = None):
        self.use_redis = use_redis
        self.redis_client = None
        
        if use_redis and redis_url:
            try:
                import redis
                self.redis_client = redis.from_url(redis_url)
                logger.info("Connected to Redis for rate limiting")
            except ImportError:
                logger.warning("Redis not available, using in-memory rate limiting")
                self.use_redis = False
            except Exception as e:
                logger.warning(f"Failed to connect to Redis: {e}, using in-memory rate limiting")
                self.use_redis = False
        
        # Fallback to in-memory limiter
        if not self.use_redis:
            self.memory_limiter = InMemoryRateLimiter()
    
    def check_user_rate_limit(
        self,
        user_id: int,
        tier: RateLimitTier,
        limit_type: RateLimitType,
        agent_id: str = None
    ) -> RateLimitResult:
        """Check rate limit for a user"""
        
        # Get base limit for tier
        tier_limits = RateLimitConfig.TIER_LIMITS.get(tier, {})
        base_limit = tier_limits.get(limit_type, 0)
        
        # Apply agent-specific multiplier if applicable
        if agent_id and limit_type == RateLimitType.AGENT_EXECUTIONS_PER_HOUR:
            multiplier = RateLimitConfig.AGENT_MULTIPLIERS.get(agent_id, 1.0)
            base_limit = int(base_limit * multiplier)
        
        # Determine window size
        window_seconds = self._get_window_seconds(limit_type)
        
        # Create rate limit key
        key = f"user:{user_id}:{limit_type.value}"
        if agent_id:
            key += f":{agent_id}"
        
        # Check rate limit
        if self.use_redis:
            result = self._check_redis_rate_limit(key, base_limit, window_seconds, limit_type)
        else:
            result = self.memory_limiter.check_rate_limit(key, base_limit, window_seconds, limit_type)
        
        # Update result with tier info
        result.tier = tier.value
        
        return result
    
    def check_api_key_rate_limit(
        self,
        api_key: str,
        tier: RateLimitTier,
        limit_type: RateLimitType
    ) -> RateLimitResult:
        """Check rate limit for an API key"""
        
        # Hash API key for privacy
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()[:16]
        
        tier_limits = RateLimitConfig.TIER_LIMITS.get(tier, {})
        base_limit = tier_limits.get(limit_type, 0)
        window_seconds = self._get_window_seconds(limit_type)
        
        key = f"api_key:{key_hash}:{limit_type.value}"
        
        if self.use_redis:
            result = self._check_redis_rate_limit(key, base_limit, window_seconds, limit_type)
        else:
            result = self.memory_limiter.check_rate_limit(key, base_limit, window_seconds, limit_type)
        
        result.tier = tier.value
        return result
    
    def start_concurrent_execution(self, user_id: int, tier: RateLimitTier) -> RateLimitResult:
        """Start a concurrent execution (increment counter)"""
        limit_type = RateLimitType.CONCURRENT_EXECUTIONS
        tier_limits = RateLimitConfig.TIER_LIMITS.get(tier, {})
        limit = tier_limits.get(limit_type, 1)
        
        key = f"user:{user_id}:concurrent"
        
        if self.use_redis:
            # Redis implementation for concurrent executions
            current = self.redis_client.incr(key)
            self.redis_client.expire(key, 300)  # 5 minute expiry
            
            allowed = current <= limit
            if not allowed:
                # Decrement if over limit
                self.redis_client.decr(key)
            
            return RateLimitResult(
                allowed=allowed,
                limit=limit,
                remaining=max(0, limit - current + (0 if allowed else 1)),
                reset_time=int(time.time() + 300),
                tier=tier.value,
                limit_type=limit_type.value
            )
        else:
            # Check limit first
            result = self.memory_limiter.check_rate_limit(key, limit, 300, limit_type)
            if result.allowed:
                self.memory_limiter.increment_concurrent(key)
            return result
    
    def end_concurrent_execution(self, user_id: int):
        """End a concurrent execution (decrement counter)"""
        key = f"user:{user_id}:concurrent"
        
        if self.use_redis:
            current = self.redis_client.get(key)
            if current and int(current) > 0:
                self.redis_client.decr(key)
        else:
            self.memory_limiter.decrement_concurrent(key)
    
    def get_user_rate_limit_status(
        self,
        user_id: int,
        tier: RateLimitTier
    ) -> Dict[str, RateLimitResult]:
        """Get rate limit status for all limit types"""
        status = {}
        
        for limit_type in RateLimitType:
            if limit_type == RateLimitType.CONCURRENT_EXECUTIONS:
                # Special handling for concurrent executions
                key = f"user:{user_id}:concurrent"
                tier_limits = RateLimitConfig.TIER_LIMITS.get(tier, {})
                limit = tier_limits.get(limit_type, 1)
                
                if self.use_redis:
                    current = int(self.redis_client.get(key) or 0)
                else:
                    current = self.memory_limiter._concurrent.get(key, 0)
                
                status[limit_type.value] = RateLimitResult(
                    allowed=current < limit,
                    limit=limit,
                    remaining=max(0, limit - current),
                    reset_time=int(time.time() + 300),
                    tier=tier.value,
                    limit_type=limit_type.value
                )
            else:
                # Check without consuming the limit
                result = self.check_user_rate_limit(user_id, tier, limit_type)
                status[limit_type.value] = result
        
        return status
    
    def _get_window_seconds(self, limit_type: RateLimitType) -> int:
        """Get window size in seconds for limit type"""
        if limit_type == RateLimitType.REQUESTS_PER_MINUTE:
            return 60
        elif limit_type == RateLimitType.REQUESTS_PER_HOUR:
            return 3600
        elif limit_type == RateLimitType.REQUESTS_PER_DAY:
            return 86400
        elif limit_type == RateLimitType.AGENT_EXECUTIONS_PER_HOUR:
            return 3600
        elif limit_type == RateLimitType.TOKENS_PER_MINUTE:
            return 60
        else:
            return 3600  # Default to 1 hour
    
    def _check_redis_rate_limit(
        self,
        key: str,
        limit: int,
        window_seconds: int,
        limit_type: RateLimitType
    ) -> RateLimitResult:
        """Check rate limit using Redis sliding window"""
        now = time.time()
        
        # Use Redis sorted set for sliding window
        pipe = self.redis_client.pipeline()
        
        # Remove old entries
        pipe.zremrangebyscore(key, 0, now - window_seconds)
        
        # Count current entries
        pipe.zcard(key)
        
        # Add current request
        pipe.zadd(key, {str(now): now})
        
        # Set expiry
        pipe.expire(key, window_seconds + 1)
        
        results = pipe.execute()
        current_count = results[1]
        
        allowed = current_count < limit
        
        if not allowed:
            # Remove the request we just added
            self.redis_client.zrem(key, str(now))
        
        # Calculate reset time
        oldest_scores = self.redis_client.zrange(key, 0, 0, withscores=True)
        reset_time = int(now + window_seconds)
        if oldest_scores:
            reset_time = int(oldest_scores[0][1] + window_seconds)
        
        return RateLimitResult(
            allowed=allowed,
            limit=limit,
            remaining=max(0, limit - current_count - (1 if allowed else 0)),
            reset_time=reset_time,
            retry_after=int(reset_time - now) if not allowed else None,
            tier="unknown",
            limit_type=limit_type.value
        )
    
    def get_tier_limits(self, tier: RateLimitTier) -> Dict[str, int]:
        """Get all limits for a tier"""
        return RateLimitConfig.TIER_LIMITS.get(tier, {})

# Global instance
rate_limiter = RateLimitManager()
