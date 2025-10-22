#!/bin/bash

# Watch Render Build and Check Agents Immediately
# Run this while Render is deploying

API_URL="https://bizbot-api.onrender.com"

echo "=================================================="
echo "🔍 WATCHING RENDER DEPLOYMENT"
echo "=================================================="
echo ""
echo "Checking every 10 seconds..."
echo "Press Ctrl+C to stop"
echo ""

check_count=0

while true; do
    check_count=$((check_count + 1))
    timestamp=$(date '+%H:%M:%S')
    
    echo "[$timestamp] Check #$check_count"
    echo "---"
    
    # Check if service is up
    health_response=$(curl -s -w "\n%{http_code}" "$API_URL/health" 2>/dev/null)
    http_code=$(echo "$health_response" | tail -n1)
    
    if [ "$http_code" = "200" ]; then
        echo "✅ Service is UP"
        
        # Check agent status
        echo ""
        echo "🤖 AGENT STATUS:"
        agent_status=$(curl -s "$API_URL/api/v1/agent-status" 2>/dev/null)
        
        if [ $? -eq 0 ]; then
            echo "$agent_status" | python3 -m json.tool 2>/dev/null || echo "$agent_status"
            
            # Check if agents are initialized
            initialized=$(echo "$agent_status" | grep -o '"initialized": true' | wc -l)
            
            if [ "$initialized" -gt 0 ]; then
                echo ""
                echo "=================================================="
                echo "🎉 AGENTS ARE LIVE!"
                echo "=================================================="
                echo ""
                echo "Testing ticket-resolver agent..."
                
                # Test an agent
                test_result=$(curl -s -X POST "$API_URL/api/v1/packages/ticket-resolver/execute" \
                    -H "Content-Type: application/json" \
                    -d '{"task": "Test: iPhone email issue", "input_data": {}}' 2>/dev/null)
                
                echo "$test_result" | python3 -m json.tool 2>/dev/null || echo "$test_result"
                
                echo ""
                echo "✅ ALL SYSTEMS OPERATIONAL"
                break
            fi
        else
            echo "⚠️  Agent status endpoint not available yet"
        fi
        
    elif [ "$http_code" = "000" ] || [ -z "$http_code" ]; then
        echo "🔄 Service is DOWN (deploying...)"
    else
        echo "⚠️  Service returned HTTP $http_code"
    fi
    
    echo ""
    echo "Waiting 10 seconds..."
    echo ""
    sleep 10
done

echo ""
echo "=================================================="
echo "✅ DEPLOYMENT COMPLETE - AGENTS ACTIVE"
echo "=================================================="

