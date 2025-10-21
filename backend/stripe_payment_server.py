#!/usr/bin/env python3
"""
🔐 SECURE STRIPE PAYMENT SERVER - Production Ready
No API keys in source code - uses environment variables only
"""

import os
import stripe
import logging
from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import json

# Initialize FastAPI
app = FastAPI(title="Secure Stripe Payment API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://bizbot.store", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Stripe (SECURE - from environment variables only)
stripe_secret_key = os.getenv('STRIPE_SECRET_KEY')
stripe_webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

if not stripe_secret_key:
    logger.error("❌ STRIPE_SECRET_KEY not found in environment variables")
    raise ValueError("Stripe configuration missing")

if not stripe_secret_key.startswith(('sk_live_', 'sk_test_')):
    logger.error("❌ Invalid Stripe secret key format")
    raise ValueError("Invalid Stripe key format")

stripe.api_key = stripe_secret_key
logger.info("✅ Stripe initialized successfully")

# Pydantic Models
class PaymentRequest(BaseModel):
    amount: float  # Amount in dollars
    currency: str = "usd"
    customer_email: Optional[str] = None
    description: Optional[str] = "Agent Marketplace Credits"

class PaymentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
    amount: float
    status: str

# Health Check
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Stripe connection
        stripe.Account.retrieve()
        return {
            "status": "healthy",
            "stripe": "connected",
            "message": "Payment system operational"
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy", 
            "stripe": "disconnected",
            "error": str(e)
        }

# Create Payment Intent
@app.post("/create-payment-intent", response_model=PaymentResponse)
async def create_payment_intent(payment_request: PaymentRequest):
    """Create a Stripe Payment Intent for credit purchase"""
    try:
        # Convert dollars to cents
        amount_cents = int(payment_request.amount * 100)
        
        # Minimum amount validation ($5)
        if amount_cents < 500:
            raise HTTPException(status_code=400, detail="Minimum payment amount is $5.00")
        
        # Create Payment Intent
        intent = stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=payment_request.currency,
            metadata={
                'type': 'credit_purchase',
                'credits': str(payment_request.amount),
                'customer_email': payment_request.customer_email or 'unknown'
            },
            description=payment_request.description,
            automatic_payment_methods={'enabled': True}
        )
        
        logger.info(f"✅ Payment Intent created: {intent.id} for ${payment_request.amount}")
        
        return PaymentResponse(
            client_secret=intent.client_secret,
            payment_intent_id=intent.id,
            amount=payment_request.amount,
            status=intent.status
        )
        
    except stripe.error.StripeError as e:
        logger.error(f"❌ Stripe error: {e}")
        raise HTTPException(status_code=400, detail=f"Payment error: {str(e)}")
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Webhook Handler
@app.post("/webhook")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks securely"""
    try:
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')
        
        if not stripe_webhook_secret:
            logger.warning("⚠️ Webhook secret not configured")
            return {"status": "webhook_secret_missing"}
        
        # Verify webhook signature
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, stripe_webhook_secret
            )
        except ValueError:
            logger.error("❌ Invalid webhook payload")
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            logger.error("❌ Invalid webhook signature")
            raise HTTPException(status_code=400, detail="Invalid signature")
        
        # Handle the event
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            logger.info(f"✅ Payment succeeded: {payment_intent['id']}")
            
            # Here you would:
            # 1. Add credits to customer account
            # 2. Send confirmation email
            # 3. Update database
            
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            logger.warning(f"❌ Payment failed: {payment_intent['id']}")
            
        else:
            logger.info(f"ℹ️ Unhandled event type: {event['type']}")
        
        return {"status": "success"}
        
    except Exception as e:
        logger.error(f"❌ Webhook error: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

# Get Stripe Publishable Key (for frontend)
@app.get("/config")
async def get_stripe_config():
    """Get Stripe publishable key for frontend"""
    publishable_key = os.getenv('STRIPE_PUBLISHABLE_KEY')
    
    if not publishable_key:
        raise HTTPException(status_code=500, detail="Stripe configuration incomplete")
    
    return {
        "publishable_key": publishable_key,
        "currency": "usd"
    }

# Payment Status Check
@app.get("/payment-status/{payment_intent_id}")
async def check_payment_status(payment_intent_id: str):
    """Check the status of a payment"""
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        return {
            "payment_intent_id": intent.id,
            "status": intent.status,
            "amount": intent.amount / 100,  # Convert cents to dollars
            "currency": intent.currency,
            "created": intent.created
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"❌ Error retrieving payment: {e}")
        raise HTTPException(status_code=404, detail="Payment not found")

if __name__ == "__main__":
    import uvicorn
    
    # Check environment variables
    required_vars = ['STRIPE_SECRET_KEY', 'STRIPE_PUBLISHABLE_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing environment variables: {missing_vars}")
        print("💡 Create a .env file with your Stripe keys:")
        print("   STRIPE_SECRET_KEY=sk_live_your_key_here")
        print("   STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here")
        print("   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret")
        exit(1)
    
    print("🚀 Starting Secure Stripe Payment Server...")
    print("✅ Environment variables configured")
    print("🔐 No API keys in source code")
    print("📡 Server running on http://localhost:8000")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
