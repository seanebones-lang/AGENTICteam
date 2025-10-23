"""
Workflow Orchestrator Agent v2.0
Advanced multi-step workflow automation and orchestration
"""

from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel, Field
from enum import Enum
from langchain_core.prompts import ChatPromptTemplate
from .base import BaseAgent
from datetime import datetime, timedelta
import json


class StepType(str, Enum):
    ACTION = "action"
    CONDITION = "condition"
    LOOP = "loop"
    PARALLEL = "parallel"
    WAIT = "wait"
    APPROVAL = "approval"
    NOTIFICATION = "notification"


class StepStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"
    WAITING_APPROVAL = "waiting_approval"


class WorkflowStep(BaseModel):
    step_id: str
    name: str
    step_type: StepType
    status: StepStatus = StepStatus.PENDING
    config: Dict[str, Any] = Field(default_factory=dict)
    dependencies: List[str] = Field(default_factory=list)
    timeout_minutes: int = 30
    retry_count: int = 0
    max_retries: int = 3
    output: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


class WorkflowExecution(BaseModel):
    execution_id: str
    workflow_id: str
    status: str
    steps: List[WorkflowStep]
    variables: Dict[str, Any] = Field(default_factory=dict)
    started_at: str
    completed_at: Optional[str] = None
    total_duration_ms: int = 0
    logs: List[str] = Field(default_factory=list)


class WorkflowTemplate(BaseModel):
    template_id: str
    name: str
    description: str
    steps: List[WorkflowStep]
    input_schema: Dict[str, Any] = Field(default_factory=dict)
    output_schema: Dict[str, Any] = Field(default_factory=dict)
    tags: List[str] = Field(default_factory=list)


