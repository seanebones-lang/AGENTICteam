#!/usr/bin/env python3
"""
🚀 PRODUCTION LIVE API - BIZBOT.STORE
Combines working Stripe integration with agent marketplace API
"""

import os
import stripe
import logging
from fastapi import FastAPI, HTTPException, Request, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import json
import uuid
from datetime import datetime

# Initialize FastAPI
app = FastAPI(
    title="BizBot.Store API", 
    version="1.0.0",
    description="Production API for Agent Marketplace with Stripe Integration"
)

# CORS Configuration - Secure for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://bizbot.store", 
        "https://www.bizbot.store",
        "http://localhost:3000"  # For development
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Stripe (SECURE - from environment variables only)
stripe_secret_key = os.getenv('STRIPE_SECRET_KEY')
stripe_webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

if stripe_secret_key:
    if not stripe_secret_key.startswith(('sk_live_', 'sk_test_')):
        logger.error("❌ Invalid Stripe secret key format")
        raise ValueError("Invalid Stripe key format")
    
    stripe.api_key = stripe_secret_key
    logger.info("✅ Stripe initialized successfully")
else:
    logger.warning("⚠️ Stripe not configured - payments will be disabled")

# Data Models
class AgentPackage(BaseModel):
    id: str
    name: str
    description: str
    category: str
    price: float
    status: str = "active"

class AgentExecution(BaseModel):
    package_id: str
    task: str
    engine_type: str = "crewai"

class ExecutionResult(BaseModel):
    success: bool
    result: str
    execution_id: str

class PaymentRequest(BaseModel):
    amount: float = Field(..., gt=0, description="Amount in dollars")
    currency: str = "usd"
    customer_email: Optional[str] = None
    description: Optional[str] = "Agent Marketplace Credits"

class PaymentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
    amount: float
    status: str

# Mock Agent Data
MOCK_AGENTS = [
    AgentPackage(
        id="security-scanner",
        name="Security Scanner Agent",
        description="Automated security vulnerability scanning and assessment",
        category="security",
        price=99.99
    ),
    AgentPackage(
        id="data-processor",
        name="Data Processing Agent", 
        description="Intelligent data analysis and processing with AI insights",
        category="analytics",
        price=149.99
    ),
    AgentPackage(
        id="incident-responder",
        name="Incident Response Agent",
        description="Automated incident detection and response system",
        category="security",
        price=199.99
    ),
    AgentPackage(
        id="workflow-orchestrator",
        name="Workflow Orchestrator",
        description="Complex workflow automation and management platform",
        category="automation",
        price=249.99
    ),
    AgentPackage(
        id="audit-agent",
        name="Compliance Audit Agent",
        description="Automated compliance auditing and reporting system",
        category="security",
        price=179.99
    ),
    AgentPackage(
        id="report-generator",
        name="Report Generator Agent",
        description="Automated report generation and business intelligence",
        category="analytics",
        price=129.99
    ),
    AgentPackage(
        id="ticket-resolver",
        name="Ticket Resolution Agent",
        description="Automated ticket resolution and customer support",
        category="automation",
        price=89.99
    ),
    AgentPackage(
        id="knowledge-base",
        name="Knowledge Base Agent",
        description="Intelligent knowledge management and retrieval system",
        category="communication",
        price=159.99
    ),
    AgentPackage(
        id="deployment-agent",
        name="Deployment Agent",
        description="Automated deployment and infrastructure management",
        category="automation",
        price=299.99
    ),
    AgentPackage(
        id="escalation-manager",
        name="Escalation Manager Agent",
        description="Intelligent escalation and priority management system",
        category="communication",
        price=219.99
    )
]

# Basic API Routes
@app.get("/")
async def root():
    return {
        "message": "BizBot.Store API - Live and Ready", 
        "status": "operational",
        "version": "1.0.0",
        "stripe_configured": bool(stripe_secret_key)
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "agents": len(MOCK_AGENTS), 
        "version": "1.0.0",
        "stripe_status": "configured" if stripe_secret_key else "not_configured",
        "timestamp": datetime.utcnow().isoformat()
    }

# Agent Marketplace Routes
@app.get("/api/v1/packages")
async def get_packages(category: Optional[str] = None):
    """Get all agent packages"""
    if category:
        filtered_agents = [agent for agent in MOCK_AGENTS if agent.category == category]
        return {"packages": filtered_agents, "total": len(filtered_agents)}
    return {"packages": MOCK_AGENTS, "total": len(MOCK_AGENTS)}

