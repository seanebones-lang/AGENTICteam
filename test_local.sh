#!/bin/bash
# 🚀 Quick Local Test Server

echo "🚀 Starting BizBot API locally..."
echo "📍 Backend will be available at: http://localhost:8000"
echo "📖 API docs at: http://localhost:8000/docs"
echo ""
echo "⚠️  Note: This is for testing only. For production, deploy to Railway or Render."
echo ""

cd backend
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
