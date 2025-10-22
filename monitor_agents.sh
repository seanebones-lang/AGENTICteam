#!/bin/bash

# Monitor AI Agents Activation Status
# Run this script to check if agents are live with Claude

API_URL="https://bizbot-api.onrender.com"

echo "🔍 AGENT ACTIVATION MONITOR"
echo "================================"
echo ""

# Check if new deployment is live
echo "1️⃣  Checking if new deployment is live..."
AGENT_STATUS=$(curl -s "$API_URL/api/v1/agent-status" 2>&1)

if echo "$AGENT_STATUS" | grep -q "Not Found"; then
    echo "❌ New deployment not yet live (endpoint not found)"
    echo "⏳ Render is still deploying..."
    echo ""
    echo "Current status:"
    curl -s "$API_URL/api/v1/health" | python3 -m json.tool 2>/dev/null || echo "API unavailable"
    exit 1
fi

echo "✅ New deployment is live!"
echo ""

# Check agent initialization
echo "2️⃣  Checking agent initialization..."
echo "$AGENT_STATUS" | python3 -m json.tool

INITIALIZED=$(echo "$AGENT_STATUS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('initialized_agents', 0))" 2>/dev/null)
TOTAL=$(echo "$AGENT_STATUS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('total_agents', 10))" 2>/dev/null)
SIM_MODE=$(echo "$AGENT_STATUS" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('simulation_mode', True))" 2>/dev/null)

echo ""
echo "📊 Summary:"
echo "   Initialized: $INITIALIZED/$TOTAL agents"
echo "   Simulation Mode: $SIM_MODE"
echo ""

if [ "$INITIALIZED" = "$TOTAL" ] && [ "$SIM_MODE" = "False" ]; then
    echo "✅ ALL AGENTS ACTIVE WITH CLAUDE!"
    echo ""
    
    # Test a real agent
    echo "3️⃣  Testing Ticket Resolver with real query..."
    TEST_RESULT=$(curl -s -X POST "$API_URL/api/v1/packages/ticket-resolver/execute" \
      -H "Content-Type: application/json" \
      -H "X-API-Key: demo-key-12345" \
      -d '{
        "package_id": "ticket-resolver",
        "task": "Test Claude connection",
        "input_data": {
          "subject": "Test",
          "description": "Testing if Claude AI is connected"
        }
      }')
    
    REAL_AI=$(echo "$TEST_RESULT" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('result', {}).get('_real_ai_execution', False))" 2>/dev/null)
    
    if [ "$REAL_AI" = "True" ]; then
        echo "✅ Agent using REAL CLAUDE AI!"
        echo ""
        echo "🎉 SUCCESS! All agents are live and functional!"
    else
        echo "⚠️  Agent still using simulation"
        echo "Response preview:"
        echo "$TEST_RESULT" | python3 -m json.tool | head -30
    fi
else
    echo "❌ AGENTS NOT FULLY INITIALIZED"
    echo ""
    echo "Failed agents:"
    echo "$AGENT_STATUS" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for agent_id, status in data.get('agent_list', {}).items():
    if not status['initialized']:
        error = status.get('error', 'Unknown error')
        print(f'  - {agent_id}: {error}')
" 2>/dev/null
fi

echo ""
echo "================================"
echo "Monitor complete at $(date)"

