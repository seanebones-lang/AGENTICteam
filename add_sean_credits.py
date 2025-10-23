#!/usr/bin/env python3
"""
Manual Credit Addition Script for Sean's Account
"""
import sqlite3
import os
from datetime import datetime

# Database path
DB_PATH = "credits.db"

def add_credits_to_sean():
    """Add $20 worth of credits to Sean's account"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Use Sean's email as customer_id (based on the schema)
        customer_id = "seanebones@gmail.com"
        print(f"✅ Using customer ID: {customer_id}")
        
        # Get current balance
        cursor.execute("SELECT COALESCE(SUM(amount), 0) FROM credit_transactions WHERE customer_id = ?", (customer_id,))
        current_balance = cursor.fetchone()[0]
        print(f"📊 Current balance: ${current_balance}")
        
        # Add $20 credits
        amount = 20.0
        cursor.execute("""
            INSERT INTO credit_transactions 
            (customer_id, amount, transaction_type, description, stripe_payment_intent_id, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            customer_id,
            amount,
            "manual_adjustment",
            "Manual credit addition - $20 payment recovery",
            "manual_recovery_sean_2025",
            datetime.now().isoformat()
        ))
        
        conn.commit()
        
        # Get new balance
        cursor.execute("SELECT COALESCE(SUM(amount), 0) FROM credit_transactions WHERE customer_id = ?", (customer_id,))
        new_balance = cursor.fetchone()[0]
        
        print(f"✅ Added ${amount} credits")
        print(f"📊 New balance: ${new_balance}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔧 Adding credits to Sean's account...")
    success = add_credits_to_sean()
    if success:
        print("🎉 Credits added successfully!")
    else:
        print("💥 Failed to add credits")
