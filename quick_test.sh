#!/bin/bash
API_URL="https://bizbot-api.onrender.com/api/v1/packages"
API_KEY="demo-key-12345"

echo "Quick Agent Test - 5 Concurrent Requests"
echo "=========================================="

# Test 5 agents concurrently
(curl -s -X POST "$API_URL/ticket-resolver/execute" -H "Content-Type: application/json" -H "X-API-Key: $API_KEY" -d '{"package_id": "ticket-resolver", "task": "Test query 1", "engine_type": "crewai"}' --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); print('1. Ticket Resolver:', 'PASS' if 'result' in data else 'FAIL')") &

(curl -s -X POST "$API_URL/security-scanner/execute" -H "Content-Type: application/json" -H "X-API-Key: $API_KEY" -d '{"package_id": "security-scanner", "task": "Test query 2", "engine_type": "crewai"}' --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); print('2. Security Scanner:', 'PASS' if 'result' in data else 'FAIL')") &

(curl -s -X POST "$API_URL/incident-responder/execute" -H "Content-Type: application/json" -H "X-API-Key: $API_KEY" -d '{"package_id": "incident-responder", "task": "Test query 3", "engine_type": "crewai"}' --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); print('3. Incident Responder:', 'PASS' if 'result' in data else 'FAIL')") &

(curl -s -X POST "$API_URL/knowledge-base/execute" -H "Content-Type: application/json" -H "X-API-Key: $API_KEY" -d '{"package_id": "knowledge-base", "task": "Test query 4", "engine_type": "crewai"}' --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); print('4. Knowledge Base:', 'PASS' if 'result' in data else 'FAIL')") &

(curl -s -X POST "$API_URL/data-processor/execute" -H "Content-Type: application/json" -H "X-API-Key: $API_KEY" -d '{"package_id": "data-processor", "task": "Test query 5", "engine_type": "crewai"}' --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); print('5. Data Processor:', 'PASS' if 'result' in data else 'FAIL')") &

wait
echo "=========================================="
echo "Concurrent test complete!"
