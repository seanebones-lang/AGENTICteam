from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

from app.core.database import get_db
from app.core.redis import redis_client
from app.core.config import settings
from app.models import AgentPackage, ExecutionHistory, FreeTrialUsage, User
from app.api.v2.auth import get_current_user

router = APIRouter()

# Pydantic models
class AgentResponse(BaseModel):
    id: str
    name: str
    description: str
    category: str
    model_type: str
    is_active: bool
    price_per_execution: Optional[float]

    class Config:
        from_attributes = True

class AgentExecutionRequest(BaseModel):
    task: str
    input_data: Dict[str, Any]

class AgentExecutionResponse(BaseModel):
    execution_id: str
    status: str
    output_data: Optional[Dict[str, Any]]
    execution_time_ms: Optional[int]
    token_count: Optional[int]
    cost_usd: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True

class AgentExecutionHistory(BaseModel):
    id: str
    agent_id: str
    agent_name: str
    input_data: str
    output_data: Optional[str]
    status: str
    error_message: Optional[str]
    execution_time_ms: Optional[int]
    token_count: Optional[int]
    cost_usd: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True

# Mock agent execution function (will be replaced with real AI)
async def execute_agent_mock(agent_id: str, task: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Mock agent execution - will be replaced with real AI integration."""
    import time
    import random
    
    # Simulate processing time
    await asyncio.sleep(random.uniform(1, 3))
    
    # Mock response based on agent type
    responses = {
        "ticket-resolver": {
            "status": "resolved",
            "solution": f"Resolved ticket: {task}",
            "priority": "medium",
            "category": "technical"
        },
        "knowledge-base": {
            "status": "found",
            "answer": f"Knowledge base answer for: {task}",
            "confidence": 0.95,
            "sources": ["doc1", "doc2"]
        },
        "incident-responder": {
            "status": "investigating",
            "action_taken": f"Investigating incident: {task}",
            "severity": "low",
            "eta_resolution": "2 hours"
        }
    }
    
    return responses.get(agent_id, {
        "status": "completed",
        "result": f"Agent {agent_id} processed: {task}",
        "timestamp": datetime.utcnow().isoformat()
    })

@router.get("/list", response_model=List[AgentResponse])
async def list_agents(db: Session = Depends(get_db)):
    """List all available agents."""
    agents = db.query(AgentPackage).filter(AgentPackage.is_active == True).all()
    return agents

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: str, db: Session = Depends(get_db)):
    """Get specific agent details."""
    agent = db.query(AgentPackage).filter(
        AgentPackage.id == agent_id,
        AgentPackage.is_active == True
    ).first()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    return agent

@router.post("/{agent_id}/execute", response_model=AgentExecutionResponse)
async def execute_agent(
    agent_id: str,
    execution_request: AgentExecutionRequest,
    request: Request,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute an agent with the given task and input data."""
    import asyncio
    import uuid
    import time
    
    # Get agent details
    agent = db.query(AgentPackage).filter(
        AgentPackage.id == agent_id,
        AgentPackage.is_active == True
    ).first()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    # Generate device fingerprint for free trial tracking
    device_fingerprint = generate_device_fingerprint(
        request.headers.get("user-agent", ""),
        request.client.host if request.client else "unknown"
    )
    
    # Check free trial usage
    if not current_user:
        # Anonymous user - check free trial
        free_trial_key = f"free_trial:{device_fingerprint}"
        free_trial_data = await redis_client.get_json(free_trial_key)
        
        if not free_trial_data:
            free_trial_data = {"query_count": 0, "first_query_at": None}
        
        if free_trial_data["query_count"] >= settings.free_trial_queries:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Free trial limit reached. You have used {settings.free_trial_queries} queries. Please sign up to continue."
            )
        
        # Increment free trial counter
        free_trial_data["query_count"] += 1
        if not free_trial_data["first_query_at"]:
            free_trial_data["first_query_at"] = datetime.utcnow().isoformat()
        free_trial_data["last_query_at"] = datetime.utcnow().isoformat()
        
        await redis_client.set_json(free_trial_key, free_trial_data, expire=86400 * 30)  # 30 days
    
    # Create execution record
    execution_id = str(uuid.uuid4())
    execution = ExecutionHistory(
        id=execution_id,
        user_id=current_user.id if current_user else None,
        agent_id=agent_id,
        agent_name=agent.name,
        input_data=str(execution_request.input_data),
        status="pending",
        device_fingerprint=device_fingerprint
    )
    
    db.add(execution)
    db.commit()
    
    # Execute agent
    start_time = time.time()
    try:
        result = await execute_agent_mock(agent_id, execution_request.task, execution_request.input_data)
        execution_time_ms = int((time.time() - start_time) * 1000)
        
        # Update execution record
        execution.status = "completed"
        execution.output_data = str(result)
        execution.execution_time_ms = execution_time_ms
        execution.token_count = len(str(result)) // 4  # Rough token estimate
        execution.cost_usd = agent.price_per_execution or 0.01
        
        db.commit()
        
        return AgentExecutionResponse(
            execution_id=execution_id,
            status="completed",
            output_data=result,
            execution_time_ms=execution_time_ms,
            token_count=execution.token_count,
            cost_usd=execution.cost_usd,
            created_at=execution.created_at
        )
        
    except Exception as e:
        execution.status = "failed"
        execution.error_message = str(e)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent execution failed: {str(e)}"
        )

@router.get("/{agent_id}/history", response_model=List[AgentExecutionHistory])
async def get_agent_execution_history(
    agent_id: str,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get execution history for a specific agent."""
    executions = db.query(ExecutionHistory).filter(
        ExecutionHistory.user_id == current_user.id,
        ExecutionHistory.agent_id == agent_id
    ).order_by(ExecutionHistory.created_at.desc()).limit(limit).all()
    
    return executions

@router.get("/{agent_id}/status")
async def get_agent_status(agent_id: str, db: Session = Depends(get_db)):
    """Get agent status and health."""
    agent = db.query(AgentPackage).filter(AgentPackage.id == agent_id).first()
    
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    return {
        "agent_id": agent_id,
        "status": "healthy" if agent.is_active else "inactive",
        "model_type": agent.model_type,
        "last_updated": agent.updated_at.isoformat() if agent.updated_at else None
    }

# Helper function for device fingerprint
def generate_device_fingerprint(user_agent: str, ip_address: str) -> str:
    """Generate a device fingerprint for tracking."""
    import hashlib
    fingerprint_data = f"{user_agent}:{ip_address}"
    return hashlib.sha256(fingerprint_data.encode()).hexdigest()[:32]
