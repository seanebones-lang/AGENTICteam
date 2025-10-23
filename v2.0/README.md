# Agent Marketplace v2.0

## Overview
Complete rebuild of BizBot.Store agent marketplace using cutting-edge October 2025 technology stack for 99.99% uptime, bulletproof stability, and enhanced UX.

## Tech Stack

### Frontend
- **Next.js 16** (Oct 21, 2025) - Turbopack, React Compiler, Edge Functions
- **React 19.2** (Oct 1, 2025) - Concurrent features, improved hooks
- **TypeScript 5.6** - Enhanced type safety
- **Tailwind CSS 4.1.15** (Oct 20, 2025) - Built-in dark mode optimizations
- **Shadcn/UI** - Headless components with accessibility

### Backend
- **FastAPI 0.119.1** (Oct 20, 2025) - 30% async performance boost
- **Python 3.13** - Latest optimizations
- **LangChain 0.3.5** (Oct 21, 2025) - Claude 4.5 optimized
- **CrewAI 1.1.0** (Oct 21, 2025) - Multi-agent orchestration
- **PostgreSQL 18** (Sep 25, 2025) - Built-in vector extensions
- **Redis 8.0.4** (Oct 2025) - Clustering for HA sessions
- **Qdrant 1.15** (Jul 2025 + Oct patches) - Vector DB for RAG

### AI Models
- **Claude Haiku 4.5** - Light/medium agents (faster, cheaper)
- **Claude Sonnet 4.5** - Heavy agents (superior reasoning)

## Key Features
- Universal 3-query free trial across all agents
- JWT authentication with refresh tokens
- Light/Dark theme toggle (bottom-right)
- All 10 agents active from day one
- 99.99% uptime target
- Blue-green deployment
- Comprehensive monitoring

## Quick Start

### Prerequisites
- Node.js 22+
- Python 3.13+
- Docker & Docker Compose
- API keys: ANTHROPIC_API_KEY

### Development Setup
```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Production Deployment
```bash
# Using Docker Compose
docker-compose up -d

# Or deploy to Vercel/Render
npm run build
vercel --prod
```

## Architecture
```
Frontend (Vercel Edge) → API Gateway v2 (Render K8s) → Databases (PostgreSQL/Redis/Qdrant)
```

## API v2 Endpoints
- `/api/v2/auth/*` - Authentication
- `/api/v2/agents/*` - Agent management
- `/api/v2/credits/*` - Credit system
- `/api/v2/usage/*` - Usage tracking
- `/api/v2/admin/*` - Admin functions

## Monitoring
- Sentry for error tracking
- Datadog for metrics
- Prometheus + Grafana
- Automated alerting

## License
MIT
