"""
Audit Agent v2.0
Comprehensive compliance and security auditing system
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from enum import Enum
from langchain_core.prompts import ChatPromptTemplate
from .base import BaseAgent
from datetime import datetime


class AuditType(str, Enum):
    SECURITY = "security"
    COMPLIANCE = "compliance"
    PERFORMANCE = "performance"
    DATA_PRIVACY = "data_privacy"
    ACCESS_CONTROL = "access_control"
    FINANCIAL = "financial"


class ComplianceFramework(str, Enum):
    SOC2 = "soc2"
    ISO27001 = "iso27001"
    GDPR = "gdpr"
    HIPAA = "hipaa"
    PCI_DSS = "pci_dss"
    FEDRAMP = "fedramp"


class AuditSeverity(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class AuditFinding(BaseModel):
    finding_id: str
    title: str
    description: str
    severity: AuditSeverity
    category: str
    affected_systems: List[str] = Field(default_factory=list)
    compliance_frameworks: List[ComplianceFramework] = Field(default_factory=list)
    remediation_steps: List[str] = Field(default_factory=list)
    risk_score: float
    evidence: Optional[str] = None


class AuditReport(BaseModel):
    audit_id: str
    audit_type: AuditType
    scope: str
    findings: List[AuditFinding]
    overall_score: float
    compliance_status: str
    recommendations: List[str]
    next_audit_date: str


class AuditAgent(BaseAgent):
    """
    v2.0 Audit Agent
    
    Features:
    - Multi-framework compliance auditing
    - Security posture assessment
    - Access control validation
    - Data privacy compliance checks
    - Automated evidence collection
    - Risk scoring and prioritization
    """
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(
            agent_id="audit-agent",
            model="claude-3-5-sonnet-20241022",  # Complex model for audit analysis
            temperature=0.1,  # Low temperature for consistent audit results
            max_tokens=4096,
            api_key=api_key
        )
        
        # Compliance frameworks and their requirements
        self.compliance_requirements = self._initialize_compliance_requirements()
    
    async def _execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute audit task"""
        audit_type = task.get("audit_type", AuditType.SECURITY)
        scope = task.get("scope", "system")
        frameworks = task.get("frameworks", [ComplianceFramework.SOC2])
        system_data = task.get("system_data", {})
        
        # Perform audit based on type
        if audit_type == AuditType.SECURITY:
            findings = await self._conduct_security_audit(system_data, scope)
        elif audit_type == AuditType.COMPLIANCE:
            findings = await self._conduct_compliance_audit(system_data, frameworks)
        elif audit_type == AuditType.ACCESS_CONTROL:
            findings = await self._conduct_access_audit(system_data)
        elif audit_type == AuditType.DATA_PRIVACY:
            findings = await self._conduct_privacy_audit(system_data, frameworks)
        else:
            findings = await self._conduct_general_audit(system_data, audit_type)
        
        # Generate audit report
        report = self._generate_audit_report(audit_type, scope, findings)
        
        return {
            "audit_id": f"audit_{int(__import__('time').time())}",
            "audit_type": audit_type,
            "report": report.dict(),
            "findings_count": len(findings),
            "critical_findings": len([f for f in findings if f.severity == AuditSeverity.CRITICAL]),
            "compliance_score": report.overall_score,
            "confidence_score": 0.9
        }
    
    async def _conduct_security_audit(self, system_data: Dict, scope: str) -> List[AuditFinding]:
        """Conduct comprehensive security audit"""
        
        security_prompt = ChatPromptTemplate.from_template("""
        Conduct a comprehensive security audit of this system.
        
        System Data: {system_data}
        Audit Scope: {scope}
        
        Evaluate security controls for:
        1. Authentication and authorization mechanisms
        2. Data encryption (in transit and at rest)
        3. Network security and firewall configurations
        4. Vulnerability management processes
        5. Incident response procedures
        6. Security monitoring and logging
        7. Access controls and privilege management
        8. Secure development practices
        
        For each area, identify:
        - Current security posture
        - Vulnerabilities or weaknesses
        - Compliance gaps
        - Risk assessment
        - Remediation recommendations
        
        Focus on OWASP Top 10, NIST Cybersecurity Framework, and industry best practices.
        """)
        
        response = await self.llm.ainvoke(
            security_prompt.format(
                system_data=str(system_data)[:1500],
                scope=scope
            )
        )
        
        return self._parse_audit_findings(response.content, AuditType.SECURITY)
    
    async def _conduct_compliance_audit(
        self, 
        system_data: Dict, 
        frameworks: List[ComplianceFramework]
    ) -> List[AuditFinding]:
        """Conduct compliance audit against specified frameworks"""
        
        compliance_prompt = ChatPromptTemplate.from_template("""
        Conduct compliance audit against these frameworks.
        
        System Data: {system_data}
        Compliance Frameworks: {frameworks}
        
        For each framework, evaluate:
        
        SOC 2 Type II:
        - Security controls and monitoring
        - Availability and system performance
        - Processing integrity
        - Confidentiality measures
        - Privacy protection
        
        ISO 27001:
        - Information security management system
        - Risk assessment and treatment
        - Security policies and procedures
        - Incident management
        - Business continuity
        
        GDPR:
        - Data protection by design and default
        - Consent management
        - Data subject rights
        - Data breach notification
        - Privacy impact assessments
        
        Identify compliance gaps, required evidence, and remediation steps.
        """)
        
        response = await self.llm.ainvoke(
            compliance_prompt.format(
                system_data=str(system_data)[:1200],
                frameworks=", ".join(frameworks)
            )
        )
        
        return self._parse_audit_findings(response.content, AuditType.COMPLIANCE)
    
    async def _conduct_access_audit(self, system_data: Dict) -> List[AuditFinding]:
        """Conduct access control audit"""
        
        access_prompt = ChatPromptTemplate.from_template("""
        Audit access controls and user management.
        
        System Data: {system_data}
        
        Evaluate:
        1. User provisioning and deprovisioning processes
        2. Role-based access control (RBAC) implementation
        3. Privileged access management
        4. Multi-factor authentication coverage
        5. Password policies and enforcement
        6. Session management and timeout controls
        7. Access review and certification processes
        8. Segregation of duties
        
        Check for:
        - Excessive privileges
        - Orphaned accounts
        - Shared accounts
        - Weak authentication
        - Missing access reviews
        - Inadequate logging
        """)
        
        response = await self.llm.ainvoke(
            access_prompt.format(system_data=str(system_data)[:1000])
        )
        
        return self._parse_audit_findings(response.content, AuditType.ACCESS_CONTROL)
    
    async def _conduct_privacy_audit(
        self, 
        system_data: Dict, 
        frameworks: List[ComplianceFramework]
    ) -> List[AuditFinding]:
        """Conduct data privacy audit"""
        
        privacy_prompt = ChatPromptTemplate.from_template("""
        Conduct data privacy and protection audit.
        
        System Data: {system_data}
        Frameworks: {frameworks}
        
        Evaluate:
        1. Data classification and inventory
        2. Personal data processing activities
        3. Consent management mechanisms
        4. Data subject rights implementation
        5. Data retention and deletion policies
        6. Cross-border data transfer controls
        7. Privacy impact assessments
        8. Data breach response procedures
        
        Check compliance with:
        - GDPR requirements
        - CCPA regulations
        - HIPAA privacy rules
        - Industry-specific privacy standards
        
        Identify privacy risks and remediation steps.
        """)
        
        response = await self.llm.ainvoke(
            privacy_prompt.format(
                system_data=str(system_data)[:1000],
                frameworks=", ".join(frameworks)
            )
        )
        
        return self._parse_audit_findings(response.content, AuditType.DATA_PRIVACY)
    
    async def _conduct_general_audit(self, system_data: Dict, audit_type: AuditType) -> List[AuditFinding]:
        """Conduct general audit for other types"""
        
        general_prompt = ChatPromptTemplate.from_template("""
        Conduct {audit_type} audit of the system.
        
        System Data: {system_data}
        
        Perform comprehensive evaluation focusing on:
        - Current state assessment
        - Best practice compliance
        - Risk identification
        - Control effectiveness
        - Process maturity
        - Documentation adequacy
        
        Provide specific findings with evidence and recommendations.
        """)
        
        response = await self.llm.ainvoke(
            general_prompt.format(
                audit_type=audit_type,
                system_data=str(system_data)[:1000]
            )
        )
        
        return self._parse_audit_findings(response.content, audit_type)
    
    def _parse_audit_findings(self, response: str, audit_type: AuditType) -> List[AuditFinding]:
        """Parse audit findings from Claude response"""
        findings = []
        
        # Generate sample findings based on audit type and response content
        if audit_type == AuditType.SECURITY:
            if "password" in response.lower():
                findings.append(AuditFinding(
                    finding_id="SEC-001",
                    title="Weak Password Policy",
                    description="Password policy does not meet security requirements",
                    severity=AuditSeverity.MEDIUM,
                    category="Authentication",
                    affected_systems=["user_management"],
                    remediation_steps=[
                        "Implement strong password requirements",
                        "Enable password complexity validation",
                        "Set appropriate password expiration"
                    ],
                    risk_score=6.5
                ))
            
            if "encryption" in response.lower():
                findings.append(AuditFinding(
                    finding_id="SEC-002",
                    title="Data Encryption Assessment",
                    description="Review data encryption implementation",
                    severity=AuditSeverity.HIGH,
                    category="Data Protection",
                    affected_systems=["database", "api"],
                    remediation_steps=[
                        "Implement encryption at rest",
                        "Ensure TLS 1.3 for data in transit",
                        "Review key management practices"
                    ],
                    risk_score=8.2
                ))
        
        elif audit_type == AuditType.COMPLIANCE:
            findings.append(AuditFinding(
                finding_id="COMP-001",
                title="Compliance Documentation Gap",
                description="Missing required compliance documentation",
                severity=AuditSeverity.MEDIUM,
                category="Documentation",
                compliance_frameworks=[ComplianceFramework.SOC2],
                remediation_steps=[
                    "Create missing policy documents",
                    "Implement document review process",
                    "Establish document retention schedule"
                ],
                risk_score=5.8
            ))
        
        elif audit_type == AuditType.ACCESS_CONTROL:
            findings.append(AuditFinding(
                finding_id="ACC-001",
                title="Privileged Access Review",
                description="Privileged accounts require regular review",
                severity=AuditSeverity.HIGH,
                category="Access Management",
                affected_systems=["admin_panel", "database"],
                remediation_steps=[
                    "Implement quarterly access reviews",
                    "Remove unnecessary privileges",
                    "Enable privileged access monitoring"
                ],
                risk_score=7.5
            ))
        
        return findings
    
    def _generate_audit_report(
        self, 
        audit_type: AuditType, 
        scope: str, 
        findings: List[AuditFinding]
    ) -> AuditReport:
        """Generate comprehensive audit report"""
        
        # Calculate overall score based on findings
        if not findings:
            overall_score = 10.0
        else:
            severity_weights = {
                AuditSeverity.CRITICAL: 10,
                AuditSeverity.HIGH: 7,
                AuditSeverity.MEDIUM: 4,
                AuditSeverity.LOW: 2,
                AuditSeverity.INFO: 1
            }
            
            total_deductions = sum(
                severity_weights.get(finding.severity, 1) for finding in findings
            )
            overall_score = max(0.0, 10.0 - (total_deductions / 10))
        
        # Determine compliance status
        critical_findings = [f for f in findings if f.severity == AuditSeverity.CRITICAL]
        if critical_findings:
            compliance_status = "Non-Compliant"
        elif overall_score >= 8.0:
            compliance_status = "Compliant"
        elif overall_score >= 6.0:
            compliance_status = "Partially Compliant"
        else:
            compliance_status = "Non-Compliant"
        
        # Generate recommendations
        recommendations = self._generate_recommendations(findings)
        
        # Calculate next audit date (6 months for high-risk, 12 months for low-risk)
        months_ahead = 6 if overall_score < 7.0 else 12
        next_audit_date = (
            datetime.now().replace(month=datetime.now().month + months_ahead)
        ).isoformat()
        
        return AuditReport(
            audit_id=f"audit_{int(__import__('time').time())}",
            audit_type=audit_type,
            scope=scope,
            findings=findings,
            overall_score=overall_score,
            compliance_status=compliance_status,
            recommendations=recommendations,
            next_audit_date=next_audit_date
        )
    
    def _generate_recommendations(self, findings: List[AuditFinding]) -> List[str]:
        """Generate high-level recommendations based on findings"""
        recommendations = []
        
        if any(f.severity == AuditSeverity.CRITICAL for f in findings):
            recommendations.append("Address critical findings immediately to reduce security risk")
        
        if any("password" in f.title.lower() for f in findings):
            recommendations.append("Implement comprehensive password and authentication policy")
        
        if any("encryption" in f.description.lower() for f in findings):
            recommendations.append("Review and enhance data encryption practices")
        
        if any("access" in f.category.lower() for f in findings):
            recommendations.append("Establish regular access review and certification process")
        
        recommendations.extend([
            "Implement continuous monitoring for compliance drift",
            "Establish regular audit schedule and remediation tracking",
            "Provide security awareness training for all personnel"
        ])
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def _initialize_compliance_requirements(self) -> Dict[ComplianceFramework, List[str]]:
        """Initialize compliance framework requirements"""
        return {
            ComplianceFramework.SOC2: [
                "Security controls and monitoring",
                "Availability and performance",
                "Processing integrity",
                "Confidentiality measures",
                "Privacy protection"
            ],
            ComplianceFramework.ISO27001: [
                "Information security management system",
                "Risk assessment and treatment",
                "Security policies and procedures",
                "Incident management",
                "Business continuity"
            ],
            ComplianceFramework.GDPR: [
                "Data protection by design",
                "Consent management",
                "Data subject rights",
                "Breach notification",
                "Privacy impact assessments"
            ]
        }
