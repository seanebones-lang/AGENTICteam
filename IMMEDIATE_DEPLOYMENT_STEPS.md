# 🚀 IMMEDIATE BACKEND DEPLOYMENT - RENDER.COM

## STEP 1: Deploy Backend to Render (2 minutes)

1. **Go to**: https://render.com
2. **Sign up** with GitHub
3. **Click**: "New" → "Web Service"
4. **Connect**: Your GitHub repository
5. **Configure**:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Python Version**: 3.12

## STEP 2: Environment Variables
Add these in Render dashboard:
```
PYTHON_VERSION=3.12
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://host:port
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_key
```

## STEP 3: Get Backend URL
After deployment, you'll get: `https://your-app.onrender.com`

## STEP 4: Update Frontend
In Vercel dashboard:
- Add environment variable: `NEXT_PUBLIC_API_URL=https://your-app.onrender.com`
- Redeploy frontend

## STEP 5: Test Everything
- Go to playground
- Test agent execution
- Verify 100% functionality

**TOTAL TIME: 5-7 minutes to 100% functionality**
