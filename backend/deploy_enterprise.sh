#!/bin/bash

# 🏆 ENTERPRISE API DEPLOYMENT SCRIPT - OCTOBER 2025
# Million Dollar Project - Best Practices Implementation

set -e  # Exit on any error

echo "🚀 ENTERPRISE API DEPLOYMENT - OCTOBER 2025"
echo "=========================================="
echo ""
echo "🎯 PROJECT: Agent Marketplace API"
echo "💰 VALUE: Million Dollar Project"
echo "🏗️  ARCHITECTURE: Enterprise-Grade"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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
if [ ! -f "main_enterprise.py" ]; then
    print_error "main_enterprise.py not found. Please run from backend directory."
    exit 1
fi

print_status "Starting enterprise deployment process..."

# Step 1: Environment Setup
print_status "Step 1: Setting up environment..."
if [ ! -f ".env" ]; then
    print_warning "Creating .env file from template..."
    cat > .env << EOF
# Enterprise API Configuration
API_TITLE="Agent Marketplace API"
API_VERSION="1.0.0"
API_DESCRIPTION="Enterprise AI Agent Platform - October 2025"
DEBUG=false

# Security
SECRET_KEY="your-super-secret-key-256-bits-minimum-change-this"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database (will be set by Railway)
DATABASE_URL="postgresql://user:pass@localhost/agentmarketplace"

# Redis (will be set by Railway)
REDIS_URL="redis://localhost:6379"

# External APIs
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
STRIPE_SECRET_KEY=""

# CORS
ALLOWED_ORIGINS=["https://frontend-theta-six-74.vercel.app","http://localhost:3000"]

# Rate Limiting
RATE_LIMIT_REQUESTS=1000
RATE_LIMIT_WINDOW=3600
EOF
    print_success ".env file created"
else
    print_success ".env file already exists"
fi

# Step 2: Install Dependencies
print_status "Step 2: Installing enterprise dependencies..."
if command -v pip3 &> /dev/null; then
    pip3 install -r requirements_enterprise.txt
    print_success "Dependencies installed"
else
    print_error "pip3 not found. Please install Python 3.12+"
    exit 1
fi

# Step 3: Code Quality Checks
print_status "Step 3: Running code quality checks..."

# Check if black is installed
if command -v black &> /dev/null; then
    print_status "Running Black code formatter..."
    black --check main_enterprise.py
    print_success "Code formatting check passed"
else
    print_warning "Black not installed, skipping formatting check"
fi

# Check if mypy is installed
if command -v mypy &> /dev/null; then
    print_status "Running MyPy type checking..."
    mypy main_enterprise.py --ignore-missing-imports
    print_success "Type checking passed"
else
    print_warning "MyPy not installed, skipping type checking"
fi

# Step 4: Test the Application
print_status "Step 4: Testing the application..."
python3 -c "
import sys
try:
    from main_enterprise import app
    print('✅ Application imports successfully')
except ImportError as e:
    print(f'❌ Import error: {e}')
    sys.exit(1)
except Exception as e:
    print(f'❌ Error: {e}')
    sys.exit(1)
"
print_success "Application test passed"

# Step 5: Railway Deployment Instructions
print_status "Step 5: Railway deployment instructions..."
echo ""
echo "🚀 RAILWAY DEPLOYMENT STEPS:"
echo "============================"
echo ""
echo "1. Go to: https://railway.app"
echo "2. Sign up with GitHub"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select: agenticteamdemo"
echo "5. Set Root Directory: backend"
echo "6. Add Environment Variables:"
echo "   - PYTHON_VERSION=3.12"
echo "   - DATABASE_URL=postgresql://..."
echo "   - REDIS_URL=redis://..."
echo "   - SECRET_KEY=your-super-secret-key"
echo "   - OPENAI_API_KEY=your-openai-key"
echo "   - ANTHROPIC_API_KEY=your-anthropic-key"
echo "   - STRIPE_SECRET_KEY=your-stripe-key"
echo "7. Click Deploy"
echo ""

# Step 6: Frontend Update Instructions
print_status "Step 6: Frontend update instructions..."
echo ""
echo "🔄 FRONTEND UPDATE STEPS:"
echo "========================"
echo ""
echo "1. Get your Railway backend URL (e.g., https://your-app.railway.app)"
echo "2. In Vercel dashboard, add environment variable:"
echo "   NEXT_PUBLIC_API_URL=https://your-app.railway.app"
echo "3. Redeploy frontend"
echo "4. Test full system functionality"
echo ""

# Step 7: Testing Instructions
print_status "Step 7: Testing instructions..."
echo ""
echo "🧪 TESTING CHECKLIST:"
echo "===================="
echo ""
echo "✅ Backend Health Check:"
echo "   curl https://your-app.railway.app/health"
echo ""
echo "✅ API Documentation:"
echo "   https://your-app.railway.app/docs"
echo ""
echo "✅ Agent Packages:"
echo "   curl https://your-app.railway.app/api/v1/packages"
echo ""
echo "✅ User Registration:"
echo "   curl -X POST https://your-app.railway.app/api/v1/auth/register \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -d '{\"username\":\"test\",\"email\":\"test@example.com\",\"password\":\"Test123!\"}'"
echo ""
echo "✅ Agent Execution:"
echo "   curl -X POST https://your-app.railway.app/api/v1/agents/security-scanner/execute \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "        -d '{\"task\":\"Scan for vulnerabilities\",\"engine_type\":\"crewai\"}'"
echo ""

# Step 8: Monitoring Setup
print_status "Step 8: Monitoring setup..."
echo ""
echo "📊 MONITORING FEATURES:"
echo "======================"
echo ""
echo "✅ Health Checks: /health endpoint"
echo "✅ API Documentation: /docs endpoint"
echo "✅ OpenTelemetry: Distributed tracing"
echo "✅ Prometheus: Metrics collection"
echo "✅ Redis: Caching and sessions"
echo "✅ PostgreSQL: Data persistence"
echo "✅ Rate Limiting: DDoS protection"
echo "✅ JWT Authentication: Secure access"
echo "✅ CORS: Cross-origin requests"
echo "✅ Error Handling: Comprehensive logging"
echo ""

# Final Status
print_success "Enterprise deployment preparation complete!"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Deploy to Railway (5 minutes)"
echo "2. Update frontend API URL (2 minutes)"
echo "3. Test full system (3 minutes)"
echo "4. Monitor performance (ongoing)"
echo ""
echo "🏆 RESULT: Enterprise-grade API ready for million-dollar scale!"
echo ""
echo "📞 Support: (817) 675-9898"
echo "🌐 Website: https://bizbot.store"
echo ""
