"""
Base Agent Class for v2.0 Agent Marketplace
Modern, production-ready foundation for all AI agents with Claude 4.5 integration
"""

import asyncio
import time
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from langchain_anthropic import ChatAnthropic
import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from core.model_manager import ModelManager, BudgetPreference, ModelTier


class AgentResponse(BaseModel):
    """Standard response format for all agents"""
    agent_id: str
    task_id: str
    status: str = "completed"  # completed, failed, partial
    result: Dict[str, Any] = Field(default_factory=dict)
    execution_time_ms: int = 0
    model_used: str = ""
    tokens_used: int = 0
    confidence_score: float = 0.0
    error_message: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class BaseAgent(ABC):
    """
    Base class for all v2.0 agents
    
    Features:
    - Standardized initialization with Claude models
    - Built-in error handling and retry logic
    - Performance monitoring and metrics
    - Consistent response format
    - Async execution support
    """
    
    def __init__(
        self,
        agent_id: str,
        model: str = "claude-3-5-sonnet-20241022",
        temperature: float = 0.3,
        max_tokens: int = 4096,
        api_key: Optional[str] = None
    ):
        self.agent_id = agent_id
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        
        # Initialize Claude LLM
        self.llm = ChatAnthropic(
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            api_key=api_key or os.getenv("ANTHROPIC_API_KEY")
        )
        
        # Performance tracking
        self.total_executions = 0
        self.total_execution_time = 0
        self.success_count = 0
        self.error_count = 0
        
    async def execute(self, task: Dict[str, Any]) -> AgentResponse:
        """
        Main execution method - standardized across all agents
        
        Args:
            task: Dictionary containing task parameters and data
            
        Returns:
            AgentResponse with standardized format
        """
        start_time = time.time()
        task_id = task.get("task_id", f"{self.agent_id}_{int(time.time())}")
        
        try:
            self.total_executions += 1
            
            # Execute the specific agent logic
            result = await self._execute_task(task)
            
            execution_time = int((time.time() - start_time) * 1000)
            self.total_execution_time += execution_time
            self.success_count += 1
            
            return AgentResponse(
                agent_id=self.agent_id,
                task_id=task_id,
                status="completed",
                result=result,
                execution_time_ms=execution_time,
                model_used=self.model,
                confidence_score=result.get("confidence_score", 0.8)
            )
            
        except Exception as e:
            self.error_count += 1
            execution_time = int((time.time() - start_time) * 1000)
            
            return AgentResponse(
                agent_id=self.agent_id,
                task_id=task_id,
                status="failed",
                result={},
                execution_time_ms=execution_time,
                model_used=self.model,
                error_message=str(e)
            )
    
    @abstractmethod
    async def _execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """
        Abstract method that each agent must implement
        Contains the specific logic for that agent type
        
        Args:
            task: Task parameters and data
            
        Returns:
            Dictionary with agent-specific results
        """
        pass
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get performance metrics for this agent"""
        avg_execution_time = (
            self.total_execution_time / self.total_executions 
            if self.total_executions > 0 else 0
        )
        
        success_rate = (
            self.success_count / self.total_executions 
            if self.total_executions > 0 else 0
        )
        
        return {
            "agent_id": self.agent_id,
            "model": self.model,
            "total_executions": self.total_executions,
            "success_count": self.success_count,
            "error_count": self.error_count,
            "success_rate": success_rate,
            "avg_execution_time_ms": avg_execution_time,
            "total_execution_time_ms": self.total_execution_time
        }
    
    async def health_check(self) -> Dict[str, Any]:
        """Perform a health check on this agent"""
        try:
            # Simple test query
            test_task = {
                "task_id": "health_check",
                "query": "Health check test"
            }
            
            start_time = time.time()
            response = await self.llm.ainvoke("Respond with 'OK' for health check")
            response_time = int((time.time() - start_time) * 1000)
            
            return {
                "status": "healthy",
                "response_time_ms": response_time,
                "model": self.model,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
                "model": self.model,
                "timestamp": datetime.now().isoformat()
            }
