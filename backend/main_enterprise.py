"""
🏆 ENTERPRISE API BACKEND - OCTOBER 2025
Best Practices Implementation for Million Dollar Project
"""
import os
import logging
from contextlib import asynccontextmanager
from typing import Optional, List
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

import uvicorn
from pydantic import BaseModel, Field, validator
from pydantic_settings import BaseSettings
import redis
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Float, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
import jwt
from passlib.context import CryptContext
import httpx
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

# Configuration
class Settings(BaseSettings):
    # API Configuration
    api_title: str = "Agent Marketplace API"
    api_version: str = "1.0.0"
    api_description: str = "Enterprise AI Agent Platform - October 2025"
    debug: bool = False
    
    # Security
    secret_key: str = "your-super-secret-key-256-bits-minimum"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    
    # Database
    database_url: str = "postgresql://user:pass@localhost/agentmarketplace"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # External APIs
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    stripe_secret_key: str = ""
    
    # CORS
    allowed_origins: List[str] = [
        "https://frontend-theta-six-74.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001"
    ]
    
    # Rate Limiting
    rate_limit_requests: int = 1000
    rate_limit_window: int = 3600  # 1 hour
    
    class Config:
        env_file = ".env"

settings = Settings()

# Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Database Setup
engine = create_engine(
    settings.database_url,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    echo=settings.debug
)
SessionLocal = sessionmaker(autoincrement=False, bind=engine)
Base = declarative_base()

# Redis Setup
redis_client = redis.from_url(settings.redis_url, decode_responses=True)

# Security Setup
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OpenTelemetry Setup
tracer = trace.get_tracer(__name__)

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class AgentPackage(Base):
    __tablename__ = "agent_packages"
    
    id = Column(Integer, primary_key=True, index=True)
    package_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ExecutionHistory(Base):
    __tablename__ = "execution_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    package_id = Column(String, nullable=False)
    task = Column(Text, nullable=False)
    result = Column(Text, nullable=False)
    success = Column(Boolean, default=True)
    execution_time = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic Models
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., regex=r'^[\w\.-]+@[\w\.-]+\.\w+$')
    password: str = Field(..., min_length=8)
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class AgentExecution(BaseModel):
    package_id: str = Field(..., min_length=1)
    task: str = Field(..., min_length=1, max_length=10000)
    engine_type: str = Field(default="crewai", regex=r'^(crewai|langgraph|langchain)$')

class ExecutionResult(BaseModel):
    success: bool
    result: str
    execution_id: str
    execution_time: float
    tokens_used: Optional[int] = None

class AgentPackageResponse(BaseModel):
    id: str
    name: str
    description: str
    category: str
    price: float
    status: str
    
    class Config:
        from_attributes = True

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
    uptime: float
    database: bool
    redis: bool

# Dependency Functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, settings.secret_key, algorithms=[settings.algorithm])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt

# Rate Limiting
async def rate_limit_check(request: Request):
    client_ip = request.client.host
    key = f"rate_limit:{client_ip}"
    
    current_requests = redis_client.get(key)
    if current_requests is None:
        redis_client.setex(key, settings.rate_limit_window, 1)
    else:
        if int(current_requests) >= settings.rate_limit_requests:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        redis_client.incr(key)

# Application Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Enterprise API Backend...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    
    # Test Redis connection
    try:
        redis_client.ping()
        logger.info("Redis connection established")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")
    
    # Initialize OpenTelemetry
    FastAPIInstrumentor.instrument_app(app)
    RedisInstrumentor().instrument()
    SQLAlchemyInstrumentor().instrument()
    logger.info("OpenTelemetry instrumentation enabled")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Enterprise API Backend...")

# FastAPI Application
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

