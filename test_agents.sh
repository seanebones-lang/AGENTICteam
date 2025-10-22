#!/bin/bash

API_URL="https://bizbot-api.onrender.com/api/v1/packages"
API_KEY="demo-key-12345"

echo "=========================================="
echo "AGENT TESTING - TICKET RESOLVER (5-10)"
echo "=========================================="

# Query 5
echo -e "\n✓ Query 5 - Account Locked"
curl -s -X POST "$API_URL/ticket-resolver/execute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"package_id": "ticket-resolver", "task": "Account locked after 3 failed login attempts, user is CEO, urgent", "engine_type": "crewai"}' \
  --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); result = data.get('result', {}); print('Priority:', result.get('priority', 'N/A'), '| Urgency:', result.get('urgency_score', 'N/A'))"

# Query 6
echo -e "\n✓ Query 6 - Data Export"
curl -s -X POST "$API_URL/ticket-resolver/execute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"package_id": "ticket-resolver", "task": "Data export not working, CSV file corrupted, contains 50k records", "engine_type": "crewai"}' \
  --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); result = data.get('result', {}); print('Priority:', result.get('priority', 'N/A'), '| Category:', result.get('category', 'N/A'))"

# Query 7
echo -e "\n✓ Query 7 - Mobile App Crash"
curl -s -X POST "$API_URL/ticket-resolver/execute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"package_id": "ticket-resolver", "task": "Mobile app crashes on iOS 17 when uploading images over 5MB", "engine_type": "crewai"}' \
  --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); result = data.get('result', {}); print('Priority:', result.get('priority', 'N/A'), '| Sentiment:', result.get('sentiment', 'N/A'))"

# Query 8
echo -e "\n✓ Query 8 - Email Notifications"
curl -s -X POST "$API_URL/ticket-resolver/execute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"package_id": "ticket-resolver", "task": "Email notifications not sending, affecting 200+ users, started 2 hours ago", "engine_type": "crewai"}' \
  --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); result = data.get('result', {}); print('Priority:', result.get('priority', 'N/A'), '| Urgency:', result.get('urgency_score', 'N/A'))"

# Query 9
echo -e "\n✓ Query 9 - Legal Threat"
curl -s -X POST "$API_URL/ticket-resolver/execute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"package_id": "ticket-resolver", "task": "Angry customer threatening legal action over data breach concern", "engine_type": "crewai"}' \
  --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); result = data.get('result', {}); print('Priority:', result.get('priority', 'N/A'), '| Sentiment:', result.get('sentiment', 'N/A'), '| Urgency:', result.get('urgency_score', 'N/A'))"

# Query 10
echo -e "\n✓ Query 10 - Feature Request"
curl -s -X POST "$API_URL/ticket-resolver/execute" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"package_id": "ticket-resolver", "task": "Feature request: need dark mode, multiple users asking, high priority", "engine_type": "crewai"}' \
  --max-time 60 | python3 -c "import sys, json; data = json.load(sys.stdin); result = data.get('result', {}); print('Priority:', result.get('priority', 'N/A'), '| Category:', result.get('category', 'N/A'))"

echo -e "\n=========================================="
echo "TICKET RESOLVER COMPLETE ✓"
echo "=========================================="
