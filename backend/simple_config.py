#!/usr/bin/env python3
"""
Simple Production Configuration for Agent Marketplace
Basic configuration without complex dependencies
"""

import os
from typing import Dict, Any, List
from enum import Enum

class Environment(str, Enum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"

class SimpleConfig:
    """Simple configuration class"""
    
    def __init__(self):
        # Environment
        self.ENVIRONMENT = Environment(os.getenv("ENVIRONMENT", "production"))
        self.DEBUG = os.getenv("DEBUG", "false").lower() == "true"
        
        # Application
        self.APP_NAME = "Agent Marketplace API"
        self.APP_VERSION = "2.0.0"
        self.API_PREFIX = "/api/v1"
        
        # Security
        self.SECRET_KEY = os.getenv("SECRET_KEY", "development-secret-key-change-in-production")
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key-change-in-production")
        
        # Database
        self.DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///agent_marketplace.db")
        
        # Redis
        self.REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        
        # LLM Configuration
        self.ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
        self.ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
        
        # Stripe
        self.STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
        self.STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
        
        # Server
        self.HOST = os.getenv("HOST", "0.0.0.0")
        self.PORT = int(os.getenv("PORT", "8000"))
        
        # Feature flags
        self.FEATURES = {
            "rate_limiting": True,
            "credit_system": True,
            "subscription_management": True,
            "webhook_processing": True,
            "audit_logging": True,
            "metrics_collection": True,
            "health_checks": True,
            "security_headers": True,
            "input_validation": True,
            "error_tracking": True,
            "monitoring": True
        }
        
        # Monitoring
        self.LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
        self.METRICS_ENABLED = os.getenv("METRICS_ENABLED", "true").lower() == "true"
        
        # CORS
        cors_origins = os.getenv("CORS_ORIGINS", "")
        if cors_origins:
            self.CORS_ORIGINS = cors_origins.split(",")
        else:
            self.CORS_ORIGINS = ["*"]
    
    def is_feature_enabled(self, feature: str) -> bool:
        """Check if a feature is enabled"""
        return self.FEATURES.get(feature, False)
    
    def get_cors_origins(self) -> List[str]:
        """Get CORS origins based on environment"""
        if self.ENVIRONMENT == Environment.PRODUCTION:
            # In production, filter out wildcards
            origins = [origin for origin in self.CORS_ORIGINS if origin != "*"]
            if not origins:
                # Default production origins
                return [
                    "https://bizbot.store",
                    "https://www.bizbot.store"
                ]
            return origins
        
        return self.CORS_ORIGINS

def validate_production_config() -> List[str]:
    """Validate production configuration and return any issues"""
    issues = []
    config = SimpleConfig()
    
    try:
        # Check critical configurations
        if config.ENVIRONMENT == Environment.PRODUCTION:
            # Security checks
            if config.DEBUG:
                issues.append("DEBUG mode should be disabled in production")
            
            if "*" in config.CORS_ORIGINS:
                issues.append("CORS should not allow all origins in production")
            
            # Database checks
            if "sqlite" in config.DATABASE_URL.lower():
                issues.append("SQLite should not be used in production")
            
            # API key checks
            if not config.ANTHROPIC_API_KEY:
                issues.append("Anthropic API key is required")
            
            if not config.STRIPE_SECRET_KEY:
                issues.append("Stripe secret key is required")
            
            # Secret key checks
            if config.SECRET_KEY == "development-secret-key-change-in-production":
                issues.append("Default secret key should be changed in production")
        
    except Exception as e:
        issues.append(f"Configuration validation error: {str(e)}")
    
    return issues

# Global configuration instance
config = SimpleConfig()

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
    print(f"  Database: {config.DATABASE_URL}")
    print(f"  Features enabled: {sum(config.FEATURES.values())}/{len(config.FEATURES)}")
    print(f"  CORS origins: {len(config.CORS_ORIGINS)}")
    print(f"  Monitoring: {config.METRICS_ENABLED}")
