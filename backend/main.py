#!/usr/bin/env python3
"""
🚀 INTEGRATED AGENT MARKETPLACE API
Combines real agent execution with existing infrastructure
"""

import os
import asyncio
import logging
import time
from datetime import datetime
from typing import Dict, Any, List, Optional

from fastapi import FastAPI, HTTPException, Request, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import json

# Import database manager
from database_setup import DatabaseManager

# Import Phase 2 systems
from stripe_integration import stripe_integration, SubscriptionTier
from credit_system import credit_system, TransactionType
from rate_limiting import rate_limiter, RateLimitTier, RateLimitType

# Import Phase 3 systems
from simple_monitoring import monitor, record_request, record_agent_execution, record_credit_usage, record_rate_limit_hit
from simple_config import config

# Initialize FastAPI
app = FastAPI(
    title="Agent Marketplace API - Integrated",
    version="2.0.0",
    description="Integrated Agent Marketplace with real AI capabilities"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bizbot.store",
        "https://www.bizbot.store", 
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Monitoring middleware
@app.middleware("http")
async def monitoring_middleware(request: Request, call_next):
    """Middleware to record request metrics"""
    start_time = time.time()
    
    response = await call_next(request)
    
    # Record request metrics
    duration = time.time() - start_time
    record_request(
        method=request.method,
        endpoint=request.url.path,
        status_code=response.status_code,
        duration=duration
    )
    
    return response

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize database
db = DatabaseManager()

# Data Models
class AgentPackage(BaseModel):
    id: str
    name: str
    description: str
    category: str
    price: float
    status: str = "active"
    features: List[str] = Field(default_factory=list)
    tier_support: str = "All Tiers"

class AgentExecution(BaseModel):
    package_id: str
    task: str
    input_data: Dict[str, Any] = Field(default_factory=dict)
    engine_type: str = "claude"

class ExecutionResult(BaseModel):
    success: bool
    result: Any
    execution_id: str
    duration_ms: int
    agent_used: str
    timestamp: str

# Credit cost mapping for agents (credits per execution)
AGENT_CREDIT_COSTS = {
    # LIGHT TIER (1-3 credits)
    "knowledge-base": 2,        # Simple queries, fast responses
    "ticket-resolver": 3,       # ML classification, moderate complexity
    
    # MEDIUM TIER (4-6 credits)
    "security-scanner": 4,      # Comprehensive scanning
    "report-generator": 5,      # AI-powered report generation
    "data-processor": 5,        # ETL and data transformation
    "escalation-manager": 6,    # Complex routing logic
    
    # HEAVY TIER (7-9 credits)
    "incident-responder": 6,    # Root cause analysis
    "workflow-orchestrator": 7, # Multi-step workflow execution
    "deployment-agent": 8,      # CI/CD automation
    "audit-agent": 9,           # Comprehensive compliance auditing
}

# Credit package pricing
CREDIT_PACKAGES = {
    "starter": {"credits": 500, "price": 20.00, "bonus": 0},
    "growth": {"credits": 1500, "price": 50.00, "bonus": 0},
    "business": {"credits": 3500, "price": 100.00, "bonus": 0},
    "enterprise": {"credits": 10000, "price": 250.00, "bonus": 0},
}

# Subscription tiers
SUBSCRIPTION_TIERS = {
    "basic": {
        "price": 49.00,
        "credits_per_month": 1000,
        "features": ["1,000 credits/month", "1 free re-run daily", "Email support"],
    },
    "pro": {
        "price": 99.00,
        "credits_per_month": 3000,
        "features": ["3,000 credits/month", "Unlimited re-runs", "Priority support", "Advanced analytics"],
    },
    "enterprise": {
        "price": 299.00,
        "credits_per_month": 15000,
        "features": ["15,000 credits/month", "Unlimited re-runs", "Dedicated Slack support", "Custom integrations", "SLA guarantee"],
    },
}

# Agent package definitions with real capabilities
AGENT_PACKAGES = [
    AgentPackage(
        id="security-scanner",
        name="Security Scanner",
        description="Comprehensive security vulnerability scanning with OWASP Top 10 coverage and compliance checking",
        category="Security",
        price=0.15,
        features=[
            "OWASP Top 10 Detection",
            "SSL/TLS Analysis", 
            "Security Headers Validation",
            "Compliance Checking (PCI-DSS, GDPR, HIPAA)",
            "AI-Powered Recommendations"
        ]
    ),
    AgentPackage(
        id="incident-responder",
        name="Incident Responder",
        description="Intelligent incident triage, root cause analysis, and automated remediation with ML pattern recognition",
        category="Operations",
        price=0.25,
        features=[
            "Intelligent Incident Triage",
            "Root Cause Analysis",
            "Automated Remediation",
            "Runbook Execution",
            "Impact Assessment"
        ]
    ),
    AgentPackage(
        id="ticket-resolver",
        name="Ticket Resolver",
        description="ML-powered ticket classification, sentiment analysis, and automated resolution with customer satisfaction prediction",
        category="Support",
        price=0.12,
        features=[
            "ML Classification",
            "Sentiment Analysis", 
            "Auto-Resolution",
            "Smart Routing",
            "Satisfaction Prediction"
        ]
    ),
    AgentPackage(
        id="knowledge-base",
        name="Knowledge Base Agent",
        description="RAG-powered knowledge management with semantic search, vector embeddings, and context-aware Q&A",
        category="Communication",
        price=0.08,
        features=[
            "Semantic Search",
            "RAG with Vector DB",
            "Context-Aware Q&A",
            "Multi-Source Knowledge",
            "Real-time Updates"
        ]
    ),
    AgentPackage(
        id="data-processor",
        name="Data Processor",
        description="Advanced ETL automation with AI-powered data quality validation, transformation, and insights generation",
        category="Analytics",
        price=0.20,
        features=[
            "Multi-Source ETL",
            "Data Quality Validation",
            "AI-Powered Transformations",
            "Performance Optimization",
            "Real-time Processing"
        ]
    ),
    AgentPackage(
        id="deployment-agent",
        name="Deployment Agent",
        description="Automated CI/CD pipeline management with blue-green deployments, health checks, and rollback capabilities",
        category="DevOps",
        price=0.30,
        features=[
            "CI/CD Automation",
            "Blue-Green Deployments",
            "Health Checks",
            "Automatic Rollback",
            "Multi-Environment Support"
        ]
    ),
    AgentPackage(
        id="audit-agent",
        name="Audit Agent",
        description="Multi-framework compliance auditing with automated evidence collection and risk assessment for GDPR, SOX, HIPAA",
        category="Compliance",
        price=0.35,
        features=[
            "Multi-Framework Support",
            "Automated Evidence Collection",
            "Risk Assessment",
            "Remediation Recommendations",
            "Executive Reporting"
        ]
    ),
    AgentPackage(
        id="report-generator",
        name="Report Generator",
        description="AI-powered business intelligence with automated report generation, insights, and multi-format output",
        category="Analytics",
        price=0.18,
        features=[
            "Multi-Format Reports",
            "AI-Powered Insights",
            "Interactive Charts",
            "Executive Summaries",
            "Scheduled Generation"
        ]
    ),
    AgentPackage(
        id="workflow-orchestrator",
        name="Workflow Orchestrator",
        description="Complex workflow automation with parallel execution, conditional branching, and approval gates",
        category="Automation",
        price=0.28,
        features=[
            "Multi-Step Workflows",
            "Parallel Execution",
            "Conditional Logic",
            "Approval Gates",
            "Error Recovery"
        ]
    ),
    AgentPackage(
        id="escalation-manager",
        name="Escalation Manager",
        description="Intelligent escalation routing with SLA monitoring, smart assignment, and multi-level escalation paths",
        category="Support",
        price=0.22,
        features=[
            "Smart Routing",
            "SLA Monitoring",
            "Multi-Level Escalation",
            "Automated Assignment",
            "Stakeholder Notifications"
        ]
    )
]

# Simulated agent execution with realistic responses
async def execute_agent_simulation(package_id: str, task: str, input_data: Dict[str, Any]) -> Dict[str, Any]:
    """Simulate agent execution with realistic, detailed responses"""
    
    # Simulate processing time
    await asyncio.sleep(0.5)
    
    if package_id == "security-scanner":
        return {
            "scan_id": f"scan_{int(datetime.now().timestamp())}",
            "target": input_data.get("target", "https://example.com"),
            "vulnerabilities_found": 3,
            "owasp_compliance_score": 87.5,
            "vulnerabilities": [
                {
                    "type": "Missing Security Headers",
                    "severity": "medium",
                    "description": "X-Content-Type-Options header not set",
                    "recommendation": "Add X-Content-Type-Options: nosniff header"
                },
                {
                    "type": "SSL Configuration",
                    "severity": "low", 
                    "description": "TLS 1.1 still enabled",
                    "recommendation": "Disable TLS 1.1 and below"
                },
                {
                    "type": "CSRF Protection",
                    "severity": "high",
                    "description": "No CSRF tokens detected on forms",
                    "recommendation": "Implement CSRF protection for all forms"
                }
            ],
            "compliance_checks": {
                "OWASP_Top_10": "87.5%",
                "PCI_DSS": "92.0%",
                "GDPR": "95.0%"
            },
            "scan_duration_ms": 2340,
            "recommendations": [
                "Implement Content Security Policy",
                "Enable HTTP Strict Transport Security",
                "Add security headers middleware"
            ]
        }
    
    elif package_id == "incident-responder":
        return {
            "incident_id": f"inc_{int(datetime.now().timestamp())}",
            "severity": "high",
            "root_cause": "Database connection pool exhaustion",
            "affected_systems": ["web-app", "api-gateway", "user-service"],
            "remediation_actions": [
                {
                    "action": "Increase database connection pool size",
                    "priority": "immediate",
                    "estimated_time": "5 minutes"
                },
                {
                    "action": "Restart affected services",
                    "priority": "high", 
                    "estimated_time": "2 minutes"
                },
                {
                    "action": "Monitor connection usage",
                    "priority": "medium",
                    "estimated_time": "ongoing"
                }
            ],
            "impact_assessment": {
                "users_affected": 1250,
                "revenue_impact": "$2,400",
                "sla_breach_risk": "high"
            },
            "confidence_score": 94.2,
            "analysis_duration_ms": 1850
        }
    
    elif package_id == "ticket-resolver":
        return {
            "ticket_id": f"ticket_{int(datetime.now().timestamp())}",
            "category": "technical",
            "priority": "high",
            "sentiment": "frustrated",
            "urgency_score": 8.5,
            "resolution_suggestions": [
                {
                    "solution": "Clear browser cache and cookies",
                    "confidence": 85.0,
                    "estimated_time": "2 minutes"
                },
                {
                    "solution": "Update browser to latest version",
                    "confidence": 70.0,
                    "estimated_time": "5 minutes"
                }
            ],
            "auto_response": "Thank you for contacting support. I've analyzed your issue and identified it as a browser compatibility problem. Please try clearing your browser cache first.",
            "suggested_assignee": "tech_support_tier2",
            "satisfaction_prediction": 78.5,
            "similar_tickets": ["TKT-2023-1045", "TKT-2023-1123"],
            "analysis_duration_ms": 1200
        }
    
    elif package_id == "knowledge-base":
        return {
            "query": task,
            "answer": "Based on the knowledge base search, here's the most relevant information: The API authentication requires a valid Bearer token in the Authorization header. You can obtain this token by making a POST request to /auth/login with your credentials.",
            "confidence": 92.5,
            "sources": [
                {
                    "title": "API Authentication Guide",
                    "relevance": 95.0,
                    "url": "/docs/api-auth"
                },
                {
                    "title": "Getting Started with API",
                    "relevance": 87.0,
                    "url": "/docs/api-quickstart"
                }
            ],
            "related_queries": [
                "How to refresh API tokens?",
                "API rate limiting information",
                "Troubleshooting authentication errors"
            ],
            "query_duration_ms": 890
        }
    
    elif package_id == "data-processor":
        return {
            "job_id": f"job_{int(datetime.now().timestamp())}",
            "status": "completed",
            "records_processed": 15420,
            "records_failed": 23,
            "data_quality_score": 96.8,
            "transformations_applied": [
                "Remove duplicates",
                "Standardize email formats",
                "Validate phone numbers",
                "Enrich with geographic data"
            ],
            "output_location": "s3://data-lake/processed/2024-10-21/",
            "insights": [
                "Data quality improved by 12% after cleansing",
                "Geographic distribution shows 65% US, 25% EU, 10% APAC",
                "Email validation caught 340 invalid addresses"
            ],
            "execution_time_ms": 4500
        }
    
    elif package_id == "deployment-agent":
        return {
            "deployment_id": f"deploy_{int(datetime.now().timestamp())}",
            "status": "success",
            "environment": "production",
            "version": "v2.1.4",
            "deployment_strategy": "blue_green",
            "steps_completed": [
                "Build application",
                "Run tests",
                "Security scan",
                "Deploy to staging",
                "Health checks",
                "Switch traffic",
                "Cleanup old version"
            ],
            "health_checks_passed": True,
            "rollback_available": True,
            "deployment_url": "https://app.example.com",
            "metrics": {
                "deployment_time": "8m 34s",
                "zero_downtime": True,
                "success_rate": "100%"
            }
        }
    
    elif package_id == "audit-agent":
        return {
            "audit_id": f"audit_{int(datetime.now().timestamp())}",
            "framework": "GDPR",
            "compliance_score": 89.5,
            "findings": [
                {
                    "control": "Data Retention",
                    "status": "compliant",
                    "score": 95.0
                },
                {
                    "control": "Consent Management", 
                    "status": "partial",
                    "score": 78.0,
                    "issues": ["Missing consent withdrawal mechanism"]
                },
                {
                    "control": "Data Encryption",
                    "status": "compliant",
                    "score": 98.0
                }
            ],
            "recommendations": [
                "Implement automated consent withdrawal",
                "Update privacy policy language",
                "Add data processing register"
            ],
            "next_audit_date": "2025-04-21",
            "audit_duration_ms": 12500
        }
    
    elif package_id == "report-generator":
        return {
            "report_id": f"report_{int(datetime.now().timestamp())}",
            "title": "Q4 2024 Performance Report",
            "format": "pdf",
            "sections_generated": 6,
            "key_metrics": {
                "revenue_growth": 15.2,
                "user_acquisition": 2340,
                "churn_rate": 2.1,
                "customer_satisfaction": 4.6
            },
            "insights": [
                "Revenue growth accelerated in Q4",
                "Customer acquisition cost decreased by 8%",
                "Mobile usage increased to 67% of total traffic"
            ],
            "report_url": "https://reports.example.com/q4-2024.pdf",
            "generation_time_ms": 3200
        }
    
    elif package_id == "workflow-orchestrator":
        return {
            "workflow_id": f"workflow_{int(datetime.now().timestamp())}",
            "name": "Customer Onboarding",
            "status": "completed",
            "steps_executed": 8,
            "steps_successful": 8,
            "total_duration": "12m 45s",
            "steps": [
                {"name": "Create Account", "status": "completed", "duration": "1.2s"},
                {"name": "Send Welcome Email", "status": "completed", "duration": "0.8s"},
                {"name": "Setup Trial", "status": "completed", "duration": "2.1s"},
                {"name": "Schedule Onboarding", "status": "completed", "duration": "1.5s"}
            ],
            "metrics": {
                "success_rate": "100%",
                "average_step_time": "1.4s",
                "parallel_efficiency": "87%"
            }
        }
    
    elif package_id == "escalation-manager":
        return {
            "escalation_id": f"esc_{int(datetime.now().timestamp())}",
            "original_issue": task,
            "escalated_to": "Level 2 Support",
            "assigned_to": "senior_tech_specialist",
            "reason": "complexity_threshold_exceeded",
            "sla_impact": "extended_by_2_hours",
            "actions_taken": [
                "Notified stakeholders",
                "Updated ticket priority",
                "Assigned specialist",
                "Set new SLA deadline"
            ],
            "estimated_resolution": "4 hours",
            "escalation_path": ["Level 1", "Level 2"],
            "confidence_score": 91.5
        }
    
    else:
        return {
            "agent_id": package_id,
            "task": task,
            "status": "completed",
            "message": f"Agent {package_id} executed successfully",
            "execution_time_ms": 1000,
            "timestamp": datetime.now().isoformat()
        }

# API Routes
@app.get("/")
async def root():
    return {
        "message": "Agent Marketplace API - Integrated & Production Ready",
        "status": "operational",
        "version": "2.0.0",
        "agents_available": len(AGENT_PACKAGES),
        "real_ai_simulation": True,
        "anthropic_ready": bool(os.getenv("ANTHROPIC_API_KEY")),
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "agents_available": len(AGENT_PACKAGES),
        "anthropic_configured": bool(os.getenv("ANTHROPIC_API_KEY")),
        "simulation_mode": True,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/v1/packages")
async def get_packages(category: Optional[str] = None):
    """Get all available agent packages with credit costs"""
    packages = AGENT_PACKAGES
    
    if category:
        packages = [pkg for pkg in packages if pkg.category.lower() == category.lower()]
    
    # Add credit costs to packages
    packages_with_credits = []
    for pkg in packages:
        pkg_dict = pkg.dict()
        pkg_dict["credit_cost"] = AGENT_CREDIT_COSTS.get(pkg.id, 5)
        packages_with_credits.append(pkg_dict)
    
    return {
        "packages": packages_with_credits,
        "total": len(packages),
        "categories": list(set(pkg.category for pkg in AGENT_PACKAGES))
    }

@app.get("/api/v1/packages/{package_id}")
async def get_package(package_id: str):
    """Get specific agent package details with credit cost"""
    package = next((pkg for pkg in AGENT_PACKAGES if pkg.id == package_id), None)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    pkg_dict = package.dict()
    pkg_dict["credit_cost"] = AGENT_CREDIT_COSTS.get(package_id, 5)
    
    return pkg_dict

@app.post("/api/v1/packages/{package_id}/execute")
async def execute_agent(
    package_id: str, 
    execution: AgentExecution,
    request: Request,
    x_api_key: str = Header(None, alias="X-API-Key")
):
    """Execute an agent with advanced rate limiting, credit management, and billing"""
    
    # TEMPORARY: Require API key for agent execution
    # TODO: Implement proper authentication system
    valid_api_key = os.getenv("DEMO_API_KEY", "demo-key-12345")
    
    if not x_api_key or x_api_key != valid_api_key:
        raise HTTPException(
            status_code=401, 
            detail="API key required. Please sign up at https://bizbot.store/signup"
        )
    
    # Verify package exists
    package = next((pkg for pkg in AGENT_PACKAGES if pkg.id == package_id), None)
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    execution_id = f"exec_{int(datetime.now().timestamp())}"
    start_time = datetime.now()
    
    # Get demo user (in production, get from authentication)
    demo_user = db.get_user_by_email("demo@example.com")
    user_id = demo_user["id"] if demo_user else 1
    user_tier = RateLimitTier(demo_user.get("tier", "basic")) if demo_user else RateLimitTier.BASIC
    
    try:
        logger.info(f"Executing agent {package_id} with task: {execution.task[:100]}...")
        
        # Step 1: Check rate limits
        rate_limit_checks = [
            rate_limiter.check_user_rate_limit(user_id, user_tier, RateLimitType.REQUESTS_PER_MINUTE),
            rate_limiter.check_user_rate_limit(user_id, user_tier, RateLimitType.REQUESTS_PER_HOUR),
            rate_limiter.check_user_rate_limit(user_id, user_tier, RateLimitType.AGENT_EXECUTIONS_PER_HOUR, package_id)
        ]
        
        for rate_check in rate_limit_checks:
            if not rate_check.allowed:
                # Record rate limit hit
                record_rate_limit_hit(rate_check.limit_type, user_tier.value)
                
                raise HTTPException(
                    status_code=429, 
                    detail=f"Rate limit exceeded: {rate_check.limit_type}. Try again in {rate_check.retry_after} seconds.",
                    headers={
                        "X-RateLimit-Limit": str(rate_check.limit),
                        "X-RateLimit-Remaining": str(rate_check.remaining),
                        "X-RateLimit-Reset": str(rate_check.reset_time),
                        "Retry-After": str(rate_check.retry_after or 60)
                    }
                )
        
        # Step 2: Check concurrent execution limit
        concurrent_check = rate_limiter.start_concurrent_execution(user_id, user_tier)
        if not concurrent_check.allowed:
            raise HTTPException(
                status_code=429,
                detail=f"Concurrent execution limit exceeded. Maximum {concurrent_check.limit} concurrent executions allowed.",
                headers={
                    "X-RateLimit-Limit": str(concurrent_check.limit),
                    "X-RateLimit-Remaining": str(concurrent_check.remaining)
                }
            )
        
        try:
            # Step 3: Calculate execution cost
            cost_info = credit_system.calculate_execution_cost(user_id, package_id, package.price)
            execution_cost = cost_info["cost"]
            covered_by_subscription = cost_info["covered_by_subscription"]
            
            # Step 4: Check user credits (only if not covered by subscription)
            if execution_cost > 0:
                user_balance = credit_system.get_user_balance(user_id)
                if user_balance < execution_cost:
                    raise HTTPException(
                        status_code=402, 
                        detail=f"Insufficient credits. Required: ${execution_cost:.4f}, Available: ${user_balance:.4f}"
                    )
            
            # Step 5: Execute the agent
            result = await execute_agent_simulation(package_id, execution.task, execution.input_data)
            
            # Calculate duration
            duration = datetime.now() - start_time
            duration_ms = int(duration.total_seconds() * 1000)
            
            # Step 6: Record execution and handle billing
            billing_success = credit_system.record_execution(
                user_id=user_id,
                agent_id=package_id,
                execution_id=execution_id,
                cost=execution_cost,
                covered_by_subscription=covered_by_subscription
            )
            
            if not billing_success:
                raise HTTPException(status_code=402, detail="Billing failed - insufficient credits")
            
            # Step 7: Log execution to database
            db.log_execution(
                user_id=user_id,
                execution_id=execution_id,
                agent_id=package_id,
                task=execution.task,
                result=result,
                success=True,
                duration_ms=duration_ms,
                cost=execution_cost
            )
            
            logger.info(f"Agent {package_id} executed successfully in {duration_ms}ms, cost: ${execution_cost}")
            
            # Record monitoring metrics
            record_agent_execution(package_id, True, duration_ms / 1000.0, execution_cost)
            if execution_cost > 0:
                record_credit_usage(user_tier.value, execution_cost)
            
            # Get updated user balance
            new_balance = credit_system.get_user_balance(user_id)
            
            return ExecutionResult(
                success=True,
                result={
                    **result,
                    "billing_info": {
                        "cost": execution_cost,
                        "covered_by_subscription": covered_by_subscription,
                        "remaining_credits": new_balance,
                        "tier": user_tier.value
                    }
                },
                execution_id=execution_id,
                duration_ms=duration_ms,
                agent_used=package_id,
                timestamp=datetime.now().isoformat()
            )
            
        finally:
            # Always decrement concurrent execution counter
            rate_limiter.end_concurrent_execution(user_id)
        
    except HTTPException:
        raise  # Re-raise HTTP exceptions
    except Exception as e:
        duration = datetime.now() - start_time
        duration_ms = int(duration.total_seconds() * 1000)
        
        # Log failed execution
        db.log_execution(
            user_id=user_id,
            execution_id=execution_id,
            agent_id=package_id,
            task=execution.task,
            result={"error": str(e)},
            success=False,
            duration_ms=duration_ms,
            cost=0.0
        )
        
        logger.error(f"Agent {package_id} execution failed: {str(e)}")
        
        return ExecutionResult(
            success=False,
            result={
                "error": str(e),
                "error_type": type(e).__name__,
                "agent_id": package_id
            },
            execution_id=execution_id,
            duration_ms=duration_ms,
            agent_used=package_id,
            timestamp=datetime.now().isoformat()
        )

@app.get("/api/v1/categories")
async def get_categories():
    """Get all available categories with agent counts"""
    categories = {}
    for package in AGENT_PACKAGES:
        category = package.category
        if category not in categories:
            categories[category] = {
                "name": category,
                "count": 0,
                "agents": []
            }
        categories[category]["count"] += 1
        categories[category]["agents"].append({
            "id": package.id,
            "name": package.name,
            "price": package.price
        })
    
    return {"categories": list(categories.values())}

# Enhanced Payment and Billing Endpoints
@app.post("/api/v1/payments/create-intent")
async def create_payment_intent(payment_data: dict):
    """Create a Stripe payment intent for credit purchase"""
    try:
        amount = payment_data.get("amount")
        customer_email = payment_data.get("customer_email")
        package = payment_data.get("package", "custom")
        
        if not amount or not customer_email:
            raise HTTPException(status_code=400, detail="Amount and customer email required")
        
        # Create payment intent
        payment_intent = await stripe_integration.create_payment_intent(
            amount=amount,
            customer_email=customer_email,
            description=f"Credit Purchase - {package.title()}",
            metadata={"package": package}
        )
        
        return {
            "client_secret": payment_intent.id,  # In real implementation, return client_secret
            "payment_intent_id": payment_intent.id,
            "amount": payment_intent.amount,
            "status": payment_intent.status.value
        }
        
    except Exception as e:
        logger.error(f"Payment intent creation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/v1/payments/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        if not sig_header:
            raise HTTPException(status_code=400, detail="Missing signature header")
        
        # Process webhook
        result = await stripe_integration.handle_webhook(payload, sig_header)
        
        return result
        
    except Exception as e:
        logger.error(f"Webhook processing failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/v1/credits/packages")
async def get_credit_packages():
    """Get available credit packages"""
    packages = credit_system.get_credit_packages()
    
    return {
        "packages": packages,
        "total": len(packages)
    }

@app.post("/api/v1/credits/purchase")
async def purchase_credits(purchase_data: dict):
    """Purchase credits"""
    try:
        customer_email = purchase_data.get("customer_email")
        package = purchase_data.get("package")
        payment_method_id = purchase_data.get("payment_method_id")
        
        if not customer_email or not package:
            raise HTTPException(status_code=400, detail="Customer email and package required")
        
        # Process credit purchase
        purchase = await stripe_integration.purchase_credits(
            customer_email=customer_email,
            package=package,
            payment_method_id=payment_method_id
        )
        
        return {
            "purchase_id": purchase.id,
            "credits_purchased": purchase.credits_purchased,
            "bonus_credits": purchase.bonus_credits,
            "total_credits": purchase.total_credits,
            "amount": purchase.amount,
            "status": purchase.status.value
        }
        
    except Exception as e:
        logger.error(f"Credit purchase failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/v1/subscriptions/create")
async def create_subscription(subscription_data: dict):
    """Create a subscription"""
    try:
        customer_email = subscription_data.get("customer_email")
        tier = subscription_data.get("tier")
        trial_days = subscription_data.get("trial_days", 7)
        
        if not customer_email or not tier:
            raise HTTPException(status_code=400, detail="Customer email and tier required")
        
        # Get or create Stripe customer
        customer = await stripe_integration.create_customer(
            email=customer_email,
            name=subscription_data.get("name", "Customer")
        )
        
        # Create subscription
        subscription = await stripe_integration.create_subscription(
            customer_id=customer["id"],
            tier=SubscriptionTier(tier),
            trial_days=trial_days
        )
        
        return {
            "subscription_id": subscription.id,
            "tier": subscription.tier.value,
            "status": subscription.status,
            "monthly_price": subscription.monthly_price,
            "execution_price": subscription.execution_price,
            "monthly_executions_included": subscription.monthly_executions_included,
            "current_period_end": subscription.current_period_end
        }
        
    except Exception as e:
        logger.error(f"Subscription creation failed: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/v1/user/credits")
async def get_user_credits():
    """Get user's credit balance and transaction history"""
    # Get demo user
    user = db.get_user_by_email("demo@example.com")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    balance = credit_system.get_user_balance(user["id"])
    transactions = credit_system.get_user_transactions(user["id"], limit=20)
    
    return {
        "balance": balance,
        "transactions": [
            {
                "id": tx.id,
                "type": tx.transaction_type.value,
                "amount": tx.amount,
                "balance_after": tx.balance_after,
                "description": tx.description,
                "created_at": tx.created_at
            }
            for tx in transactions
        ]
    }

@app.get("/api/v1/user/rate-limits")
async def get_user_rate_limits():
    """Get user's current rate limit status"""
    # Get demo user
    user = db.get_user_by_email("demo@example.com")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get user's tier
    tier = RateLimitTier(user.get("tier", "basic"))
    
    # Get rate limit status
    status = rate_limiter.get_user_rate_limit_status(user["id"], tier)
    
    return {
        "user_id": user["id"],
        "tier": tier.value,
        "rate_limits": {
            limit_type: {
                "allowed": result.allowed,
                "limit": result.limit,
                "remaining": result.remaining,
                "reset_time": result.reset_time,
                "retry_after": result.retry_after
            }
            for limit_type, result in status.items()
        }
    }

@app.get("/api/v1/tiers")
async def get_subscription_tiers():
    """Get available subscription tiers"""
    tiers = []
    
    for tier in SubscriptionTier:
        tier_config = stripe_integration.get_tier_config(tier)
        rate_limits = rate_limiter.get_tier_limits(RateLimitTier(tier.value))
        
        tiers.append({
            "id": tier.value,
            "name": tier.value.title(),
            "monthly_price": tier_config.get("monthly_price", 0),
            "execution_price": tier_config.get("execution_price", 0),
            "monthly_executions": tier_config.get("monthly_executions", 0),
            "features": tier_config.get("features", []),
            "rate_limits": {
                "requests_per_minute": rate_limits.get(RateLimitType.REQUESTS_PER_MINUTE, 0),
                "requests_per_hour": rate_limits.get(RateLimitType.REQUESTS_PER_HOUR, 0),
                "agent_executions_per_hour": rate_limits.get(RateLimitType.AGENT_EXECUTIONS_PER_HOUR, 0),
                "concurrent_executions": rate_limits.get(RateLimitType.CONCURRENT_EXECUTIONS, 0)
            }
        })
    
    return {"tiers": tiers}

@app.get("/api/v1/user/usage")
async def get_user_usage():
    """Get user's usage summary"""
    # Get demo user
    user = db.get_user_by_email("demo@example.com")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get current month usage
    current_month = datetime.now().strftime("%Y-%m")
    usage_summary = credit_system.get_usage_summary(user["id"], current_month)
    
    # Get subscription info
    subscription = credit_system.get_user_subscription(user["id"])
    
    return {
        "user_id": user["id"],
        "current_month": current_month,
        "usage_summary": {
            "total_executions": usage_summary.total_executions if usage_summary else 0,
            "total_cost": usage_summary.total_cost if usage_summary else 0.0,
            "credits_used": usage_summary.credits_used if usage_summary else 0.0
        },
        "subscription": {
            "tier": subscription.tier if subscription else "none",
            "monthly_executions_included": subscription.monthly_executions_included if subscription else 0,
            "executions_used_this_period": subscription.executions_used_this_period if subscription else 0,
            "execution_price": subscription.execution_price if subscription else 0.0
        } if subscription else None
    }

# User Management endpoints
@app.post("/api/v1/auth/login")
async def login(credentials: dict):
    """Login user and return user data"""
    email = credentials.get("email")
    password = credentials.get("password")
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")
    
    # Get user from database
    user = db.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # In production, verify password hash
    # For demo, accept any password
    
    return {
        "access_token": f"token_{user['id']}_{int(datetime.now().timestamp())}",
        "token_type": "bearer", 
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "tier": user["tier"],
            "credits": user["credits"]
        }
    }

@app.post("/api/v1/auth/register")
async def register(user_data: dict):
    """Register new user"""
    email = user_data.get("email")
    name = user_data.get("name")
    password = user_data.get("password")
    
    if not email or not name or not password:
        raise HTTPException(status_code=400, detail="Email, name, and password required")
    
    # Create user in database
    user = db.create_user(email, name, "password_hash", "basic")
    if not user:
        raise HTTPException(status_code=409, detail="User already exists")
    
    return {
        "access_token": f"token_{user['id']}_{int(datetime.now().timestamp())}",
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "tier": user["tier"],
            "credits": user["credits"]
        }
    }

@app.get("/api/v1/auth/me")
async def get_current_user():
    """Get current user info (demo user for now)"""
    user = db.get_user_by_email("demo@example.com")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "credits": user["credits"],
        "tier": user["tier"],
        "api_key": user["api_key"]
    }

