#!/bin/bash

# 🚀 QUICK DEPLOY SCRIPT - GET BIZBOT.STORE WORKING NOW

set -e

echo "🚀 BIZBOT.STORE QUICK DEPLOYMENT"
echo "================================"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

cd "$(dirname "$0")"

print_status "Preparing production API..."

# Copy the production file to main.py for Railway
cp backend/main_production_live.py backend/main.py

print_success "Production API ready: backend/main.py"

# Create Procfile for Railway
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > backend/Procfile

print_success "Procfile created"

# Create runtime.txt for Python version
echo "python-3.9" > backend/runtime.txt

print_success "Runtime configuration created"

echo ""
print_status "🎯 NEXT STEPS TO COMPLETE DEPLOYMENT:"
echo ""
echo "1. Deploy to Railway:"
echo "   cd backend"
echo "   railway login"
echo "   railway init"
echo "   railway up"
echo ""
echo "2. Set environment variables in Railway:"
echo "   railway variables set STRIPE_SECRET_KEY=sk_live_YOUR_KEY"
echo "   railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY"
echo "   railway variables set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET"
echo ""
echo "3. Get your Railway URL:"
echo "   railway status"
echo ""
echo "4. Update frontend environment variables:"
echo "   NEXT_PUBLIC_API_BASE_URL=https://your-railway-url.railway.app"
echo ""
echo "5. Configure Stripe webhooks:"
echo "   - Go to Stripe Dashboard > Webhooks"
echo "   - Add endpoint: https://your-railway-url.railway.app/webhook"
echo "   - Select events: payment_intent.succeeded, payment_intent.payment_failed"
echo ""

print_success "🎉 Ready to deploy! Follow the steps above."
print_warning "⚠️  Don't forget to replace placeholder Stripe keys with real ones!"

echo ""
echo "Alternative: Deploy to Vercel Functions"
echo "cd backend && vercel --prod"
