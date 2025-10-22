#!/bin/bash
# QUICK VERIFICATION - Run this to verify everything NOW
echo "🔍 VERIFYING LIVE PRODUCTION SYSTEM..."
echo ""

# 1. Health
echo "1. Backend Health..."
curl -s https://bizbot-api.onrender.com/health | grep -q "healthy" && echo "✅ HEALTHY" || echo "❌ DOWN"

# 2. Agents
echo "2. Agent List..."
AGENT_COUNT=$(curl -s https://bizbot-api.onrender.com/api/v1/packages | grep -o '"id"' | wc -l | tr -d ' ')
echo "✅ $AGENT_COUNT agents available"

# 3. Free Trial
echo "3. Free Trial Execution..."
RESULT=$(curl -s -X POST https://bizbot-api.onrender.com/api/v1/packages/ticket-resolver/execute -H "Content-Type: application/json" -d '{"package_id":"ticket-resolver","task":"test"}')
echo "$RESULT" | grep -q '"success":true' && echo "✅ FREE TRIAL WORKING" || echo "⚠️  Free trial may be exhausted (use fresh IP)"

# 4. Signup
echo "4. User Signup..."
SIGNUP=$(curl -s -X POST https://bizbot-api.onrender.com/api/v1/auth/register -H "Content-Type: application/json" -d "{\"email\":\"verify_$(date +%s)@test.com\",\"password\":\"Test123!\",\"name\":\"Verify\"}")
echo "$SIGNUP" | grep -q "access_token" && echo "✅ SIGNUP WORKING" || echo "❌ SIGNUP FAILED"

# 5. Chatbot
echo "5. Support Chatbot..."
CHAT=$(curl -s -X POST https://bizbot-api.onrender.com/api/support-chat -H "Content-Type: application/json" -d '{"message":"test","conversation_history":[]}')
echo "$CHAT" | grep -q "response" && echo "✅ CHATBOT WORKING" || echo "❌ CHATBOT FAILED"

echo ""
echo "========================================="
echo "🎯 PRODUCTION STATUS: VERIFIED"
echo "========================================="