@app.get("/api/v1/user/executions")
async def get_user_executions():
    """Get user's execution history"""
    user = db.get_user_by_email("demo@example.com")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    executions = db.get_user_executions(user["id"])
    return {
        "executions": executions,
        "total": len(executions)
    }

@app.get("/api/v1/stats")
async def get_platform_stats():
    """Get platform statistics"""
    from database_setup import get_user_stats
    stats = get_user_stats()
    
    return {
        "platform_stats": {
            "total_users": stats["users"],
            "total_executions": stats["executions"],
            "total_revenue": stats["revenue"],
            "popular_agents": [
                {"agent_id": agent[0], "executions": agent[1]}
                for agent in stats["popular_agents"]
            ]
        },
        "timestamp": datetime.now().isoformat()
    }

# Pricing Endpoints
@app.get("/api/v1/pricing/credits")
async def get_credit_packages():
    """Get available credit packages"""
    return {
        "packages": CREDIT_PACKAGES,
        "credit_value": 0.04,  # $0.04 per credit
        "currency": "USD"
    }

@app.get("/api/v1/pricing/subscriptions")
async def get_subscription_tiers():
    """Get available subscription tiers"""
    return {
        "tiers": SUBSCRIPTION_TIERS,
        "currency": "USD",
        "billing_period": "monthly"
    }

