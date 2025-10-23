<!-- a66d77c8-bfc4-4c2d-9574-6fa0d46e9d9b adf3f79a-27fc-48e0-9b9b-cec368295721 -->
# Agent Marketplace v2.0 - Engineering Rebuild Plan

## Executive Summary
Full rebuild of BizBot.Store agent marketplace to eliminate crashes, login issues, and agent downtimes. Using cutting-edge October 2025 technology stack with enterprise-grade stability and modern UI/UX.

## Tech Stack Updates (Latest Stable Versions)

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

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel Edge)                    │
│ Next.js 16 + React 19.2 + TypeScript + Tailwind + Shadcn/UI │
│              Theme Toggle (Light/Dark) Bottom-Right          │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS/TLS 1.3 + JWT Refresh
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway v2 (Render K8s)                 │
│  FastAPI 0.119.1 + Uvicorn + Auto-scaling + Health Checks   │
│              Rate Limiting + Circuit Breakers                │
└─────────────────────────────────────────────────────────────┘
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ PostgreSQL 18 │   │ Redis 8.0.4  │   │ Qdrant 1.15  │
│ (HA Replicas) │   │ (Clustering) │   │ (Vectors HA) │
└──────────────┘   └──────────────┘   └──────────────┘
```

## Key Implementation Details

### 1. Authentication & Sessions
- JWT with refresh tokens (15-min access, 7-day refresh)
- Redis-persisted sessions with HA clustering
- Google OAuth + Email/Password options
- Rate limiting: 100 req/min per user
- Automatic session recovery on network issues

### 2. Free Trial System
- Universal 3-query limit across ALL agents (not per agent)
- Redis tracking by user_id + device fingerprint
- Clear paywall modal after 3rd query
- No "special" agent focus - all equal access

### 3. UI/UX Implementation

#### Navigation Structure
- Top bar: Logo | Home | Agents | Playground | Dashboard | Pricing | Support | Docs | Login/Signup
- Theme toggle: Small sun/moon icon at bottom-right (24px, subtle)
- Search bar for agent discovery

#### Theme System
```typescript
// Light Theme
colors: {
  background: '#FFFFFF',
  foreground: '#000000',
  primary: '#0070F3',
  secondary: '#F5F5F5'
}

// Dark Theme  
colors: {
  background: '#000000',
  foreground: '#FFFFFF',
  primary: '#0EA5E9',
  secondary: '#1A1A1A'
}
```

- Using `next-themes` for flicker-free switching
- System preference detection on first load
- LocalStorage persistence
- Server-side rendering support

### 4. Agent Reliability
- All 10 agents active from day one
- Retry logic with exponential backoff (429/500 errors)
- Celery task queues for async execution
- Fallback to cached responses on API failures
- Circuit breakers per agent (prevent cascading failures)

### 5. Database Schema Updates

#### New Tables
```sql
-- User sessions with refresh tokens
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMP,
    device_fingerprint TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Free trial tracking
CREATE TABLE free_trial_usage (
    id UUID PRIMARY KEY,
    user_id UUID,
    device_fingerprint TEXT,
    agent_id TEXT,
    query_count INT DEFAULT 0,
    first_query_at TIMESTAMP,
    last_query_at TIMESTAMP,
    UNIQUE(user_id, device_fingerprint)
);
```

### 6. API v2 Structure
```
/api/v2/
├── auth/
│   ├── login
│   ├── refresh
│   ├── logout
│   └── session
├── agents/
│   ├── list
│   ├── {id}/execute
│   ├── {id}/status
│   └── {id}/history
├── credits/
│   ├── balance
│   ├── purchase
│   └── history
├── usage/
│   ├── stats
│   ├── limits
│   └── executions
└── admin/
    ├── metrics
    ├── health
    └── circuit-breakers
```

### 7. Testing Strategy
- Unit tests: 90% coverage target
- E2E tests: Playwright for critical user flows
- Load tests: Artillery.io simulating 5K concurrent users
- Security tests: OWASP ZAP automated scans
- Performance tests: Lighthouse CI for frontend

### 8. CI/CD Pipeline

#### GitHub Actions Workflow
- Lint → Test → Build → Deploy
- Parallel frontend/backend testing
- Automated security scanning
- Blue-green deployment to Render/Vercel
- Rollback on >1% error rate

### 9. Monitoring & Alerting
- Sentry for error tracking (auto-issue creation)
- Datadog for metrics (custom dashboards)
- PagerDuty integration for critical alerts
- Weekly automated performance reports

### 10. Data Migration Plan
1. Create migration scripts for users, credits, execution history
2. Test migration on staging environment
3. Schedule 1-hour maintenance window
4. Run blue-green cutover with rollback capability
5. Verify data integrity post-migration

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Set up new repo structure
- Initialize tech stack with latest versions
- Create base UI components with theme system
- Implement JWT auth with refresh tokens
- Set up CI/CD pipeline

### Phase 2: Core Features (Weeks 2-3)
- Build all 10 agent integrations with Claude tiering
- Implement universal free trial system
- Create agent execution engine with retries
- Build credit/billing system
- Implement rate limiting and circuit breakers

### Phase 3: Testing & Migration (Week 4)
- Write comprehensive test suite
- Perform load testing
- Create and test data migration scripts
- Security audit and penetration testing
- Performance optimization

### Phase 4: Deployment (Week 5)
- Deploy to staging environment
- Run migration dry-run
- Execute production migration
- Blue-green deployment
- Monitor initial traffic

### Phase 5: Polish & Launch (Week 6)
- Fix any discovered issues
- Optimize based on real usage
- A/B test UI elements
- Complete documentation
- Marketing launch

## Success Metrics
- 99.99% uptime (measured monthly)
- <1s page load time (P95)
- <5s agent response time (P95)
- 0% login failures (excluding user error)
- <0.1% transaction failures
- 90%+ test coverage
- Zero security vulnerabilities (OWASP scan)

## Risk Mitigation
- Automated rollback on deployment failures
- Feature flags for gradual rollout
- Comprehensive logging for debugging
- Regular automated backups
- Disaster recovery plan with RTO <1hr

## Estimated Resources
- Team: 4 engineers (Lead Dev, UI Specialist, DevOps, QA)
- Timeline: 6 weeks total
- Cost: $50-75K (includes team + infrastructure)

This rebuild will deliver a bulletproof, scalable platform with exceptional user experience and rock-solid reliability.

### To-dos

- [ ] Initialize new repository structure with Next.js 16, FastAPI 0.119.1, and configure development environment
- [ ] Build JWT authentication system with refresh tokens and Redis session management
- [ ] Develop Shadcn/UI component library with light/dark theme system and theme toggle
- [ ] Implement agent execution engine with Claude Haiku/Sonnet tiering and retry logic
- [ ] Create universal 3-query free trial system with Redis tracking
- [ ] Port and optimize all 10 agents to new architecture with proper error handling
- [ ] Configure PostgreSQL 18, Redis 8.0.4, and Qdrant 1.15 with HA and clustering
- [ ] Set up Sentry, Datadog, and Prometheus with alerting rules
- [ ] Create new API v2 structure with proper versioning and deprecation strategy
- [ ] Develop data migration scripts for users, credits, and execution history
- [ ] Write unit tests (90% coverage), E2E tests (Playwright), and load tests (Artillery)
- [ ] Configure GitHub Actions for automated testing and blue-green deployment
- [ ] Perform OWASP security audit and penetration testing
- [ ] Deploy to staging environment and run migration dry-run
- [ ] Execute production migration and blue-green deployment with monitoring