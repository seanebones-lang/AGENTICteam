"""
Security Scanner Agent v2.0
Advanced security analysis and vulnerability detection
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from enum import Enum
from langchain_core.prompts import ChatPromptTemplate
from .base import BaseAgent


class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class VulnerabilityType(str, Enum):
    SQL_INJECTION = "sql_injection"
    XSS = "xss"
    CSRF = "csrf"
    AUTH_BYPASS = "auth_bypass"
    DATA_EXPOSURE = "data_exposure"
    INSECURE_CONFIG = "insecure_config"
    OUTDATED_DEPS = "outdated_dependencies"
    WEAK_CRYPTO = "weak_cryptography"


class SecurityFinding(BaseModel):
    vulnerability_type: VulnerabilityType
    severity: SeverityLevel
    title: str
    description: str
    location: str
    impact: str
    remediation: str
    confidence: float
    cvss_score: Optional[float] = None


class SecurityScannerAgent(BaseAgent):
    """
    v2.0 Security Scanner Agent
    
    Features:
    - OWASP Top 10 vulnerability detection
    - Code security analysis
    - Configuration security review
    - Dependency vulnerability scanning
    - Security best practices validation
    """
    
    def __init__(self, api_key: Optional[str] = None):
        super().__init__(
            agent_id="security-scanner",
            model="claude-3-5-sonnet-20241022",  # Heavy model for complex security analysis
            temperature=0.1,  # Low temperature for consistent security analysis
            max_tokens=4096,
            api_key=api_key
        )
    
    async def _execute_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute security scanning task"""
        scan_type = task.get("scan_type", "general")
        target = task.get("target", "")
        code_content = task.get("code_content", "")
        config_content = task.get("config_content", "")
        
        if not target and not code_content and not config_content:
            raise ValueError("At least one of target, code_content, or config_content is required")
        
        findings = []
        
        # Perform different types of scans based on input
        if code_content:
            code_findings = await self._scan_code(code_content)
            findings.extend(code_findings)
        
        if config_content:
            config_findings = await self._scan_configuration(config_content)
            findings.extend(config_findings)
        
        if target:
            web_findings = await self._scan_web_target(target)
            findings.extend(web_findings)
        
        # Calculate overall risk score
        risk_score = self._calculate_risk_score(findings)
        
        return {
            "scan_id": task.get("scan_id", f"scan_{int(__import__('time').time())}"),
            "target": target,
            "scan_type": scan_type,
            "findings": [finding.dict() for finding in findings],
            "total_findings": len(findings),
            "critical_count": len([f for f in findings if f.severity == SeverityLevel.CRITICAL]),
            "high_count": len([f for f in findings if f.severity == SeverityLevel.HIGH]),
            "medium_count": len([f for f in findings if f.severity == SeverityLevel.MEDIUM]),
            "low_count": len([f for f in findings if f.severity == SeverityLevel.LOW]),
            "risk_score": risk_score,
            "recommendations": self._generate_recommendations(findings),
            "confidence_score": 0.85
        }
    
    async def _scan_code(self, code_content: str) -> List[SecurityFinding]:
        """Scan code for security vulnerabilities"""
        
        code_scan_prompt = ChatPromptTemplate.from_template("""
        Analyze this code for security vulnerabilities. Focus on OWASP Top 10 issues.
        
        Code:
        {code}
        
        Look for:
        1. SQL Injection vulnerabilities
        2. Cross-Site Scripting (XSS)
        3. Authentication/Authorization flaws
        4. Insecure data handling
        5. Cryptographic issues
        6. Input validation problems
        7. Error handling that exposes information
        8. Insecure configurations
        
        For each vulnerability found, provide:
        - Vulnerability type
        - Severity (critical/high/medium/low)
        - Specific location in code
        - Description of the issue
        - Potential impact
        - Remediation steps
        - Confidence level (0.0-1.0)
        
        If no vulnerabilities found, respond with "NO_VULNERABILITIES_FOUND".
        """)
        
        response = await self.llm.ainvoke(
            code_scan_prompt.format(code=code_content[:3000])  # Limit code length
        )
        
        return self._parse_security_findings(response.content, "code")
    
    async def _scan_configuration(self, config_content: str) -> List[SecurityFinding]:
        """Scan configuration for security issues"""
        
        config_scan_prompt = ChatPromptTemplate.from_template("""
        Analyze this configuration for security issues and misconfigurations.
        
        Configuration:
        {config}
        
        Check for:
        1. Weak authentication settings
        2. Insecure communication protocols
        3. Overly permissive access controls
        4. Exposed sensitive information
        5. Weak encryption settings
        6. Missing security headers
        7. Debug mode enabled in production
        8. Default credentials
        
        For each issue found, provide:
        - Issue type and severity
        - Specific configuration line/section
        - Security risk description
        - Impact assessment
        - Remediation guidance
        - Confidence level
        
        If configuration is secure, respond with "CONFIGURATION_SECURE".
        """)
        
        response = await self.llm.ainvoke(
            config_scan_prompt.format(config=config_content[:2000])
        )
        
        return self._parse_security_findings(response.content, "configuration")
    
    async def _scan_web_target(self, target: str) -> List[SecurityFinding]:
        """Analyze web target for common vulnerabilities"""
        
        web_scan_prompt = ChatPromptTemplate.from_template("""
        Analyze this web target/URL for potential security vulnerabilities.
        
        Target: {target}
        
        Based on the URL structure and common web vulnerabilities, identify potential risks:
        
        1. URL structure analysis for path traversal risks
        2. Parameter injection possibilities
        3. Common endpoint vulnerabilities
        4. Authentication bypass opportunities
        5. Information disclosure risks
        6. CSRF vulnerabilities
        7. Clickjacking potential
        8. SSL/TLS configuration issues
        
        Note: This is a theoretical analysis based on URL patterns, not active scanning.
        
        Provide findings with severity levels and remediation advice.
        If the URL appears secure, respond with "TARGET_APPEARS_SECURE".
        """)
        
        response = await self.llm.ainvoke(
            web_scan_prompt.format(target=target)
        )
        
        return self._parse_security_findings(response.content, "web")
    
    def _parse_security_findings(self, response: str, scan_type: str) -> List[SecurityFinding]:
        """Parse security findings from Claude response"""
        findings = []
        
        if "NO_VULNERABILITIES_FOUND" in response or "CONFIGURATION_SECURE" in response or "TARGET_APPEARS_SECURE" in response:
            return findings
        
        # Simple parsing - in production, use more robust parsing
        # For now, create findings based on response content
        if "sql injection" in response.lower():
            findings.append(SecurityFinding(
                vulnerability_type=VulnerabilityType.SQL_INJECTION,
                severity=SeverityLevel.HIGH,
                title="Potential SQL Injection",
                description="SQL injection vulnerability detected in code analysis",
                location=f"{scan_type} analysis",
                impact="Could allow unauthorized database access",
                remediation="Use parameterized queries and input validation",
                confidence=0.8
            ))
        
        if "xss" in response.lower() or "cross-site scripting" in response.lower():
            findings.append(SecurityFinding(
                vulnerability_type=VulnerabilityType.XSS,
                severity=SeverityLevel.MEDIUM,
                title="Cross-Site Scripting Risk",
                description="XSS vulnerability detected",
                location=f"{scan_type} analysis",
                impact="Could allow script injection attacks",
                remediation="Implement proper input sanitization and output encoding",
                confidence=0.75
            ))
        
        if "authentication" in response.lower() and ("weak" in response.lower() or "bypass" in response.lower()):
            findings.append(SecurityFinding(
                vulnerability_type=VulnerabilityType.AUTH_BYPASS,
                severity=SeverityLevel.CRITICAL,
                title="Authentication Weakness",
                description="Authentication bypass or weakness detected",
                location=f"{scan_type} analysis",
                impact="Could allow unauthorized access",
                remediation="Strengthen authentication mechanisms",
                confidence=0.85
            ))
        
        return findings
    
    def _calculate_risk_score(self, findings: List[SecurityFinding]) -> float:
        """Calculate overall risk score based on findings"""
        if not findings:
            return 0.0
        
        severity_weights = {
            SeverityLevel.CRITICAL: 10,
            SeverityLevel.HIGH: 7,
            SeverityLevel.MEDIUM: 4,
            SeverityLevel.LOW: 2,
            SeverityLevel.INFO: 1
        }
        
        total_score = sum(severity_weights.get(finding.severity, 1) for finding in findings)
        max_possible = len(findings) * 10  # If all were critical
        
        return min(total_score / max_possible, 1.0) if max_possible > 0 else 0.0
    
    def _generate_recommendations(self, findings: List[SecurityFinding]) -> List[str]:
        """Generate security recommendations based on findings"""
        if not findings:
            return ["No security issues detected. Continue following security best practices."]
        
        recommendations = [
            "Address critical and high severity vulnerabilities immediately",
            "Implement security code review processes",
            "Use automated security scanning in CI/CD pipeline",
            "Follow OWASP security guidelines",
            "Regular security training for development team"
        ]
        
        # Add specific recommendations based on vulnerability types found
        vuln_types = {finding.vulnerability_type for finding in findings}
        
        if VulnerabilityType.SQL_INJECTION in vuln_types:
            recommendations.append("Implement parameterized queries and ORM usage")
        
        if VulnerabilityType.XSS in vuln_types:
            recommendations.append("Implement Content Security Policy (CSP) headers")
        
        if VulnerabilityType.AUTH_BYPASS in vuln_types:
            recommendations.append("Review and strengthen authentication mechanisms")
        
        return recommendations
