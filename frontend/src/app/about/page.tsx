import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp, 
  Users, 
  Award,
  Target,
  Rocket,
  Heart,
  Phone,
  Mail
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 px-4 py-1.5 text-sm font-semibold">
              About Agent Marketplace
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Enterprise AI Innovation by <span className="text-blue-600">BizBot</span>
            </h1>
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300 mb-8">
              Pioneering autonomous AI agent technology for enterprise operations. Built by Sean McDonnell and the BizBot team.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Agent Marketplace is a flagship product from <strong>BizBot.store</strong>, a leading provider of AI automation and intelligent business solutions. Founded by Sean McDonnell, we specialize in creating cutting-edge AI agents that transform how enterprises operate.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                Our mission is to democratize access to enterprise-grade AI agents, making autonomous operations accessible to organizations of all sizes. We combine military-grade security with bleeding-edge AI technology to deliver unparalleled reliability and performance.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                With 99.999% uptime, 45ms global latency, and 10 production-ready agent packages, we&apos;re setting the standard for AI agent marketplaces.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit BizBot.store
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="mailto:support@bizbot.store">
                    <Phone className="mr-2 h-4 w-4" />
                    support@bizbot.store
                  </a>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">99.999%</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Uptime SLA</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">45ms</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Global Latency</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500k+</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Daily Executions</div>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">10</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Agent Packages</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we build and deliver
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Security First</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Military-grade security and zero-trust architecture in every agent
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Rocket className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Pushing boundaries with AI-driven autoscaling and multi-modal processing
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-700 dark:text-gray-300">
                99.999% uptime and 45ms latency - we set the bar high
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Success</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Your success is our success - we&apos;re here to support you
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Built with Cutting-Edge Technology</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Enterprise-grade infrastructure powering the next generation of AI agents
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Zap className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI & ML Stack</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• LangChain & CrewAI orchestration</li>
                <li>• Multi-modal LLMs (GPT-4, Claude 3.5)</li>
                <li>• Vector databases (Qdrant)</li>
                <li>• Federated learning marketplace</li>
              </ul>
            </Card>
            <Card className="p-6">
              <Globe className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Infrastructure</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Kubernetes multi-region deployment</li>
                <li>• AI-driven autoscaling (HPA)</li>
                <li>• Global CDN & edge computing</li>
                <li>• 99.999% uptime guarantee</li>
              </ul>
            </Card>
            <Card className="p-6">
              <Shield className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Security & Compliance</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Zero-trust sandbox architecture</li>
                <li>• SOC 2, ISO 27001 ready</li>
                <li>• GDPR & HIPAA compliant</li>
                <li>• End-to-end encryption</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Meet the Founder</h2>
          </div>
          <Card className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Sean McDonnell</h3>
              <p className="text-lg text-blue-600 mb-4">Founder & Chief Architect</p>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 text-center max-w-2xl mx-auto">
              Sean McDonnell is the visionary founder behind BizBot and the Agent Marketplace platform. With deep expertise in AI/ML, enterprise architecture, and autonomous systems, Sean has built a category-leading platform that combines cutting-edge AI technology with military-grade security.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center max-w-2xl mx-auto">
              His commitment to innovation and excellence has resulted in a platform trusted by enterprises worldwide for mission-critical AI agent operations.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer">
                  <Globe className="mr-2 h-4 w-4" />
                  BizBot.store
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@bizbot.store">
                  <Phone className="mr-2 h-4 w-4" />
                  support@bizbot.store
                </a>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contact us today to discuss licensing and implementation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-5 w-5" />
                Visit BizBot.store
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <a href="mailto:support@bizbot.store">
                <Phone className="mr-2 h-5 w-5" />
                Call support@bizbot.store
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