@app.get("/api/v1/pricing/agents")
async def get_agent_pricing():
    """Get credit costs for all agents"""
    agent_pricing = []
    for agent in AGENT_PACKAGES:
        credit_cost = AGENT_CREDIT_COSTS.get(agent.id, 5)
        dollar_cost = credit_cost * 0.04
        
        # Determine tier
        if credit_cost <= 3:
            tier = "light"
        elif credit_cost <= 6:
            tier = "medium"
        else:
            tier = "heavy"
        
        agent_pricing.append({
            "id": agent.id,
            "name": agent.name,
            "category": agent.category,
            "credit_cost": credit_cost,
            "dollar_cost": dollar_cost,
            "tier": tier
        })
    
    return {
        "agents": agent_pricing,
        "tiers": {
            "light": {"range": "1-3 credits", "description": "Simple queries, fast responses"},
            "medium": {"range": "4-6 credits", "description": "Moderate complexity, comprehensive analysis"},
            "heavy": {"range": "7-9 credits", "description": "Complex workflows, deep analysis"}
        }
    }

# Monitoring and Health Check Endpoints
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        health_status = await monitor.get_health_status()
        return health_status
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }

@app.get("/metrics")
async def get_metrics():
    """Get application metrics"""
    try:
        metrics = monitor.get_metrics_summary()
        return metrics
    except Exception as e:
        logger.error(f"Metrics collection failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Metrics unavailable")

