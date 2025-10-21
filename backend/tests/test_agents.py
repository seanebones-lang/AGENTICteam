#!/usr/bin/env python3
"""
Comprehensive test suite for AI agents
Tests all 10 agent implementations for functionality and reliability
"""

import pytest
import asyncio
import json
from datetime import datetime
from unittest.mock import Mock, patch, AsyncMock

# Import all agent classes
from agents.packages.security_scanner import SecurityScannerAgent
from agents.packages.ticket_resolver import TicketResolverAgent
from agents.packages.knowledge_base import KnowledgeBaseAgent
from agents.packages.incident_responder import IncidentResponderAgent
from agents.packages.data_processor import DataProcessorAgent
from agents.packages.deployment_agent import DeploymentAgent
from agents.packages.audit_agent import AuditAgent
from agents.packages.report_generator import ReportGeneratorAgent
from agents.packages.workflow_orchestrator import WorkflowOrchestratorAgent
from agents.packages.escalation_manager import EscalationManagerAgent

class TestSecurityScannerAgent:
    """Test suite for Security Scanner Agent"""
    
    @pytest.fixture
    def agent(self):
        return SecurityScannerAgent()
    
    def test_agent_initialization(self, agent):
        """Test agent initializes correctly"""
        assert agent.name == "Security Scanner"
        assert agent.version == "1.0.0"
        assert "vulnerability scanning" in agent.description.lower()
        assert agent.llm is not None
    
    @pytest.mark.asyncio
    async def test_scan_basic_functionality(self, agent):
        """Test basic scanning functionality"""
        target = "example.com"
        result = await agent.scan(target)
        
        assert isinstance(result, dict)
        assert "scan_id" in result
        assert "target" in result
        assert result["target"] == target
        assert "vulnerabilities" in result
        assert "summary" in result
        assert isinstance(result["vulnerabilities"], list)
    
    @pytest.mark.asyncio
    async def test_scan_with_options(self, agent):
        """Test scanning with custom options"""
        target = "test.example.com"
        options = {
            "scan_type": "comprehensive",
            "include_ssl": True,
            "check_headers": True
        }
        
        result = await agent.scan(target, options)
        
        assert result["target"] == target
        assert "scan_type" in result["metadata"]
        assert result["metadata"]["scan_type"] == "comprehensive"
    
    @pytest.mark.asyncio
    async def test_scan_invalid_target(self, agent):
        """Test scanning with invalid target"""
        with pytest.raises(ValueError):
            await agent.scan("")
        
        with pytest.raises(ValueError):
            await agent.scan(None)
    
    def test_agent_capabilities(self, agent):
        """Test agent capabilities are properly defined"""
        capabilities = agent.get_capabilities()
        
        assert isinstance(capabilities, list)
        assert len(capabilities) > 0
        assert any("vulnerability" in cap.lower() for cap in capabilities)

class TestTicketResolverAgent:
    """Test suite for Ticket Resolver Agent"""
    
    @pytest.fixture
    def agent(self):
        return TicketResolverAgent()
    
    def test_agent_initialization(self, agent):
        """Test agent initializes correctly"""
        assert agent.name == "Ticket Resolver"
        assert agent.version == "1.0.0"
        assert "ticket resolution" in agent.description.lower()
    
    @pytest.mark.asyncio
    async def test_resolve_ticket_basic(self, agent):
        """Test basic ticket resolution"""
        ticket_data = {
            "id": "TICKET-123",
            "title": "Login issues",
            "description": "Users cannot log in to the system",
            "priority": "high",
            "category": "authentication"
        }
        
        result = await agent.resolve(ticket_data)
        
        assert isinstance(result, dict)
        assert "ticket_id" in result
        assert "resolution" in result
        assert "confidence_score" in result
        assert "steps" in result
        assert isinstance(result["steps"], list)
    
    @pytest.mark.asyncio
    async def test_resolve_ticket_with_context(self, agent):
        """Test ticket resolution with additional context"""
        ticket_data = {
            "id": "TICKET-456",
            "title": "Database connection error",
            "description": "Application cannot connect to database",
            "priority": "critical",
            "category": "database",
            "logs": ["Connection timeout", "Failed to authenticate"]
        }
        
        result = await agent.resolve(ticket_data)
        
        assert result["ticket_id"] == "TICKET-456"
        assert result["confidence_score"] > 0.5
        assert len(result["steps"]) > 0

class TestKnowledgeBaseAgent:
    """Test suite for Knowledge Base Agent"""
    
    @pytest.fixture
    def agent(self):
        return KnowledgeBaseAgent()
    
    @pytest.mark.asyncio
    async def test_query_knowledge_base(self, agent):
        """Test knowledge base querying"""
        query = "How to reset user password?"
        
        result = await agent.query(query)
        
        assert isinstance(result, dict)
        assert "query" in result
        assert "results" in result
        assert "confidence" in result
        assert isinstance(result["results"], list)
    
    @pytest.mark.asyncio
    async def test_add_knowledge_entry(self, agent):
        """Test adding knowledge entries"""
        entry = {
            "title": "Password Reset Procedure",
            "content": "Step-by-step guide for password reset",
            "tags": ["password", "security", "user-management"]
        }
        
        result = await agent.add_entry(entry)
        
        assert isinstance(result, dict)
        assert "entry_id" in result
        assert "status" in result
        assert result["status"] == "success"

