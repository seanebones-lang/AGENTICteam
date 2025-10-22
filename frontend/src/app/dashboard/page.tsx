'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CheckCircle, Zap, ArrowRight, Sparkles } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Welcome to Agent Marketplace</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your AI-powered automation platform is ready
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10</div>
            <p className="text-gray-600 dark:text-gray-400">AI Agents Available</p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">3</div>
            <p className="text-gray-600 dark:text-gray-400">Free Queries Remaining</p>
          </Card>
          
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">$20</div>
            <p className="text-gray-600 dark:text-gray-400">Minimum to Get Started</p>
          </Card>
        </div>

        {/* System Overview */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">System Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center dark:text-white">
                <Sparkles className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                What You Get
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">10 powerful AI agents for automation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Support, security, analytics, and more</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Credits never expire - use anytime</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Pay-as-you-go pricing from $20</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center dark:text-white">
                <Zap className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                How It Works
              </h3>
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="font-bold text-purple-600 dark:text-purple-400 mr-3">1.</span>
                  <span className="text-gray-700 dark:text-gray-300">Choose an agent from our marketplace</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-purple-600 dark:text-purple-400 mr-3">2.</span>
                  <span className="text-gray-700 dark:text-gray-300">Describe your task in plain English</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-purple-600 dark:text-purple-400 mr-3">3.</span>
                  <span className="text-gray-700 dark:text-gray-300">Get instant AI-powered results</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-purple-600 dark:text-purple-400 mr-3">4.</span>
                  <span className="text-gray-700 dark:text-gray-300">Pay only for what you use</span>
                </li>
              </ol>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              asChild
            >
              <Link href="/agents">
                <Sparkles className="mr-2 h-5 w-5" />
                Browse All Agents
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              asChild
            >
              <Link href="/agents/ticket-resolver">
                Try Free Agent
              </Link>
            </Button>
          </div>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2 dark:text-white">Need Help?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get support from our AI chatbot or email us
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/support">Get Support</Link>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2 dark:text-white">View Pricing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              See credit packages and subscription options
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold mb-2 dark:text-white">Documentation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Learn how to use each agent effectively
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/docs">Read Docs</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
