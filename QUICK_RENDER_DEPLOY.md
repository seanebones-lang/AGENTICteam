# 🚀 Render.com Deployment (Easiest Option)

## Step 1: Go to Render.com
1. Visit https://render.com
2. Sign up/login with GitHub
3. Click "New" → "Web Service"

## Step 2: Connect Repository
1. Connect your GitHub account
2. Select `agenticteamdemo` repository
3. Set root directory to `backend`

## Step 3: Configure Service
- **Name**: `bizbot-api`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Step 4: Set Environment Variables
Add these in Render dashboard:
```
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET
```

## Step 5: Deploy
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. Copy the URL (like: https://bizbot-api.onrender.com)

## Step 6: Update Frontend
In your Vercel dashboard, update environment variable:
```
NEXT_PUBLIC_API_BASE_URL=https://bizbot-api.onrender.com
```

## Step 7: Configure Stripe Webhooks
1. Stripe Dashboard → Webhooks
2. Add: `https://bizbot-api.onrender.com/webhook`
3. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

Done! Your backend will be live and connected.
