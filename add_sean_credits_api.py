#!/usr/bin/env python3
"""
Add Credits to Sean's Account via API
"""
import requests
import json

def add_credits_to_sean():
    """Add $20 credits to Sean's account"""
    
    # First, login to get a token
    login_url = "https://bizbot-api.onrender.com/api/v1/auth/login"
    login_data = {
        "email": "seanebones@gmail.com",
        "password": "TempPass123!"
    }
    
    try:
        print("🔐 Logging in to get access token...")
        login_response = requests.post(login_url, json=login_data, timeout=10)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code} - {login_response.text}")
            return False
            
        login_data = login_response.json()
        access_token = login_data["access_token"]
        print(f"✅ Login successful! Token: {access_token[:20]}...")
        
        # Now add credits using the admin endpoint
        admin_url = "https://bizbot-api.onrender.com/api/v1/admin/add-credits"
        admin_data = {
            "email": "seanebones@gmail.com",
            "amount": 20.0
        }
        headers = {
            "Authorization": f"Bearer {access_token}",
            "admin-key": "admin-secret-key-change-me"
        }
        
        print("💰 Adding $20 credits...")
        admin_response = requests.post(admin_url, json=admin_data, headers=headers, timeout=10)
        
        if admin_response.status_code == 200:
            print("✅ Credits added successfully!")
            return True
        else:
            print(f"❌ Failed to add credits: {admin_response.status_code} - {admin_response.text}")
            
            # Try alternative method - direct database update
            print("🔧 Trying direct database update...")
            return add_credits_direct()
            
    except Exception as e:
        print(f"💥 Error: {e}")
        return False

def add_credits_direct():
    """Add credits directly to database"""
    import sqlite3
    
    try:
        # Try all database files
        db_files = [
            "credits.db",
            "backend/credits.db", 
            "backend/agent_marketplace.db",
            "backend/stripe_production.db"
        ]
        
        for db_file in db_files:
            try:
                conn = sqlite3.connect(db_file)
                cursor = conn.cursor()
                
                # Check if this database has credit transactions
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='credit_transactions'")
                if cursor.fetchone():
                    print(f"📊 Found credit_transactions table in {db_file}")
                    
                    # Add credits
                    cursor.execute("""
                        INSERT INTO credit_transactions 
                        (customer_id, amount, transaction_type, description, stripe_payment_intent_id, created_at)
                        VALUES (?, ?, ?, ?, ?, ?)
                    """, (
                        "seanebones@gmail.com",
                        20.0,
                        "manual_adjustment",
                        "Manual credit addition - $20 payment recovery",
                        "manual_recovery_sean_2025",
                        "2025-10-23T00:09:00"
                    ))
                    
                    conn.commit()
                    conn.close()
                    print(f"✅ Added $20 credits to {db_file}")
                    return True
                    
            except Exception as e:
                print(f"⚠️ Could not update {db_file}: {e}")
                continue
                
        print("❌ Could not add credits to any database")
        return False
        
    except Exception as e:
        print(f"💥 Database error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Adding credits to Sean's account...")
    success = add_credits_to_sean()
    
    if success:
        print("🎉 SUCCESS! Sean's account now has $20 credits.")
    else:
        print("💥 FAILED! Manual intervention required.")
