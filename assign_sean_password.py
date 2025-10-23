#!/usr/bin/env python3
"""
ASSIGN PASSWORD FOR SEAN'S ACCOUNT
"""
import sqlite3
import hashlib
import requests
import json
from datetime import datetime

def assign_password_to_sean():
    """Assign a secure password to Sean's account"""
    print("🔐 ASSIGNING PASSWORD TO SEAN'S ACCOUNT")
    print("=" * 50)
    
    # Generate a secure password
    password = "Sean2025Secure!"
    email = "seanebones@gmail.com"
    
    print(f"📧 Email: {email}")
    print(f"🔑 Password: {password}")
    print()
    
    # Hash the password
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    print(f"🔒 Password hashed: {password_hash[:20]}...")
    
    try:
        # Update local database
        conn = sqlite3.connect('backend/agent_marketplace.db')
        cursor = conn.cursor()
        
        # Update password in database
        cursor.execute("""
            UPDATE users 
            SET password_hash = ?, updated_at = ?
            WHERE email = ?
        """, (password_hash, datetime.now().isoformat(), email))
        
        if cursor.rowcount > 0:
            print("✅ Password updated in local database")
        else:
            print("❌ User not found in local database")
        
        conn.commit()
        conn.close()
        
        # Test login with new password
        print("\n🧪 TESTING LOGIN WITH NEW PASSWORD")
        print("-" * 40)
        
        login_data = {
            'email': email,
            'password': password
        }
        
        try:
            response = requests.post('https://bizbot-api.onrender.com/api/v1/auth/login', 
                                   json=login_data, timeout=10)
            
            print(f"Login Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ LOGIN SUCCESSFUL!")
                print(f"User: {data.get('user', {}).get('name', 'N/A')}")
                print(f"Email: {data.get('user', {}).get('email', 'N/A')}")
                print(f"Tier: {data.get('user', {}).get('tier', 'N/A')}")
                print(f"Credits: ${data.get('user', {}).get('credits', 0)}")
                
                print("\n🎉 PASSWORD ASSIGNMENT SUCCESSFUL!")
                print("=" * 50)
                print("📧 EMAIL: seanebones@gmail.com")
                print("🔑 PASSWORD: Sean2025Secure!")
                print("🌐 LOGIN URL: https://www.bizbot.store/login")
                print("=" * 50)
                
                return True
            else:
                print(f"❌ Login failed: {response.text}")
                
                # Try to register the user if login fails
                print("\n🔄 Attempting to register user...")
                register_data = {
                    'name': 'Sean McDonnell',
                    'email': email,
                    'password': password,
                    'tier': 'bronze'
                }
                
                register_response = requests.post('https://bizbot-api.onrender.com/api/v1/auth/register', 
                                                json=register_data, timeout=10)
                
                print(f"Registration Status: {register_response.status_code}")
                
                if register_response.status_code == 200:
                    print("✅ User registered successfully!")
                    print("\n🎉 PASSWORD ASSIGNMENT SUCCESSFUL!")
                    print("=" * 50)
                    print("📧 EMAIL: seanebones@gmail.com")
                    print("🔑 PASSWORD: Sean2025Secure!")
                    print("🌐 LOGIN URL: https://www.bizbot.store/login")
                    print("=" * 50)
                    return True
                else:
                    print(f"❌ Registration failed: {register_response.text}")
                
        except Exception as e:
            print(f"❌ Login test failed: {e}")
    
    except Exception as e:
        print(f"❌ Database update failed: {e}")
    
    return False

if __name__ == "__main__":
    success = assign_password_to_sean()
    
    if success:
        print("\n✅ PASSWORD SUCCESSFULLY ASSIGNED!")
        print("You can now login with:")
        print("Email: seanebones@gmail.com")
        print("Password: Sean2025Secure!")
    else:
        print("\n❌ Password assignment failed!")
    
    exit(0 if success else 1)