class TestIncidentResponderAgent:
    """Test suite for Incident Responder Agent"""
    
    @pytest.fixture
    def agent(self):
        return IncidentResponderAgent()
    
    @pytest.mark.asyncio
    async def test_respond_to_incident(self, agent):
        """Test incident response functionality"""
        incident = {
            "id": "INC-001",
            "type": "security_breach",
            "severity": "high",
            "description": "Unauthorized access detected",
            "affected_systems": ["web-server", "database"]
        }
        
        result = await agent.respond(incident)
        
        assert isinstance(result, dict)
        assert "incident_id" in result
        assert "response_plan" in result
        assert "immediate_actions" in result
        assert "timeline" in result
        assert isinstance(result["immediate_actions"], list)

class TestDataProcessorAgent:
    """Test suite for Data Processor Agent"""
    
    @pytest.fixture
    def agent(self):
        return DataProcessorAgent()
    
    @pytest.mark.asyncio
    async def test_process_data_basic(self, agent):
        """Test basic data processing"""
        job = {
            "job_id": "job-123",
            "data_source": "csv",
            "operations": ["clean", "validate", "transform"],
            "output_format": "json"
        }
        
        result = await agent.process(job)
        
        assert isinstance(result, dict)
        assert "job_id" in result
        assert "status" in result
        assert "processed_records" in result
        assert "errors" in result
        assert isinstance(result["errors"], list)
    
    @pytest.mark.asyncio
    async def test_process_data_with_validation(self, agent):
        """Test data processing with validation rules"""
        job = {
            "job_id": "job-456",
            "data_source": "database",
            "operations": ["validate", "enrich"],
            "validation_rules": {
                "email": "email_format",
                "phone": "phone_format"
            }
        }
        
        result = await agent.process(job)
        
        assert result["job_id"] == "job-456"
        assert "validation_summary" in result

class TestDeploymentAgent:
    """Test suite for Deployment Agent"""
    
    @pytest.fixture
    def agent(self):
        return DeploymentAgent()
    
    @pytest.mark.asyncio
    async def test_deploy_application(self, agent):
        """Test application deployment"""
        config = {
            "app_name": "test-app",
            "version": "1.0.0",
            "environment": "staging",
            "replicas": 2,
            "resources": {
                "cpu": "500m",
                "memory": "512Mi"
            }
        }
        
        result = await agent.deploy(config)
        
        assert isinstance(result, dict)
        assert "deployment_id" in result
        assert "status" in result
        assert "app_name" in result
        assert result["app_name"] == "test-app"

class TestAuditAgent:
    """Test suite for Audit Agent"""
    
    @pytest.fixture
    def agent(self):
        return AuditAgent()
    
    @pytest.mark.asyncio
    async def test_audit_system(self, agent):
        """Test system auditing"""
        audit_config = {
            "scope": "security",
            "frameworks": ["SOC2", "ISO27001"],
            "systems": ["authentication", "authorization", "logging"]
        }
        
        result = await agent.audit(audit_config)
        
        assert isinstance(result, dict)
        assert "audit_id" in result
        assert "compliance_score" in result
        assert "findings" in result
        assert "recommendations" in result
        assert isinstance(result["findings"], list)

class TestReportGeneratorAgent:
    """Test suite for Report Generator Agent"""
    
    @pytest.fixture
    def agent(self):
        return ReportGeneratorAgent()
    
    @pytest.mark.asyncio
    async def test_generate_report(self, agent):
        """Test report generation"""
        report_config = {
            "type": "security_summary",
            "period": "monthly",
            "data_sources": ["security_logs", "vulnerability_scans"],
            "format": "pdf"
        }
        
        result = await agent.generate_report(report_config)
        
        assert isinstance(result, dict)
        assert "report_id" in result
        assert "status" in result
        assert "report_url" in result
        assert "metadata" in result

class TestWorkflowOrchestratorAgent:
    """Test suite for Workflow Orchestrator Agent"""
    
    @pytest.fixture
    def agent(self):
        return WorkflowOrchestratorAgent()
    
    @pytest.mark.asyncio
    async def test_orchestrate_workflow(self, agent):
        """Test workflow orchestration"""
        workflow = {
            "name": "incident_response",
            "steps": [
                {"action": "detect", "agent": "security_scanner"},
                {"action": "analyze", "agent": "incident_responder"},
                {"action": "notify", "agent": "escalation_manager"}
            ],
            "triggers": ["security_alert"]
        }
        
        result = await agent.orchestrate(workflow)
        
        assert isinstance(result, dict)
        assert "workflow_id" in result
        assert "status" in result
        assert "execution_plan" in result
        assert isinstance(result["execution_plan"], list)

