"""
Incident Responder Agent v2.0
Intelligent incident triage, root cause analysis, and automated remediation
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from enum import Enum
from langchain_core.prompts import ChatPromptTemplate
from .base import BaseAgent
from datetime import datetime


class IncidentSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class IncidentStatus(str, Enum):
    OPEN = "open"
    INVESTIGATING = "investigating"
    IDENTIFIED = "identified"
    MONITORING = "monitoring"
    RESOLVED = "resolved"


class RemediationAction(BaseModel):
    action_type: str
    description: str
    command: Optional[str] = None
    estimated_time: str
    risk_level: str
    requires_approval: bool = False
    confidence: float


class IncidentAnalysis(BaseModel):
    incident_id: str
    severity: IncidentSeverity
    category: str
    root_cause: str
    impact_assessment: str
    affected_systems: List[str] = Field(default_factory=list)
    remediation_actions: List[RemediationAction] = Field(default_factory=list)
    escalation_required: bool = False
    estimated_resolution_time: str


class IncidentResponderAgent(BaseAgent):
    """
    v2.0 Incident Responder Agent
    
    Features:
    - Intelligent incident triage and prioritization
    - Root cause analysis using pattern recognition
    - Automated remediation suggestions
    - Impact assessment and escalation logic
    - Integration with monitoring systems
    """
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(
            agent_id="incident-responder",
            model="claude-3-5-sonnet-20241022",  # Complex model for incident analysis
            temperature=0.1,  # Low temperature for consistent analysis
            max_tokens=4096,
            api_key=api_key
        )
        
        # Known incident patterns for faster classification
        self.incident_patterns = self._initialize_patterns()
    
    async def _execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute incident response task"""
        incident_description = task.get("incident_description", "")
        system_metrics = task.get("system_metrics", {})
        logs = task.get("logs", [])
        affected_services = task.get("affected_services", [])
        
        if not incident_description:
            raise ValueError("incident_description is required")
        
        # Analyze the incident
        analysis = await self._analyze_incident(
            incident_description, system_metrics, logs, affected_services
        )
        
        # Generate remediation actions
        remediation_actions = await self._generate_remediation_actions(analysis)
        
        # Assess escalation needs
        escalation_needed = await self._assess_escalation(analysis)
        
        return {
            "incident_id": task.get("incident_id", f"inc_{int(__import__('time').time())}"),
            "analysis": analysis.dict(),
            "remediation_actions": [action.dict() for action in remediation_actions],
            "escalation_required": escalation_needed,
            "next_steps": self._generate_next_steps(analysis, remediation_actions),
            "confidence_score": analysis.get("confidence", 0.8)
        }
    
    async def _analyze_incident(
        self, 
        description: str, 
        metrics: Dict, 
        logs: List, 
        services: List
    ) -> Dict[str, Any]:
        """Analyze incident to determine severity, root cause, and impact"""
        
        analysis_prompt = ChatPromptTemplate.from_template("""
        Analyze this production incident and provide a structured assessment.
        
        Incident Description: {description}
        System Metrics: {metrics}
        Recent Logs: {logs}
        Affected Services: {services}
        
        Provide analysis in this format:
        SEVERITY: [critical|high|medium|low]
        CATEGORY: [performance|availability|security|data|network|deployment]
        ROOT_CAUSE: [Detailed root cause analysis]
        IMPACT: [Business and technical impact assessment]
        AFFECTED_SYSTEMS: [Comma-separated list of affected systems]
        RESOLUTION_TIME: [Estimated time to resolve]
        CONFIDENCE: [0.0-1.0 confidence in analysis]
        
        Consider:
        - Service outages = critical severity
        - Performance degradation = high/medium severity
        - Security incidents = critical/high severity
        - Data corruption = critical severity
        - Network issues = varies by scope
        - Recent deployments as potential causes
        """)
        
        response = await self.llm.ainvoke(
            analysis_prompt.format(
                description=description[:1000],
                metrics=str(metrics)[:500] if metrics else "No metrics provided",
                logs=str(logs[:5])[:800] if logs else "No logs provided",
                services=", ".join(services) if services else "Unknown"
            )
        )
        
        return self._parse_incident_analysis(response.content)
    
    async def _generate_remediation_actions(self, analysis: Dict) -> List[RemediationAction]:
        """Generate specific remediation actions based on incident analysis"""
        
        remediation_prompt = ChatPromptTemplate.from_template("""
        Generate specific remediation actions for this incident.
        
        Incident Analysis:
        - Severity: {severity}
        - Category: {category}
        - Root Cause: {root_cause}
        - Affected Systems: {affected_systems}
        
        Generate 2-4 remediation actions with:
        1. Action type (restart, rollback, scale, patch, investigate)
        2. Detailed description
        3. Specific command if applicable
        4. Estimated time to complete
        5. Risk level (low/medium/high)
        6. Whether approval is required
        7. Confidence level (0.0-1.0)
        
        Prioritize actions by:
        - Immediate service restoration
        - Risk mitigation
        - Long-term fixes
        
        Format each action clearly and provide specific steps.
        """)
        
        response = await self.llm.ainvoke(
            remediation_prompt.format(
                severity=analysis.get("severity", "medium"),
                category=analysis.get("category", "unknown"),
                root_cause=analysis.get("root_cause", "Under investigation"),
                affected_systems=", ".join(analysis.get("affected_systems", []))
            )
        )
        
        return self._parse_remediation_actions(response.content)
    
    async def _assess_escalation(self, analysis: Dict) -> bool:
        """Determine if incident requires escalation"""
        
        escalation_prompt = ChatPromptTemplate.from_template("""
        Determine if this incident requires escalation based on the analysis.
        
        Analysis:
        - Severity: {severity}
        - Category: {category}
        - Impact: {impact}
        - Estimated Resolution Time: {resolution_time}
        
        Escalation criteria:
        - Critical severity incidents
        - Security breaches
        - Data loss incidents
        - Customer-facing outages > 30 minutes
        - Financial impact > $10k/hour
        - Regulatory compliance issues
        
        Respond with: ESCALATE or NO_ESCALATION
        Include brief reasoning.
        """)
        
        response = await self.llm.ainvoke(
            escalation_prompt.format(
                severity=analysis.get("severity", "medium"),
                category=analysis.get("category", "unknown"),
                impact=analysis.get("impact", "Unknown impact"),
                resolution_time=analysis.get("resolution_time", "Unknown")
            )
        )
        
        return "ESCALATE" in response.content.upper()
    
    def _parse_incident_analysis(self, response: str) -> Dict[str, Any]:
        """Parse structured incident analysis from Claude response"""
        analysis = {
            "severity": "medium",
            "category": "unknown",
            "root_cause": "Under investigation",
            "impact": "Impact assessment in progress",
            "affected_systems": [],
            "resolution_time": "Unknown",
            "confidence": 0.7
        }
        
        lines = response.strip().split('\n')
        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                key = key.strip().lower()
                value = value.strip()
                
                if key == "severity":
                    analysis["severity"] = value.lower()
                elif key == "category":
                    analysis["category"] = value.lower()
                elif key == "root_cause":
                    analysis["root_cause"] = value
                elif key == "impact":
                    analysis["impact"] = value
                elif key == "affected_systems":
                    analysis["affected_systems"] = [s.strip() for s in value.split(',')]
                elif key == "resolution_time":
                    analysis["resolution_time"] = value
                elif key == "confidence":
                    try:
                        analysis["confidence"] = float(value)
                    except:
                        pass
        
        return analysis
    
    def _parse_remediation_actions(self, response: str) -> List[RemediationAction]:
        """Parse remediation actions from Claude response"""
        actions = []
        
        # Simple parsing - in production, use more robust parsing
        if "restart" in response.lower():
            actions.append(RemediationAction(
                action_type="restart",
                description="Restart affected services to restore functionality",
                command="systemctl restart service-name",
                estimated_time="2-5 minutes",
                risk_level="low",
                requires_approval=False,
                confidence=0.8
            ))
        
        if "rollback" in response.lower():
            actions.append(RemediationAction(
                action_type="rollback",
                description="Rollback recent deployment to last known good state",
                command="kubectl rollout undo deployment/app-name",
                estimated_time="5-10 minutes",
                risk_level="medium",
                requires_approval=True,
                confidence=0.9
            ))
        
        if "scale" in response.lower():
            actions.append(RemediationAction(
                action_type="scale",
                description="Scale up resources to handle increased load",
                command="kubectl scale deployment app-name --replicas=10",
                estimated_time="3-5 minutes",
                risk_level="low",
                requires_approval=False,
                confidence=0.85
            ))
        
        # Always include investigation action
        actions.append(RemediationAction(
            action_type="investigate",
            description="Conduct detailed investigation to identify root cause",
            estimated_time="15-30 minutes",
            risk_level="low",
            requires_approval=False,
            confidence=0.9
        ))
        
        return actions[:4]  # Return max 4 actions
    
    def _generate_next_steps(self, analysis: Dict, actions: List[RemediationAction]) -> List[str]:
        """Generate prioritized next steps"""
        next_steps = []
        
        # Immediate actions based on severity
        if analysis.get("severity") == "critical":
            next_steps.append("🚨 CRITICAL: Execute immediate remediation actions")
            next_steps.append("📞 Notify incident commander and stakeholders")
        
        # Add action-specific steps
        for action in actions:
            if not action.requires_approval:
                next_steps.append(f"⚡ Execute: {action.description}")
            else:
                next_steps.append(f"✋ Get approval for: {action.description}")
        
        # Standard steps
        next_steps.extend([
            "📊 Monitor system metrics for improvement",
            "📝 Document incident timeline and actions taken",
            "🔍 Conduct post-incident review when resolved"
        ])
        
        return next_steps[:6]  # Return max 6 steps
    
    def _initialize_patterns(self) -> Dict[str, Dict]:
        """Initialize known incident patterns for faster classification"""
        return {
            "high_latency": {
                "keywords": ["slow", "latency", "timeout", "performance"],
                "severity": "high",
                "category": "performance",
                "common_causes": ["database overload", "network congestion", "memory leak"]
            },
            "service_down": {
                "keywords": ["down", "unavailable", "502", "503", "connection refused"],
                "severity": "critical",
                "category": "availability",
                "common_causes": ["service crash", "deployment issue", "resource exhaustion"]
            },
            "security_breach": {
                "keywords": ["unauthorized", "breach", "attack", "malicious", "intrusion"],
                "severity": "critical",
                "category": "security",
                "common_causes": ["vulnerability exploit", "credential compromise", "malware"]
            },
            "data_corruption": {
                "keywords": ["corrupt", "data loss", "inconsistent", "missing data"],
                "severity": "critical",
                "category": "data",
                "common_causes": ["failed transaction", "storage failure", "replication issue"]
            }
        }
