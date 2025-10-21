import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { SupportChatbot } from '@/components/support-chatbot'
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  Shield,
  CreditCard,
  Settings,
  Play,
  Users,
  FileText,
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 px-4 py-1.5 text-sm font-semibold">
              <HelpCircle className="w-4 h-4 mr-2" />
              24/7 Support Available
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Support & Help Center
            </h1>
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300 mb-8">
              Get started quickly with our comprehensive onboarding guide, troubleshooting resources, and expert support team.
            </p>
            
            {/* Quick Contact */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" asChild>
                <Link href="#onboarding">
                  <Play className="w-4 h-4 mr-2" />
                  Start Onboarding
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link href="#contact">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>

            {/* Support Status */}
            <div className="flex items-center justify-center gap-x-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-gray-600 dark:text-gray-400">Support team online</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-gray-600 dark:text-gray-400">Avg response: 2 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Onboarding */}
      <section id="onboarding" className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🚀 Quick Start Onboarding</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get up and running with Agentic AI Solutions in under 5 minutes
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Step 1 */}
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h3 className="text-xl font-semibold">Create Account</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Sign up for your free account and verify your email address.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Click "Sign Up" in the top navigation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Enter your email and create a password
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Check your email for verification link
                </li>
              </ul>
              <Button variant="outline" size="sm" asChild>
                <Link href="/signup">
                  Start Here <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </Card>

            {/* Step 2 */}
            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h3 className="text-xl font-semibold">Choose Your Plan</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Select a plan that fits your needs. Start with our free tier.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Free: 10 agent executions/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Pro: Unlimited executions + priority
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Enterprise: Custom solutions
                </li>
              </ul>
              <Button variant="outline" size="sm" asChild>
                <Link href="/pricing">
                  View Plans <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </Card>

            {/* Step 3 */}
            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h3 className="text-xl font-semibold">Deploy Your First Agent</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Browse our agent marketplace and activate your first AI agent.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Browse the agent marketplace
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Click "Activate" on any agent
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Test in the playground first
                </li>
              </ul>
              <Button variant="outline" size="sm" asChild>
                <Link href="/agents">
                  Browse Agents <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Troubleshooting Section */}
      <section id="troubleshooting" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">🔧 Troubleshooting Guide</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Common issues and their solutions
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Authentication Issues */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold">Authentication Issues</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-l-red-200 pl-4">
                  <h4 className="font-semibold text-red-700 dark:text-red-400">Can't log in / "Invalid credentials"</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                    <li>• Check your email and password are correct</li>
                    <li>• Try resetting your password</li>
                    <li>• Clear browser cache and cookies</li>
                    <li>• Disable browser extensions temporarily</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-l-red-200 pl-4">
                  <h4 className="font-semibold text-red-700 dark:text-red-400">Email verification not received</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                    <li>• Check your spam/junk folder</li>
                    <li>• Add support@bizbot.store to your contacts</li>
                    <li>• Request a new verification email</li>
                    <li>• Contact support if still not received</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Agent Execution Issues */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Zap className="w-6 h-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold">Agent Execution Issues</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-l-orange-200 pl-4">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-400">Agent not responding / Timeout</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Try a simpler task first</li>
                    <li>• Verify you have sufficient credits</li>
                    <li>• Contact support for complex tasks</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-l-orange-200 pl-4">
                  <h4 className="font-semibold text-orange-700 dark:text-orange-400">Poor agent responses</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                    <li>• Be more specific in your instructions</li>
                    <li>• Provide more context and examples</li>
                    <li>• Try breaking complex tasks into steps</li>
                    <li>• Use the playground to test first</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Payment Issues */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-xl font-semibold">Payment & Billing Issues</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-l-blue-200 pl-4">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400">Payment failed / Card declined</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                    <li>• Verify card details are correct</li>
                    <li>• Check with your bank for blocks</li>
                    <li>• Try a different payment method</li>
                    <li>• Contact support for assistance</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-l-blue-200 pl-4">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-400">Credits not updating</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                    <li>• Refresh the page and wait 2-3 minutes</li>
                    <li>• Check your billing history</li>
                    <li>• Verify payment was processed</li>
                    <li>• Contact support with transaction ID</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Technical Issues */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-gray-500 mr-3" />
                <h3 className="text-xl font-semibold">Technical Issues</h3>
              </div>
              
              <div className="space-y-4">
                <div className="border-l-4 border-l-gray-200 pl-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-400">Page not loading / 500 errors</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                    <li>• Refresh the page (Ctrl+F5 / Cmd+Shift+R)</li>
                    <li>• Clear browser cache and cookies</li>
                    <li>• Try incognito/private browsing mode</li>
                    <li>• Check our status page for outages</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-l-gray-200 pl-4">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-400">Slow performance</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                    <li>• Check your internet speed</li>
                    <li>• Close unnecessary browser tabs</li>
                    <li>• Disable heavy browser extensions</li>
                    <li>• Try a different browser</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">❓ Frequently Asked Questions</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">How do I get started?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Follow our 3-step onboarding process above. Create an account, choose a plan, and deploy your first agent. It takes less than 5 minutes!
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">How secure is my data?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We use military-grade encryption, SOC 2 compliance, and zero-trust architecture. Your data is never stored permanently and is encrypted in transit and at rest.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">Do you offer custom agents?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! Enterprise customers can request custom agents built specifically for their use cases. Contact our sales team for details.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3">What's your uptime guarantee?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                We guarantee 99.999% uptime with global redundancy. If we fall below this, you'll receive service credits automatically.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section id="contact" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">📞 Contact Support</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Still need help? Our expert support team is here 24/7
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Live Chat */}
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get instant help from our support team
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <Clock className="w-4 h-4 inline mr-1" />
                Available 24/7 • Avg response: 2 min
              </div>
              <Button className="w-full">
                Start Chat
              </Button>
            </Card>

            {/* Email Support */}
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Send us a detailed message
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <Clock className="w-4 h-4 inline mr-1" />
                Response within 1 hour
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="mailto:support@bizbot.store">
                  support@bizbot.store
                </a>
              </Button>
            </Card>

            {/* Phone Support */}
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Speak directly with our experts
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <Clock className="w-4 h-4 inline mr-1" />
                Mon-Fri 9AM-6PM EST
              </div>
              <Button variant="outline" className="w-full" asChild>
                <a href="tel:+18176759898">
                  (817) 675-9898
                </a>
              </Button>
            </Card>
          </div>

          {/* Additional Resources */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold mb-6">Additional Resources</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/docs">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Documentation
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/status">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  System Status
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  BizBot.Store
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Chatbot */}
      <SupportChatbot />
    </div>
  )
}
