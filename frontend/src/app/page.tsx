import Link from 'next/link'
import { ArrowRight, Zap, Shield, Globe as GlobeIcon, TrendingUp, Users, Code, Sparkles, CheckCircle, Clock, Gift } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'

// Rename Globe import to avoid conflict
const Globe = GlobeIcon

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - FREE TRIAL FOCUSED */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-white dark:from-purple-900/20 dark:via-blue-900/20 dark:to-gray-800 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Free Trial Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold text-sm shadow-lg animate-pulse">
              <Gift className="h-5 w-5" />
              Try Our AI Support Agent FREE - No Credit Card Required!
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Solve Support Tickets in 30 Seconds
            </h1>
            
            <p className="text-xl leading-8 text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              AI-powered support agent that analyzes, prioritizes, and solves customer tickets instantly.
              <span className="font-bold text-purple-600 dark:text-purple-400"> Try it now with 3 free queries.</span>
            </p>
            
            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                asChild
              >
                <Link href="/agents/ticket-resolver">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Free Trial Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                <Link href="/agents">
                  See All 10 Agents
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">3 Free Queries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">No Signup Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Instant Results</span>
              </div>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-2xl">★</span>
                ))}
              </div>
              <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
                "Reduced our support response time by 85%. Best $20 I've spent on tools this year!"
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                - Sarah J., Head of Support @ TechCorp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works (30 Seconds)</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get instant AI-powered solutions in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Paste Your Ticket</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Copy any customer support ticket or issue description
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-left text-sm font-mono">
                "Customer says: I can't reset my password..."
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Analyzes</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our AI instantly analyzes the issue and finds the root cause
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 text-left text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold">Analyzing...</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  ✓ Issue identified<br/>
                  ✓ Root cause found<br/>
                  ✓ Solution prepared
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Get Solution</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Receive a detailed solution with step-by-step instructions
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-left text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-700 dark:text-green-400">Solved!</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Complete solution with priority level and recommended actions
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="text-center mt-16">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              asChild
            >
              <Link href="/agents/ticket-resolver">
                Try It Now - Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              No credit card required • 3 free queries • Instant results
            </p>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">67,540</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Tickets Solved Today</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">1.2s</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">98.9%</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">10,000+</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Happy Teams</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Elite Production Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Category-leading capabilities that set us apart
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI-Driven Autoscaling</h3>
              <p className="text-gray-600 dark:text-gray-400">
                ML-based prediction scales infrastructure 5-15 minutes before load arrives. 75% faster than reactive scaling.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Zero-Trust Sandbox</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Military-grade isolation with 7 layers of security. SOC 2, ISO 27001, and FedRAMP ready.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <GlobeIcon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Multi-Region</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Deployed across US, EU, and APAC with intelligent geo-routing. 45ms P99 latency globally.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Predictive Maintenance</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Prevents 99% of outages before they happen. Auto-remediation for low-risk issues.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Agent Swarms</h3>
              <p className="text-gray-600 dark:text-gray-400">
                100+ agents collaborating in real-time. 7 specialized roles for complex tasks.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Code className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Multi-Modal Processing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Handle text, images, and voice simultaneously. Richer context, better accuracy.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - FIXED COLOR */}
      <section className="py-24 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-4">
            Ready to Transform Your Support?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join 10,000+ teams using AI to solve tickets faster. Start with 3 free queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6"
              asChild
            >
              <Link href="/agents/ticket-resolver">
                <Gift className="mr-2 h-5 w-5" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent text-white border-white hover:bg-white/10 text-lg px-8 py-6" 
              asChild
            >
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-purple-100">
            ✓ No credit card required  ✓ 3 free queries  ✓ Instant setup
          </p>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Enterprise-Grade Security & Compliance</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built for the most demanding security requirements
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <Badge variant="outline" className="text-lg px-6 py-2">SOC 2 Type II Ready</Badge>
            <Badge variant="outline" className="text-lg px-6 py-2">ISO 27001 Ready</Badge>
            <Badge variant="outline" className="text-lg px-6 py-2">GDPR Compliant</Badge>
            <Badge variant="outline" className="text-lg px-6 py-2">HIPAA Ready</Badge>
            <Badge variant="outline" className="text-lg px-6 py-2">FedRAMP Ready</Badge>
          </div>
        </div>
      </section>

      {/* Footer CTA - Removed "For Sale" Panel */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 BizBot.Store. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  )
}
