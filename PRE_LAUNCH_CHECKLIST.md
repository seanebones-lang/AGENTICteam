# 🚀 PRE-LAUNCH CHECKLIST - BizBot.Store

**Goal:** Get EVERYTHING production-ready for launch announcement  
**Status:** 🔄 IN PROGRESS  
**Target:** Full functional launch

---

## 🔑 PHASE 1: ENVIRONMENT VARIABLES (CRITICAL)

### **Vercel Frontend Project**

**Go to:** https://vercel.com/[your-team]/frontend/settings/environment-variables

**Add/Verify these variables:**

#### **1. Backend API URL**
```bash
Name: NEXT_PUBLIC_API_URL
Value: https://bizbot-api.onrender.com
Environments: ✅ Production ✅ Preview ✅ Development
```

#### **2. Demo API Key**
```bash
Name: NEXT_PUBLIC_DEMO_API_KEY
Value: demo-key-12345
Environments: ✅ Production ✅ Preview ✅ Development
```

#### **3. Stripe Publishable Key**
```bash
Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_[YOUR_KEY] or pk_live_[YOUR_KEY]
Environments: ✅ Production ✅ Preview ✅ Development
```
**Get from:** https://dashboard.stripe.com/apikeys

#### **4. App URL (Optional)**
```bash
Name: NEXT_PUBLIC_APP_URL
Value: https://bizbot.store
Environments: ✅ Production ✅ Preview ✅ Development
```

**After adding ALL variables:**
- [ ] Click "Redeploy" on latest deployment
- [ ] Wait 2-3 minutes for new build
- [ ] Test the site

---

### **Render Backend Project**

**Go to:** https://dashboard.render.com/web/[your-service]/env

**Add/Verify these variables:**

#### **1. Anthropic API Key**
```bash
Name: ANTHROPIC_API_KEY
Value: sk-ant-[YOUR_KEY]
```
**Get from:** https://console.anthropic.com/settings/keys

#### **2. Stripe Secret Key**
```bash
Name: STRIPE_SECRET_KEY
Value: sk_test_[YOUR_KEY] or sk_live_[YOUR_KEY]
```
**Get from:** https://dashboard.stripe.com/apikeys

#### **3. JWT Secret Key**
```bash
Name: JWT_SECRET_KEY
Value: [Generate a secure random string]
```
**Generate with:** `openssl rand -base64 32`

#### **4. Demo API Key**
```bash
Name: DEMO_API_KEY
Value: demo-key-12345
```
**Must match frontend!**

#### **5. SMTP Email Settings (Optional but recommended)**
```bash
Name: SMTP_SERVER
Value: smtp.sendgrid.net (or your provider)

Name: SMTP_PORT
Value: 587

Name: SMTP_USERNAME
Value: apikey (for SendGrid) or your username

Name: SMTP_PASSWORD
Value: [Your SMTP password/API key]

Name: SENDER_EMAIL
Value: no-reply@bizbot.store
```

**After adding ALL variables:**
- [ ] Click "Save Changes"
- [ ] Backend will auto-restart
- [ ] Wait 1-2 minutes

---

## ✅ PHASE 2: FUNCTIONAL TESTING

### **Test 1: Backend Health Check**
```bash
curl https://bizbot-api.onrender.com/health
```
**Expected:** `{"status":"healthy"}` or similar

- [ ] Backend is responding
- [ ] No errors in Render logs

---

### **Test 2: Free Trial Flow**

1. **Go to:** https://bizbot.store
2. **Click:** "Start Free Trial Now"
3. **Should land on:** Ticket Resolver page
4. **Check:** "Query 1 of 3" progress indicator visible
5. **Paste test ticket:**
   ```
   Customer says: I cannot reset my password. When I click the reset link, I get error 403 Forbidden.
   ```
6. **Click:** "Execute Agent"
7. **Expected:** Results appear in 1-2 seconds
8. **Check:** Progress updates to "Query 2 of 3"
9. **Repeat 2 more times**
10. **After Query 3:** Paywall modal should appear

**Checklist:**
- [ ] Free trial counter works
- [ ] Progress bar updates
- [ ] Agent executes successfully
- [ ] Paywall appears after 3 queries

