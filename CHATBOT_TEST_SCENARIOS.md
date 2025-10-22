# Support Chatbot Test Scenarios

## Overview
The support chatbot is now powered by Claude 3.5 Sonnet with comprehensive system knowledge covering all aspects of BizBot.Store.

## Test Scenarios

### 1. Getting Started Questions
**User Input**: "How do I get started?"
**Expected Response**: 
- 3-step onboarding process
- Links to signup, pricing, and agents pages
- Clear, actionable steps

**User Input**: "What is this platform?"
**Expected Response**:
- Platform overview
- Key features
- Available agents
- Pricing information

### 2. Pricing & Billing Questions
**User Input**: "How much does it cost?"
**Expected Response**:
- Credit system explanation ($0.04 per credit)
- Credit packages ($20, $50, $100, $250)
- Subscription options
- Link to /pricing page

**User Input**: "Do credits expire?"
**Expected Response**:
- Credits never expire (one-time purchases)
- Subscription credits don't roll over
- Clear distinction between purchase types

**User Input**: "My payment failed, what should I do?"
**Expected Response**:
- Step-by-step troubleshooting
- Check card details
- Contact bank
- Alternative payment methods
- Support contact info

### 3. Account Issues
**User Input**: "I can't log in"
**Expected Response**:
- Common login troubleshooting steps
- Password reset instructions
- Browser cache clearing
- Link to /login page
- Support escalation if needed

**User Input**: "I didn't receive verification email"
**Expected Response**:
- Check spam folder
- Add support@bizbot.store to contacts
- Wait 5-10 minutes
- Request new verification
- Support contact for manual verification

### 4. Agent Execution Questions
**User Input**: "How do I use the Ticket Resolver agent?"
**Expected Response**:
- Free trial information (3 queries)
- How to execute agent
- Best practices for input
- Example use cases
- Link to agent page

**User Input**: "What agents are available?"
**Expected Response**:
- List of all 10 agents
- Brief description of each
- Credit costs
- Link to /agents page

**User Input**: "Agent is not responding"
**Expected Response**:
- Troubleshooting steps
- Check internet connection
- Verify credits
- Try simpler task
- Support escalation

### 5. Free Trial Questions
**User Input**: "Is there a free trial?"
**Expected Response**:
- Ticket Resolver has 3 free queries
- No credit card required
- How to access
- Limitations
- What happens after trial

**User Input**: "Can I get more free queries?"
**Expected Response**:
- Trial is limited to 3 queries
- Cannot be extended
- Minimum purchase is $20
- Link to pricing

### 6. Technical Issues
**User Input**: "The page won't load"
**Expected Response**:
- Refresh page (Ctrl+F5)
- Clear cache
- Try incognito mode
- Check /status page
- Different browser
- Support contact

**User Input**: "Credits not showing after payment"
**Expected Response**:
- Wait 2-3 minutes and refresh
- Check email confirmation
- Verify payment processed
- Check /dashboard
- Support contact with transaction ID

### 7. Security & Privacy
**User Input**: "Is my data secure?"
**Expected Response**:
- Encryption details (TLS 1.3, AES-256)
- Compliance (SOC 2, GDPR)
- Data retention (30 days)
- No training on user data
- Zero-trust architecture

**User Input**: "Can I delete my account?"
**Expected Response**:
- Contact support@bizbot.store
- Processed within 7 days
- Data export available
- Privacy policy link

### 8. Complex Multi-Part Questions
**User Input**: "I signed up but my payment failed and now I can't log in"
**Expected Response**:
- Address each issue separately
- Payment troubleshooting first
- Then login troubleshooting
- Suggest contacting support
- Provide both email and phone

### 9. Escalation Scenarios
**User Input**: "This is urgent, I need help now"
**Expected Response**:
- Acknowledge urgency
- Provide immediate contact options
- Phone: (817) 675-9898
- Email: support@bizbot.store
- Live chat option

**User Input**: "I want to speak to a human"
**Expected Response**:
- Acknowledge request
- Provide contact options
- Email, phone, live chat
- Business hours
- Response times

### 10. Edge Cases
**User Input**: "asdfasdf" (gibberish)
**Expected Response**:
- Polite acknowledgment
- Ask to clarify
- Provide main menu options
- Getting started, pricing, agents, support

**User Input**: "Tell me a joke"
**Expected Response**:
- Polite redirect to support topics
- Offer help with platform questions
- Main menu options

## Success Criteria
✅ Responses are accurate and based on system knowledge
✅ Responses are professional and helpful
✅ Suggested actions are relevant to the question
✅ Links are correct and functional
✅ Escalation to human support when appropriate
✅ Handles errors gracefully with fallback responses
✅ Response time < 5 seconds
✅ Conversation context is maintained

## Testing Instructions

### Frontend Testing (After Deployment)
1. Go to https://bizbot.store
2. Click chat icon (bottom right)
3. Test each scenario above
4. Verify responses are accurate
5. Click suggested action buttons
6. Verify links work correctly

### Backend Testing (Local)
```bash
curl -X POST https://bizbot-api.onrender.com/api/support-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How much does it cost?",
    "conversation_history": []
  }'
```

### Expected Response Format
```json
{
  "response": "Detailed, helpful response text...",
  "suggested_actions": [
    {"label": "View Pricing", "action": "link", "value": "/pricing"},
    {"label": "Email Support", "action": "contact", "value": "email"}
  ]
}
```

## Deployment Status
- ✅ Backend endpoint created: `/api/support-chat`
- ✅ System knowledge base created
- ✅ Frontend connected to backend API
- ✅ Error handling and fallbacks implemented
- ✅ Timeout protection (15 seconds)
- ⏳ Waiting for Render backend deployment
- ⏳ Waiting for Vercel frontend deployment

## Next Steps
1. Wait for Render to deploy backend (3-5 minutes)
2. Wait for Vercel to deploy frontend (2-3 minutes)
3. Test chatbot on live site
4. Monitor for errors in production
5. Gather user feedback
6. Iterate on knowledge base as needed