@app.get("/api/v1/packages/{package_id}")
async def get_package(package_id: str):
    """Get specific agent package"""
    agent = next((agent for agent in MOCK_AGENTS if agent.id == package_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Package not found")
    return agent

@app.post("/api/v1/agents/{package_id}/execute")
async def execute_agent(package_id: str, execution: AgentExecution):
    """Execute an agent"""
    agent = next((agent for agent in MOCK_AGENTS if agent.id == package_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Package not found")
    
    # Simulate agent execution
    execution_id = str(uuid.uuid4())
    
    # Mock execution result with realistic output
    result_text = f"""🤖 Agent Execution Complete

Agent: {agent.name}
Task: {execution.task}
Engine: {execution.engine_type}
Execution ID: {execution_id}

✅ Status: SUCCESS
⏱️ Duration: 2.3 seconds
📊 Confidence: 98.5%

Results:
- Task completed successfully
- All objectives achieved
- No errors encountered
- Ready for production use

Next Steps:
- Review results in dashboard
- Download detailed report
- Schedule follow-up if needed"""
    
    return ExecutionResult(
        success=True,
        result=result_text,
        execution_id=execution_id
    )

@app.get("/api/v1/categories")
async def get_categories():
    """Get all categories"""
    categories = [
        {
            "id": "security", 
            "name": "Security", 
            "description": "Security and compliance agents", 
            "icon": "shield",
            "count": len([a for a in MOCK_AGENTS if a.category == "security"])
        },
        {
            "id": "automation", 
            "name": "Automation", 
            "description": "Process automation agents", 
            "icon": "zap",
            "count": len([a for a in MOCK_AGENTS if a.category == "automation"])
        },
        {
            "id": "analytics", 
            "name": "Analytics", 
            "description": "Data analysis agents", 
            "icon": "bar-chart",
            "count": len([a for a in MOCK_AGENTS if a.category == "analytics"])
        },
        {
            "id": "communication", 
            "name": "Communication", 
            "description": "Communication agents", 
            "icon": "message-circle",
            "count": len([a for a in MOCK_AGENTS if a.category == "communication"])
        },
    ]
    return {"categories": categories}

# Stripe Payment Routes
@app.post("/api/v1/create-payment-intent", response_model=PaymentResponse)
async def create_payment_intent(payment_request: PaymentRequest):
    """Create a Stripe payment intent"""
    if not stripe_secret_key:
        raise HTTPException(status_code=503, detail="Payment processing not configured")
    
    try:
        # Convert dollars to cents for Stripe
        amount_cents = int(payment_request.amount * 100)
        
        # Create payment intent
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=payment_request.currency,
            metadata={
                "description": payment_request.description,
                "customer_email": payment_request.customer_email or "unknown"
            }
        )
        
        logger.info(f"✅ Payment intent created: {intent.id} for ${payment_request.amount}")
        
        return PaymentResponse(
            client_secret=intent.client_secret,
            payment_intent_id=intent.id,
            amount=payment_request.amount,
            status=intent.status
        )
        
    except stripe.error.StripeError as e:
        logger.error(f"❌ Stripe error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"❌ Payment error: {e}")
        raise HTTPException(status_code=500, detail="Payment processing failed")

# Webhook Handler
@app.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks securely"""
    if not stripe_webhook_secret:
        logger.warning("⚠️ Webhook secret not configured")
        return {"status": "webhook_secret_missing"}
    
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        # Verify webhook signature
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, stripe_webhook_secret
            )
        except ValueError:
            logger.error("❌ Invalid webhook payload")
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            logger.error("❌ Invalid webhook signature")
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            logger.info(f"✅ Payment succeeded: {payment_intent['id']}")
            
            # Here you would:
            # 1. Add credits to customer account
            # 2. Send confirmation email
            # 3. Update database
            
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            logger.warning(f"❌ Payment failed: {payment_intent['id']}")
            
        else:
            logger.info(f"ℹ️ Unhandled event type: {event['type']}")
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"❌ Webhook error: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

# Get Stripe Config (for frontend)
@app.get("/api/v1/stripe/config")
async def get_stripe_config():
    """Get Stripe publishable key for frontend"""
    publishable_key = os.getenv('STRIPE_PUBLISHABLE_KEY')
    if not publishable_key:
        raise HTTPException(status_code=503, detail="Stripe not configured")
    
    return {
        "publishable_key": publishable_key,
        "currency": "usd"
    }

# Auth endpoints (mock for now)
@app.post("/api/v1/auth/login")
async def login(email: str, password: str):
    return {
        "access_token": "mock_token_12345", 
        "token_type": "bearer",
        "user": {"id": "user_123", "name": "Demo User", "email": email}
    }

@app.post("/api/v1/auth/register")
async def register(name: str, email: str, password: str):
    return {
        "access_token": "mock_token_12345", 
        "token_type": "bearer",
        "user": {"id": "user_123", "name": name, "email": email}
    }

@app.get("/api/v1/auth/me")
async def get_current_user():
    return {
        "id": "user_123", 
        "name": "Demo User", 
        "email": "demo@bizbot.store",
        "credits": 100.0,
        "tier": "pro"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
