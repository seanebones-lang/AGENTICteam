import { NextRequest, NextResponse } from 'next/server'

// System knowledge base for Claude
const SYSTEM_KNOWLEDGE = `
You are the AI support assistant for Agentic AI Solutions, a comprehensive AI agent marketplace platform. You have complete knowledge of the system and can help users with anything.

## PLATFORM OVERVIEW
Agentic AI Solutions is an enterprise-grade platform that allows users to:
- Deploy and manage autonomous AI agents
- Execute complex tasks through AI agents
- Scale operations with 99.999% uptime
- Access 10+ production-ready agents
- Integrate with existing workflows

## AVAILABLE AGENTS
1. **Security Scanner** - Vulnerability assessment and security auditing
2. **Ticket Resolver** - Automated customer support ticket resolution
3. **Incident Responder** - Emergency response and incident management
4. **Data Processor** - Large-scale data analysis and transformation
5. **Deployment Agent** - Automated software deployment and CI/CD
6. **Report Generator** - Automated report creation and analytics
7. **Audit Agent** - Compliance auditing and risk assessment
8. **Knowledge Base** - Information retrieval and knowledge management
9. **Workflow Orchestrator** - Complex workflow automation
10. **Analytics Engine** - Advanced data analytics and insights

## PRICING TIERS
- **Free**: 10 agent executions/month, basic support
- **Pro ($49/month)**: Unlimited executions, priority support, advanced features
- **Enterprise (Custom)**: Custom agents, dedicated support, SLA guarantees

## GETTING STARTED PROCESS
1. **Sign Up**: Create account at /signup with email verification
2. **Choose Plan**: Select tier at /pricing (start with free)
3. **Browse Agents**: Explore marketplace at /agents
4. **Test in Playground**: Use /playground to test agents safely
5. **Deploy**: Activate agents for production use
6. **Monitor**: Track usage in /dashboard

## COMMON TROUBLESHOOTING

### Authentication Issues
- Login problems: Check email/password, clear cache, try password reset
- Email verification: Check spam, request new verification, whitelist support@bizbot.store
- Account locked: Contact support for unlock

### Agent Execution Issues
- Timeouts: Check internet, try simpler tasks, verify credits
- Poor responses: Be more specific, provide context, break down complex tasks
- Errors: Check agent status, verify permissions, try different agent

### Payment & Billing
- Payment failed: Verify card details, check bank blocks, try different method
- Credits not updating: Wait 2-3 minutes, refresh page, check billing history
- Subscription issues: Manage at /dashboard, contact billing support

### Technical Issues
- Page loading: Refresh (Ctrl+F5), clear cache, try incognito mode
- Slow performance: Check internet speed, close tabs, disable extensions
- Mobile issues: Update browser, clear mobile cache

## SUPPORT CHANNELS
- **Live Chat**: 24/7 availability, 2-minute average response
- **Email**: support@bizbot.store, 1-hour response time
- **Phone**: support@bizbot.store, business hours
- **Documentation**: /docs for detailed guides

## SECURITY & COMPLIANCE
- Military-grade encryption
- SOC 2 compliant
- Zero-trust architecture
- GDPR compliant
- Data never stored permanently

## API INTEGRATION
- REST API available at /api/v1/
- Authentication via API keys
- Rate limiting: 1000 requests/hour (free), unlimited (pro)
- Webhooks for real-time updates

## ENTERPRISE FEATURES
- Custom agent development
- Dedicated support team
- SLA guarantees
- On-premise deployment options
- Advanced analytics and reporting

## INSTRUCTIONS
- Always be helpful, knowledgeable, and professional
- Provide step-by-step guidance when needed
- Offer specific solutions, not just general advice
- Include relevant links when helpful
- Escalate to human support for complex technical issues
- Use the user's conversation history for context
- Suggest appropriate next actions with buttons when relevant

Remember: You can walk users through ANY aspect of the platform. Be comprehensive but concise.
`

