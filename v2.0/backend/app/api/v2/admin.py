from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

from app.core.database import get_db
from app.core.redis import redis_client
from app.models import User, ExecutionHistory, AgentPackage
from app.api.v2.auth import get_current_user

router = APIRouter()

# Pydantic models
class SystemMetrics(BaseModel):
    total_users: int
    total_executions: int
    active_agents: int
    system_uptime: str
    database_status: str
    redis_status: str

class HealthCheck(BaseModel):
    status: str
    timestamp: datetime
    version: str
    services: Dict[str, str]

class CircuitBreakerStatus(BaseModel):
    agent_id: str
    status: str
    failure_count: int
    last_failure: Optional[datetime]
    next_retry: Optional[datetime]

@router.get("/metrics", response_model=SystemMetrics)
async def get_system_metrics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get system metrics (admin only)."""
    # Check if user is admin (mock implementation)
    if current_user.tier not in ["admin", "elite"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Get system metrics
    total_users = db.query(User).count()
    total_executions = db.query(ExecutionHistory).count()
    active_agents = db.query(AgentPackage).filter(AgentPackage.is_active == True).count()
    
    # Check Redis status
    redis_status = "healthy" if await redis_client.is_connected() else "unhealthy"
    
    return SystemMetrics(
        total_users=total_users,
        total_executions=total_executions,
        active_agents=active_agents,
        system_uptime="99.99%",  # Mock uptime
        database_status="healthy",
        redis_status=redis_status
    )

@router.get("/health", response_model=HealthCheck)
async def health_check():
    """Comprehensive health check."""
    services = {
        "database": "healthy",
        "redis": "healthy" if await redis_client.is_connected() else "unhealthy",
        "anthropic_api": "healthy",  # Mock status
        "stripe": "healthy"  # Mock status
    }
    
    overall_status = "healthy" if all(status == "healthy" for status in services.values()) else "degraded"
    
    return HealthCheck(
        status=overall_status,
        timestamp=datetime.utcnow(),
        version="2.0.0",
        services=services
    )

@router.get("/circuit-breakers", response_model=List[CircuitBreakerStatus])
async def get_circuit_breaker_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get circuit breaker status for all agents."""
    # Check if user is admin
    if current_user.tier not in ["admin", "elite"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Mock circuit breaker status
    agents = db.query(AgentPackage).filter(AgentPackage.is_active == True).all()
    
    circuit_breakers = []
    for agent in agents:
        circuit_breakers.append(CircuitBreakerStatus(
            agent_id=agent.id,
            status="closed",  # Mock status
            failure_count=0,
            last_failure=None,
            next_retry=None
        ))
    
    return circuit_breakers
