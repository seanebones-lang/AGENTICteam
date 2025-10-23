#!/bin/bash
# Add $20 credits to Sean's account

echo "Adding $20 credits to seanebones@gmail.com..."
echo ""

curl -X POST https://bizbot-api.onrender.com/api/v1/admin/add-credits \
  -H "Content-Type: application/json" \
  -H "admin_key: admin-secret-key-change-me" \
  -d '{
    "email": "seanebones@gmail.com",
    "amount": 20.0
  }'

echo ""
echo ""
echo "✅ Credits added! Check your dashboard at https://www.bizbot.store/dashboard"


