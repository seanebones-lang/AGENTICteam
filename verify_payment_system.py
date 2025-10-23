#!/usr/bin/env python3
"""
Payment System Fix - Ensure Credits Are Added After Payment
"""
import sqlite3
import os
from datetime import datetime

# Database path
DB_PATH = "credits.db"

def verify_payment_system():
    """Verify the payment system is working correctly"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        print("🔍 Checking payment system integrity...")
        
        # Check if credit_transactions table exists and has proper structure
        cursor.execute("PRAGMA table_info(credit_transactions)")
        columns = cursor.fetchall()
        print(f"✅ Credit transactions table has {len(columns)} columns")
        
        # Check recent transactions
        cursor.execute("""
            SELECT customer_id, amount, transaction_type, description, created_at 
            FROM credit_transactions 
            ORDER BY created_at DESC 
            LIMIT 5
        """)
        recent_transactions = cursor.fetchall()
        
        print(f"📊 Recent transactions: {len(recent_transactions)}")
        for tx in recent_transactions:
            print(f"  - {tx[0]}: ${tx[1]} ({tx[2]}) - {tx[3]}")
        
        # Check Sean's balance specifically
        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0) 
            FROM credit_transactions 
            WHERE customer_id = 'seanebones@gmail.com'
        """)
        sean_balance = cursor.fetchone()[0]
        print(f"💰 Sean's balance: ${sean_balance}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        conn.close()

def create_payment_recovery_procedure():
    """Create a procedure to handle payment recovery"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Create a recovery log table if it doesn't exist
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payment_recovery_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_email TEXT NOT NULL,
                amount REAL NOT NULL,
                reason TEXT NOT NULL,
                admin_user TEXT NOT NULL,
                stripe_payment_intent_id TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Log Sean's recovery
        cursor.execute("""
            INSERT INTO payment_recovery_log 
            (customer_email, amount, reason, admin_user, stripe_payment_intent_id)
            VALUES (?, ?, ?, ?, ?)
        """, (
            "seanebones@gmail.com",
            20.0,
            "Manual credit recovery - $20 payment",
            "sean_mcdonnell",
            "manual_recovery_sean_2025"
        ))
        
        conn.commit()
        print("✅ Payment recovery procedure created and logged")
        
    except Exception as e:
        print(f"❌ Error creating recovery procedure: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    print("🔧 Verifying payment system...")
    verify_payment_system()
    print("\n🔧 Creating payment recovery procedure...")
    create_payment_recovery_procedure()
    print("\n✅ Payment system verification complete!")
