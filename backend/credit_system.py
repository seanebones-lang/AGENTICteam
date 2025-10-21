#!/usr/bin/env python3
"""
Advanced Credit System for Agent Marketplace
Handles credits, subscriptions, usage tracking, and billing
"""

import sqlite3
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple
from pydantic import BaseModel, Field
from enum import Enum
import json
from dataclasses import dataclass

logger = logging.getLogger(__name__)

class TransactionType(str, Enum):
    CREDIT_PURCHASE = "credit_purchase"
    AGENT_EXECUTION = "agent_execution"
    SUBSCRIPTION_CREDIT = "subscription_credit"
    BONUS_CREDIT = "bonus_credit"
    REFUND = "refund"
    ADJUSTMENT = "adjustment"

class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    PAST_DUE = "past_due"
    CANCELLED = "cancelled"
    UNPAID = "unpaid"
    TRIALING = "trialing"

@dataclass
class CreditTransaction:
    """Credit transaction record"""
    id: str
    user_id: int
    transaction_type: TransactionType
    amount: float  # positive for credits added, negative for credits used
    balance_after: float
    description: str
    metadata: Dict[str, Any]
    created_at: str

@dataclass
class UserSubscription:
    """User subscription record"""
    id: str
    user_id: int
    stripe_subscription_id: str
    tier: str
    status: SubscriptionStatus
    current_period_start: str
    current_period_end: str
    monthly_price: float
    execution_price: float
    monthly_executions_included: int
    executions_used_this_period: int
    created_at: str
    updated_at: str

@dataclass
class UsageSummary:
    """Monthly usage summary"""
    user_id: int
    month: str  # YYYY-MM format
    total_executions: int
    total_cost: float
    subscription_cost: float
    overage_cost: float
    credits_used: float
    tier: str