---

### **Test 3: Agent Execution**

**Test each agent:**
1. [ ] Ticket Resolver
2. [ ] Security Scanner
3. [ ] Data Processor
4. [ ] Knowledge Base
5. [ ] Incident Responder
6. [ ] Deployment Agent
7. [ ] Audit Agent
8. [ ] Report Generator
9. [ ] Workflow Orchestrator
10. [ ] Escalation Manager

**For each agent:**
- [ ] Page loads without errors
- [ ] "How to Use Guide" link appears
- [ ] Can execute agent
- [ ] Results appear

---

### **Test 4: Stripe Payment Flow**

1. **Trigger paywall** (use 3 free queries)
2. **Click:** "Get Started - $20"
3. **Should redirect to:** Stripe checkout
4. **Use test card:** 4242 4242 4242 4242
5. **Expected:** Payment processes successfully

**Checklist:**
- [ ] Stripe checkout loads
- [ ] Test payment works
- [ ] Redirects back to site
- [ ] Credits are added to account

---

### **Test 5: How to Use Guides**

**Visit each guide:**
1. [ ] /agents/ticket-resolver/how-to-use
2. [ ] /agents/security-scanner/how-to-use
3. [ ] /agents/data-processor/how-to-use
4. [ ] /agents/knowledge-base/how-to-use
5. [ ] /agents/incident-responder/how-to-use
6. [ ] /agents/deployment-agent/how-to-use
7. [ ] /agents/audit-agent/how-to-use
8. [ ] /agents/report-generator/how-to-use
9. [ ] /agents/workflow-orchestrator/how-to-use
10. [ ] /agents/escalation-manager/how-to-use

**For each guide:**
- [ ] Page loads without errors
- [ ] Content is displayed
- [ ] Examples are visible
- [ ] Back button works

---

### **Test 6: Mobile Responsiveness**

**Test on:**
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)

**Check:**
- [ ] Homepage looks good
- [ ] Agent pages are readable
- [ ] Buttons are clickable
- [ ] Forms work
- [ ] No horizontal scrolling

---

### **Test 7: Browser Compatibility**

**Test in:**
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)

**Check:**
- [ ] Site loads
- [ ] No console errors
- [ ] All features work

---

## 🔒 PHASE 3: SECURITY VERIFICATION

### **Security Checklist**

- [ ] **SSL Certificate:** https://bizbot.store shows padlock
- [ ] **Security Headers:** Check with https://securityheaders.com
- [ ] **Rate Limiting:** Try 20 rapid requests (should block)
- [ ] **API Key Required:** Try agent without key (should fail)
- [ ] **Free Trial Tracking:** Clear cookies, try 4 queries (should block)
- [ ] **No Exposed Secrets:** Check browser console for API keys
- [ ] **CORS Working:** Frontend can call backend
- [ ] **Error Handling:** Invalid inputs show proper errors

---

## 📊 PHASE 4: ANALYTICS & MONITORING

### **Set Up Tracking**

#### **Google Analytics**
1. [ ] Create GA4 property
2. [ ] Add tracking code to frontend
3. [ ] Set up conversion events:
   - Free trial started
   - Query executed
   - Paywall shown
   - Payment completed

#### **Error Monitoring**
1. [ ] Set up Sentry (or similar)
2. [ ] Add to frontend
3. [ ] Add to backend
4. [ ] Test error reporting

#### **Uptime Monitoring**
1. [ ] Set up UptimeRobot (or similar)
2. [ ] Monitor: https://bizbot.store
3. [ ] Monitor: https://bizbot-api.onrender.com
4. [ ] Set up alerts

---

## 🎯 PHASE 5: FINAL SMOKE TEST

### **Complete User Journey**

**Scenario: New user trying the platform**