export async function POST(request: NextRequest) {
  try {
    const { message, conversation_history } = await request.json()

    // Build conversation context
    let conversationContext = ""
    if (conversation_history && conversation_history.length > 0) {
      conversationContext = "\n\nRecent conversation:\n" + 
        conversation_history.map((msg: any) => 
          `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
    }

    // For now, we'll simulate Claude responses with intelligent logic
    // In production, this would call the actual Claude API
    const response = await generateClaudeResponse(message, conversationContext)

    return NextResponse.json({
      response: response.content,
      suggested_actions: response.actions
    })

  } catch (error) {
    console.error('Support chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

// Simulate Claude API response with intelligent logic
async function generateClaudeResponse(message: string, context: string) {
  const lowerMessage = message.toLowerCase()

  // Analyze user intent and provide comprehensive responses
  if (lowerMessage.includes('getting started') || lowerMessage.includes('how to start') || lowerMessage.includes('begin')) {
    return {
      content: `I'll walk you through getting started with Agentic AI Solutions step by step:

**Step 1: Create Your Account**
• Go to our signup page (/signup)
• Enter your email and create a secure password
• Check your email for verification (including spam folder)
• Click the verification link to activate your account

**Step 2: Choose Your Plan**
• Start with our Free tier (10 executions/month)
• Upgrade to Pro ($49/month) for unlimited usage
• Enterprise plans available for custom needs

**Step 3: Explore the Platform**
• Visit /agents to browse our 10+ AI agents
• Use /playground to test agents safely
• Check /docs for detailed documentation

**Step 4: Deploy Your First Agent**
• Choose an agent that fits your needs
• Click "Activate" to deploy it
• Monitor usage in your /dashboard

Would you like me to guide you through any specific step?`,
      actions: [
        { label: "Sign Up Now", action: "link", value: "/signup" },
        { label: "Browse Agents", action: "link", value: "/agents" },
        { label: "View Pricing", action: "link", value: "/pricing" },
        { label: "Try Playground", action: "link", value: "/playground" }
      ]
    }
  }

  if (lowerMessage.includes('agent') && (lowerMessage.includes('not working') || lowerMessage.includes('error') || lowerMessage.includes('problem'))) {
    return {
      content: `Let me help you troubleshoot agent execution issues:

**Common Agent Problems & Solutions:**

🔧 **Agent Not Responding:**
• Check your internet connection stability
• Verify you have sufficient credits in /dashboard
• Try executing a simpler task first
• Check if the agent is currently online (status indicator)

🎯 **Poor Agent Responses:**
• Be more specific in your instructions
• Provide more context and examples
• Break complex tasks into smaller steps
• Use the playground to test and refine prompts

⚡ **Execution Timeouts:**
• Large tasks may need to be split up
• Check if you're hitting rate limits
• Try during off-peak hours for better performance

🔍 **Error Messages:**
• Copy the exact error message for diagnosis
• Check agent-specific documentation
• Verify your account permissions

Which specific issue are you experiencing? I can provide more targeted help.`,
      actions: [
        { label: "Check Dashboard", action: "link", value: "/dashboard" },
        { label: "Test in Playground", action: "link", value: "/playground" },
        { label: "View Agent Status", action: "link", value: "/agents" },
        { label: "Contact Technical Support", action: "contact", value: "human" }
      ]
    }
  }

  if (lowerMessage.includes('payment') || lowerMessage.includes('billing') || lowerMessage.includes('credit') || lowerMessage.includes('subscription')) {
    return {
      content: `I'll help you with billing and payment questions:

**Payment Issues:**
💳 **Card Declined/Payment Failed:**
• Verify all card details are correct
• Check with your bank for any blocks
• Try a different payment method
• Ensure sufficient funds are available

💰 **Credits Not Updating:**
• Wait 2-3 minutes after payment
• Refresh your dashboard page
• Check your billing history for confirmation
• Verify the payment was actually processed

📊 **Subscription Management:**
• View current plan in /dashboard
• Upgrade/downgrade anytime
• Cancel subscription (access continues until period ends)
• Download invoices and receipts

**Our Pricing:**
• Free: 10 executions/month
• Pro: $49/month - unlimited executions
• Enterprise: Custom pricing for large organizations

Need help with a specific billing issue?`,
      actions: [
        { label: "View Dashboard", action: "link", value: "/dashboard" },
        { label: "See Pricing Plans", action: "link", value: "/pricing" },
        { label: "Billing Support", action: "contact", value: "email" },
        { label: "Update Payment Method", action: "link", value: "/dashboard" }
      ]
    }
  }

  if (lowerMessage.includes('login') || lowerMessage.includes('password') || lowerMessage.includes('account') || lowerMessage.includes('access')) {
    return {
      content: `Let me help you resolve account access issues:

**Login Problems:**
🔐 **Can't Log In:**
• Double-check your email and password spelling
• Try the "Forgot Password" link to reset
• Clear your browser cache and cookies
• Disable browser extensions temporarily
• Try incognito/private browsing mode

📧 **Email Verification Issues:**
• Check your spam/junk folder thoroughly
• Add support@bizbot.store to your contacts
• Request a new verification email
• Wait up to 10 minutes for delivery

🔒 **Account Locked/Suspended:**
• Contact our support team immediately
• Provide your account email for verification
• We'll investigate and restore access quickly

**Security Tips:**
• Use a strong, unique password
• Enable two-factor authentication when available
• Don't share your login credentials
• Log out from shared computers

Still having trouble accessing your account?`,
      actions: [
        { label: "Reset Password", action: "link", value: "/login" },
        { label: "Contact Support", action: "contact", value: "email" },
        { label: "Create New Account", action: "link", value: "/signup" },
        { label: "Check System Status", action: "link", value: "/status" }
      ]
    }
  }

  // Default intelligent response for any other query
  return {
    content: `I'm here to help you with anything related to Agentic AI Solutions! 

Based on your message, I can assist you with:

🚀 **Platform Features:**
• 10+ production-ready AI agents
• Secure agent execution with 99.999% uptime
• Real-time monitoring and analytics
• Enterprise-grade security and compliance

🛠️ **What I Can Help With:**
• Getting started and onboarding
• Agent deployment and management
• Troubleshooting technical issues
• Account and billing questions
• API integration guidance
• Security and compliance questions

💡 **Popular Actions:**
• Browse our AI agent marketplace
• Test agents in the playground
• Check your usage dashboard
• Review documentation and guides

What specific aspect would you like help with? I can provide detailed, step-by-step guidance for anything on the platform.`,
    actions: [
      { label: "Browse Agents", action: "link", value: "/agents" },
      { label: "Try Playground", action: "link", value: "/playground" },
      { label: "View Dashboard", action: "link", value: "/dashboard" },
      { label: "Read Documentation", action: "link", value: "/docs" },
      { label: "Talk to Human Expert", action: "contact", value: "human" }
    ]
  }
}
