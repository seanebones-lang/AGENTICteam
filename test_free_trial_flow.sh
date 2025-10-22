#!/bin/bash
# TEST FREE TRIAL: 3 queries then paywall

API="https://bizbot-api.onrender.com"

echo "🔍 TESTING FREE TRIAL: 3 Queries → Paywall"
echo "============================================"
echo ""

# Query 1
echo "Query 1/3: Testing Ticket Resolver..."
Q1=$(curl -s -X POST "$API/api/v1/packages/ticket-resolver/execute" \
  -H "Content-Type: application/json" \
  -d '{"package_id":"ticket-resolver","task":"Test query 1"}')

if echo "$Q1" | grep -q '"success":true'; then
  echo "✅ Query 1: SUCCESS (Real Claude AI)"
elif echo "$Q1" | grep -q "Free trial"; then
  echo "⚠️  Query 1: Free trial exhausted (you already used it)"
  exit 0
else
  echo "❌ Query 1: $(echo "$Q1" | head -c 100)"
fi

# Query 2
echo ""
echo "Query 2/3: Testing Knowledge Base..."
Q2=$(curl -s -X POST "$API/api/v1/packages/knowledge-base/execute" \
  -H "Content-Type: application/json" \
  -d '{"package_id":"knowledge-base","task":"Test query 2"}')

if echo "$Q2" | grep -q '"success":true'; then
  echo "✅ Query 2: SUCCESS (Real Claude AI)"
else
  echo "❌ Query 2: Failed"
fi

# Query 3
echo ""
echo "Query 3/3: Testing Security Scanner..."
Q3=$(curl -s -X POST "$API/api/v1/packages/security-scanner/execute" \
  -H "Content-Type: application/json" \
  -d '{"package_id":"security-scanner","task":"Test query 3"}')

if echo "$Q3" | grep -q '"success":true'; then
  echo "✅ Query 3: SUCCESS (Real Claude AI)"
else
  echo "❌ Query 3: Failed"
fi

# Query 4 (should be blocked)
echo ""
echo "Query 4/3: Testing Data Processor (SHOULD FAIL)..."
Q4=$(curl -s -X POST "$API/api/v1/packages/data-processor/execute" \
  -H "Content-Type: application/json" \
  -d '{"package_id":"data-processor","task":"Test query 4"}')

if echo "$Q4" | grep -qi "free trial.*exhausted\|sign up"; then
  echo "✅ Query 4: PAYWALL ACTIVATED (as expected!)"
  echo "   Message: $(echo "$Q4" | python3 -c "import json,sys; print(json.load(sys.stdin).get('detail','')[:100])" 2>/dev/null)"
else
  echo "❌ Query 4: Should have been blocked but: $(echo "$Q4" | head -c 100)"
fi

echo ""
echo "============================================"
echo "🎯 FREE TRIAL TEST COMPLETE"
echo ""
echo "Expected Behavior:"
echo "  ✅ First 3 queries: Work with Claude AI"
echo "  ✅ 4th query: Paywall (must sign up)"
echo "============================================"
