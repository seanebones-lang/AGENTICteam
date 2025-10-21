#!/usr/bin/env python3
"""
Production Configuration for Agent Marketplace
Secure, scalable configuration for production deployment
"""

import os
import secrets
from typing import Dict, Any, List, Optional
try:
    from pydantic_settings import BaseSettings
    from pydantic import validator
except ImportError:
    # Fallback for older pydantic versions
    from pydantic import BaseSettings, validator
from enum import Enum

class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"

class DatabaseConfig(BaseSettings):
    """Database configuration"""
    
    # PostgreSQL configuration for production
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/agent_marketplace")
    DATABASE_POOL_SIZE: int = int(os.getenv("DATABASE_POOL_SIZE", "20"))
    DATABASE_MAX_OVERFLOW: int = int(os.getenv("DATABASE_MAX_OVERFLOW", "30"))
    DATABASE_POOL_TIMEOUT: int = int(os.getenv("DATABASE_POOL_TIMEOUT", "30"))
    DATABASE_POOL_RECYCLE: int = int(os.getenv("DATABASE_POOL_RECYCLE", "3600"))
    
    # Connection encryption
    DATABASE_SSL_MODE: str = os.getenv("DATABASE_SSL_MODE", "require")
    DATABASE_SSL_CERT: Optional[str] = os.getenv("DATABASE_SSL_CERT")
    DATABASE_SSL_KEY: Optional[str] = os.getenv("DATABASE_SSL_KEY")
    DATABASE_SSL_ROOT_CERT: Optional[str] = os.getenv("DATABASE_SSL_ROOT_CERT")

class RedisConfig(BaseSettings):
    """Redis configuration for caching and rate limiting"""
    
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD")
    REDIS_SSL: bool = os.getenv("REDIS_SSL", "false").lower() == "true"
    REDIS_POOL_SIZE: int = int(os.getenv("REDIS_POOL_SIZE", "20"))
    REDIS_TIMEOUT: int = int(os.getenv("REDIS_TIMEOUT", "5"))

class SecurityConfig(BaseSettings):
    """Security configuration"""
    
    # JWT and session security
    SECRET_KEY: str = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", secrets.token_urlsafe(32))
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))
    
    # Password security
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_REQUIRE_UPPERCASE: bool = True
    PASSWORD_REQUIRE_LOWERCASE: bool = True
    PASSWORD_REQUIRE_NUMBERS: bool = True
    PASSWORD_REQUIRE_SPECIAL: bool = True
    
    # Rate limiting
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
    RATE_LIMIT_STORAGE: str = os.getenv("RATE_LIMIT_STORAGE", "redis")  # redis or memory
    
    # CORS settings
    CORS_ORIGINS: List[str] = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else ["*"]
    CORS_ALLOW_CREDENTIALS: bool = os.getenv("CORS_ALLOW_CREDENTIALS", "true").lower() == "true"
    
    # Security headers
    SECURITY_HEADERS_ENABLED: bool = True
    HSTS_MAX_AGE: int = 31536000  # 1 year
    
    @validator("SECRET_KEY", "JWT_SECRET_KEY")
    def validate_secret_keys(cls, v):
        if len(v) < 32:
            raise ValueError("Secret keys must be at least 32 characters long")
        return v

class StripeConfig(BaseSettings):
    """Stripe payment configuration"""
    
    STRIPE_PUBLISHABLE_KEY: str = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_API_VERSION: str = "2023-10-16"
    
    # Webhook configuration
    STRIPE_WEBHOOK_TOLERANCE: int = 300  # 5 minutes
    
    @validator("STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET")
    def validate_stripe_keys(cls, v, field):
        if not v and os.getenv("ENVIRONMENT") == "production":
            raise ValueError(f"{field.name} is required in production")
        return v

class LLMConfig(BaseSettings):
    """LLM provider configuration"""
    
    # Anthropic (Claude)
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    ANTHROPIC_MODEL: str = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
    ANTHROPIC_MAX_TOKENS: int = int(os.getenv("ANTHROPIC_MAX_TOKENS", "4096"))
    ANTHROPIC_TIMEOUT: int = int(os.getenv("ANTHROPIC_TIMEOUT", "60"))
    
    # OpenAI (fallback)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4")
    
    # Groq (high-speed inference)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "mixtral-8x7b-32768")
    
    @validator("ANTHROPIC_API_KEY")
    def validate_anthropic_key(cls, v):
        if not v and os.getenv("ENVIRONMENT") == "production":
            raise ValueError("ANTHROPIC_API_KEY is required in production")
        return v

