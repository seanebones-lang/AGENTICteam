#!/bin/bash

echo "Monitoring Render Redeploy..."
echo "Checking every 15 seconds for new deployment..."
echo "Press Ctrl+C to stop"
echo "=========================================="

OLD_UPTIME=253
CHECK_COUNT=0

while true; do
    CHECK_COUNT=$((CHECK_COUNT + 1))
    echo -e "\n[Check $CHECK_COUNT] $(date +%H:%M:%S)"
    
    RESPONSE=$(curl -s https://bizbot-api.onrender.com/health 2>&1)
    
    if echo "$RESPONSE" | grep -q "uptime_seconds"; then
        UPTIME=$(echo "$RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(int(data.get('uptime_seconds', 0)))" 2>/dev/null)
        
        if [ "$UPTIME" -lt 60 ]; then
            echo "✅ NEW DEPLOYMENT DETECTED!"
            echo "   Uptime: ${UPTIME}s (fresh deployment)"
            echo "   Testing concurrent requests..."
            sleep 5
            ./quick_test.sh
            echo ""
            echo "=========================================="
            echo "✅ Redeploy complete! You can now run full tests."
            echo "   Run: ./COMPREHENSIVE_AGENT_TEST.sh"
            echo "=========================================="
            break
        else
            echo "⏳ Old deployment still running (uptime: ${UPTIME}s)"
        fi
    else
        echo "⚠️  Backend not responding or error"
    fi
    
    sleep 15
done
