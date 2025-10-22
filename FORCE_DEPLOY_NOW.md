# FORCE RENDER DEPLOYMENT

**CRITICAL: Agents using mock data - need new deployment NOW**

## Manual Deploy Steps

1. **Go to Render Dashboard:**
   https://dashboard.render.com

2. **Select your backend service** (bizbot-api or similar)

3. **Click "Manual Deploy"** button (top right)
   - Select branch: `main`
   - Click "Deploy"

4. **Watch the logs** for:
   ```
   Successfully installed langchain-anthropic-0.3.0
   Successfully installed langchain-core-0.3.17
   ✅ Successfully initialized ticket-resolver
   ✅ Successfully initialized security-scanner
   ...
   Agent initialization complete: 10/10 agents ready
   ```

## Why Manual Deploy is Needed

Render's auto-deploy may be delayed or not triggered. The fix is ready in GitHub (commit 963022e) but needs to be deployed.

## Verify After Deploy

Run: `./monitor_agents.sh`

Should show:
- `simulation_mode: false`
- `initialized_agents: 10`
- `_real_ai_execution: true`

## Current Issue

Agents are responding but using SIMULATION DATA:
- "Clear browser cache" for iPhone email issue ❌
- Generic, irrelevant responses ❌
- No real Claude AI processing ❌

After deploy, agents will use REAL CLAUDE AI ✅

