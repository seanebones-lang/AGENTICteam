# 🚀 Quick Railway Deployment (No CLI Required)

## Step 1: Go to Railway.app
1. Visit https://railway.app
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"

## Step 2: Connect Your Repository
1. Select your `agenticteamdemo` repository
2. Choose the `backend` folder as root directory
3. Railway will auto-detect Python

## Step 3: Set Environment Variables
In Railway dashboard, add these variables:
```
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_KEY  
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET
```

## Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy the generated URL (like: https://your-app.railway.app)

## Step 5: Update Frontend
Update your frontend environment variable:
```
NEXT_PUBLIC_API_BASE_URL=https://your-app.railway.app
```

## Step 6: Configure Stripe Webhooks
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-app.railway.app/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

That's it! Your backend will be live and connected to your frontend.
