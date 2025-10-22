#!/bin/bash
# VERIFY HOTFIX - Test with new user account

API="https://bizbot-api.onrender.com"
EMAIL="hotfix_test_$(date +%s)@test.com"

echo "🔧 VERIFYING HOTFIX DEPLOYMENT..."
echo ""

# Create account
echo "1. Creating test user..."
SIGNUP=$(curl -s -X POST "$API/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"Test123!\",\"name\":\"Hotfix Test\"}")

TOKEN=$(echo "$SIGNUP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to create account"
  exit 1
fi
echo "✅ Account created, token: ${TOKEN:0:20}..."

# Test Ticket Resolver (was broken)
echo ""
echo "2. Testing Ticket Resolver (HAD PYDANTIC ERROR)..."
TICKET=$(curl -s -X POST "$API/api/v1/packages/ticket-resolver/execute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $TOKEN" \
  -d '{"package_id":"ticket-resolver","task":"URGENT: Payment system down, 500 users affected"}')

if echo "$TICKET" | grep -q '"success":true'; then
  echo "✅ TICKET RESOLVER FIXED! No more Pydantic errors"
  echo "   Response includes: $(echo "$TICKET" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('result',{}).get('estimated_resolution_time','N/A'))" 2>/dev/null)"
else
  echo "❌ Still broken: $(echo "$TICKET" | head -c 200)"
fi

# Test Incident Responder (preventive fix)
echo ""
echo "3. Testing Incident Responder (PREVENTIVE FIX)..."
INCIDENT=$(curl -s -X POST "$API/api/v1/packages/incident-responder/execute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $TOKEN" \
  -d '{"package_id":"incident-responder","task":"DATABASE DOWN: All queries failing"}')

if echo "$INCIDENT" | grep -q '"success":true'; then
  echo "✅ INCIDENT RESPONDER WORKING"
else
  echo "⚠️  Response: $(echo "$INCIDENT" | head -c 200)"
fi

echo ""
echo "========================================="
echo "🎉 HOTFIX VERIFICATION COMPLETE"
echo "========================================="
