import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Zap, Shield, Globe, TrendingUp, ArrowRight } from 'lucide-react'

export default function IntroductionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/docs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <Badge className="mb-4">Getting Started</Badge>
          <h1 className="text-4xl font-bold mb-4">Introduction to Agent Marketplace</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Welcome to the Agent Marketplace platform - your enterprise solution for deploying, managing, and scaling autonomous AI agents.
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">What is Agent Marketplace?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Agent Marketplace is an enterprise-grade platform that provides production-ready AI agents for automating complex business operations. Built with military-grade security and 99.999% uptime, our platform enables organizations to deploy autonomous agents that handle everything from security scanning to incident response.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Unlike traditional automation tools, our agents use advanced AI/ML techniques including LangChain, CrewAI, and multi-modal processing to understand context, make decisions, and take action autonomously.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">10 Production-Ready Agents</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Pre-built agents for security, operations, support, and more
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Military-Grade Security</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Zero-trust architecture with SOC 2 and ISO 27001 ready compliance
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Global Multi-Region</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    45ms P99 latency with deployments across US, EU, and APAC
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">99.999% Uptime SLA</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Enterprise reliability with predictive maintenance
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                  <h3 className="font-semibold text-lg">Choose Your Agent</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 ml-11">
                  Browse our marketplace of 10 production-ready agents or request custom development
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                  <h3 className="font-semibold text-lg">Configure & Deploy</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 ml-11">
                  Use our API or web interface to configure agents with your specific parameters and deploy instantly
                </p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
                  <h3 className="font-semibold text-lg">Monitor & Scale</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 ml-11">
                  Track performance in real-time, review execution history, and scale automatically with AI-driven autoscaling
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Security & Compliance</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Automated vulnerability scanning, compliance checking, and security incident response
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">IT Operations</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Incident triage, root cause analysis, deployment automation, and infrastructure management
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Ticket classification, automated resolution, knowledge base management, and escalation handling
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Processing</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  ETL pipelines, data quality checks, report generation, and analytics automation
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Ready to get started? Follow our quick start guide to deploy your first agent in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/docs/quick-start">
                  Quick Start Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/playground">
                  Try Interactive Demo
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

