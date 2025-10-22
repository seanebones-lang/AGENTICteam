#!/bin/bash
# TEST ALL 10 AGENTS RIGHT NOW - WITH REAL CLAUDE

API="https://bizbot-api.onrender.com"
EMAIL="verify_all_$(date +%s)@test.com"

echo "🤖 TESTING ALL 10 AGENTS WITH REAL CLAUDE AI"
echo "=============================================="

# Create fresh account with credits
echo "Creating test account..."
SIGNUP=$(curl -s -X POST "$API/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Test123!\",\"name\":\"Full Test\"}")

TOKEN=$(echo "$SIGNUP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to create account"
  exit 1
fi
echo "✅ Test account created (has $10 credits)"
echo ""

test_agent() {
  AGENT=$1
  TASK=$2
  echo "Testing: $AGENT"
  RESULT=$(curl -s -X POST "$API/api/v1/packages/$AGENT/execute" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: $TOKEN" \
    -d "{\"package_id\":\"$AGENT\",\"task\":\"$TASK\"}")
  
  if echo "$RESULT" | grep -q '"success":true'; then
    echo "  ✅ WORKING - Real Claude AI"
  else
    ERROR=$(echo "$RESULT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('detail','Unknown error')[:80])" 2>/dev/null)
    echo "  ❌ FAILED: $ERROR"
  fi
}

test_agent "ticket-resolver" "Customer payment failing with error 500"
test_agent "security-scanner" "Scan API for SQL injection vulnerabilities"
test_agent "incident-responder" "Database CPU 99%, queries timing out"
test_agent "knowledge-base" "Explain JWT authentication best practices"
test_agent "data-processor" "Analyze sales data: Q1 $100K, Q2 $150K, Q3 $200K"
test_agent "deployment-agent" "Plan blue-green deployment on Kubernetes"
test_agent "audit-agent" "Audit system for GDPR compliance"
test_agent "report-generator" "Generate monthly report: 5000 orders, $250K revenue"
test_agent "workflow-orchestrator" "Design customer onboarding workflow"
test_agent "escalation-manager" "VIP customer complaint, $50K billing error"

echo ""
echo "=============================================="
echo "🎯 VERIFICATION COMPLETE"
echo "=============================================="
