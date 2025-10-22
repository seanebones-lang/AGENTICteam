'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { 
  Check, 
  DollarSign, 
  Shield, 
  Zap, 
  Clock, 
  Award,
  Calculator,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface CreditPackage {
  credits: number
  price: number
  bonus: number
}

interface SubscriptionTier {
  price: number
  credits_per_month: number
  features: string[]
}

interface AgentPricing {
  id: string
  name: string
  category: string
  credit_cost: number
  dollar_cost: number
  tier: string
}

export default function PricingPage() {
  const [creditPackages, setCreditPackages] = useState<Record<string, CreditPackage>>({})
  const [subscriptionTiers, setSubscriptionTiers] = useState<Record<string, SubscriptionTier>>({})
  const [agentPricing, setAgentPricing] = useState<AgentPricing[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bizbot-api.onrender.com'
        
        const [creditsRes, subsRes, agentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/v1/pricing/credits`),
          fetch(`${API_BASE_URL}/api/v1/pricing/subscriptions`),
          fetch(`${API_BASE_URL}/api/v1/pricing/agents`)
        ])

        const creditsData = await creditsRes.json()
        const subsData = await subsRes.json()
        const agentsData = await agentsRes.json()

        setCreditPackages(creditsData.packages)
        setSubscriptionTiers(subsData.tiers)
        setAgentPricing(agentsData.agents)
      } catch (error) {
        console.error('Failed to fetch pricing:', error)
        toast({
          title: "Error",
          description: "Failed to load pricing information",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [toast])

  const handlePurchaseCredits = async (packageName: string, amount: number) => {
    try {
      // Get user email from localStorage or prompt
      const userData = localStorage.getItem('user_data')
      let email = ''
      
      if (userData) {
        const user = JSON.parse(userData)
        email = user.email
      } else {
        // Redirect to signup if not logged in
        window.location.href = '/signup'
        return
      }
      
      toast({
        title: "Creating Checkout Session",
        description: `Redirecting to Stripe for $${amount} payment...`,
      })
      
      // Create Stripe Checkout Session
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bizbot-api.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/v1/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_email: email,
          package: packageName,
          success_url: `${window.location.origin}/dashboard?payment=success&package=${packageName}`,
          cancel_url: `${window.location.origin}/pricing?payment=cancelled`
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }
      
      const data = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = data.checkout_url
      
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: "Checkout Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleSubscribe = async (tierName: string, amount: number) => {
    try {
      // Get user email from localStorage or prompt
      const userData = localStorage.getItem('user_data')
      let email = ''
      
      if (userData) {
        const user = JSON.parse(userData)
        email = user.email
      } else {
        // Redirect to signup if not logged in
        window.location.href = '/signup'
        return
      }
      
      toast({
        title: "Creating Subscription",
        description: `Setting up ${tierName} subscription for $${amount}/month...`,
      })
      
      // Create Stripe Subscription Checkout Session
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bizbot-api.onrender.com'
      const response = await fetch(`${API_BASE_URL}/api/v1/stripe/create-subscription-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_email: email,
          tier: tierName.toLowerCase(),
          success_url: `${window.location.origin}/dashboard?subscription=success&tier=${tierName}`,
          cancel_url: `${window.location.origin}/pricing?subscription=cancelled`
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create subscription checkout')
      }
      
      const data = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = data.checkout_url
      
    } catch (error) {
      console.error('Subscription checkout error:', error)
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading pricing...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-3xl mx-auto">
            Pay only for what you use with our credit-based system. No hidden fees, no surprises.
          </p>
          
          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-5 w-5 text-green-600" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Instant activation</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>75% margin on agents</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span>$20 minimum to start</span>
            </div>
          </div>
        </div>

        {/* Free Trial Banner */}
        <div className="mb-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8 text-center border-2 border-green-200 dark:border-green-800">
          <Sparkles className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Try Before You Buy</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Get <span className="font-bold text-green-600">3 FREE queries</span> to our Ticket Resolver agent
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            No credit card required. See the platform in action before committing.
          </p>
          <Button size="lg" asChild>
            <Link href="/agents/ticket-resolver">Start Free Trial</Link>
          </Button>
        </div>

        {/* Credit Packages */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Pay-As-You-Go Credits</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Purchase credits and use them across all agents. Credits never expire.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(creditPackages).map(([name, pkg]) => {
              const costPerCredit = pkg.price / pkg.credits
              const isPopular = name === 'growth'
              
              return (
                <Card 
                  key={name} 
                  className={`p-6 relative ${
                    isPopular 
                      ? 'border-2 border-blue-500 shadow-xl' 
                      : 'border border-gray-200 hover:shadow-lg transition-shadow'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-medium">
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold mb-2 capitalize">{name}</h3>
                    <div className="mb-3">
                      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        ${pkg.price}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {pkg.credits.toLocaleString()} credits
                      </p>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ${costPerCredit.toFixed(4)} per credit
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{pkg.credits.toLocaleString()} credits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Never expires</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>All agents included</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Instant activation</span>
                    </li>
                  </ul>

                  <Button 
                    className="w-full" 
                    variant={isPopular ? 'default' : 'outline'}
                    onClick={() => handlePurchaseCredits(name, pkg.price)}
                  >
                    Purchase
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Monthly Subscriptions</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Get more value with monthly credits plus exclusive benefits.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(subscriptionTiers).map(([name, tier]) => {
              const isPopular = name === 'pro'
              const costPerCredit = tier.price / tier.credits_per_month
              
              return (
                <Card 
                  key={name} 
                  className={`p-8 relative ${
                    isPopular 
                      ? 'border-2 border-purple-500 shadow-xl scale-105' 
                      : 'border border-gray-200 hover:shadow-lg transition-shadow'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-purple-500 text-white px-4 py-1 text-sm font-medium">
                        Best Value
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 capitalize">{name}</h3>
                    <div className="mb-4">
                      <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        ${tier.price}
                        <span className="text-lg text-gray-500 font-normal">/mo</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {tier.credits_per_month.toLocaleString()} credits/month
                      </p>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ${costPerCredit.toFixed(4)} per credit
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full py-3 text-lg font-medium" 
                    variant={isPopular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(name, tier.price)}
                  >
                    Subscribe
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Agent Pricing Table */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Agent Credit Costs</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Different agents have different credit costs based on complexity and compute requirements.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Agent</th>
                  <th className="text-left py-3 px-4 font-semibold">Category</th>
                  <th className="text-center py-3 px-4 font-semibold">Credits</th>
                  <th className="text-center py-3 px-4 font-semibold">Cost</th>
                  <th className="text-center py-3 px-4 font-semibold">Tier</th>
                </tr>
              </thead>
              <tbody>
                {agentPricing
                  .sort((a, b) => a.credit_cost - b.credit_cost)
                  .map((agent) => (
                    <tr key={agent.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 font-medium">{agent.name}</td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{agent.category}</td>
                      <td className="text-center py-3 px-4 font-bold text-blue-600 dark:text-blue-400">{agent.credit_cost}</td>
                      <td className="text-center py-3 px-4 text-gray-600 dark:text-gray-400">
                        ${agent.dollar_cost.toFixed(2)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge 
                          className={
                            agent.tier === 'light' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : agent.tier === 'medium'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }
                        >
                          {agent.tier}
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold">Light Tier (1-3 credits)</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Simple queries, fast responses</p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-semibold">Medium Tier (4-6 credits)</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Moderate complexity, comprehensive analysis</p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="font-semibold">Heavy Tier (7-9 credits)</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Complex workflows, deep analysis</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">How do credits work?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Each agent execution costs a certain number of credits based on its complexity. Light agents cost 1-3 credits, medium agents cost 4-6 credits, and heavy agents cost 7-9 credits. Credits are deducted from your balance when you run an agent.
              </p>
              
              <h3 className="font-semibold mb-3">Do credits expire?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                No! Pay-as-you-go credits never expire. Subscription credits renew monthly and don't roll over.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">What's the $20 minimum?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                To ensure platform reliability and filter real users, we require a $20 minimum purchase (500 credits) to start. This gives you enough credits to thoroughly test the platform.
              </p>
              
              <h3 className="font-semibold mb-3">Can I switch between pay-as-you-go and subscription?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Yes! You can purchase credits anytime and subscribe or cancel subscriptions at any time. Both credit types work the same way.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Try 3 free queries, then choose your plan.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/agents/ticket-resolver">Start Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/signup">Sign Up & Purchase Credits</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/agents">Browse All Agents</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
