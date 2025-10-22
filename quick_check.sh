#!/bin/bash
# Quick deployment check

echo "🔍 Checking if new deployment is live..."
echo ""

# Check for new endpoint
if curl -s https://bizbot-api.onrender.com/api/v1/agent-status | grep -q "initialized_agents"; then
    echo "✅ NEW DEPLOYMENT IS LIVE!"
    echo ""
    curl -s https://bizbot-api.onrender.com/api/v1/agent-status | python3 -m json.tool
else
    echo "⏳ Still on old deployment"
    echo ""
    curl -s https://bizbot-api.onrender.com/api/v1/health | python3 -m json.tool
fi

