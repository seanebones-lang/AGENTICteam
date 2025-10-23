"""
Credits API v2 - Enhanced credit management with Stripe integration
ACID transactions, real-time balance, value previews, webhook handling
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
import stripe
import os

from app.core.payments import PaymentManager
from app.api.v2.auth_v2 import get_current_user_optional, require_auth

router = APIRouter()
payment_manager = PaymentManager()

# Stripe configuration
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_test...")


class CreditBalance(BaseModel):
    user_id: str
    balance: float
    last_updated: str
    transactions_count: int
    tier: str


class CreditTransaction(BaseModel):
    transaction_id: str
    type: str
    amount: float
    description: str
    balance_before: float
    balance_after: float
    timestamp: str


class CheckoutRequest(BaseModel):
    plan_id: str
    success_url: str = "https://agentmarketplace.com/dashboard?payment=success"
    cancel_url: str = "https://agentmarketplace.com/pricing?payment=cancelled"


class SubscriptionRequest(BaseModel):
    plan_id: str
    success_url: str = "https://agentmarketplace.com/dashboard?subscription=success"
    cancel_url: str = "https://agentmarketplace.com/pricing?subscription=cancelled"


@router.get("/balance")
async def get_credit_balance(
    current_user: Dict = Depends(require_auth)
):
    """Get current credit balance with detailed information"""
    
    try:
        user_id = current_user["id"]
        
        # Get current balance
        balance = await payment_manager.get_user_credit_balance(user_id)
        
        # Get transaction history for count
        transactions = await payment_manager.get_user_transaction_history(user_id, limit=1000)
        
        return {
            "user_id": user_id,
            "balance": balance,
            "last_updated": datetime.utcnow().isoformat(),
            "transactions_count": len(transactions),
            "tier": current_user.get("tier", "basic"),
            "credit_info": {
                "never_expire": True,
                "avg_cost_per_query": 3.5,  # Average credits per query
                "estimated_queries_remaining": int(balance // 3.5),
                "value_usd": balance * 0.03  # Approximate USD value
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get credit balance: {str(e)}"
        )


@router.get("/transactions")
async def get_credit_transactions(
    limit: int = 50,
    current_user: Dict = Depends(require_auth)
):
    """Get detailed credit transaction history"""
    
    try:
        user_id = current_user["id"]
        transactions = await payment_manager.get_user_transaction_history(user_id, limit)
        
        # Calculate summary statistics
        total_purchased = sum(t.get("amount", 0) for t in transactions if t.get("amount", 0) > 0)
        total_used = abs(sum(t.get("amount", 0) for t in transactions if t.get("amount", 0) < 0))
        
        return {
            "transactions": transactions,
            "total": len(transactions),
            "user_id": user_id,
            "summary": {
                "total_purchased": total_purchased,
                "total_used": total_used,
                "net_balance": total_purchased - total_used,
                "avg_transaction": (total_purchased + total_used) / max(len(transactions), 1)
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get transactions: {str(e)}"
        )


@router.get("/plans")
async def get_all_plans():
    """Get all available payment plans with competitive analysis"""
    
    try:
        plans = payment_manager.get_all_plans()
        
        return {
            "paygo_plans": [plan.dict() for plan in plans["paygo"]],
            "subscription_plans": [plan.dict() for plan in plans["subscription"]],
            "enterprise": {
                "name": "Enterprise Deployment",
                "description": "Docker, Kubernetes, Air-gapped deployments",
                "starting_price": 50000,
                "contact_sales": True,
                "deployment_methods": ["Docker", "Kubernetes", "Air-gapped", "Self-hosted"],
                "features": [
                    "Unlimited usage",
                    "Self-hosted deployment", 
                    "Air-gapped options",
                    "24/7 support",
                    "Custom SLA",
                    "Dedicated support team"
                ]
            },
            "competitive_advantage": {
                "cost_savings": "50-60% cheaper than OpenAI/Anthropic",
                "deployment_flexibility": "7 methods vs competitors' API-only",
                "trial_advantage": "3 queries across ALL agents vs per-agent limits"
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get plans: {str(e)}"
        )


@router.post("/checkout")
async def create_checkout_session(
    checkout_request: CheckoutRequest,
    current_user: Dict = Depends(require_auth)
):
    """Create Stripe Checkout Session for one-time credit purchase"""
    
    try:
        user_id = current_user["id"]
        
        session_info = await payment_manager.create_checkout_session(
            user_id=user_id,
            plan_id=checkout_request.plan_id,
            success_url=checkout_request.success_url,
            cancel_url=checkout_request.cancel_url
        )
        
        return {
            "success": True,
            "checkout_url": session_info["checkout_url"],
            "session_id": session_info["session_id"],
            "plan": session_info["plan"],
            "expires_at": session_info["expires_at"],
            "security_info": {
                "pci_compliant": True,
                "secure_checkout": True,
                "no_card_storage": True
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Checkout session creation failed: {str(e)}"
        )


@router.post("/subscribe")
async def create_subscription(
    subscription_request: SubscriptionRequest,
    current_user: Dict = Depends(require_auth)
):
    """Create Stripe Subscription for recurring monthly billing"""
    
    try:
        user_id = current_user["id"]
        user_email = current_user.get("email", "")
        
        subscription_info = await payment_manager.create_subscription(
            user_id=user_id,
            plan_id=subscription_request.plan_id,
            customer_email=user_email,
            success_url=subscription_request.success_url,
            cancel_url=subscription_request.cancel_url
        )
        
        return {
            "success": True,
            "checkout_url": subscription_info["checkout_url"],
            "session_id": subscription_info["session_id"],
            "plan": subscription_info["plan"],
            "customer_id": subscription_info["customer_id"],
            "subscription_info": {
                "billing_cycle": "monthly",
                "credits_per_month": subscription_info["plan"]["credits"],
                "rollover_policy": "Limited rollover based on plan",
                "cancellation": "Cancel anytime, access until period end"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Subscription creation failed: {str(e)}"
        )


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks with idempotency and comprehensive event processing"""
    
    try:
        payload = await request.body()
        signature = request.headers.get("stripe-signature")
        
        if not signature:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Missing Stripe signature header"
            )
        
        # Process webhook with idempotency
        result = await payment_manager.handle_webhook(
            payload=payload,
            signature=signature,
            webhook_secret=STRIPE_WEBHOOK_SECRET
        )
        
        return {
            "received": True,
            "processed": result.get("status") == "success",
            "event_id": result.get("event_id"),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        # Log error but return 200 to prevent Stripe retries
        print(f"Webhook processing error: {e}")
        return {
            "received": True,
            "processed": False,
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }


@router.get("/preview/{plan_id}")
async def preview_plan_purchase(
    plan_id: str,
    current_user: Optional[Dict] = Depends(get_current_user_optional)
):
    """Preview plan purchase with value calculation and competitive comparison"""
    
    try:
        plan = payment_manager.get_plan_by_id(plan_id)
        
        if not plan:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Plan '{plan_id}' not found"
            )
        
        # Get current balance if authenticated
        current_balance = 0.0
        if current_user:
            current_balance = await payment_manager.get_user_credit_balance(current_user["id"])
        
        # Calculate value metrics
        credits_per_dollar = plan.credits / plan.price_usd
        estimated_queries = plan.credits // 3  # Average 3 credits per query
        
        # Competitive comparison
        competitor_price_per_credit = 0.06  # Average competitor pricing
        savings_percentage = int((competitor_price_per_credit - plan.price_per_credit) / competitor_price_per_credit * 100)
        
        return {
            "plan": plan.dict(),
            "preview": {
                "current_balance": current_balance,
                "credits_after_purchase": current_balance + plan.credits,
                "price_per_credit": plan.price_per_credit,
                "credits_per_dollar": round(credits_per_dollar, 1),
                "estimated_queries": estimated_queries,
                "estimated_usage_time": f"{estimated_queries // 10} days at 10 queries/day"
            },
            "value_proposition": {
                "savings_vs_competitors": f"{savings_percentage}% cheaper",
                "cost_comparison": f"${plan.price_per_credit:.3f} vs competitors' $0.06-0.10",
                "unique_benefits": [
                    "Access to all 10 agents",
                    "Credits never expire" if plan.type == "paygo" else "Monthly credits with rollover",
                    "7 deployment methods available",
                    "Enterprise-grade security",
                    "98.7% success rate guarantee"
                ]
            },
            "instant_benefits": [
                f"Immediate access to {plan.credits} credits",
                "All 10 AI agents unlocked",
                "Priority support included",
                f"Save ${(competitor_price_per_credit - plan.price_per_credit) * plan.credits:.2f} vs competitors"
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Plan preview failed: {str(e)}"
        )


@router.post("/deduct")
async def deduct_credits(
    credits: int,
    description: str,
    current_user: Dict = Depends(require_auth)
):
    """Deduct credits from user account (for agent execution)"""
    
    try:
        user_id = current_user["id"]
        
        result = await payment_manager.deduct_credits_from_user(
            user_id=user_id,
            credits=credits,
            description=description
        )
        
        return {
            "success": True,
            "credits_deducted": credits,
            "new_balance": result["new_balance"],
            "transaction_id": result["transaction_id"],
            "description": description
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Credit deduction failed: {str(e)}"
        )