class CreditSystem:
    """Advanced credit and subscription management system"""
    
    def __init__(self, db_path: str = "agent_marketplace.db"):
        self.db_path = db_path
        self._init_credit_tables()
    
    def _init_credit_tables(self):
        """Initialize credit system tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Credit transactions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS credit_transactions (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                transaction_type TEXT NOT NULL,
                amount REAL NOT NULL,
                balance_after REAL NOT NULL,
                description TEXT NOT NULL,
                metadata TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # User subscriptions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_subscriptions (
                id TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                stripe_subscription_id TEXT UNIQUE,
                tier TEXT NOT NULL,
                status TEXT NOT NULL,
                current_period_start TIMESTAMP NOT NULL,
                current_period_end TIMESTAMP NOT NULL,
                monthly_price REAL NOT NULL,
                execution_price REAL NOT NULL,
                monthly_executions_included INTEGER NOT NULL,
                executions_used_this_period INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Monthly usage summaries table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS usage_summaries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                month TEXT NOT NULL,
                total_executions INTEGER DEFAULT 0,
                total_cost REAL DEFAULT 0.0,
                subscription_cost REAL DEFAULT 0.0,
                overage_cost REAL DEFAULT 0.0,
                credits_used REAL DEFAULT 0.0,
                tier TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                UNIQUE(user_id, month)
            )
        ''')
        
        # Credit packages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS credit_packages (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                credits REAL NOT NULL,
                bonus_credits REAL DEFAULT 0.0,
                description TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
        
        # Initialize default credit packages
        self._init_default_packages()
        
        logger.info("Credit system tables initialized")
    
    def _init_default_packages(self):
        """Initialize default credit packages"""
        default_packages = [
            {
                "id": "starter",
                "name": "Starter Pack",
                "price": 10.00,
                "credits": 10.00,
                "bonus_credits": 0.0,
                "description": "Perfect for trying out our agents"
            },
            {
                "id": "growth",
                "name": "Growth Pack", 
                "price": 50.00,
                "credits": 50.00,
                "bonus_credits": 5.0,
                "description": "Great for small teams and regular usage"
            },
            {
                "id": "business",
                "name": "Business Pack",
                "price": 100.00,
                "credits": 100.00,
                "bonus_credits": 15.0,
                "description": "Ideal for growing businesses"
            },
            {
                "id": "enterprise",
                "name": "Enterprise Pack",
                "price": 500.00,
                "credits": 500.00,
                "bonus_credits": 100.0,
                "description": "For large-scale operations"
            },
            {
                "id": "mega",
                "name": "Mega Pack",
                "price": 1000.00,
                "credits": 1000.00,
                "bonus_credits": 250.0,
                "description": "Maximum value for heavy users"
            }
        ]
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        for package in default_packages:
            cursor.execute('''
                INSERT OR IGNORE INTO credit_packages 
                (id, name, price, credits, bonus_credits, description)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                package["id"], package["name"], package["price"],
                package["credits"], package["bonus_credits"], package["description"]
            ))
        
        conn.commit()
        conn.close()
    
    def get_user_balance(self, user_id: int) -> float:
        """Get user's current credit balance"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT credits FROM users WHERE id = ?
        ''', (user_id,))
        
        result = cursor.fetchone()
        conn.close()
        
        return result[0] if result else 0.0
    
    def add_credits(
        self, 
        user_id: int, 
        amount: float, 
        transaction_type: TransactionType,
        description: str,
        metadata: Dict[str, Any] = None
    ) -> CreditTransaction:
        """Add credits to user account"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get current balance
        current_balance = self.get_user_balance(user_id)
        new_balance = current_balance + amount
        
        # Update user balance
        cursor.execute('''
            UPDATE users SET credits = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (new_balance, user_id))
        
        # Create transaction record
        transaction_id = f"tx_{int(datetime.now().timestamp())}_{user_id}"
        cursor.execute('''
            INSERT INTO credit_transactions 
            (id, user_id, transaction_type, amount, balance_after, description, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            transaction_id, user_id, transaction_type.value, amount,
            new_balance, description, json.dumps(metadata or {})
        ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Added {amount} credits to user {user_id}, new balance: {new_balance}")
        
        return CreditTransaction(
            id=transaction_id,
            user_id=user_id,
            transaction_type=transaction_type,
            amount=amount,
            balance_after=new_balance,
            description=description,
            metadata=metadata or {},
            created_at=datetime.now().isoformat()
        )
    
    def deduct_credits(
        self, 
        user_id: int, 
        amount: float, 
        description: str,
        metadata: Dict[str, Any] = None
    ) -> Tuple[bool, CreditTransaction]:
        """Deduct credits from user account"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Get current balance
        current_balance = self.get_user_balance(user_id)
        
        if current_balance < amount:
            conn.close()
            return False, None
        
        new_balance = current_balance - amount
        
        # Update user balance
        cursor.execute('''
            UPDATE users SET credits = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (new_balance, user_id))
        
        # Create transaction record
        transaction_id = f"tx_{int(datetime.now().timestamp())}_{user_id}"
        cursor.execute('''
            INSERT INTO credit_transactions 
            (id, user_id, transaction_type, amount, balance_after, description, metadata)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            transaction_id, user_id, TransactionType.AGENT_EXECUTION.value, -amount,
            new_balance, description, json.dumps(metadata or {})
        ))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Deducted {amount} credits from user {user_id}, new balance: {new_balance}")
        
        return True, CreditTransaction(
            id=transaction_id,
            user_id=user_id,
            transaction_type=TransactionType.AGENT_EXECUTION,
            amount=-amount,
            balance_after=new_balance,
            description=description,
            metadata=metadata or {},
            created_at=datetime.now().isoformat()
        )
    
    def create_subscription(
        self,
        user_id: int,
        stripe_subscription_id: str,
        tier: str,
        monthly_price: float,
        execution_price: float,
        monthly_executions_included: int,
        current_period_start: datetime,
        current_period_end: datetime
    ) -> UserSubscription:
        """Create a new subscription for user"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        subscription_id = f"sub_{int(datetime.now().timestamp())}_{user_id}"
        
        cursor.execute('''
            INSERT INTO user_subscriptions 
            (id, user_id, stripe_subscription_id, tier, status, current_period_start,
             current_period_end, monthly_price, execution_price, monthly_executions_included)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            subscription_id, user_id, stripe_subscription_id, tier,
            SubscriptionStatus.ACTIVE.value, current_period_start.isoformat(),
            current_period_end.isoformat(), monthly_price, execution_price,
            monthly_executions_included
        ))
        
        # Update user tier
        cursor.execute('''
            UPDATE users SET tier = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (tier, user_id))
        
        conn.commit()
        conn.close()
        
        logger.info(f"Created subscription {subscription_id} for user {user_id}")
        
        return UserSubscription(
            id=subscription_id,
            user_id=user_id,
            stripe_subscription_id=stripe_subscription_id,
            tier=tier,
            status=SubscriptionStatus.ACTIVE,
            current_period_start=current_period_start.isoformat(),
            current_period_end=current_period_end.isoformat(),
            monthly_price=monthly_price,
            execution_price=execution_price,
            monthly_executions_included=monthly_executions_included,
            executions_used_this_period=0,
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat()
        )
    
    def get_user_subscription(self, user_id: int) -> Optional[UserSubscription]:
        """Get user's active subscription"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, user_id, stripe_subscription_id, tier, status,
                   current_period_start, current_period_end, monthly_price,
                   execution_price, monthly_executions_included, 
                   executions_used_this_period, created_at, updated_at
            FROM user_subscriptions 
            WHERE user_id = ? AND status = ?
            ORDER BY created_at DESC LIMIT 1
        ''', (user_id, SubscriptionStatus.ACTIVE.value))
        
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            return None
        
        return UserSubscription(
            id=result[0],
            user_id=result[1],
            stripe_subscription_id=result[2],
            tier=result[3],
            status=SubscriptionStatus(result[4]),
            current_period_start=result[5],
            current_period_end=result[6],
            monthly_price=result[7],
            execution_price=result[8],
            monthly_executions_included=result[9],
            executions_used_this_period=result[10],
            created_at=result[11],
            updated_at=result[12]
        )
    
    def calculate_execution_cost(
        self, 
        user_id: int, 
        agent_id: str,
        base_cost: float = None
    ) -> Dict[str, Any]:
        """Calculate cost for an agent execution"""
        subscription = self.get_user_subscription(user_id)
        
        if not subscription:
            # No subscription - use pay-per-use pricing
            return {
                "cost": base_cost or 0.10,
                "covered_by_subscription": False,
                "remaining_included_executions": 0,
                "subscription_tier": "none"
            }
        
        # Check if execution is covered by subscription
        if subscription.executions_used_this_period < subscription.monthly_executions_included:
            # Covered by subscription
            return {
                "cost": 0.0,
                "covered_by_subscription": True,
                "remaining_included_executions": subscription.monthly_executions_included - subscription.executions_used_this_period,
                "subscription_tier": subscription.tier
            }
        else:
            # Overage - charge execution price
            return {
                "cost": subscription.execution_price,
                "covered_by_subscription": False,
                "remaining_included_executions": 0,
                "subscription_tier": subscription.tier,
                "overage": True
            }
    
    def record_execution(
        self,
        user_id: int,
        agent_id: str,
        execution_id: str,
        cost: float,
        covered_by_subscription: bool = False
    ) -> bool:
        """Record an agent execution and handle billing"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            # Update subscription usage if covered
            if covered_by_subscription:
                cursor.execute('''
                    UPDATE user_subscriptions 
                    SET executions_used_this_period = executions_used_this_period + 1,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = ? AND status = ?
                ''', (user_id, SubscriptionStatus.ACTIVE.value))
            
            # If there's a cost, deduct credits
            if cost > 0:
                success, transaction = self.deduct_credits(
                    user_id, cost, 
                    f"Agent execution: {agent_id}",
                    {"agent_id": agent_id, "execution_id": execution_id}
                )
                if not success:
                    conn.rollback()
                    conn.close()
                    return False
            
            # Update monthly usage summary
            current_month = datetime.now().strftime("%Y-%m")
            cursor.execute('''
                INSERT OR IGNORE INTO usage_summaries 
                (user_id, month, total_executions, total_cost, tier)
                VALUES (?, ?, 0, 0.0, ?)
            ''', (user_id, current_month, self._get_user_tier(user_id)))
            
            cursor.execute('''
                UPDATE usage_summaries 
                SET total_executions = total_executions + 1,
                    total_cost = total_cost + ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ? AND month = ?
            ''', (cost, user_id, current_month))
            
            conn.commit()
            conn.close()
            
            logger.info(f"Recorded execution for user {user_id}, cost: ${cost}")
            return True
            
        except Exception as e:
            conn.rollback()
            conn.close()
            logger.error(f"Failed to record execution: {str(e)}")
            return False
    
    def get_user_transactions(self, user_id: int, limit: int = 50) -> List[CreditTransaction]:
        """Get user's credit transaction history"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, user_id, transaction_type, amount, balance_after,
                   description, metadata, created_at
            FROM credit_transactions 
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT ?
        ''', (user_id, limit))
        
        results = cursor.fetchall()
        conn.close()
        
        transactions = []
        for row in results:
            transactions.append(CreditTransaction(
                id=row[0],
                user_id=row[1],
                transaction_type=TransactionType(row[2]),
                amount=row[3],
                balance_after=row[4],
                description=row[5],
                metadata=json.loads(row[6]) if row[6] else {},
                created_at=row[7]
            ))
        
        return transactions
    
    def get_usage_summary(self, user_id: int, month: str = None) -> Optional[UsageSummary]:
        """Get usage summary for a specific month"""
        if not month:
            month = datetime.now().strftime("%Y-%m")
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT user_id, month, total_executions, total_cost,
                   subscription_cost, overage_cost, credits_used, tier
            FROM usage_summaries 
            WHERE user_id = ? AND month = ?
        ''', (user_id, month))
        
        result = cursor.fetchone()
        conn.close()
        
        if not result:
            return None
        
        return UsageSummary(
            user_id=result[0],
            month=result[1],
            total_executions=result[2],
            total_cost=result[3],
            subscription_cost=result[4],
            overage_cost=result[5],
            credits_used=result[6],
            tier=result[7]
        )
    
    def get_credit_packages(self) -> List[Dict[str, Any]]:
        """Get available credit packages"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT id, name, price, credits, bonus_credits, description
            FROM credit_packages 
            WHERE is_active = TRUE
            ORDER BY price ASC
        ''', )
        
        results = cursor.fetchall()
        conn.close()
        
        packages = []
        for row in results:
            packages.append({
                "id": row[0],
                "name": row[1],
                "price": row[2],
                "credits": row[3],
                "bonus_credits": row[4],
                "total_credits": row[3] + row[4],
                "description": row[5],
                "value_per_dollar": (row[3] + row[4]) / row[2] if row[2] > 0 else 0
            })
        
        return packages
    
    def _get_user_tier(self, user_id: int) -> str:
        """Get user's current tier"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT tier FROM users WHERE id = ?', (user_id,))
        result = cursor.fetchone()
        conn.close()
        
        return result[0] if result else "basic"

# Global instance
credit_system = CreditSystem()
