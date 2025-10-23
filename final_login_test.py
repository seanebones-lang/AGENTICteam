#!/usr/bin/env python3
"""
Final Login System Verification
Test Sean's account specifically
"""
import requests
import json

def test_sean_login():
    """Test Sean's login specifically"""
    print("🔍 Testing Sean's Login System")
    print("=" * 50)
    
    # Test login
    login_url = "https://bizbot-api.onrender.com/api/v1/auth/login"
    login_data = {
        "email": "seanebones@gmail.com",
        "password": "TempPass123!"
    }
    
    try:
        print("🔐 Testing login...")
        response = requests.post(login_url, json=login_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ LOGIN SUCCESS!")
            print(f"   👤 User: {data['user']['name']}")
            print(f"   📧 Email: {data['user']['email']}")
            print(f"   💰 Credits: ${data['user']['credits']}")
            print(f"   🎫 Token: {data['access_token'][:20]}...")
            return True
        else:
            print(f"❌ LOGIN FAILED: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"💥 ERROR: {e}")
        return False

def test_frontend_integration():
    """Test frontend integration"""
    print("\n🌐 Testing Frontend Integration")
    print("=" * 50)
    
    try:
        # Test frontend page
        response = requests.get("https://www.bizbot.store/login", timeout=10)
        
        if response.status_code == 200:
            print("✅ Frontend page accessible")
            
            # Check for login form elements
            content = response.text.lower()
            has_email = 'email' in content and 'input' in content
            has_password = 'password' in content and 'input' in content
            has_submit = 'submit' in content or 'sign in' in content
            
            if has_email and has_password and has_submit:
                print("✅ Login form elements present")
                return True
            else:
                print("❌ Login form incomplete")
                return False
        else:
            print(f"❌ Frontend error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"💥 Frontend error: {e}")
        return False

def test_credit_system():
    """Test credit system"""
    print("\n💰 Testing Credit System")
    print("=" * 50)
    
    try:
        import sqlite3
        conn = sqlite3.connect("credits.db")
        cursor = conn.cursor()
        
        # Check Sean's credits
        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0) 
            FROM credit_transactions 
            WHERE customer_id = 'seanebones@gmail.com'
        """)
        credits = cursor.fetchone()[0]
        
        cursor.execute("""
            SELECT COUNT(*) 
            FROM credit_transactions 
            WHERE customer_id = 'seanebones@gmail.com'
        """)
        transactions = cursor.fetchone()[0]
        
        conn.close()
        
        print(f"✅ Sean's Credits: ${credits}")
        print(f"✅ Transactions: {transactions}")
        
        if credits >= 20.0:
            print("✅ Credit system working correctly")
            return True
        else:
            print("❌ Insufficient credits")
            return False
            
    except Exception as e:
        print(f"💥 Credit system error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 FINAL LOGIN SYSTEM VERIFICATION")
    print("=" * 60)
    
    tests = [
        test_sean_login,
        test_frontend_integration,
        test_credit_system
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if test():
            passed += 1
    
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL SYSTEMS OPERATIONAL!")
        print("✅ Sean can login successfully")
        print("✅ Frontend is working")
        print("✅ Credits are restored")
        print("\n🔑 LOGIN CREDENTIALS:")
        print("   Email: seanebones@gmail.com")
        print("   Password: TempPass123!")
        print("   Credits: $40.00")
    else:
        print("⚠️ Some issues remain")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
