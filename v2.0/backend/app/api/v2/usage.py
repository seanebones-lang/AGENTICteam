from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.redis import redis_client
from app.core.config import settings
from app.models import User, ExecutionHistory, FreeTrialUsage
from app.api.v2.auth import get_current_user

router = APIRouter()

# Pydantic models
class UsageStats(BaseModel):
    total_executions: int
    total_tokens: int
    total_cost_usd: float
    executions_today: int
    executions_this_month: int
    most_used_agent: Optional[str]
    average_execution_time_ms: Optional[float]

class UsageLimits(BaseModel):
    free_trial_queries_remaining: int
    free_trial_queries_total: int
    rate_limit_remaining: int
    rate_limit_reset_time: datetime

class ExecutionStats(BaseModel):
    id: str
    agent_id: str
    agent_name: str
    status: str
    execution_time_ms: Optional[int]
    token_count: Optional[int]
    cost_usd: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/stats", response_model=UsageStats)
async def get_usage_stats(
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's usage statistics."""
    if not current_user:
        return UsageStats(
            total_executions=0,
            total_tokens=0,
            total_cost_usd=0.0,
            executions_today=0,
            executions_this_month=0,
            most_used_agent=None,
            average_execution_time_ms=None
        )
    
    # Get all executions for user
    executions = db.query(ExecutionHistory).filter(
        ExecutionHistory.user_id == current_user.id
    ).all()
    
    # Calculate stats
    total_executions = len(executions)
    total_tokens = sum(e.token_count or 0 for e in executions)
    total_cost_usd = sum(e.cost_usd or 0 for e in executions)
    
    # Today's executions
    today = datetime.utcnow().date()
    executions_today = len([
        e for e in executions 
        if e.created_at.date() == today
    ])
    
    # This month's executions
    month_start = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    executions_this_month = len([
        e for e in executions 
        if e.created_at >= month_start
    ])
    
    # Most used agent
    agent_counts = {}
    for e in executions:
        agent_counts[e.agent_id] = agent_counts.get(e.agent_id, 0) + 1
    most_used_agent = max(agent_counts.items(), key=lambda x: x[1])[0] if agent_counts else None
    
    # Average execution time
    completed_executions = [e for e in executions if e.execution_time_ms is not None]
    average_execution_time_ms = (
        sum(e.execution_time_ms for e in completed_executions) / len(completed_executions)
        if completed_executions else None
    )
    
    return UsageStats(
        total_executions=total_executions,
        total_tokens=total_tokens,
        total_cost_usd=total_cost_usd,
        executions_today=executions_today,
        executions_this_month=executions_this_month,
        most_used_agent=most_used_agent,
        average_execution_time_ms=average_execution_time_ms
    )

@router.get("/limits", response_model=UsageLimits)
async def get_usage_limits(
    request: Request,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's usage limits and remaining quotas."""
    # Generate device fingerprint
    device_fingerprint = generate_device_fingerprint(
        request.headers.get("user-agent", ""),
        request.client.host if request.client else "unknown"
    )
    
    if current_user:
        # Authenticated user - no free trial limits
        return UsageLimits(
            free_trial_queries_remaining=0,
            free_trial_queries_total=0,
            rate_limit_remaining=1000,  # Mock rate limit
            rate_limit_reset_time=datetime.utcnow() + timedelta(hours=1)
        )
    else:
        # Anonymous user - check free trial
        free_trial_key = f"free_trial:{device_fingerprint}"
        free_trial_data = await redis_client.get_json(free_trial_key)
        
        if not free_trial_data:
            free_trial_data = {"query_count": 0}
        
        remaining = max(0, settings.free_trial_queries - free_trial_data["query_count"])
        
        return UsageLimits(
            free_trial_queries_remaining=remaining,
            free_trial_queries_total=settings.free_trial_queries,
            rate_limit_remaining=100,  # Mock rate limit
            rate_limit_reset_time=datetime.utcnow() + timedelta(minutes=1)
        )

@router.get("/executions", response_model=List[ExecutionStats])
async def get_execution_history(
    limit: int = 50,
    offset: int = 0,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's execution history."""
    if not current_user:
        return []
    
    executions = db.query(ExecutionHistory).filter(
        ExecutionHistory.user_id == current_user.id
    ).order_by(ExecutionHistory.created_at.desc()).offset(offset).limit(limit).all()
    
    return executions

# Helper function for device fingerprint
def generate_device_fingerprint(user_agent: str, ip_address: str) -> str:
    """Generate a device fingerprint for tracking."""
    import hashlib
    fingerprint_data = f"{user_agent}:{ip_address}"
    return hashlib.sha256(fingerprint_data.encode()).hexdigest()[:32]