# Custom OpenAPI Schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=settings.api_title,
        version=settings.api_version,
        description=settings.api_description,
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Routes
@app.get("/", response_model=dict)
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Agent Marketplace API - Enterprise Edition",
        "version": settings.api_version,
        "status": "operational",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Comprehensive health check endpoint"""
    start_time = datetime.utcnow()
    
    # Check database
    db_status = True
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
    except Exception:
        db_status = False
    
    # Check Redis
    redis_status = True
    try:
        redis_client.ping()
    except Exception:
        redis_status = False
    
    return HealthResponse(
        status="healthy" if db_status and redis_status else "degraded",
        timestamp=start_time,
        version=settings.api_version,
        uptime=0.0,  # Would be calculated from startup time
        database=db_status,
        redis=redis_status
    )

@app.post("/api/v1/auth/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user.email) | (User.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(db_user.id)})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id)})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token
    )

@app.post("/api/v1/auth/login", response_model=Token)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return tokens"""
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not db_user.is_active:
        raise HTTPException(status_code=401, detail="Account deactivated")
    
    # Create tokens
    access_token = create_access_token(data={"sub": str(db_user.id)})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id)})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token
    )

@app.get("/api/v1/packages", response_model=List[AgentPackageResponse])
async def get_packages(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    _: Request = Depends(rate_limit_check)
):
    """Get all agent packages with optional filtering"""
    query = db.query(AgentPackage).filter(AgentPackage.status == "active")
    
    if category:
        query = query.filter(AgentPackage.category == category)
    
    packages = query.all()
    return packages

@app.get("/api/v1/packages/{package_id}", response_model=AgentPackageResponse)
async def get_package(package_id: str, db: Session = Depends(get_db)):
    """Get specific agent package"""
    package = db.query(AgentPackage).filter(AgentPackage.package_id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package

@app.post("/api/v1/agents/{package_id}/execute", response_model=ExecutionResult)
async def execute_agent(
    package_id: str,
    execution: AgentExecution,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute an agent with the given task"""
    start_time = datetime.utcnow()
    
    # Verify package exists
    package = db.query(AgentPackage).filter(AgentPackage.package_id == package_id).first()
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    # Check user permissions
    if package.price > 0 and not current_user.is_premium:
        raise HTTPException(status_code=403, detail="Premium subscription required")
    
    # Simulate agent execution (replace with actual agent logic)
    import asyncio
    import uuid
    
    execution_id = str(uuid.uuid4())
    
    # Mock execution result
    result_text = f"""
Agent '{package.name}' executed successfully!

Task: {execution.task}
Engine: {execution.engine_type}
Execution ID: {execution_id}
User: {current_user.username}

Result: Task completed with 100% success rate. All objectives achieved.
Processing time: {execution.engine_type} engine processed the request efficiently.
Status: ✅ COMPLETED
"""
    
    execution_time = (datetime.utcnow() - start_time).total_seconds()
    
    # Save execution history
    history = ExecutionHistory(
        user_id=current_user.id,
        package_id=package_id,
        task=execution.task,
        result=result_text,
        success=True,
        execution_time=execution_time
    )
    db.add(history)
    db.commit()
    
    return ExecutionResult(
        success=True,
        result=result_text,
        execution_id=execution_id,
        execution_time=execution_time,
        tokens_used=len(execution.task.split()) * 2  # Mock token count
    )

@app.get("/api/v1/categories")
async def get_categories():
    """Get all available categories"""
    categories = [
        {"id": "security", "name": "Security", "description": "Security and compliance agents", "icon": "shield"},
        {"id": "automation", "name": "Automation", "description": "Process automation agents", "icon": "zap"},
        {"id": "analytics", "name": "Analytics", "description": "Data analysis agents", "icon": "bar-chart"},
        {"id": "communication", "name": "Communication", "description": "Communication agents", "icon": "message-circle"},
    ]
    return {"categories": categories}

@app.get("/api/v1/user/profile")
async def get_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "is_premium": current_user.is_premium,
        "is_admin": current_user.is_admin,
        "created_at": current_user.created_at
    }

# Error Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "timestamp": datetime.utcnow().isoformat(),
                "path": str(request.url)
            }
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": 500,
                "message": "Internal server error",
                "timestamp": datetime.utcnow().isoformat(),
                "path": str(request.url)
            }
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        workers=4,
        reload=settings.debug,
        log_level="info"
    )
