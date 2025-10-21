# 🔐 SECURE DEPLOYMENT GUIDE - BIZBOT.STORE

## 🎯 **IMMEDIATE ACTION REQUIRED**

Your Stripe integration is **PRODUCTION-READY** but needs secure environment variable setup to receive payments safely.

## ⚡ **QUICK SECURE DEPLOYMENT (5 minutes)**

### **Step 1: Create Secure Environment File**

Create `.env` file in your project root (this file will NOT be committed to git):

```bash
# 🔐 PRODUCTION ENVIRONMENT VARIABLES
# Replace with your actual Stripe keys from https://dashboard.stripe.com/apikeys

STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE  
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE

# Database (use your production database URL)
DATABASE_URL=postgresql://user:password@host:port/database

# Application Settings
JWT_SECRET=your-secure-jwt-secret-here
API_BASE_URL=https://your-backend-domain.com
FRONTEND_URL=https://bizbot.store
NODE_ENV=production
```

### **Step 2: Deploy Backend to Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend
railway init
railway up

# Set environment variables securely
railway variables set STRIPE_SECRET_KEY="sk_live_YOUR_KEY"
railway variables set STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_KEY"  
railway variables set STRIPE_WEBHOOK_SECRET="whsec_YOUR_SECRET"
railway variables set DATABASE_URL="your_database_url"
```

### **Step 3: Deploy Frontend to Vercel**

```bash
# Install Vercel CLI  
npm install -g vercel

# Deploy frontend
cd frontend
vercel --prod

# Set environment variables securely
vercel env add NEXT_PUBLIC_API_URL production
# Enter your Railway backend URL when prompted

vercel env add STRIPE_PUBLISHABLE_KEY production  
# Enter your Stripe publishable key when prompted
```

### **Step 4: Configure Stripe Webhooks**

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your Railway URL: `https://your-railway-app.railway.app/api/v1/stripe/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the webhook secret and update your Railway environment variables

## 🛡️ **SECURITY BEST PRACTICES**

### **✅ What We've Implemented**
- ✅ No API keys in source code
- ✅ Environment variable validation
- ✅ Webhook signature verification  
- ✅ Rate limiting on all endpoints
- ✅ SSL/HTTPS encryption
- ✅ Input validation and sanitization
- ✅ SQL injection prevention
- ✅ Security headers (HSTS, CSP, etc.)
- ✅ Structured logging and monitoring

### **🔐 Additional Security Measures**

#### **Stripe Dashboard Security**
1. **Restrict API Keys by IP**: In Stripe Dashboard → API Keys → Restrict key
2. **Enable Webhook Signatures**: Always verify webhook signatures
3. **Set Up Alerts**: Monitor for unusual payment activity
4. **Regular Key Rotation**: Rotate keys every 90 days

#### **Platform Security**
```bash
# Railway: Enable 2FA and restrict team access
railway auth:2fa enable

# Vercel: Enable 2FA and set up team permissions  
vercel teams switch your-team
```

## 🚨 **CRITICAL SECURITY CHECKLIST**

Before going live, verify:

- [ ] ✅ All API keys stored in platform environment variables (not in code)
- [ ] ✅ `.env` file added to `.gitignore` 
- [ ] ✅ Stripe webhook endpoints configured with correct URLs
- [ ] ✅ Webhook signature verification working
- [ ] ✅ SSL certificates properly configured
- [ ] ✅ Rate limiting active on all endpoints
- [ ] ✅ Database connections encrypted
- [ ] ✅ CORS properly configured for your domain
- [ ] ✅ Error handling doesn't expose sensitive information
- [ ] ✅ Logging configured (without logging sensitive data)

## 🎯 **EXPECTED RESULT**

After deployment:
- ✅ **bizbot.store**: Frontend working with secure API connection
- ✅ **Railway Backend**: API processing payments securely
- ✅ **Stripe Integration**: Live payments working with webhook verification
- ✅ **Credit System**: Real-time balance tracking and agent execution
- ✅ **Security**: Enterprise-grade protection active

## 🔧 **TROUBLESHOOTING**

### **Common Issues**

**❌ "Stripe not configured" error**
```bash
# Check environment variables are set
railway variables
vercel env ls
```

**❌ Webhook signature verification failed**
```bash
# Verify webhook secret matches Stripe dashboard
# Check webhook URL is correct in Stripe dashboard
```

**❌ CORS errors**
```bash
# Verify FRONTEND_URL environment variable matches your domain
# Check API_BASE_URL points to your Railway deployment
```

## 📞 **SUPPORT**

If you encounter issues:
1. Check Railway/Vercel deployment logs
2. Verify all environment variables are set correctly
3. Test API endpoints directly with curl/Postman
4. Check Stripe webhook delivery logs in dashboard

## 🚀 **GO LIVE CHECKLIST**

1. ✅ Deploy backend to Railway with secure environment variables
2. ✅ Deploy frontend to Vercel with API URL configuration  
3. ✅ Configure Stripe webhooks to point to Railway URL
4. ✅ Test end-to-end payment flow
5. ✅ Verify credit system is working
6. ✅ Monitor for any errors in first 24 hours

**🎉 Your secure, production-ready payment system is now live!**