1. [ ] Visit https://bizbot.store
2. [ ] See attractive homepage
3. [ ] Click "Start Free Trial Now"
4. [ ] Land on Ticket Resolver
5. [ ] See "How to Use Guide" banner
6. [ ] Click guide, read documentation
7. [ ] Go back to agent
8. [ ] See progress "Query 1 of 3"
9. [ ] Execute first query
10. [ ] Get results
11. [ ] Progress updates to "Query 2 of 3"
12. [ ] Execute second query
13. [ ] Progress updates to "Query 3 of 3"
14. [ ] Execute third query
15. [ ] Paywall modal appears
16. [ ] Click "Get Started"
17. [ ] Stripe checkout loads
18. [ ] (Don't complete payment in test)

**All steps should work smoothly!**

---

## 📝 PHASE 6: LAUNCH PREPARATION

### **Create Launch Materials**

#### **Announcement Copy**
```markdown
🚀 Introducing BizBot.Store - AI Agents for Business

Solve support tickets in 30 seconds with AI.

✅ 3 FREE queries to try it
✅ No credit card required
✅ Instant results

10 production-ready agents:
- Ticket Resolver
- Security Scanner
- Data Processor
- And 7 more...

Try it now: https://bizbot.store

#AI #CustomerSupport #Automation
```

#### **Social Media Posts**
- [ ] Twitter/X post
- [ ] LinkedIn post
- [ ] Facebook post
- [ ] Reddit post (relevant subreddits)

#### **Email Announcement**
- [ ] Subject line
- [ ] Body copy
- [ ] CTA buttons
- [ ] Test email

---

## 🚀 PHASE 7: LAUNCH!

### **Pre-Launch Final Checks**

**30 minutes before launch:**
- [ ] All environment variables set
- [ ] All tests passing
- [ ] No errors in logs
- [ ] Site loads fast
- [ ] Mobile works
- [ ] Stripe test mode works

**Launch Sequence:**
1. [ ] Make announcement posts
2. [ ] Send email announcement
3. [ ] Post on social media
4. [ ] Monitor traffic
5. [ ] Watch for errors
6. [ ] Respond to feedback

---

## 📊 POST-LAUNCH MONITORING

### **First 24 Hours**

**Monitor:**
- [ ] Conversion rate
- [ ] Free trial usage
- [ ] Error rates
- [ ] Page load times
- [ ] User feedback

**Be ready to:**
- [ ] Fix bugs quickly
- [ ] Respond to users
- [ ] Adjust messaging
- [ ] Scale if needed

---

## 🆘 TROUBLESHOOTING

### **Common Issues**

**Issue: Agent execution fails**
- Check: ANTHROPIC_API_KEY in Render
- Check: DEMO_API_KEY matches frontend/backend
- Check: Backend logs in Render

**Issue: Stripe not working**
- Check: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel
- Check: STRIPE_SECRET_KEY in Render
- Check: Using test keys (pk_test_, sk_test_)

**Issue: Free trial not tracking**
- Check: Backend database is working
- Check: IP-based tracking is enabled
- Check: Browser cookies enabled

**Issue: Site not updating**
- Check: Vercel deployment succeeded
- Check: Clear browser cache
- Check: Try incognito mode

---

## ✅ LAUNCH READINESS SCORE

**Calculate your score:**

- Environment Variables: ___ / 12 ✅
- Functional Tests: ___ / 7 ✅
- Security Checks: ___ / 8 ✅
- Analytics Setup: ___ / 3 ✅
- Smoke Test: ___ / 17 ✅
- Launch Materials: ___ / 4 ✅

**Total: ___ / 51**

**Launch when score is 45+ (90%)**

---

## 🎯 PRIORITY ORDER

**Do these FIRST (Critical):**
1. ✅ Add all Vercel environment variables
2. ✅ Add all Render environment variables
3. ✅ Test free trial flow
4. ✅ Test agent execution
5. ✅ Verify Stripe works

**Do these SECOND (Important):**
6. ✅ Test all 10 agents
7. ✅ Test on mobile
8. ✅ Check security
9. ✅ Set up analytics

**Do these THIRD (Nice to have):**
10. ✅ Create launch materials
11. ✅ Set up monitoring
12. ✅ Test all browsers

---

## 📞 SUPPORT

**If you get stuck:**
1. Check Vercel deployment logs
2. Check Render backend logs
3. Check browser console errors
4. Test in incognito mode
5. Ask for help!

---

**🚀 LET'S GET YOU LAUNCHED! 🚀**

**Start with Phase 1 (Environment Variables) and work through each phase.**

**You're almost there!**

