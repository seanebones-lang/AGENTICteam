#!/usr/bin/env python3
"""
Login Test Script - Verify Sean's Account Access
"""
import requests
import json

def test_login():
    """Test Sean's login credentials"""
    url = "https://bizbot-api.onrender.com/api/v1/auth/login"
    
    # Test credentials
    credentials = {
        "email": "seanebones@gmail.com",
        "password": "TempPass123!"
    }
    
    try:
        print("🔍 Testing login for Sean's account...")
        print(f"📧 Email: {credentials['email']}")
        print(f"🔑 Password: {'*' * len(credentials['password'])}")
        
        response = requests.post(url, json=credentials, timeout=10)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📄 Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ LOGIN SUCCESSFUL!")
            print(f"🎫 Token: {data.get('access_token', 'N/A')[:20]}...")
            print(f"👤 User: {data.get('user', {}).get('name', 'N/A')}")
            print(f"💰 Credits: ${data.get('user', {}).get('credits', 'N/A')}")
            return True
        else:
            print("❌ LOGIN FAILED!")
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"💥 Error testing login: {e}")
        return False

def test_frontend_login():
    """Test if frontend login page is accessible"""
    try:
        print("\n🌐 Testing frontend login page...")
        response = requests.get("https://www.bizbot.store/login", timeout=10)
        
        if response.status_code == 200:
            print("✅ Frontend login page is accessible")
            return True
        else:
            print(f"❌ Frontend login page error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"💥 Error testing frontend: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting login verification...")
    
    # Test backend login
    backend_success = test_login()
    
    # Test frontend accessibility
    frontend_success = test_frontend_login()
    
    print("\n📋 SUMMARY:")
    print(f"Backend Login: {'✅ SUCCESS' if backend_success else '❌ FAILED'}")
    print(f"Frontend Access: {'✅ SUCCESS' if frontend_success else '❌ FAILED'}")
    
    if backend_success and frontend_success:
        print("\n🎉 All systems operational! Sean can login successfully.")
    else:
        print("\n⚠️ Issues detected. Manual intervention may be required.")
