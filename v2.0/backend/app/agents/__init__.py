"""
Agent Marketplace v2.0 - AI Agents Package
Production-ready AI agents with Claude 3.5 Sonnet/Haiku integration
"""

from .base import BaseAgent, AgentResponse
from .ticket_resolver import TicketResolverAgent
from .security_scanner import SecurityScannerAgent
from .knowledge_base import KnowledgeBaseAgent
from .incident_responder import IncidentResponderAgent
from .data_processor import DataProcessorAgent
from .report_generator import ReportGeneratorAgent
from .deployment_agent import DeploymentAgent
from .audit_agent import AuditAgent
from .workflow_orchestrator import WorkflowOrchestratorAgent
from .escalation_manager import EscalationManagerAgent

__all__ = [
    "BaseAgent",
    "AgentResponse",
    "TicketResolverAgent",
    "SecurityScannerAgent", 
    "KnowledgeBaseAgent",
    "IncidentResponderAgent",
    "DataProcessorAgent",
    "ReportGeneratorAgent",
    "DeploymentAgent",
    "AuditAgent",
    "WorkflowOrchestratorAgent",
    "EscalationManagerAgent",
]

# Agent configuration for v2.0
AGENT_CONFIG = {
    "light_agents": {
        "model": "claude-3-5-haiku-20241022",
        "temperature": 0.3,
        "max_tokens": 2048,
        "agents": ["ticket_resolver", "knowledge_base", "escalation_manager"]
    },
    "heavy_agents": {
        "model": "claude-3-5-sonnet-20241022", 
        "temperature": 0.2,
        "max_tokens": 4096,
        "agents": ["security_scanner", "incident_responder", "data_processor", 
                  "deployment_agent", "audit_agent", "report_generator", "workflow_orchestrator"]
    }
}
