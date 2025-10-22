#!/usr/bin/env python3
"""
Database Setup for Agent Marketplace
Simple SQLite database for user management and execution tracking
"""

import sqlite3
import os
from datetime import datetime
import json

DATABASE_PATH = "agent_marketplace.db"

def init_database():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            tier TEXT DEFAULT 'basic',
            credits REAL DEFAULT 10.0,
            api_key TEXT UNIQUE,
            email_verified BOOLEAN DEFAULT FALSE,
            verification_token TEXT,
            verification_token_expires TIMESTAMP,
            password_reset_token TEXT,
            password_reset_expires TIMESTAMP,
            failed_login_attempts INTEGER DEFAULT 0,
            account_locked_until TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Agent executions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS agent_executions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            execution_id TEXT UNIQUE NOT NULL,
            user_id INTEGER,
            agent_id TEXT NOT NULL,
            task TEXT NOT NULL,
            input_data TEXT,
            result TEXT,
            success BOOLEAN NOT NULL,
            duration_ms INTEGER,
            cost REAL DEFAULT 0.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Usage tracking table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usage_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            date DATE,
            agent_id TEXT,
            executions_count INTEGER DEFAULT 0,
            total_cost REAL DEFAULT 0.0,
            total_duration_ms INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, date, agent_id)
        )
    ''')
    
    # API keys table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS api_keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            key_hash TEXT UNIQUE NOT NULL,
            name TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            last_used TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Free trial tracking table (server-side, secure)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS free_trial_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT NOT NULL,
            device_fingerprint TEXT,
            user_agent TEXT,
            queries_used INTEGER DEFAULT 0,
            agent_id TEXT NOT NULL,
            first_query_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_query_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_blocked BOOLEAN DEFAULT FALSE,
            block_reason TEXT,
            UNIQUE(ip_address, agent_id)
        )
    ''')
    
    # Security audit log table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS security_audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_type TEXT NOT NULL,
            ip_address TEXT,
            user_id INTEGER,
            user_agent TEXT,
            endpoint TEXT,
            request_data TEXT,
            response_status INTEGER,
            threat_level TEXT,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Rate limiting table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS rate_limit_tracking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT NOT NULL,
            endpoint TEXT NOT NULL,
            request_count INTEGER DEFAULT 1,
            window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_blocked BOOLEAN DEFAULT FALSE,
            block_expires_at TIMESTAMP,
            UNIQUE(ip_address, endpoint, window_start)
        )
    ''')
    
    # User sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            session_hash TEXT UNIQUE NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"✅ Database initialized: {DATABASE_PATH}")

def create_demo_user():
    """Create a demo user for testing"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    # Check if demo user already exists
    cursor.execute("SELECT id FROM users WHERE email = ?", ("demo@example.com",))
    if cursor.fetchone():
        print("Demo user already exists")
        conn.close()
        return
    
    # Create demo user
    cursor.execute('''
        INSERT INTO users (email, name, password_hash, tier, credits, api_key)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        "demo@example.com",
        "Demo User",
        "demo_password_hash",  # In production, use proper password hashing
        "premium",
        100.0,
        "ak_demo_12345"
    ))
    
    user_id = cursor.lastrowid
    
    # Create some sample executions
    sample_executions = [
        {
            "execution_id": "exec_demo_001",
            "agent_id": "security-scanner",
            "task": "Scan https://example.com for vulnerabilities",
            "success": True,
            "duration_ms": 2340,
            "cost": 0.15
        },
        {
            "execution_id": "exec_demo_002", 
            "agent_id": "ticket-resolver",
            "task": "Classify and resolve customer complaint about slow loading",
            "success": True,
            "duration_ms": 1200,
            "cost": 0.12
        },
        {
            "execution_id": "exec_demo_003",
            "agent_id": "data-processor",
            "task": "Process customer data export and generate insights",
            "success": True,
            "duration_ms": 4500,
            "cost": 0.20
        }
    ]
    
    for exec_data in sample_executions:
        cursor.execute('''
            INSERT INTO agent_executions 
            (execution_id, user_id, agent_id, task, success, duration_ms, cost, result)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            exec_data["execution_id"],
            user_id,
            exec_data["agent_id"],
            exec_data["task"],
            exec_data["success"],
            exec_data["duration_ms"],
            exec_data["cost"],
            json.dumps({"status": "completed", "demo": True})
        ))
    
    conn.commit()
    conn.close()
    print("✅ Demo user and sample data created")

def get_user_stats():
    """Get basic user statistics"""
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM agent_executions")
    execution_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT SUM(cost) FROM agent_executions")
    total_revenue = cursor.fetchone()[0] or 0.0
    
    cursor.execute('''
        SELECT agent_id, COUNT(*) as count 
        FROM agent_executions 
        GROUP BY agent_id 
        ORDER BY count DESC 
        LIMIT 5
    ''')
    popular_agents = cursor.fetchall()
    
    conn.close()
    
    return {
        "users": user_count,
        "executions": execution_count,
        "revenue": total_revenue,
        "popular_agents": popular_agents
    }

class DatabaseManager:
    """Simple database manager for the agent marketplace"""
    
    def __init__(self, db_path=DATABASE_PATH):
        self.db_path = db_path
    
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def get_user_by_email(self, email):
        """Get user by email"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, email, name, tier, credits, api_key, created_at
            FROM users WHERE email = ?
        ''', (email,))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return {
                "id": result[0],
                "email": result[1],
                "name": result[2],
                "tier": result[3],
                "credits": result[4],
                "api_key": result[5],
                "created_at": result[6]
            }
        return None
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT id, email, name, tier, credits, api_key, created_at
            FROM users WHERE id = ?
        ''', (user_id,))
        result = cursor.fetchone()
        conn.close()
        
        if result:
            return {
                "id": result[0],
                "email": result[1],
                "name": result[2],
                "tier": result[3],
                "credits": result[4],
                "api_key": result[5],
                "created_at": result[6]
            }
        return None
    
    def create_user(self, email, name, password_hash, tier="basic"):
        """Create a new user"""
        import secrets
        api_key = f"ak_{secrets.token_urlsafe(32)}"
        
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT INTO users (email, name, password_hash, tier, api_key)
                VALUES (?, ?, ?, ?, ?)
            ''', (email, name, password_hash, tier, api_key))
            
            user_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            return {
                "id": user_id,
                "email": email,
                "name": name,
                "tier": tier,
                "credits": 10.0,
                "api_key": api_key
            }
        except sqlite3.IntegrityError:
            conn.close()
            return None
    
    def log_execution(self, user_id, execution_id, agent_id, task, result, success, duration_ms, cost):
        """Log an agent execution"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO agent_executions 
            (execution_id, user_id, agent_id, task, result, success, duration_ms, cost)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (execution_id, user_id, agent_id, task, json.dumps(result), success, duration_ms, cost))
        
        # Update user credits
        cursor.execute('''
            UPDATE users SET credits = credits - ? WHERE id = ?
        ''', (cost, user_id))
        
        conn.commit()
        conn.close()
    
    def get_user_executions(self, user_id, limit=50):
        """Get user's recent executions"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT execution_id, agent_id, task, success, duration_ms, cost, created_at
            FROM agent_executions 
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        ''', (user_id, limit))
        
        results = cursor.fetchall()
        conn.close()
        
        return [
            {
                "execution_id": row[0],
                "agent_id": row[1],
                "task": row[2],
                "success": bool(row[3]),
                "duration_ms": row[4],
                "cost": row[5],
                "created_at": row[6]
            }
            for row in results
        ]

if __name__ == "__main__":
    print("🚀 Setting up Agent Marketplace Database...")
    init_database()
    create_demo_user()
    
    stats = get_user_stats()
    print(f"\n📊 Database Stats:")
    print(f"  Users: {stats['users']}")
    print(f"  Executions: {stats['executions']}")
    print(f"  Revenue: ${stats['revenue']:.2f}")
    print(f"  Popular Agents: {stats['popular_agents']}")
    
    print("\n✅ Database setup complete!")
