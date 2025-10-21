# Agent Marketplace API Documentation

**Version:** 2.0.0  
**Base URL:** `https://api.agentmarketplace.com`  
**Authentication:** API Key / JWT Token  

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [Error Handling](#error-handling)
5. [Core Endpoints](#core-endpoints)
6. [Agent Execution](#agent-execution)
7. [Payment & Billing](#payment--billing)
8. [User Management](#user-management)
9. [Monitoring & Health](#monitoring--health)
10. [SDKs & Examples](#sdks--examples)

## Overview

The Agent Marketplace API provides access to 10 specialized AI agents for enterprise automation, security, and data processing. The platform offers a subscription-based model with pay-per-execution pricing and comprehensive rate limiting.

### Available Agents

| Agent ID | Name | Category | Description |
|----------|------|----------|-------------|
| `security-scanner` | Security Scanner | Security | Vulnerability scanning and security analysis |
| `ticket-resolver` | Ticket Resolver | Support | Automated ticket resolution and support |
| `knowledge-base` | Knowledge Base | Information | Knowledge management and retrieval |
| `incident-responder` | Incident Responder | Security | Security incident response and analysis |
| `data-processor` | Data Processor | Data | ETL and data processing workflows |
| `deployment-agent` | Deployment Agent | DevOps | CI/CD and deployment automation |
| `audit-agent` | Audit Agent | Compliance | Compliance auditing and reporting |
| `report-generator` | Report Generator | Analytics | AI-powered report generation |
| `workflow-orchestrator` | Workflow Orchestrator | Automation | Complex workflow automation |
| `escalation-manager` | Escalation Manager | Support | Intelligent escalation routing |

### Subscription Tiers

| Tier | Monthly Price | Execution Price | Monthly Executions | Rate Limits |
|------|---------------|-----------------|-------------------|-------------|
| Solo | $0 | $0.005 | 0 | 5/min, 50/hour |
| Basic | $29 | $0.0095 | 1,000 | 20/min, 500/hour |
| Silver | $99 | $0.038 | 5,000 | 50/min, 2,000/hour |
| Standard | $199 | $0.0475 | 10,000 | 100/min, 5,000/hour |
| Premium | $499 | $0.076 | 25,000 | 200/min, 10,000/hour |
| Elite | $999 | $0.2375 | 50,000 | 500/min, 25,000/hour |
| BYOK | $99 | $0.002 | 100,000 | 1000/min, 50,000/hour |

## Authentication

### API Key Authentication

Include your API key in the request headers:

```http
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### JWT Token Authentication

For user-specific operations, use JWT tokens:

```http
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

### Getting API Keys

1. Register at [Agent Marketplace Dashboard](https://dashboard.agentmarketplace.com)
2. Navigate to API Keys section
3. Generate new API key with appropriate permissions

## Rate Limiting

Rate limits are enforced per subscription tier:

- **Requests per minute**: Tier-specific limits
- **Requests per hour**: Extended tier limits  
- **Concurrent executions**: Maximum parallel agent executions
- **Agent executions per hour**: Specific limits for agent operations

### Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
Retry-After: 60
```

### Rate Limit Exceeded

When rate limits are exceeded, you'll receive a `429 Too Many Requests` response:

```json
{
  "error": "Rate limit exceeded",
  "message": "requests_per_minute limit exceeded. Try again in 45 seconds.",
  "retry_after": 45,
  "limit": 100,
  "remaining": 0
}
```

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 402 | Payment Required (Insufficient Credits) |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

### Error Response Format

```json
{
  "error": "validation_error",
  "message": "Invalid request parameters",
  "details": {
    "field": "task",
    "issue": "Task description is required"
  },
  "timestamp": "2025-10-21T10:30:00Z",
  "request_id": "req_123456789"
}
```

## Core Endpoints

### Get Available Packages

```http
GET /api/v1/packages
```

**Response:**
```json
{
  "packages": [
    {
      "id": "security-scanner",
      "name": "Security Scanner",
      "description": "Advanced vulnerability scanning and security analysis",
      "category": "Security",
      "price": 0.15,
      "status": "active",
      "features": ["Vulnerability Detection", "Compliance Scanning", "Risk Assessment"],
      "tier_support": "All Tiers"
    }
  ],
  "total": 10
}
```

### Get Package Details

```http
GET /api/v1/packages/{package_id}
```

**Response:**
```json
{
  "id": "security-scanner",
  "name": "Security Scanner",
  "description": "Advanced vulnerability scanning and security analysis",
  "category": "Security",
  "price": 0.15,
  "status": "active",
  "features": ["Vulnerability Detection", "Compliance Scanning", "Risk Assessment"],
  "tier_support": "All Tiers",
  "capabilities": [
    "Network vulnerability scanning",
    "Web application security testing",
    "Compliance framework assessment",
    "Risk prioritization and reporting"
  ],
  "input_parameters": {
    "target": "string (required) - Target to scan",
    "scan_type": "string (optional) - Type of scan to perform",
    "options": "object (optional) - Additional scan options"
  },
  "output_format": {
    "scan_id": "string - Unique scan identifier",
    "vulnerabilities": "array - List of discovered vulnerabilities",
    "summary": "object - Scan summary and statistics",
    "recommendations": "array - Security recommendations"
  }
}
```

### Get Categories

```http
GET /api/v1/categories
```

**Response:**
```json
{
  "categories": [
    {
      "id": "security",
      "name": "Security",
      "description": "Security and compliance agents",
      "agent_count": 3,
      "agents": [
        {
          "id": "security-scanner",
          "name": "Security Scanner",
          "price": 0.15
        }
      ]
    }
  ]
}
```

## Agent Execution

### Execute Agent

```http
POST /api/v1/packages/{package_id}/execute
```

**Request Body:**
```json
{
  "package_id": "security-scanner",
  "task": "Scan example.com for vulnerabilities",
  "input_data": {
    "target": "example.com",
    "scan_type": "comprehensive",
    "options": {
      "include_ssl": true,
      "check_headers": true
    }
  },
  "engine_type": "claude"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "scan_id": "scan_1640995200_abc123",
    "target": "example.com",
    "vulnerabilities": [
      {
        "id": "vuln_001",
        "severity": "medium",
        "title": "Missing Security Headers",
        "description": "The target is missing important security headers",
        "recommendation": "Implement Content-Security-Policy and X-Frame-Options headers"
      }
    ],
    "summary": {
      "total_vulnerabilities": 1,
      "critical": 0,
      "high": 0,
      "medium": 1,
      "low": 0,
      "scan_duration": "45 seconds"
    },
    "billing_info": {
      "cost": 0.15,
      "covered_by_subscription": false,
      "remaining_credits": 99.85,
      "tier": "premium"
    }
  },
  "execution_id": "exec_1640995200",
  "duration_ms": 2500,
  "agent_used": "security-scanner",
  "timestamp": "2025-10-21T10:30:00Z"
}
```

### Agent-Specific Examples

#### Security Scanner
```json
{
  "package_id": "security-scanner",
  "task": "Perform comprehensive security scan of web application",
  "input_data": {
    "target": "https://example.com",
    "scan_type": "comprehensive",
    "options": {
      "include_ssl": true,
      "check_headers": true,
      "scan_depth": "deep"
    }
  }
}
```

#### Ticket Resolver
```json
{
  "package_id": "ticket-resolver",
  "task": "Resolve customer support ticket",
  "input_data": {
    "ticket_id": "TICKET-123",
    "title": "Login issues",
    "description": "Users cannot log in to the system",
    "priority": "high",
    "category": "authentication"
  }
}
```

#### Data Processor
```json
{
  "package_id": "data-processor",
  "task": "Process and transform customer data",
  "input_data": {
    "job_id": "job-456",
    "data_source": "csv",
    "operations": ["clean", "validate", "transform"],
    "output_format": "json"
  }
}
```

## Payment & Billing

### Get Subscription Tiers

```http
GET /api/v1/tiers
```

**Response:**
```json
{
  "tiers": [
    {
      "id": "premium",
      "name": "Premium",
      "monthly_price": 499.00,
      "execution_price": 0.076,
      "monthly_executions": 25000,
      "features": [
        "All features",
        "Dedicated support",
        "Custom integrations"
      ],
      "rate_limits": {
        "requests_per_minute": 200,
        "requests_per_hour": 10000,
        "agent_executions_per_hour": 2000,
        "concurrent_executions": 20
      }
    }
  ]
}
```

### Get Credit Packages

```http
GET /api/v1/credits/packages
```

**Response:**
```json
{
  "packages": [
    {
      "id": "business",
      "name": "Business Pack",
      "price": 100.00,
      "credits": 100.00,
      "bonus_credits": 15.00,
      "total_credits": 115.00,
      "description": "Ideal for growing businesses",
      "value_per_dollar": 1.15
    }
  ],
  "total": 5
}
```

### Create Payment Intent

```http
POST /api/v1/payments/create-intent
```

**Request Body:**
```json
{
  "amount": 100.00,
  "customer_email": "user@example.com",
  "package": "business"
}
```

**Response:**
```json
{
  "client_secret": "pi_1234567890_secret_abcdef",
  "payment_intent_id": "pi_1234567890",
  "amount": 100.00,
  "status": "requires_payment_method"
}
```

### Purchase Credits

```http
POST /api/v1/credits/purchase
```

**Request Body:**
```json
{
  "customer_email": "user@example.com",
  "package": "business",
  "payment_method_id": "pm_1234567890"
}
```

**Response:**
```json
{
  "purchase_id": "cp_1640995200",
  "credits_purchased": 100.00,
  "bonus_credits": 15.00,
  "total_credits": 115.00,
  "amount": 100.00,
  "status": "succeeded"
}
```

### Create Subscription

```http
POST /api/v1/subscriptions/create
```

**Request Body:**
```json
{
  "customer_email": "user@example.com",
  "tier": "premium",
  "trial_days": 7,
  "name": "John Doe"
}
```

**Response:**
```json
{
  "subscription_id": "sub_1234567890",
  "tier": "premium",
  "status": "trialing",
  "monthly_price": 499.00,
  "execution_price": 0.076,
  "monthly_executions_included": 25000,
  "current_period_end": "2025-11-21T10:30:00Z"
}
```

## User Management

### Get Current User

```http
GET /api/v1/auth/me
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "credits": 99.85,
  "tier": "premium",
  "created_at": "2025-01-01T00:00:00Z",
  "subscription": {
    "tier": "premium",
    "status": "active",
    "current_period_end": "2025-11-21T10:30:00Z"
  }
}
```

### User Login

```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "tier": "premium"
  }
}
```

### User Registration

```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "tier": "solo",
    "credits": 10.00
  }
}
```

### Get User Credits

```http
GET /api/v1/user/credits
```

**Response:**
```json
{
  "balance": 99.85,
  "transactions": [
    {
      "id": "tx_1640995200_1",
      "type": "agent_execution",
      "amount": -0.15,
      "balance_after": 99.85,
      "description": "Agent execution: security-scanner",
      "created_at": "2025-10-21T10:30:00Z"
    }
  ]
}
```

### Get User Rate Limits

```http
GET /api/v1/user/rate-limits
```

**Response:**
```json
{
  "user_id": 1,
  "tier": "premium",
  "rate_limits": {
    "requests_per_minute": {
      "allowed": true,
      "limit": 200,
      "remaining": 195,
      "reset_time": 1640995260
    },
    "concurrent_executions": {
      "allowed": true,
      "limit": 20,
      "remaining": 20,
      "reset_time": 1640995560
    }
  }
}
```

### Get User Usage

```http
GET /api/v1/user/usage
```

**Response:**
```json
{
  "user_id": 1,
  "current_month": "2025-10",
  "usage_summary": {
    "total_executions": 15,
    "total_cost": 2.25,
    "credits_used": 2.25
  },
  "subscription": {
    "tier": "premium",
    "monthly_executions_included": 25000,
    "executions_used_this_period": 15,
    "execution_price": 0.076
  }
}
```

### Get User Executions

```http
GET /api/v1/user/executions
```

**Response:**
```json
{
  "executions": [
    {
      "id": "exec_1640995200",
      "agent_id": "security-scanner",
      "task": "Scan example.com for vulnerabilities",
      "success": true,
      "duration_ms": 2500,
      "cost": 0.15,
      "created_at": "2025-10-21T10:30:00Z"
    }
  ],
  "total": 15,
  "page": 1,
  "per_page": 50
}
```

## Monitoring & Health

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-21T10:30:00Z",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection OK",
      "duration_ms": 5.2
    },
    "redis": {
      "status": "healthy", 
      "message": "Redis connection OK",
      "duration_ms": 2.1
    }
  },
  "uptime_seconds": 86400
}
```

### System Metrics

```http
GET /metrics
```

**Response:**
```json
{
  "timestamp": "2025-10-21T10:30:00Z",
  "application_metrics": {
    "counters": {
      "requests_total": 1500,
      "agent_executions_total": 250
    },
    "gauges": {
      "active_users": 45,
      "system_cpu_percent": 25.5
    }
  },
  "system_metrics": {
    "cpu_percent": 25.5,
    "memory_percent": 45.2,
    "timestamp": "2025-10-21T10:30:00Z"
  }
}
```

### Prometheus Metrics

```http
GET /metrics/prometheus
```

**Response:**
```
# HELP agent_marketplace_info Agent Marketplace information
# TYPE agent_marketplace_info gauge
agent_marketplace_info{version="2.0.0"} 1

# TYPE requests_total counter
requests_total 1500

# TYPE system_cpu_percent gauge
system_cpu_percent 25.5
```

### System Status

```http
GET /api/v1/system/status
```

**Response:**
```json
{
  "system": "Agent Marketplace API",
  "version": "2.0.0",
  "environment": "production",
  "health": {
    "status": "healthy",
    "checks": {
      "database": {"status": "healthy"},
      "redis": {"status": "healthy"}
    }
  },
  "features": {
    "rate_limiting": true,
    "credit_system": true,
    "subscription_management": true,
    "monitoring": true
  }
}
```

## SDKs & Examples

### Python SDK

```python
from agent_marketplace import AgentMarketplace

# Initialize client
client = AgentMarketplace(api_key="your_api_key")

# Execute agent
result = client.execute_agent(
    agent_id="security-scanner",
    task="Scan example.com for vulnerabilities",
    input_data={
        "target": "example.com",
        "scan_type": "comprehensive"
    }
)

print(f"Scan completed: {result.success}")
print(f"Vulnerabilities found: {len(result.result['vulnerabilities'])}")
```

### JavaScript SDK

```javascript
import { AgentMarketplace } from '@agent-marketplace/sdk';

// Initialize client
const client = new AgentMarketplace({
  apiKey: 'your_api_key'
});

// Execute agent
const result = await client.executeAgent({
  agentId: 'security-scanner',
  task: 'Scan example.com for vulnerabilities',
  inputData: {
    target: 'example.com',
    scanType: 'comprehensive'
  }
});

console.log(`Scan completed: ${result.success}`);
console.log(`Vulnerabilities found: ${result.result.vulnerabilities.length}`);
```

### cURL Examples

```bash
# Get available packages
curl -X GET "https://api.agentmarketplace.com/api/v1/packages" \
  -H "Authorization: Bearer YOUR_API_KEY"

# Execute security scanner
curl -X POST "https://api.agentmarketplace.com/api/v1/packages/security-scanner/execute" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "package_id": "security-scanner",
    "task": "Scan example.com for vulnerabilities",
    "input_data": {
      "target": "example.com",
      "scan_type": "comprehensive"
    }
  }'

# Get user credits
curl -X GET "https://api.agentmarketplace.com/api/v1/user/credits" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Support & Resources

- **Documentation**: [https://docs.agentmarketplace.com](https://docs.agentmarketplace.com)
- **Dashboard**: [https://dashboard.agentmarketplace.com](https://dashboard.agentmarketplace.com)
- **Support**: [support@agentmarketplace.com](mailto:support@agentmarketplace.com)
- **Status Page**: [https://status.agentmarketplace.com](https://status.agentmarketplace.com)
- **GitHub**: [https://github.com/agentmarketplace/api](https://github.com/agentmarketplace/api)

## Changelog

### Version 2.0.0 (2025-10-21)
- Added 10 specialized AI agents
- Implemented comprehensive payment system
- Added advanced rate limiting
- Enhanced security and monitoring
- Production-ready deployment

### Version 1.0.0 (2025-01-01)
- Initial API release
- Basic agent execution
- Simple authentication
