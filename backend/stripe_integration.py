#!/usr/bin/env python3
"""
Advanced Stripe Integration for Agent Marketplace
Complete payment processing with webhooks, subscriptions, and billing
"""

import os
import stripe
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from enum import Enum
import json

# Configure logging
logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"
    # Stripe payment intent statuses
    REQUIRES_PAYMENT_METHOD = "requires_payment_method"
    REQUIRES_CONFIRMATION = "requires_confirmation"
    REQUIRES_ACTION = "requires_action"
    REQUIRES_CAPTURE = "requires_capture"

class SubscriptionTier(str, Enum):
    SOLO = "solo"           # $0.005/execution
    BASIC = "basic"         # $0.0095/execution  
    SILVER = "silver"       # $0.038/execution
    STANDARD = "standard"   # $0.0475/execution
    PREMIUM = "premium"     # $0.076/execution
    ELITE = "elite"         # $0.2375/execution
    BYOK = "byok"          # $0.002/execution + user pays Anthropic

class PaymentIntent(BaseModel):
    """Payment intent data model"""
    id: str
    amount: float  # in dollars
    currency: str = "usd"
    status: PaymentStatus
    customer_email: Optional[str] = None
    description: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class Subscription(BaseModel):
    """Subscription data model"""
    id: str
    customer_id: str
    tier: SubscriptionTier
    status: str
    current_period_start: str
    current_period_end: str
    monthly_price: float
    execution_price: float
    monthly_executions_included: int
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class CreditPurchase(BaseModel):
    """Credit purchase data model"""
    id: str
    customer_id: str
    amount: float  # dollars
    credits_purchased: float
    bonus_credits: float = 0.0
    total_credits: float
    payment_intent_id: str
    status: PaymentStatus
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class StripeIntegration:
    """Advanced Stripe integration for the Agent Marketplace"""
    
    def __init__(self, webhook_secret: Optional[str] = None):
        self.webhook_secret = webhook_secret or os.getenv('STRIPE_WEBHOOK_SECRET')
        
        # Pricing tiers configuration
        self.tier_config = {
            SubscriptionTier.SOLO: {
                "monthly_price": 0.00,
                "execution_price": 0.005,
                "monthly_executions": 0,
                "rate_limit_per_minute": 5,
                "rate_limit_per_hour": 50,
                "features": ["Basic agents", "Email support"]
            },
            SubscriptionTier.BASIC: {
                "monthly_price": 29.00,
                "execution_price": 0.0095,
                "monthly_executions": 1000,
                "rate_limit_per_minute": 20,
                "rate_limit_per_hour": 500,
                "features": ["All agents", "Priority support", "API access"]
            },
            SubscriptionTier.SILVER: {
                "monthly_price": 99.00,
                "execution_price": 0.038,
                "monthly_executions": 5000,
                "rate_limit_per_minute": 50,
                "rate_limit_per_hour": 2000,
                "features": ["Advanced agents", "Custom workflows", "Analytics"]
            },
            SubscriptionTier.STANDARD: {
                "monthly_price": 199.00,
                "execution_price": 0.0475,
                "monthly_executions": 10000,
                "rate_limit_per_minute": 100,
                "rate_limit_per_hour": 5000,
                "features": ["Enterprise agents", "White-label", "SLA"]
            },
            SubscriptionTier.PREMIUM: {
                "monthly_price": 499.00,
                "execution_price": 0.076,
                "monthly_executions": 25000,
                "rate_limit_per_minute": 200,
                "rate_limit_per_hour": 10000,
                "features": ["All features", "Dedicated support", "Custom integrations"]
            },
            SubscriptionTier.ELITE: {
                "monthly_price": 999.00,
                "execution_price": 0.2375,
                "monthly_executions": 50000,
                "rate_limit_per_minute": 500,
                "rate_limit_per_hour": 25000,
                "features": ["Maximum intelligence", "Priority processing", "Account manager"]
            },
            SubscriptionTier.BYOK: {
                "monthly_price": 99.00,
                "execution_price": 0.002,
                "monthly_executions": 100000,
                "rate_limit_per_minute": 1000,
                "rate_limit_per_hour": 50000,
                "features": ["Bring your own keys", "Unlimited usage", "Direct billing"]
            }
        }
        
        # Credit purchase packages
        self.credit_packages = {
            "starter": {"price": 10.00, "credits": 10.00, "bonus": 0.0},
            "growth": {"price": 50.00, "credits": 50.00, "bonus": 5.0},
            "business": {"price": 100.00, "credits": 100.00, "bonus": 15.0},
            "enterprise": {"price": 500.00, "credits": 500.00, "bonus": 100.0},
            "mega": {"price": 1000.00, "credits": 1000.00, "bonus": 250.0}
        }
    
    async def create_customer(self, email: str, name: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """Create a new Stripe customer"""
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                metadata=metadata or {}
            )
            
            logger.info(f"Created Stripe customer: {customer.id} for {email}")
            
            return {
                "id": customer.id,
                "email": customer.email,
                "name": customer.name,
                "created": customer.created
            }
            
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create Stripe customer: {str(e)}")
            raise Exception(f"Customer creation failed: {str(e)}")
    
    async def create_payment_intent(
        self, 
        amount: float, 
        customer_email: str,
        description: str = "Agent Marketplace Credits",
        metadata: Dict[str, Any] = None
    ) -> PaymentIntent:
        """Create a payment intent for credit purchase"""
        try:
            amount_cents = int(amount * 100)
            
            intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency="usd",
                receipt_email=customer_email,
                description=description,
                metadata=metadata or {},
                automatic_payment_methods={"enabled": True}
            )
            
            logger.info(f"Created payment intent: {intent.id} for ${amount}")
            
            return PaymentIntent(
                id=intent.id,
                amount=amount,
                status=PaymentStatus(intent.status),
                customer_email=customer_email,
                description=description,
                metadata=metadata or {}
            )
            
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create payment intent: {str(e)}")
            raise Exception(f"Payment intent creation failed: {str(e)}")
    
    async def create_subscription(
        self, 
        customer_id: str, 
        tier: SubscriptionTier,
        trial_days: int = 7
    ) -> Subscription:
        """Create a subscription for a customer"""
        try:
            tier_config = self.tier_config[tier]
            
            # Create or get price object
            price = await self._get_or_create_price(tier, tier_config["monthly_price"])
            
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=[{"price": price.id}],
                trial_period_days=trial_days if tier_config["monthly_price"] > 0 else 0,
                metadata={
                    "tier": tier.value,
                    "execution_price": str(tier_config["execution_price"]),
                    "monthly_executions": str(tier_config["monthly_executions"])
                }
            )
            
            logger.info(f"Created subscription: {subscription.id} for customer {customer_id}")
            
            return Subscription(
                id=subscription.id,
                customer_id=customer_id,
                tier=tier,
                status=subscription.status,
                current_period_start=datetime.fromtimestamp(subscription.current_period_start).isoformat(),
                current_period_end=datetime.fromtimestamp(subscription.current_period_end).isoformat(),
                monthly_price=tier_config["monthly_price"],
                execution_price=tier_config["execution_price"],
                monthly_executions_included=tier_config["monthly_executions"]
            )
            
        except stripe.error.StripeError as e:
            logger.error(f"Failed to create subscription: {str(e)}")
            raise Exception(f"Subscription creation failed: {str(e)}")
    
    async def purchase_credits(
        self, 
        customer_email: str, 
        package: str,
        payment_method_id: str = None
    ) -> CreditPurchase:
        """Process credit purchase"""
        if package not in self.credit_packages:
            raise ValueError(f"Invalid credit package: {package}")
        
        package_info = self.credit_packages[package]
        
        try:
            # Create payment intent
            payment_intent = await self.create_payment_intent(
                amount=package_info["price"],
                customer_email=customer_email,
                description=f"Credit Purchase - {package.title()} Package",
                metadata={
                    "package": package,
                    "credits": str(package_info["credits"]),
                    "bonus_credits": str(package_info["bonus"])
                }
            )
            
            # If payment method provided, confirm payment immediately
            if payment_method_id:
                stripe.PaymentIntent.confirm(
                    payment_intent.id,
                    payment_method=payment_method_id
                )
            
            total_credits = package_info["credits"] + package_info["bonus"]
            
            return CreditPurchase(
                id=f"cp_{int(datetime.now().timestamp())}",
                customer_id=customer_email,  # Using email as customer ID for now
                amount=package_info["price"],
                credits_purchased=package_info["credits"],
                bonus_credits=package_info["bonus"],
                total_credits=total_credits,
                payment_intent_id=payment_intent.id,
                status=payment_intent.status
            )
            
        except Exception as e:
            logger.error(f"Credit purchase failed: {str(e)}")
            raise Exception(f"Credit purchase failed: {str(e)}")
    
    async def handle_webhook(self, payload: bytes, sig_header: str) -> Dict[str, Any]:
        """Handle Stripe webhook events"""
        if not self.webhook_secret:
            raise Exception("Webhook secret not configured")
        
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, self.webhook_secret
            )
        except ValueError:
            logger.error("Invalid webhook payload")
            raise Exception("Invalid payload")
        except stripe.error.SignatureVerificationError:
            logger.error("Invalid webhook signature")
            raise Exception("Invalid signature")
        
        logger.info(f"Received webhook event: {event['type']}")
        
        # Handle different event types
        if event['type'] == 'payment_intent.succeeded':
            return await self._handle_payment_succeeded(event['data']['object'])
        
        elif event['type'] == 'payment_intent.payment_failed':
            return await self._handle_payment_failed(event['data']['object'])
        
        elif event['type'] == 'customer.subscription.created':
            return await self._handle_subscription_created(event['data']['object'])
        
        elif event['type'] == 'customer.subscription.updated':
            return await self._handle_subscription_updated(event['data']['object'])
        
        elif event['type'] == 'customer.subscription.deleted':
            return await self._handle_subscription_cancelled(event['data']['object'])
        
        elif event['type'] == 'invoice.payment_succeeded':
            return await self._handle_invoice_paid(event['data']['object'])
        
        elif event['type'] == 'invoice.payment_failed':
            return await self._handle_invoice_failed(event['data']['object'])
        
        else:
            logger.info(f"Unhandled webhook event: {event['type']}")
            return {"status": "ignored", "event_type": event['type']}
    
    async def _handle_payment_succeeded(self, payment_intent: Dict[str, Any]) -> Dict[str, Any]:
        """Handle successful payment"""
        logger.info(f"Payment succeeded: {payment_intent['id']}")
        
        # Extract metadata
        metadata = payment_intent.get('metadata', {})
        customer_email = payment_intent.get('receipt_email')
        
        # If this is a credit purchase, add credits to user account
        if 'credits' in metadata:
            credits = float(metadata['credits'])
            bonus_credits = float(metadata.get('bonus_credits', 0))
            total_credits = credits + bonus_credits
            
            # Here you would update the user's credit balance in the database
            # For now, we'll just log it
            logger.info(f"Adding {total_credits} credits to {customer_email}")
            
            return {
                "status": "processed",
                "action": "credits_added",
                "customer_email": customer_email,
                "credits_added": total_credits,
                "payment_intent_id": payment_intent['id']
            }
        
        return {"status": "processed", "action": "payment_recorded"}
    
    async def _handle_payment_failed(self, payment_intent: Dict[str, Any]) -> Dict[str, Any]:
        """Handle failed payment"""
        logger.warning(f"Payment failed: {payment_intent['id']}")
        
        return {
            "status": "processed",
            "action": "payment_failed",
            "payment_intent_id": payment_intent['id'],
            "failure_reason": payment_intent.get('last_payment_error', {}).get('message', 'Unknown')
        }
    
    async def _handle_subscription_created(self, subscription: Dict[str, Any]) -> Dict[str, Any]:
        """Handle new subscription"""
        logger.info(f"Subscription created: {subscription['id']}")
        
        return {
            "status": "processed",
            "action": "subscription_created",
            "subscription_id": subscription['id'],
            "customer_id": subscription['customer']
        }
    
    async def _handle_subscription_updated(self, subscription: Dict[str, Any]) -> Dict[str, Any]:
        """Handle subscription update"""
        logger.info(f"Subscription updated: {subscription['id']}")
        
        return {
            "status": "processed",
            "action": "subscription_updated",
            "subscription_id": subscription['id']
        }
    
    async def _handle_subscription_cancelled(self, subscription: Dict[str, Any]) -> Dict[str, Any]:
        """Handle subscription cancellation"""
        logger.info(f"Subscription cancelled: {subscription['id']}")
        
        return {
            "status": "processed",
            "action": "subscription_cancelled",
            "subscription_id": subscription['id']
        }
    
    async def _handle_invoice_paid(self, invoice: Dict[str, Any]) -> Dict[str, Any]:
        """Handle successful invoice payment"""
        logger.info(f"Invoice paid: {invoice['id']}")
        
        return {
            "status": "processed",
            "action": "invoice_paid",
            "invoice_id": invoice['id']
        }
    
    async def _handle_invoice_failed(self, invoice: Dict[str, Any]) -> Dict[str, Any]:
        """Handle failed invoice payment"""
        logger.warning(f"Invoice payment failed: {invoice['id']}")
        
        return {
            "status": "processed",
            "action": "invoice_failed",
            "invoice_id": invoice['id']
        }
    
    async def _get_or_create_price(self, tier: SubscriptionTier, amount: float) -> Any:
        """Get or create a Stripe price object"""
        price_id = f"price_{tier.value}_monthly"
        
        try:
            # Try to retrieve existing price
            price = stripe.Price.retrieve(price_id)
            return price
        except stripe.error.InvalidRequestError:
            # Price doesn't exist, create it
            if amount == 0:
                # Free tier - create a $0 price
                price = stripe.Price.create(
                    unit_amount=0,
                    currency="usd",
                    recurring={"interval": "month"},
                    product_data={
                        "name": f"Agent Marketplace - {tier.value.title()} Tier"
                    },
                    lookup_key=price_id
                )
            else:
                price = stripe.Price.create(
                    unit_amount=int(amount * 100),
                    currency="usd",
                    recurring={"interval": "month"},
                    product_data={
                        "name": f"Agent Marketplace - {tier.value.title()} Tier"
                    },
                    lookup_key=price_id
                )
            
            logger.info(f"Created price: {price.id} for tier {tier.value}")
            return price
    
    def get_tier_config(self, tier: SubscriptionTier) -> Dict[str, Any]:
        """Get configuration for a subscription tier"""
        return self.tier_config.get(tier, {})
    
    def get_credit_packages(self) -> Dict[str, Dict[str, float]]:
        """Get available credit packages"""
        return self.credit_packages
    
    async def calculate_usage_cost(
        self, 
        tier: SubscriptionTier, 
        executions: int,
        monthly_executions_used: int = 0
    ) -> Dict[str, Any]:
        """Calculate cost for agent executions based on tier"""
        tier_config = self.tier_config[tier]
        monthly_included = tier_config["monthly_executions"]
        execution_price = tier_config["execution_price"]
        
        # Calculate overage
        remaining_included = max(0, monthly_included - monthly_executions_used)
        covered_executions = min(executions, remaining_included)
        overage_executions = executions - covered_executions
        
        overage_cost = overage_executions * execution_price
        
        return {
            "tier": tier.value,
            "total_executions": executions,
            "covered_by_plan": covered_executions,
            "overage_executions": overage_executions,
            "overage_cost": overage_cost,
            "execution_price": execution_price,
            "monthly_included": monthly_included,
            "monthly_used": monthly_executions_used
        }

# Global instance
stripe_integration = StripeIntegration()
