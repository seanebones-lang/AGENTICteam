from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from prometheus_client import make_asgi_app
import logging
import time

from app.core.config import settings
from app.core.database import init_db
from app.core.redis import redis_client
from app.api.v2 import auth, agents, credits, usage, admin

# Import all 10 agents
from app.agents import (
    TicketResolverAgent,
    SecurityScannerAgent,
    KnowledgeBaseAgent,
    IncidentResponderAgent,
    DataProcessorAgent,
    ReportGeneratorAgent,
    DeploymentAgent,
    AuditAgent,
    WorkflowOrchestratorAgent,
    EscalationManagerAgent,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Sentry if DSN is provided
if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[
            FastApiIntegration(auto_enabling_instrumentations=True),
            SqlalchemyIntegration(),
        ],
        traces_sample_rate=0.1,
        environment="production" if not settings.debug else "development",
    )

# Create FastAPI application
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description=settings.api_description,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.debug else ["https://bizbot.store"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"] if settings.debug else ["bizbot.store", "*.bizbot.store"]
)

# Add Prometheus metrics if enabled
if settings.prometheus_enabled:
    metrics_app = make_asgi_app()
    app.mount("/metrics", metrics_app)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": time.time()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "status_code": 500,
            "timestamp": time.time()
        }
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for load balancers."""
    return {
        "status": "healthy",
        "version": settings.api_version,
        "timestamp": time.time()
    }

# Include API routers
app.include_router(auth.router, prefix="/api/v2/auth", tags=["Authentication"])
app.include_router(agents.router, prefix="/api/v2/agents", tags=["Agents"])
app.include_router(credits.router, prefix="/api/v2/credits", tags=["Credits"])
app.include_router(usage.router, prefix="/api/v2/usage", tags=["Usage"])
app.include_router(admin.router, prefix="/api/v2/admin", tags=["Admin"])

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup."""
    logger.info("🚀 Starting Agent Marketplace v2.0 API")
    
    # Initialize database
    try:
        init_db()
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Failed to initialize database: {e}")
        raise
    
    # Initialize Redis
    try:
        await redis_client.ping()
        logger.info("✅ Redis connected successfully")
    except Exception as e:
        logger.error(f"❌ Failed to connect to Redis: {e}")
        # Continue without Redis for development
    
    # Initialize all 10 agents
    try:
        claude_api_key = settings.anthropic_api_key or "test-key-for-development"
        
        app.state.agents = {
            "ticket-resolver": TicketResolverAgent(api_key=claude_api_key),
            "security-scanner": SecurityScannerAgent(api_key=claude_api_key),
            "knowledge-base": KnowledgeBaseAgent(api_key=claude_api_key),
            "incident-responder": IncidentResponderAgent(api_key=claude_api_key),
            "data-processor": DataProcessorAgent(api_key=claude_api_key),
            "report-generator": ReportGeneratorAgent(api_key=claude_api_key),
            "deployment-agent": DeploymentAgent(api_key=claude_api_key),
            "audit-agent": AuditAgent(api_key=claude_api_key),
            "workflow-orchestrator": WorkflowOrchestratorAgent(api_key=claude_api_key),
            "escalation-manager": EscalationManagerAgent(api_key=claude_api_key),
        }
        
        logger.info("✅ All 10 agents initialized with Claude 4.5 support")
        
        # Initialize free trial system
        app.state.free_trial_limit = 3
        logger.info("✅ Universal free trial system (3 queries) activated")
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize agents: {e}")
        raise
    
    logger.info("🎉 Agent Marketplace v2.0 fully operational!")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on application shutdown."""
    logger.info("Shutting down Agent Marketplace v2.0 API")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )
