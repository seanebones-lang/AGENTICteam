from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ForeignKey, Float, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid

class User(Base):
    """User model for authentication and profile management."""
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    tier = Column(String(50), default="solo")
    credits_balance = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    executions = relationship("ExecutionHistory", back_populates="user", cascade="all, delete-orphan")
    free_trial_usage = relationship("FreeTrialUsage", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    """User session model for JWT token management - matches plan schema."""
    __tablename__ = "user_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    device_fingerprint = Column(String(32), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="sessions")

class FreeTrialUsage(Base):
    """Free trial usage tracking model - matches plan schema exactly."""
    __tablename__ = "free_trial_usage"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    device_fingerprint = Column(String(32), nullable=False, index=True)
    agent_id = Column(String(100), nullable=True)
    query_count = Column(Integer, default=0)
    first_query_at = Column(DateTime(timezone=True), nullable=True)
    last_query_at = Column(DateTime(timezone=True), nullable=True)
    
    # Unique constraint as specified in plan
    __table_args__ = (
        UniqueConstraint('user_id', 'device_fingerprint', name='uq_user_device'),
    )
    
    # Relationships
    user = relationship("User", back_populates="free_trial_usage")

class ExecutionHistory(Base):
    """Execution history model for tracking agent usage."""
    __tablename__ = "execution_history"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    agent_id = Column(String(100), nullable=False, index=True)
    agent_name = Column(String(255), nullable=False)
    input_data = Column(Text, nullable=False)
    output_data = Column(Text, nullable=True)
    status = Column(String(50), default="pending")
    error_message = Column(Text, nullable=True)
    execution_time_ms = Column(Integer, nullable=True)
    token_count = Column(Integer, nullable=True)
    cost_usd = Column(Float, nullable=True)
    device_fingerprint = Column(String(32), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="executions")

class AgentPackage(Base):
    """Agent package model for storing agent configurations."""
    __tablename__ = "agent_packages"
    
    id = Column(String(100), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    model_type = Column(String(50), default="haiku")  # haiku or sonnet
    is_active = Column(Boolean, default=True)
    price_per_execution = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())