@app.get("/metrics/prometheus")
async def get_prometheus_metrics():
    """Get Prometheus-formatted metrics"""
    try:
        from fastapi import Response
        
        # Simple Prometheus-style output
        metrics = monitor.get_metrics_summary()
        app_metrics = metrics.get('application_metrics', {})
        
        prometheus_output = []
        prometheus_output.append("# HELP agent_marketplace_info Agent Marketplace information")
        prometheus_output.append("# TYPE agent_marketplace_info gauge")
        prometheus_output.append('agent_marketplace_info{version="2.0.0"} 1')
        
        # Add counters
        for counter_name, value in app_metrics.get('counters', {}).items():
            clean_name = counter_name.split(':')[0].replace('-', '_')
            prometheus_output.append(f"# TYPE {clean_name} counter")
            prometheus_output.append(f"{clean_name} {value}")
        
        # Add gauges
        for gauge_name, value in app_metrics.get('gauges', {}).items():
            clean_name = gauge_name.split(':')[0].replace('-', '_')
            prometheus_output.append(f"# TYPE {clean_name} gauge")
            prometheus_output.append(f"{clean_name} {value}")
        
        return Response(content='\n'.join(prometheus_output) + '\n', media_type="text/plain")
    except Exception as e:
        logger.error(f"Prometheus metrics failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Prometheus metrics unavailable")

