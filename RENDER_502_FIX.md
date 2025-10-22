# Fix for Render 502 Error

## Problem: 502 Bad Gateway
Your app is deployed but not starting properly.

## Solution 1: Update Start Command in Render
In your Render dashboard, change the start command to:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
```

## Solution 2: Add Missing Dependencies
Your requirements.txt is missing some dependencies. Update it to:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
stripe==7.8.0
pydantic==2.5.0
python-multipart==0.0.6
python-dotenv==1.0.0
```

## Solution 3: Check Environment Variables
Make sure these are set in Render:
- STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_STRIPE_PUBLISHABLE_KEY

## Solution 4: Check Logs
In Render dashboard, go to your service and check the "Logs" tab to see the exact error.

## Quick Fix Steps:
1. Go to Render dashboard
2. Click on your service
3. Go to "Settings" tab
4. Update "Start Command" to: `uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1`
5. Update "Build Command" to: `pip install -r requirements.txt`
6. Add missing environment variables
7. Click "Save Changes"
8. Wait for redeploy

The 502 error should be fixed after these changes!