class TestEscalationManagerAgent:
    """Test suite for Escalation Manager Agent"""
    
    @pytest.fixture
    def agent(self):
        return EscalationManagerAgent()
    
    @pytest.mark.asyncio
    async def test_escalate_issue(self, agent):
        """Test issue escalation"""
        escalation_data = {
            "issue_id": "ISS-789",
            "severity": "high",
            "category": "security",
            "description": "Multiple failed login attempts detected",
            "current_assignee": "tier1_support"
        }
        
        result = await agent.escalate(escalation_data)
        
        assert isinstance(result, dict)
        assert "escalation_id" in result
        assert "new_assignee" in result
        assert "escalation_reason" in result
        assert "timeline" in result

class TestAgentIntegration:
    """Integration tests for agent interactions"""
    
    @pytest.mark.asyncio
    async def test_security_incident_workflow(self):
        """Test complete security incident workflow"""
        # Initialize agents
        scanner = SecurityScannerAgent()
        responder = IncidentResponderAgent()
        escalator = EscalationManagerAgent()
        
        # Step 1: Scan for vulnerabilities
        scan_result = await scanner.scan("vulnerable-system.com")
        assert len(scan_result["vulnerabilities"]) > 0
        
        # Step 2: Create incident from scan results
        incident = {
            "id": "INC-SECURITY-001",
            "type": "vulnerability_detected",
            "severity": "high",
            "description": f"Vulnerabilities found: {len(scan_result['vulnerabilities'])}",
            "source": "security_scan"
        }
        
        response = await responder.respond(incident)
        assert response["incident_id"] == incident["id"]
        
        # Step 3: Escalate if high severity
        if incident["severity"] == "high":
            escalation = await escalator.escalate({
                "issue_id": incident["id"],
                "severity": incident["severity"],
                "category": "security",
                "description": incident["description"]
            })
            assert "escalation_id" in escalation
    
    @pytest.mark.asyncio
    async def test_data_processing_pipeline(self):
        """Test data processing pipeline"""
        processor = DataProcessorAgent()
        auditor = AuditAgent()
        reporter = ReportGeneratorAgent()
        
        # Step 1: Process data
        job = {
            "job_id": "data-pipeline-001",
            "data_source": "user_logs",
            "operations": ["clean", "validate", "anonymize"]
        }
        
        process_result = await processor.process(job)
        assert process_result["status"] == "completed"
        
        # Step 2: Audit processed data
        audit_result = await auditor.audit({
            "scope": "data_privacy",
            "target": job["job_id"]
        })
        assert "compliance_score" in audit_result
        
        # Step 3: Generate compliance report
        report_result = await reporter.generate_report({
            "type": "data_processing_audit",
            "source_job": job["job_id"],
            "audit_id": audit_result["audit_id"]
        })
        assert report_result["status"] == "generated"

# Performance and load testing
class TestAgentPerformance:
    """Performance tests for agents"""
    
    @pytest.mark.asyncio
    async def test_concurrent_agent_execution(self):
        """Test multiple agents running concurrently"""
        agents = [
            SecurityScannerAgent(),
            TicketResolverAgent(),
            KnowledgeBaseAgent()
        ]
        
        # Create concurrent tasks
        tasks = []
        for i, agent in enumerate(agents):
            if isinstance(agent, SecurityScannerAgent):
                task = agent.scan(f"test{i}.example.com")
            elif isinstance(agent, TicketResolverAgent):
                task = agent.resolve({"id": f"TICKET-{i}", "title": f"Test ticket {i}"})
            elif isinstance(agent, KnowledgeBaseAgent):
                task = agent.query(f"Test query {i}")
            tasks.append(task)
        
        # Execute concurrently
        start_time = datetime.now()
        results = await asyncio.gather(*tasks)
        end_time = datetime.now()
        
        # Verify all completed successfully
        assert len(results) == len(agents)
        for result in results:
            assert isinstance(result, dict)
        
        # Performance check (should complete within reasonable time)
        execution_time = (end_time - start_time).total_seconds()
        assert execution_time < 10.0  # Should complete within 10 seconds
    
    @pytest.mark.asyncio
    async def test_agent_memory_usage(self):
        """Test agent memory usage stays reasonable"""
        import psutil
        import os
        
        process = psutil.Process(os.getpid())
        initial_memory = process.memory_info().rss / 1024 / 1024  # MB
        
        # Create and use multiple agents
        agents = []
        for _ in range(10):
            agents.extend([
                SecurityScannerAgent(),
                TicketResolverAgent(),
                DataProcessorAgent()
            ])
        
        # Execute some operations
        for i, agent in enumerate(agents[:5]):  # Test subset to avoid timeout
            if isinstance(agent, SecurityScannerAgent):
                await agent.scan(f"test{i}.com")
            elif isinstance(agent, TicketResolverAgent):
                await agent.resolve({"id": f"T-{i}", "title": "Test"})
            elif isinstance(agent, DataProcessorAgent):
                await agent.process({"job_id": f"job-{i}"})
        
        final_memory = process.memory_info().rss / 1024 / 1024  # MB
        memory_increase = final_memory - initial_memory
        
        # Memory increase should be reasonable (less than 100MB for this test)
        assert memory_increase < 100, f"Memory usage increased by {memory_increase:.2f}MB"

if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "--tb=short"])
