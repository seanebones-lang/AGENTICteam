# URGENT: Clear Render Cache & Redeploy

## THE PROBLEM
Render is using a **cached build** from BEFORE we added the dependencies. The logs show:
- `ModuleNotFoundError: No module named 'pandas'`
- `ModuleNotFoundError: No module named 'langchain_core'`
- Multiple "Deploy cancelled" messages

**Root Cause:** Render's build cache doesn't include the new dependencies we added.

---

## SOLUTION: Clear Cache & Force Rebuild

### Step 1: Go to Render Dashboard
https://dashboard.render.com

### Step 2: Select Your Service
Click on your backend service (bizbot-api or similar)

### Step 3: Clear Build Cache
**Option A: Via Settings**
1. Click "Settings" (left sidebar)
2. Scroll down to "Build & Deploy"
3. Look for "Clear Build Cache" button
4. Click it

**Option B: Via Manual Deploy**
1. Click "Manual Deploy" (top right)
2. Select "Clear build cache" checkbox ✓
3. Select branch: `main`
4. Click "Deploy"

### Step 4: Watch the Logs
Go to "Logs" tab and watch for:
```
==> Running build command 'pip install -r requirements.txt'...
Collecting langchain-anthropic==0.3.0
Collecting langchain-core==0.3.17
Collecting pandas==2.2.3
Collecting numpy==1.26.4
Collecting aiohttp==3.11.11
...
Successfully installed langchain-anthropic-0.3.0
Successfully installed langchain-core-0.3.17
Successfully installed pandas-2.2.3
...
✅ Successfully initialized ticket-resolver
✅ Successfully initialized security-scanner
...
Agent initialization complete: 10/10 agents ready
```

---

## ALTERNATIVE: Delete & Recreate Service

If clearing cache doesn't work:

### Step 1: Note Your Settings
- Service name
- Environment variables (especially ANTHROPIC_API_KEY)
- Region
- Plan (Free)

### Step 2: Delete Service
1. Go to Settings
2. Scroll to bottom
3. Click "Delete Service"
4. Confirm

### Step 3: Create New Service
1. Click "New +" → "Web Service"
2. Connect to GitHub repo
3. **Root Directory:** `backend`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1`
6. Add environment variables:
   - `ANTHROPIC_API_KEY` = your key
   - `PYTHON_VERSION` = 3.13.4
7. Deploy

---

## WHY THIS HAPPENS

Render caches the virtual environment to speed up deployments. When you add new dependencies, sometimes the cache doesn't detect the changes in requirements.txt.

**The Fix:** Force a fresh build by clearing the cache.

---

## VERIFY IT WORKED

After deployment completes, run:
```bash
curl https://bizbot-api.onrender.com/api/v1/agent-status | python3 -m json.tool
```

**Expected:**
```json
{
  "simulation_mode": false,
  "initialized_agents": 10,
  "agent_init_errors": null
}
```

**If you see this, ALL AGENTS ARE LIVE WITH CLAUDE!** ✅

---

## CURRENT STATUS

- ✅ All dependencies added to requirements.txt
- ✅ All code pushed to GitHub
- ❌ Render using old cached build
- 🔄 **ACTION NEEDED:** Clear cache and redeploy

**Time to fix:** 5-8 minutes (fresh build with all dependencies)

---

**Last Updated:** October 22, 2025 15:05 UTC