class MonitoringConfig(BaseSettings):
    """Monitoring and observability configuration"""
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "json"  # json or text
    LOG_FILE: Optional[str] = os.getenv("LOG_FILE")
    
    # Metrics
    METRICS_ENABLED: bool = os.getenv("METRICS_ENABLED", "true").lower() == "true"
    METRICS_PORT: int = int(os.getenv("METRICS_PORT", "9090"))
    
    # Health checks
    HEALTH_CHECK_ENABLED: bool = True
    HEALTH_CHECK_INTERVAL: int = 30  # seconds
    
    # Tracing
    TRACING_ENABLED: bool = os.getenv("TRACING_ENABLED", "false").lower() == "true"
    JAEGER_ENDPOINT: Optional[str] = os.getenv("JAEGER_ENDPOINT")
    
    # Error tracking
    SENTRY_DSN: Optional[str] = os.getenv("SENTRY_DSN")
    SENTRY_ENVIRONMENT: str = os.getenv("ENVIRONMENT", "production")

class ServerConfig(BaseSettings):
    """Server configuration"""
    
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    WORKERS: int = int(os.getenv("WORKERS", "4"))
    
    # Performance
    WORKER_CLASS: str = "uvicorn.workers.UvicornWorker"
    WORKER_CONNECTIONS: int = int(os.getenv("WORKER_CONNECTIONS", "1000"))
    MAX_REQUESTS: int = int(os.getenv("MAX_REQUESTS", "10000"))
    MAX_REQUESTS_JITTER: int = int(os.getenv("MAX_REQUESTS_JITTER", "1000"))
    TIMEOUT: int = int(os.getenv("TIMEOUT", "120"))
    KEEPALIVE: int = int(os.getenv("KEEPALIVE", "5"))
    
    # SSL/TLS
    SSL_KEYFILE: Optional[str] = os.getenv("SSL_KEYFILE")
    SSL_CERTFILE: Optional[str] = os.getenv("SSL_CERTFILE")
    SSL_CA_CERTS: Optional[str] = os.getenv("SSL_CA_CERTS")