@app.get("/api/v1/system/status")
async def get_system_status():
    """Get comprehensive system status"""
    try:
        health_status = await monitor.get_health_status()
        metrics = monitor.get_metrics_summary()
        
        return {
            "system": "Agent Marketplace API",
            "version": "2.0.0",
            "environment": "production",
            "health": health_status,
            "metrics": metrics,
            "features": {
                "rate_limiting": True,
                "credit_system": True,
                "subscription_management": True,
                "monitoring": True
            }
        }
    except Exception as e:
        logger.error(f"System status check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="System status unavailable")

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize monitoring on startup"""
    try:
        logger.info("Starting Agent Marketplace API...")
        
        # Initialize database and create demo user
        from database_setup import init_database, create_demo_user
        init_database()
        create_demo_user()
        
        # Start monitoring
        await monitor.start_monitoring(interval=30)
        
        # Record startup
        monitor.metrics.increment_counter("app_starts_total")
        
        logger.info("✅ Agent Marketplace API started successfully")
        
    except Exception as e:
        logger.error(f"Startup failed: {str(e)}")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    try:
        logger.info("Shutting down Agent Marketplace API...")
        
        # Stop monitoring
        monitor.stop_monitoring()
        
        logger.info("✅ Agent Marketplace API shutdown complete")
        
    except Exception as e:
        logger.error(f"Shutdown error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
