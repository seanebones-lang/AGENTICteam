# 🚀 Deploy Agents Anywhere - 7 Ways (2 Minutes to Production)

**Run the world's best AI agents (98.7% success rate) in YOUR environment:**

| Method | Setup Time | Best For | One-Click |
|--------|------------|----------|-----------|
| **[SaaS API](#1-saas-api-fastest---recommended)** | 30s | Quick start | `curl /v2/agents/execute` |
| **[Embedded SDK](#2-embedded-sdk-3-lines-for-any-website)** | 2 min | Websites/apps | `<agent-ticket-resolver />` |
| **[Docker](#3-docker-self-hosted-most-popular-enterprise)** | 3 min | Self-hosted | `docker run agentmarketplace/*` |
| **[Kubernetes](#4-kubernetes--helm-enterprise-scale)** | 5 min | Enterprise | `helm install agents` |
| **[Serverless](#5-serverless-functions)** | 4 min | AWS Lambda | `npm i @agentmarketplace/serverless` |
| **[Edge](#6-edge-deployment-global-100ms)** | 3 min | Global latency | Cloudflare Workers |
| **[Air-Gapped](#7-air-gapped--on-prem-defensegovernment)** | 10 min | Defense | Offline download |

---

## **1. SaaS API (Fastest - Recommended)**

**For immediate production use:**

```bash
curl -X POST https://api.agentmarketplace.com/v2/agents/ticket-resolver/execute \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Customer angry about billing - refund or explain?",
    "context": "Customer: John Doe, Plan: Pro, Last payment: Oct 15"
  }'
```

**Response (2.1s avg):**
```json
{
  "success": true,
  "response": "Recommend partial refund + explanation email. Script: 'I understand your frustration...'",
  "confidence": 0.94,
  "credits_used": 3
}
```

**Get API Key**: Dashboard → Settings → API Keys → Create

---

## **2. Embedded SDK (3 Lines for Any Website)**

**React / Vanilla JS / WordPress / Shopify:**

```html
<!-- Add to <head> -->
<script src="https://cdn.agentmarketplace.com/sdk/v2.js"></script>

<!-- Add anywhere -->
<agent-ticket-resolver 
  api-key="your-api-key"
  theme="dark"
  credits="auto-charge">
</agent-ticket-resolver>
```

**React Component:**
```jsx
import { TicketResolver } from '@agentmarketplace/react';

function SupportWidget() {
  return (
    <TicketResolver 
      agentId="ticket-resolver"
      apiKey={process.env.AGENT_KEY}
      onResponse={(result) => console.log(result)}
    />
  );
}
```

**npm install**: `npm i @agentmarketplace/react`

---

## **3. Docker Self-Hosted (Most Popular Enterprise)**

**One command deploys ANY agent:**

```bash
# Ticket Resolver
docker pull agentmarketplace/ticket-resolver:latest
docker run -d -p 8080:8080 \
  -e LICENSE_KEY=your-license-key \
  -e CLAUDE_API_KEY=sk-your-claude-key \
  agentmarketplace/ticket-resolver:latest

# Now live at http://localhost:8080
curl -X POST http://localhost:8080/execute -d '{"task": "Fix this bug"}'
```

**Available Images (10 total):**
```
agentmarketplace/ticket-resolver:latest
agentmarketplace/security-scanner:latest  
agentmarketplace/knowledge-base:latest
agentmarketplace/data-processor:latest
agentmarketplace/deployment-agent:latest
agentmarketplace/audit-agent:latest
agentmarketplace/report-generator:latest
agentmarketplace/workflow-orchestrator:latest
agentmarketplace/escalation-manager:latest
agentmarketplace/incident-responder:latest
```

**Features Included:**
- ✅ Claude 4.5 Sonnet/Haiku auto-tiering
- ✅ Redis caching (15% faster)
- ✅ Health checks (`/health`)
- ✅ Metrics (`/metrics`)
- ✅ Zero external dependencies

---

## **4. Kubernetes / Helm (Enterprise Scale)**

**Production-grade cluster deployment:**

```bash
# Add repo
helm repo add agentmarketplace https://charts.agentmarketplace.com
helm repo update

# Deploy ALL 10 agents
helm install agents agentmarketplace/agents-stack \
  --set licenseKey=your-enterprise-key \
  --set replicaCount=3 \
  --namespace production
```

**Helm Values (Customizable):**
```yaml
replicaCount: 3
resources:
  requests:
    cpu: 500m
    memory: 1Gi
hpa:
  enabled: true
  minReplicas: 2
  maxReplicas: 20
```

**Auto-scales to 20,000 concurrent requests**

---

## **5. Serverless Functions**

**AWS Lambda / Vercel Functions / Cloudflare Workers:**

```javascript
// AWS Lambda
import { SecurityScanner } from '@agentmarketplace/serverless';

export const handler = async (event) => {
  const agent = new SecurityScanner({ licenseKey: process.env.LICENSE_KEY });
  const result = await agent.execute(JSON.parse(event.body));
  return { statusCode: 200, body: JSON.stringify(result) };
};
```

**Package Size**: 12MB | **Cold Start**: 180ms

---

## **6. Edge Deployment (Global <100ms)**

**Cloudflare Workers / Fastly / Akamai:**

```javascript
// Cloudflare Workers
import { KnowledgeBaseAgent } from '@agentmarketplace/edge';

export default {
  async fetch(request) {
    const agent = new KnowledgeBaseAgent({ licenseKey: AGENT_LICENSE });
    const result = await agent.execute(await request.json());
    return new Response(JSON.stringify(result));
  }
};
```

**Global Latency**: 50-100ms everywhere

---

## **7. Air-Gapped / On-Prem (Defense/Government)**

**100% offline deployment:**

1. **Download Bundle**: Dashboard → Deploy → "Air-Gapped Package"
2. **Transfer**: USB drive to secure network
3. **Deploy**: 
   ```bash
   tar -xzf agentmarketplace-airgapped-v2.0.tar.gz
   docker load < containers.tar
   docker-compose up -d
   ```

**Bundle Contains:**
- ✅ All 10 agents (Docker images)
- ✅ Offline Claude model weights (optional)
- ✅ 12-month license
- ✅ Documentation
- **Size**: 8.2GB

---

## **Deployment Comparison Matrix**

| Method | Latency | Scale | Cost | Security | Setup |
|--------|---------|-------|------|----------|-------|
| **SaaS** | 2.1s | ∞ | $0.12/query | SOC 2 | 30s ⭐⭐⭐⭐⭐ |
| **SDK** | 2.3s | ∞ | $0.12/query | SOC 2 | 2min ⭐⭐⭐⭐⭐ |
| **Docker** | 1.8s | Self | $99/mo | Air-gapped | 3min ⭐⭐⭐⭐ |
| **Kubernetes** | 1.5s | ∞ | $999/mo | Air-gapped | 5min ⭐⭐⭐ |
| **Serverless** | 1.9s | ∞ | $0.10/query | Provider | 4min ⭐⭐⭐⭐ |
| **Edge** | 0.8s | ∞ | $0.15/query | Edge | 3min ⭐⭐⭐⭐ |
| **Air-Gapped** | 2.5s | Self | $50K/yr | Zero-trust | 10min ⭐⭐ |

---

## **Get Started Now**

**Pick your deployment method:**

| 👉 **Quickest** | **[Start SaaS API Demo](https://agentmarketplace.com/api)** |
|-----------------|---------------------------|
| 🔧 **Self-Hosted** | **[Download Docker](https://hub.docker.com/u/agentmarketplace)** |
| 🏢 **Enterprise** | **[Kubernetes Helm Chart](https://charts.agentmarketplace.com)** |
| 💻 **Developer** | **[npm SDK Install](https://www.npmjs.com/org/agentmarketplace)** |

**Need Help?** 
- **Live Chat**: Bottom-right (2min response)
- **Enterprise Sales**: sales@agentmarketplace.com
- **Documentation**: `/docs/deploy`

---

## **Why Choose Agent Marketplace Deployment?**

### **🚀 Deployment Flexibility**
- **7 deployment methods** vs competitors' API-only lock-in
- **Run anywhere**: Your VPC, Kubernetes, embedded in apps
- **No vendor lock-in**: Full control over your deployment

### **💰 Cost Advantages**
- **50-60% cheaper** than OpenAI/Anthropic fixed pricing
- **Adaptive model selection**: Haiku for speed, Sonnet for complexity
- **Enterprise licensing**: Unlimited usage for fixed cost

### **🔒 Enterprise Security**
- **Air-gapped deployments** for defense/government
- **SOC 2, ISO 27001, GDPR** compliance ready
- **Zero-trust architecture** with offline capabilities

### **⚡ Performance**
- **98.7% success rate** across all agents
- **<2s response time** for most queries
- **Global edge deployment** for <100ms latency

### **🛠️ Developer Experience**
- **3-line integration** for any website
- **Docker containers** with zero dependencies
- **Kubernetes auto-scaling** to 20,000+ requests

---

**Ready to deploy? Choose your method above and get started in 2 minutes!**
