#!/bin/bash

# 🚀 LIVE DEPLOYMENT SCRIPT - BIZBOT.STORE
# This script deploys your backend to make payments work live

set -e  # Exit on any error

echo "🚀 BIZBOT.STORE LIVE DEPLOYMENT"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend/main_simple.py" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting live deployment process..."

# Phase 1: Quick Backend Deployment
echo ""
echo "🎯 PHASE 1: DEPLOY BASIC BACKEND"
echo "================================"

print_status "Checking for Railway CLI..."
if ! command -v railway &> /dev/null; then
    print_warning "Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

print_status "Checking for Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Create Railway deployment
print_status "Deploying backend to Railway..."
cd backend

# Create railway.json for simple deployment
cat > railway.json << EOF
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python main_simple.py",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

print_status "Railway configuration created"

# Deploy to Railway
if railway login --help &> /dev/null; then
    print_status "Deploying to Railway..."
    railway up
    RAILWAY_URL=$(railway status --json | jq -r '.deployments[0].url')
    print_success "Backend deployed to: $RAILWAY_URL"
else
    print_warning "Please login to Railway first: railway login"
    print_status "Then run: railway up"
fi

cd ..

# Phase 2: Update Frontend Configuration
echo ""
echo "🎯 PHASE 2: UPDATE FRONTEND CONFIG"
echo "=================================="

print_status "Updating frontend API configuration..."

# Create environment variable file for frontend
cat > frontend/.env.production << EOF
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
EOF

print_warning "Please update the API URL in frontend/.env.production with your actual Railway URL"

# Phase 3: Stripe Configuration
echo ""
echo "🎯 PHASE 3: STRIPE CONFIGURATION"
echo "================================"

print_status "Creating Stripe environment template..."

cat > .env.production << EOF
# 🔐 PRODUCTION ENVIRONMENT VARIABLES
# Copy these to your Railway project environment variables

# Stripe Configuration (REQUIRED)
STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE

# Database (Railway will provide this)
DATABASE_URL=postgresql://user:password@host:port/database

# Application Configuration
FRONTEND_URL=https://bizbot.store
PORT=8000

# Security
JWT_SECRET=your-secure-jwt-secret-here
API_KEY_HASH_SECRET=your-api-key-hash-secret
EOF

print_success "Environment template created: .env.production"

# Final Instructions
echo ""
echo "🎯 NEXT STEPS TO COMPLETE DEPLOYMENT"
echo "===================================="

echo ""
print_status "1. Set Railway Environment Variables:"
echo "   railway variables set STRIPE_SECRET_KEY=sk_live_YOUR_KEY"
echo "   railway variables set STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY"
echo "   railway variables set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET"
echo "   railway variables set FRONTEND_URL=https://bizbot.store"

echo ""
print_status "2. Update Frontend API URL:"
echo "   - Get your Railway URL: railway status"
echo "   - Update frontend/.env.production with the URL"
echo "   - Redeploy frontend: cd frontend && vercel --prod"

echo ""
print_status "3. Configure Stripe Webhooks:"
echo "   - Go to Stripe Dashboard > Webhooks"
echo "   - Add endpoint: https://your-railway-url.railway.app/webhook"
echo "   - Select events: payment_intent.succeeded, payment_intent.payment_failed"
echo "   - Copy webhook secret to Railway environment variables"

echo ""
print_status "4. Test the System:"
echo "   - Visit bizbot.store"
echo "   - Try to execute an agent (should work with mock data)"
echo "   - Try payment flow (should work with live Stripe)"

echo ""
print_success "🎉 Deployment script complete!"
print_status "Your backend is ready to deploy. Follow the steps above to complete the process."

echo ""
print_warning "⚠️  IMPORTANT: Replace all placeholder values with your actual Stripe keys!"