class ProductionConfig(BaseSettings):
    """Main production configuration"""
    
    # Environment
    ENVIRONMENT: Environment = Environment(os.getenv("ENVIRONMENT", "production"))
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Application
    APP_NAME: str = "Agent Marketplace API"
    APP_VERSION: str = "2.0.0"
    API_PREFIX: str = "/api/v1"
    
    # Configuration sections
    database: DatabaseConfig = DatabaseConfig()
    redis: RedisConfig = RedisConfig()
    security: SecurityConfig = SecurityConfig()
    stripe: StripeConfig = StripeConfig()
    llm: LLMConfig = LLMConfig()
    monitoring: MonitoringConfig = MonitoringConfig()
    server: ServerConfig = ServerConfig()
    
    # Feature flags
    FEATURES: Dict[str, bool] = {
        "rate_limiting": True,
        "credit_system": True,
        "subscription_management": True,
        "webhook_processing": True,
        "audit_logging": True,
        "metrics_collection": True,
        "health_checks": True,
        "security_headers": True,
        "input_validation": True,
        "error_tracking": True
    }
    
    # Resource limits
    MAX_CONCURRENT_EXECUTIONS: int = int(os.getenv("MAX_CONCURRENT_EXECUTIONS", "100"))
    MAX_EXECUTION_TIME: int = int(os.getenv("MAX_EXECUTION_TIME", "300"))  # 5 minutes
    MAX_REQUEST_SIZE: int = int(os.getenv("MAX_REQUEST_SIZE", "10485760"))  # 10MB
    
    # Cache settings
    CACHE_TTL: int = int(os.getenv("CACHE_TTL", "3600"))  # 1 hour
    CACHE_MAX_SIZE: int = int(os.getenv("CACHE_MAX_SIZE", "1000"))
    
    @validator("ENVIRONMENT")
    def validate_environment(cls, v):
        if v == Environment.PRODUCTION:
            # Additional production validations
            required_env_vars = [
                "SECRET_KEY",
                "JWT_SECRET_KEY",
                "DATABASE_URL",
                "REDIS_URL",
                "ANTHROPIC_API_KEY"
            ]
            
            missing_vars = [var for var in required_env_vars if not os.getenv(var)]
            if missing_vars:
                raise ValueError(f"Missing required environment variables for production: {missing_vars}")
        
        return v
    
    def get_database_url(self) -> str:
        """Get database URL with proper SSL configuration"""
        url = self.database.DATABASE_URL
        
        if self.database.DATABASE_SSL_MODE and "sslmode" not in url:
            separator = "&" if "?" in url else "?"
            url += f"{separator}sslmode={self.database.DATABASE_SSL_MODE}"
        
        return url
    
    def get_redis_url(self) -> str:
        """Get Redis URL with proper configuration"""
        url = self.redis.REDIS_URL
        
        if self.redis.REDIS_SSL and not url.startswith("rediss://"):
            url = url.replace("redis://", "rediss://")
        
        return url
    
    def is_feature_enabled(self, feature: str) -> bool:
        """Check if a feature is enabled"""
        return self.FEATURES.get(feature, False)
    
    def get_cors_origins(self) -> List[str]:
        """Get CORS origins based on environment"""
        if self.ENVIRONMENT == Environment.PRODUCTION:
            # In production, never allow all origins
            origins = [origin for origin in self.security.CORS_ORIGINS if origin != "*"]
            if not origins:
                raise ValueError("CORS_ORIGINS must be specified in production (no wildcards allowed)")
            return origins
        
        return self.security.CORS_ORIGINS
    
    def get_log_config(self) -> Dict[str, Any]:
        """Get logging configuration"""
        config = {
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "default": {
                    "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                },
                "json": {
                    "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
                    "format": "%(asctime)s %(name)s %(levelname)s %(message)s"
                }
            },
            "handlers": {
                "default": {
                    "formatter": self.monitoring.LOG_FORMAT,
                    "class": "logging.StreamHandler",
                    "stream": "ext://sys.stdout"
                }
            },
            "root": {
                "level": self.monitoring.LOG_LEVEL,
                "handlers": ["default"]
            }
        }
        
        # Add file handler if specified
        if self.monitoring.LOG_FILE:
            config["handlers"]["file"] = {
                "formatter": self.monitoring.LOG_FORMAT,
                "class": "logging.handlers.RotatingFileHandler",
                "filename": self.monitoring.LOG_FILE,
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5
            }
            config["root"]["handlers"].append("file")
        
        return config

# Global configuration instance
config = ProductionConfig()

# Environment-specific configurations
def get_config() -> ProductionConfig:
    """Get configuration based on environment"""
    return config

def validate_production_config() -> List[str]:
    """Validate production configuration and return any issues"""
    issues = []
    
    try:
        config = ProductionConfig()
        
        # Check critical configurations
        if config.ENVIRONMENT == Environment.PRODUCTION:
            # Security checks
            if config.DEBUG:
                issues.append("DEBUG mode should be disabled in production")
            
            if "*" in config.security.CORS_ORIGINS:
                issues.append("CORS should not allow all origins in production")
            
            if not config.server.SSL_CERTFILE:
                issues.append("SSL certificate should be configured in production")
            
            # Database checks
            if "localhost" in config.database.DATABASE_URL:
                issues.append("Database should not be localhost in production")
            
            # Redis checks
            if "localhost" in config.redis.REDIS_URL:
                issues.append("Redis should not be localhost in production")
            
            # API key checks
            if not config.llm.ANTHROPIC_API_KEY:
                issues.append("Anthropic API key is required")
            
            if not config.stripe.STRIPE_SECRET_KEY:
                issues.append("Stripe secret key is required")
        
    except Exception as e:
        issues.append(f"Configuration validation error: {str(e)}")
    
    return issues

if __name__ == "__main__":
    # Validate configuration
    issues = validate_production_config()
    
    if issues:
        print("❌ Production configuration issues found:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("✅ Production configuration is valid")
    
    # Print configuration summary
    print(f"\n📋 Configuration Summary:")
    print(f"  Environment: {config.ENVIRONMENT}")
    print(f"  Debug: {config.DEBUG}")
    print(f"  Database: {config.database.DATABASE_URL.split('@')[1] if '@' in config.database.DATABASE_URL else 'Not configured'}")
    print(f"  Redis: {config.redis.REDIS_URL.split('@')[1] if '@' in config.redis.REDIS_URL else 'localhost'}")
    print(f"  Features enabled: {sum(config.FEATURES.values())}/{len(config.FEATURES)}")