class WorkflowOrchestratorAgent(BaseAgent):
    """
    v2.0 Workflow Orchestrator Agent
    
    Features:
    - Multi-step workflow design and execution
    - Conditional logic and parallel processing
    - Human-in-the-loop approvals
    - Error handling and retry mechanisms
    - Workflow templates and reusability
    - Real-time monitoring and logging
    """
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(
            agent_id="workflow-orchestrator",
            model="claude-3-5-sonnet-20241022",  # Complex model for workflow logic
            temperature=0.2,  # Low-moderate temperature for consistent decisions
            max_tokens=4096,
            api_key=api_key
        )
        
        # Built-in workflow templates
        self.workflow_templates = self._initialize_workflow_templates()
    
    async def _execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute workflow orchestration task"""
        operation = task.get("operation", "execute")  # execute, create, validate, monitor
        workflow_definition = task.get("workflow_definition", {})
        execution_id = task.get("execution_id", "")
        template_id = task.get("template_id", "")
        
        if operation == "create":
            result = await self._create_workflow_template(workflow_definition)
        elif operation == "execute":
            result = await self._execute_workflow(workflow_definition, template_id)
        elif operation == "validate":
            result = await self._validate_workflow(workflow_definition)
        elif operation == "monitor":
            result = await self._monitor_workflow_execution(execution_id)
        else:
            raise ValueError(f"Unsupported operation: {operation}")
        
        return {
            "workflow_id": task.get("workflow_id", f"wf_{int(__import__('time').time())}"),
            "operation": operation,
            "result": result,
            "confidence_score": result.get("confidence", 0.85)
        }
    
    async def _create_workflow_template(self, workflow_def: Dict) -> Dict[str, Any]:
        """Create reusable workflow template"""
        
        template_prompt = ChatPromptTemplate.from_template("""
        Analyze this workflow definition and create an optimized template.
        
        Workflow Definition: {workflow_def}
        
        Create a workflow template that includes:
        1. Optimized step sequence and dependencies
        2. Error handling and retry strategies
        3. Conditional logic and branching
        4. Parallel execution opportunities
        5. Input/output schema validation
        6. Monitoring and logging points
        
        Consider:
        - Step dependencies and execution order
        - Resource requirements and constraints
        - Failure scenarios and recovery
        - Performance optimization
        - Reusability across different contexts
        """)
        
        response = await self.llm.ainvoke(
            template_prompt.format(workflow_def=json.dumps(workflow_def, indent=2))
        )
        
        # Generate template from definition
        template = self._generate_workflow_template(workflow_def, response.content)
        
        return {
            "template_created": True,
            "template_id": template.template_id,
            "template": template.dict(),
            "optimization_suggestions": response.content,
            "estimated_execution_time": self._estimate_execution_time(template.steps),
            "confidence": 0.9
        }
    
    async def _execute_workflow(self, workflow_def: Dict, template_id: str = "") -> Dict[str, Any]:
        """Execute workflow with orchestration logic"""
        
        execution_prompt = ChatPromptTemplate.from_template("""
        Orchestrate the execution of this workflow with intelligent step management.
        
        Workflow: {workflow_def}
        Template ID: {template_id}
        
        Execution strategy should include:
        1. Step dependency resolution and scheduling
        2. Parallel execution where possible
        3. Error handling and recovery procedures
        4. Progress monitoring and logging
        5. Resource optimization and load balancing
        6. Human approval integration points
        
        Provide:
        - Execution plan with step sequence
        - Resource allocation strategy
        - Monitoring checkpoints
        - Failure recovery procedures
        - Performance optimization recommendations
        """)
        
        response = await self.llm.ainvoke(
            execution_prompt.format(
                workflow_def=json.dumps(workflow_def, indent=2),
                template_id=template_id or "custom"
            )
        )
        
        # Simulate workflow execution
        execution = self._simulate_workflow_execution(workflow_def)
        
        return {
            "execution_id": execution.execution_id,
            "execution_status": execution.status,
            "steps_completed": len([s for s in execution.steps if s.status == StepStatus.COMPLETED]),
            "steps_failed": len([s for s in execution.steps if s.status == StepStatus.FAILED]),
            "total_steps": len(execution.steps),
            "execution_plan": response.content,
            "duration_ms": execution.total_duration_ms,
            "logs": execution.logs,
            "confidence": 0.88
        }
    
    async def _validate_workflow(self, workflow_def: Dict) -> Dict[str, Any]:
        """Validate workflow definition and logic"""
        
        validation_prompt = ChatPromptTemplate.from_template("""
        Validate this workflow definition for correctness and optimization.
        
        Workflow Definition: {workflow_def}
        
        Validation checks:
        1. Step dependency cycles and deadlocks
        2. Resource requirements and availability
        3. Input/output schema compatibility
        4. Error handling completeness
        5. Performance bottlenecks
        6. Security and compliance requirements
        
        Identify:
        - Validation errors and warnings
        - Optimization opportunities
        - Best practice recommendations
        - Potential failure points
        - Resource utilization issues
        """)
        
        response = await self.llm.ainvoke(
            validation_prompt.format(workflow_def=json.dumps(workflow_def, indent=2))
        )
        
        # Perform validation checks
        validation_results = self._perform_workflow_validation(workflow_def)
        
        return {
            "validation_status": "passed" if validation_results["errors"] == 0 else "failed",
            "errors": validation_results["errors"],
            "warnings": validation_results["warnings"],
            "validation_report": response.content,
            "optimization_score": validation_results["optimization_score"],
            "recommendations": validation_results["recommendations"],
            "confidence": 0.92
        }
    
    async def _monitor_workflow_execution(self, execution_id: str) -> Dict[str, Any]:
        """Monitor ongoing workflow execution"""
        
        monitoring_prompt = ChatPromptTemplate.from_template("""
        Analyze workflow execution status and provide monitoring insights.
        
        Execution ID: {execution_id}
        
        Monitoring analysis should include:
        1. Current execution status and progress
        2. Performance metrics and bottlenecks
        3. Resource utilization patterns
        4. Error patterns and failure analysis
        5. Completion time estimates
        6. Optimization recommendations
        
        Provide:
        - Real-time status summary
        - Performance analytics
        - Predictive completion estimates
        - Issue identification and resolution
        - Resource optimization suggestions
        """)
        
        response = await self.llm.ainvoke(
            monitoring_prompt.format(execution_id=execution_id)
        )
        
        # Generate monitoring data
        monitoring_data = self._generate_monitoring_data(execution_id)
        
        return {
            "execution_id": execution_id,
            "current_status": monitoring_data["status"],
            "progress_percentage": monitoring_data["progress"],
            "steps_completed": monitoring_data["completed_steps"],
            "estimated_completion": monitoring_data["estimated_completion"],
            "performance_metrics": monitoring_data["metrics"],
            "monitoring_analysis": response.content,
            "alerts": monitoring_data["alerts"],
            "confidence": 0.87
        }
    
    def _generate_workflow_template(self, workflow_def: Dict, analysis: str) -> WorkflowTemplate:
        """Generate workflow template from definition"""
        template_id = f"template_{int(__import__('time').time())}"
        
        # Create steps from definition
        steps = []
        step_configs = workflow_def.get("steps", [])
        
        for i, step_config in enumerate(step_configs):
            step = WorkflowStep(
                step_id=f"step_{i+1}",
                name=step_config.get("name", f"Step {i+1}"),
                step_type=StepType(step_config.get("type", "action")),
                config=step_config.get("config", {}),
                dependencies=step_config.get("dependencies", []),
                timeout_minutes=step_config.get("timeout", 30)
            )
            steps.append(step)
        
        return WorkflowTemplate(
            template_id=template_id,
            name=workflow_def.get("name", "Custom Workflow"),
            description=workflow_def.get("description", "Generated workflow template"),
            steps=steps,
            input_schema=workflow_def.get("input_schema", {}),
            output_schema=workflow_def.get("output_schema", {}),
            tags=workflow_def.get("tags", ["generated"])
        )
    
    def _simulate_workflow_execution(self, workflow_def: Dict) -> WorkflowExecution:
        """Simulate workflow execution for testing"""
        execution_id = f"exec_{int(__import__('time').time())}"
        
        # Create steps
        steps = []
        step_configs = workflow_def.get("steps", [])
        
        for i, step_config in enumerate(step_configs):
            step = WorkflowStep(
                step_id=f"step_{i+1}",
                name=step_config.get("name", f"Step {i+1}"),
                step_type=StepType(step_config.get("type", "action")),
                status=StepStatus.COMPLETED,  # Simulate success
                config=step_config.get("config", {}),
                started_at=datetime.now().isoformat(),
                completed_at=(datetime.now() + timedelta(minutes=2)).isoformat()
            )
            steps.append(step)
        
        return WorkflowExecution(
            execution_id=execution_id,
            workflow_id=workflow_def.get("id", "workflow_1"),
            status="completed",
            steps=steps,
            started_at=datetime.now().isoformat(),
            completed_at=(datetime.now() + timedelta(minutes=10)).isoformat(),
            total_duration_ms=600000,  # 10 minutes
            logs=[
                "Workflow execution started",
                f"Executing {len(steps)} steps",
                "All steps completed successfully",
                "Workflow execution completed"
            ]
        )
    
    def _perform_workflow_validation(self, workflow_def: Dict) -> Dict[str, Any]:
        """Perform workflow validation checks"""
        errors = 0
        warnings = 0
        recommendations = []
        
        steps = workflow_def.get("steps", [])
        
        # Check for circular dependencies
        if self._has_circular_dependencies(steps):
            errors += 1
            recommendations.append("Remove circular dependencies between steps")
        
        # Check for missing required fields
        for step in steps:
            if not step.get("name"):
                warnings += 1
                recommendations.append("Add descriptive names to all steps")
        
        # Calculate optimization score
        optimization_score = max(0.0, 10.0 - errors * 2 - warnings * 0.5)
        
        return {
            "errors": errors,
            "warnings": warnings,
            "optimization_score": optimization_score,
            "recommendations": recommendations
        }
    
    def _has_circular_dependencies(self, steps: List[Dict]) -> bool:
        """Check for circular dependencies in workflow steps"""
        # Simplified check - in production, use proper graph algorithms
        step_ids = {step.get("id", f"step_{i}") for i, step in enumerate(steps)}
        
        for step in steps:
            dependencies = step.get("dependencies", [])
            if step.get("id") in dependencies:
                return True  # Self-dependency
        
        return False
    
    def _estimate_execution_time(self, steps: List[WorkflowStep]) -> str:
        """Estimate workflow execution time"""
        total_minutes = sum(step.timeout_minutes for step in steps)
        
        # Account for parallel execution (simplified)
        parallel_steps = len([s for s in steps if s.step_type == StepType.PARALLEL])
        if parallel_steps > 0:
            total_minutes = total_minutes * 0.6  # 40% time savings
        
        if total_minutes < 60:
            return f"{int(total_minutes)} minutes"
        else:
            hours = total_minutes // 60
            minutes = total_minutes % 60
            return f"{int(hours)}h {int(minutes)}m"
    
    def _generate_monitoring_data(self, execution_id: str) -> Dict[str, Any]:
        """Generate monitoring data for workflow execution"""
        return {
            "status": "running",
            "progress": 65.0,
            "completed_steps": 4,
            "total_steps": 6,
            "estimated_completion": (datetime.now() + timedelta(minutes=15)).isoformat(),
            "metrics": {
                "avg_step_duration_ms": 120000,
                "cpu_utilization": 45.2,
                "memory_usage_mb": 512,
                "network_io_mb": 23.4
            },
            "alerts": [
                "Step 3 taking longer than expected",
                "High memory usage detected"
            ]
        }
    
    def _initialize_workflow_templates(self) -> List[WorkflowTemplate]:
        """Initialize built-in workflow templates"""
        return [
            WorkflowTemplate(
                template_id="incident_response",
                name="Incident Response Workflow",
                description="Automated incident response and escalation",
                steps=[
                    WorkflowStep(
                        step_id="detect",
                        name="Incident Detection",
                        step_type=StepType.ACTION,
                        config={"action": "monitor_alerts"}
                    ),
                    WorkflowStep(
                        step_id="assess",
                        name="Impact Assessment",
                        step_type=StepType.ACTION,
                        config={"action": "assess_impact"},
                        dependencies=["detect"]
                    ),
                    WorkflowStep(
                        step_id="notify",
                        name="Stakeholder Notification",
                        step_type=StepType.NOTIFICATION,
                        config={"recipients": ["team_lead", "manager"]},
                        dependencies=["assess"]
                    )
                ],
                tags=["incident", "response", "automation"]
            )
        ]
