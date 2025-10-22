import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  AlertTriangle,
  Zap,
  Clock,
  Target,
  BookOpen,
  PlayCircle,
  Code,
  MessageSquare,
  Shield,
  TrendingUp
} from 'lucide-react'

export default function TicketResolverHowToPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/agents/ticket-resolver" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ticket Resolver
          </Link>
          
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                How to Use: Ticket Resolver Agent
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Complete guide to maximizing your AI support agent
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-green-500 text-white px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              5 min read
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Beginner Friendly
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              15+ Use Cases
            </Badge>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <PlayCircle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">Quick Start (30 Seconds)</h2>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>Copy any customer support ticket or issue description</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>Paste it into the "Task Description" field</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Click "Execute Agent" and get instant analysis + solution</span>
                </li>
              </ol>
              <Link href="/agents/ticket-resolver">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Try It Now - Free
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Table of Contents */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">📋 Table of Contents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <a href="#what-it-does" className="text-blue-600 hover:underline">→ What It Does</a>
            <a href="#use-cases" className="text-blue-600 hover:underline">→ 15+ Use Cases</a>
            <a href="#best-practices" className="text-blue-600 hover:underline">→ Best Practices</a>
            <a href="#limitations" className="text-blue-600 hover:underline">→ Limitations</a>
            <a href="#examples" className="text-blue-600 hover:underline">→ Real Examples</a>
            <a href="#tips" className="text-blue-600 hover:underline">→ Pro Tips</a>
          </div>
        </Card>

        {/* What It Does */}
        <section id="what-it-does" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Zap className="h-8 w-8 text-purple-600" />
            What the Ticket Resolver Agent Does
          </h2>
          
          <Card className="p-6 mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              The Ticket Resolver Agent is an AI-powered support assistant that analyzes customer support tickets and provides:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Issue Classification</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically categorizes the problem (technical, billing, access, etc.)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Priority Scoring</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Assigns urgency level (Low, Medium, High, Critical)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Root Cause Analysis</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Identifies the underlying problem causing the issue
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Solution Recommendations</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Provides step-by-step resolution instructions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Smart Routing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Suggests which team/person should handle the ticket
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Customer Response Draft</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generates professional response you can send to customer
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Target className="h-8 w-8 text-purple-600" />
            15+ Ways to Use This Agent
          </h2>
          
          <div className="space-y-4">
            {/* Technical Support */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">1. Technical Support Issues</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Perfect for troubleshooting technical problems, errors, bugs, and system issues.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold mb-2">Example Input:</p>
                    <code className="text-sm text-gray-700 dark:text-gray-300">
                      "Customer says: The app crashes every time I try to upload a photo. I'm on iPhone 14, iOS 17.2. Error message: 'Upload failed - network error'"
                    </code>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm font-semibold mb-2">What You Get:</p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Issue: Photo upload failure on iOS app</li>
                      <li>• Root Cause: Network timeout or file size limit</li>
                      <li>• Priority: Medium</li>
                      <li>• Solution: Check photo size, try WiFi, update app, clear cache</li>
                      <li>• Response draft for customer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Access */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">2. Account Access & Login Issues</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Handle password resets, locked accounts, authentication problems, and access issues.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold mb-2">Example Input:</p>
                    <code className="text-sm text-gray-700 dark:text-gray-300">
                      "User reports: I cannot reset my password. When I click the reset link in the email, I get error 403 Forbidden."
                    </code>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm font-semibold mb-2">What You Get:</p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Issue: Password reset link returning 403 error</li>
                      <li>• Root Cause: Expired token or permissions issue</li>
                      <li>• Priority: High (user cannot access account)</li>
                      <li>• Solution: Generate new reset link, check token expiry settings</li>
                      <li>• Escalate to: Security team if repeated failures</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* Billing */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">3. Billing & Payment Issues</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    Resolve payment failures, subscription problems, refund requests, and invoice questions.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                    <p className="text-sm font-semibold mb-2">Example Input:</p>
                    <code className="text-sm text-gray-700 dark:text-gray-300">
                      "Customer complaint: I was charged twice for my monthly subscription. I see two charges of $29.99 on my credit card statement for the same date."
                    </code>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <p className="text-sm font-semibold mb-2">What You Get:</p>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Issue: Duplicate billing charge</li>
                      <li>• Root Cause: Payment retry or system glitch</li>
                      <li>• Priority: High (financial impact)</li>
                      <li>• Solution: Verify charges, process refund, check billing system</li>
                      <li>• Escalate to: Billing team for refund processing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            {/* More Use Cases - Condensed */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Additional Use Cases:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">4. Feature Requests</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Categorize and prioritize product suggestions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">5. Bug Reports</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Analyze bugs and route to dev team</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">6. Integration Issues</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Troubleshoot API and third-party connections</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">7. Performance Complaints</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Diagnose slow loading, timeouts, lag</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">8. Data Export Requests</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Handle GDPR and data portability</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">9. Account Cancellations</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Process cancellation requests properly</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">10. Mobile App Issues</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">iOS/Android specific problems</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">11. Email Delivery Problems</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Not receiving notifications or confirmations</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">12. Upgrade/Downgrade Requests</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Plan changes and pricing questions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">13. Security Concerns</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Suspicious activity, hacking attempts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">14. Onboarding Questions</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">New user setup and getting started</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">15. Compliance Requests</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">GDPR, CCPA, data deletion</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-yellow-600" />
            Best Practices for Maximum Accuracy
          </h2>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  DO: Provide Complete Context
                </h3>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-2">Good Example:</p>
                  <code className="text-sm text-gray-700 dark:text-gray-300">
                    "Customer (John Doe, account #12345) reports: Cannot access dashboard. Gets 'Session expired' error. Using Chrome 120 on Windows 11. Last successful login was 2 hours ago. Has tried clearing cache and different browsers."
                  </code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  DON'T: Use Vague Descriptions
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-2">Bad Example:</p>
                  <code className="text-sm text-gray-700 dark:text-gray-300">
                    "It's broken"
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    ❌ Too vague - agent cannot provide accurate analysis
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-3">📋 Include These Details When Possible:</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Error messages:</strong> Exact text of any errors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Steps to reproduce:</strong> What the user did before the issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Environment:</strong> Browser, device, OS version</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Account info:</strong> User ID, subscription tier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Frequency:</strong> First time or recurring issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span><strong>Impact:</strong> How many users affected, business impact</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Limitations */}
        <section id="limitations" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            What This Agent CANNOT Do
          </h2>
          
          <Card className="p-6 border-2 border-orange-200 dark:border-orange-800">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              It's important to understand the agent's limitations to set proper expectations:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cannot Access Your Systems</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The agent analyzes text only. It cannot log into your database, check server logs, or access your internal tools. It provides recommendations based on the information you provide.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cannot Make Changes Automatically</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The agent provides analysis and recommendations. It cannot reset passwords, process refunds, or modify accounts. A human must take action based on the recommendations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cannot Guarantee 100% Accuracy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    While highly accurate (98.9% success rate), the agent is AI-based and may occasionally misinterpret complex or ambiguous tickets. Always review recommendations before implementing.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cannot Handle Extremely Sensitive Data</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Do not paste full credit card numbers, social security numbers, or other highly sensitive PII. Redact sensitive data before analysis (e.g., "Card ending in ****1234").
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cannot Learn Your Specific Policies</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The agent uses general best practices. It doesn't know your company's specific refund policy, SLAs, or internal procedures unless you include them in the ticket description.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Cannot Replace Human Judgment</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The agent is a tool to assist support teams, not replace them. Complex situations, angry customers, or edge cases still require human empathy and decision-making.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Pro Tips */}
        <section id="tips" className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-purple-600" />
            Pro Tips for Power Users
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <h3 className="text-lg font-bold mb-3">💡 Tip #1: Batch Processing</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Process multiple similar tickets at once by combining them: "3 users report login issues: User A sees error X, User B sees error Y, User C sees error Z"
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <h3 className="text-lg font-bold mb-3">💡 Tip #2: Include History</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Mention previous attempts: "User tried clearing cache, restarting browser, and different device - still failing." This helps the agent avoid suggesting already-tried solutions.
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <h3 className="text-lg font-bold mb-3">💡 Tip #3: Priority Keywords</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Use keywords like "URGENT", "CRITICAL", "BLOCKING PRODUCTION" to help the agent correctly assess priority. It understands context and urgency indicators.
              </p>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <h3 className="text-lg font-bold mb-3">💡 Tip #4: Copy-Paste Friendly</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                The agent's output is formatted for easy copy-paste into your ticketing system or customer response. Use it to speed up your workflow.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Try It?</h2>
          <p className="text-xl mb-6 text-purple-100">
            Start with 3 free queries. No credit card required.
          </p>
          <Link href="/agents/ticket-resolver">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
              Start Free Trial Now
            </Button>
          </Link>
          <p className="mt-4 text-sm text-purple-100">
            ✓ 3 free queries  ✓ No signup required  ✓ Instant results
          </p>
        </Card>
      </div>
    </div>
  )
}

