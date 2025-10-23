from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # API Configuration
    api_title: str = "Agent Marketplace v2.0"
    api_version: str = "2.0"
    api_description: str = "Enterprise-grade AI agent marketplace with 99.99% uptime"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    
    # Database Configuration
    database_url: str = "postgresql://user:password@localhost/agent_marketplace_v2"
    database_pool_size: int = 20
    database_max_overflow: int = 30
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379"
    redis_max_connections: int = 20
    
    # Authentication
    secret_key: str = "your-secret-key-change-in-production"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7
    algorithm: str = "HS256"
    
    # AI Configuration
    anthropic_api_key: Optional[str] = None
    claude_haiku_model: str = "claude-3-5-haiku-20241022"
    claude_sonnet_model: str = "claude-3-5-sonnet-20241022"
    
    # Payment Configuration
    stripe_secret_key: Optional[str] = None
    stripe_webhook_secret: Optional[str] = None
    
    # Monitoring
    sentry_dsn: Optional[str] = None
    prometheus_enabled: bool = True
    
    # Rate Limiting
    rate_limit_requests_per_minute: int = 100
    rate_limit_requests_per_hour: int = 1000
    
    # Free Trial Configuration
    free_trial_queries: int = 3
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Global settings instance
settings = Settings()
