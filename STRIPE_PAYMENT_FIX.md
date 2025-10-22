# Stripe Payment Issue - Troubleshooting Guide

## Current Issue
User is being redirected to Stripe checkout but no actual charge is appearing on their card.

## Root Cause Analysis

There are three possible causes:

### 1. **Stripe Test Mode (Most Likely)**
The Stripe keys might be in test mode, which means:
- Checkout appears to work
- No real charges are made
- Test cards like `4242 4242 4242 4242` work
- Real cards show "payment successful" but no actual charge

### 2. **Stripe Account Not Activated**
Your Stripe account needs to be fully activated for live payments:
- Business details must be complete
- Bank account must be verified
- Identity verification completed
- Live mode must be enabled

### 3. **Backend Keys Not Configured**
The Stripe secret key might not be set in Render environment variables.

---

## Solution: Verify Stripe Setup

### Step 1: Check Stripe Dashboard

1. **Go to**: https://dashboard.stripe.com
2. **Check Top Left Corner**: Look for "Test mode" toggle
   - If it says "Test mode ON" → You're in test mode
   - Switch to "Live mode" to see real transactions

3. **Check Activation Status**:
   - Go to: https://dashboard.stripe.com/settings/account
   - Look for "Activate your account" banner
   - If present, complete the activation steps

### Step 2: Verify You're Using Live Keys

Your keys should start with:
- **Publishable Key**: `pk_live_...` (not `pk_test_...`)
- **Secret Key**: `sk_live_...` (not `sk_test_...`)

Your keys should look like:
```
pk_live_51....[your_publishable_key]
sk_live_51....[your_secret_key]
```

These ARE live keys (good!), but they might not be configured correctly in Render.

### Step 3: Set Stripe Keys in Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service** (bizbot-api)
3. **Go to "Environment" tab**
4. **Add/Verify these environment variables**:

```
STRIPE_SECRET_KEY=sk_live_[your_stripe_secret_key]
STRIPE_PUBLISHABLE_KEY=pk_live_[your_stripe_publishable_key]
```

5. **Click "Save Changes"**
6. **Wait for automatic redeploy** (2-3 minutes)

### Step 4: Set Stripe Key in Vercel (Frontend)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your frontend project**
3. **Go to Settings → Environment Variables**
4. **Add this variable**:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[your_stripe_publishable_key]
```

5. **Redeploy** the frontend

### Step 5: Complete Stripe Account Activation

If your Stripe account isn't fully activated:

1. **Go to**: https://dashboard.stripe.com/settings/account
2. **Complete all required fields**:
   - Business name
   - Business address
   - Tax ID (EIN or SSN)
   - Bank account for payouts
   - Personal identification

3. **Verify your identity**:
   - Upload ID (driver's license, passport)
   - Provide business documents if required

4. **Activate live mode**:
   - Once verification is complete
   - Stripe will enable live payments
   - You'll receive an email confirmation

---

## Testing the Fix

### Test with Real Card (Small Amount)

1. **Go to**: https://bizbot.store/pricing
2. **Click "Purchase" on Starter package** ($20)
3. **Use your real credit card**
4. **Complete checkout**
5. **Check**:
   - Stripe dashboard for transaction
   - Your bank account for charge
   - Dashboard for credit balance

### Test with Stripe Test Cards (Test Mode Only)

If you want to test without real charges:

1. **Switch to Test Mode** in Stripe dashboard
2. **Use test keys** (`pk_test_...` and `sk_test_...`)
3. **Use test card**: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

---

## Webhook Configuration (Important!)

For payments to be confirmed and credits added automatically, you need to set up webhooks:

### Step 1: Create Webhook Endpoint

1. **Go to**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"**
3. **Endpoint URL**: `https://bizbot-api.onrender.com/api/v1/stripe/webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

5. **Click "Add endpoint"**
6. **Copy the "Signing secret"** (starts with `whsec_...`)

### Step 2: Add Webhook Secret to Render

1. **Go to Render dashboard**
2. **Environment variables**
3. **Add**:
```
STRIPE_WEBHOOK_SECRET=whsec_[your_webhook_secret]
```

4. **Save and redeploy**

---

## Quick Diagnostic Commands

### Check if Stripe keys are set in backend:
```bash
curl https://bizbot-api.onrender.com/health
```

### Test checkout session creation:
```bash
curl -X POST https://bizbot-api.onrender.com/api/v1/stripe/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "test@example.com",
    "package": "starter",
    "success_url": "https://bizbot.store/dashboard",
    "cancel_url": "https://bizbot.store/pricing"
  }'
```

If this returns a `checkout_url`, the backend is configured correctly.

---

## Expected Flow (When Working)

1. **User clicks "Purchase"** on pricing page
2. **Frontend calls backend**: `/api/v1/stripe/create-checkout-session`
3. **Backend creates Stripe session** with live keys
4. **User redirected to Stripe** checkout page
5. **User enters card details** and completes payment
6. **Stripe processes payment** (real charge to card)
7. **Stripe sends webhook** to backend
8. **Backend adds credits** to user account
9. **User redirected back** to dashboard with success message

---

## Current Status

Based on the symptoms:
- ✅ Frontend is working (redirects to Stripe)
- ✅ Backend endpoint exists
- ❓ Stripe keys might not be set in Render
- ❓ Stripe account might not be fully activated
- ❓ Webhooks not configured (credits won't be added automatically)

---

## Immediate Action Items

1. **Check Stripe Dashboard**:
   - Verify account is activated
   - Check if any payments appear (even failed ones)
   - Look for error messages

2. **Set Environment Variables in Render**:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - Wait for redeploy

3. **Set Up Webhooks**:
   - Create webhook endpoint in Stripe
   - Add webhook secret to Render

4. **Test Again**:
   - Try $20 purchase
   - Check Stripe dashboard immediately
   - Check bank account in 1-2 business days

---

## Support

If issues persist after following this guide:

1. **Check Stripe Dashboard** → Logs section for errors
2. **Check Render Logs** for backend errors
3. **Email Stripe Support**: support@stripe.com
4. **Include**:
   - Account ID
   - Timestamp of failed payment
   - Error messages from logs

---

## Alternative: Manual Credit Addition (Temporary)

While fixing Stripe, you can manually add credits via backend:

```bash
# This would require a backend endpoint to manually add credits
# Not currently implemented, but could be added for testing
```

---

**Status**: Awaiting Stripe account activation and environment variable configuration
**Priority**: HIGH - Blocking revenue
**ETA**: 5-10 minutes (if just env vars) or 1-2 days (if Stripe activation needed)

