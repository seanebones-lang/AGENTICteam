'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { 
  Check, 
  DollarSign, 
  Shield, 
  Zap, 
  Clock, 
  Users, 
  Phone,
  Mail,
  ExternalLink,
  Calculator,
  TrendingUp,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

const pricingTiers = [
  {
    name: 'Solo',
    pricePerExecution: 0.005,
    minExecutions: 5,
    minCost: 0.025,
    description: 'Perfect for individual developers and testing',
    features: [
      '5,000 included tokens (free tier)',
      'Claude Haiku 3.5',
      '100K context window',
      '2K max output tokens',
      'Email support',
      'Basic analytics',
      'API access',
      'Community access'
    ],
    popular: false,
    sla: 'None',
    rateLimit: '10 requests/min',
    teamSize: '1 user',
    cta: 'Start Free',
    color: 'gray'
  },
  {
    name: 'Basic',
    pricePerExecution: 0.0095,
    minExecutions: 8,
    minCost: 0.076,
    description: 'Fast and economical for simple tasks',
    features: [
      '10,000 included tokens',
      'Claude Haiku 3.5',
      '200K context window',
      '4K max output tokens',
      'Email support',
      'Webhook integrations',
      'Advanced analytics',
      'API access'
    ],
    popular: false,
    sla: '99% uptime',
    rateLimit: '60 requests/min',
    teamSize: '3 users',
    cta: 'Get Started',
    color: 'blue'
  },
  {
    name: 'Silver',
    pricePerExecution: 0.038,
    minExecutions: 12,
    minCost: 0.456,
    description: 'Enhanced features for growing teams',
    features: [
      '15,000 included tokens',
      'Claude Sonnet 4',
      '200K context window',
      '6K max output tokens',
      'Priority support',
      'Advanced analytics',
      'Webhook integrations',
      'Team collaboration',
      'Custom workflows'
    ],
    popular: false,
    sla: '99.5% uptime',
    rateLimit: '120 requests/min',
    teamSize: '5 users',
    cta: 'Get Started',
    color: 'silver'
  },
  {
    name: 'Standard',
    pricePerExecution: 0.0475,
    minExecutions: 15,
    minCost: 0.7125,
    description: 'Balanced performance for most workloads',
    features: [
      '20,000 included tokens',
      'Claude Sonnet 4',
      '200K context window',
      '8K max output tokens',
      'Priority support',
      'Full API access',
      'Webhook integrations',
      'Usage analytics',
      'Team collaboration',
      'Multi-region deployment'
    ],
    popular: true,
    sla: '99.9% uptime',
    rateLimit: '300 requests/min',
    teamSize: '10 users',
    cta: 'Get Started',
    color: 'blue'
  },
  {
    name: 'Premium',
    pricePerExecution: 0.076,
    minExecutions: 20,
    minCost: 1.52,
    description: 'Advanced agents and complex orchestration',
    features: [
      '25,000 included tokens',
      'Claude Sonnet 4.5',
      '200K context window',
      '8K max output tokens',
      'Dedicated support',
      'Advanced orchestration',
      'Multi-agent workflows',
      'Custom integrations',
      'Dedicated account manager',
      'Priority processing'
    ],
    popular: false,
    sla: '99.95% uptime',
    rateLimit: '600 requests/min',
    teamSize: '25 users',
    cta: 'Get Started',
    color: 'purple'
  },
  {
    name: 'Elite',
    pricePerExecution: 0.19,
    minExecutions: 25,
    minCost: 4.75,
    description: 'Maximum intelligence for mission-critical tasks',
    features: [
      '30,000 included tokens',
      'Claude Opus 4.1',
      '200K context window',
      '8K max output tokens',
      'White-glove support',
      'Maximum intelligence',
      'Complex reasoning',
      'Security audits',
      'Custom SLAs',
      'Dedicated infrastructure',
      'Advanced security'
    ],
    popular: false,
    sla: '99.99% uptime',
    rateLimit: '1200 requests/min',
    teamSize: 'Unlimited',
    cta: 'Contact Sales',
    color: 'gold'
  }
]

const costExamples = [
  { executions: 5, label: 'Minimum Load' },
  { executions: 1000, label: '1,000' },
  { executions: 10000, label: '10,000' },
  { executions: 100000, label: '100,000' }
]

export default function PricingPage() {
  const [calculatorExecutions, setCalculatorExecutions] = useState([1000])
  const [requiredAmount, setRequiredAmount] = useState<number | null>(null)
  const [paymentReason, setPaymentReason] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check URL parameters for required payment
    const urlParams = new URLSearchParams(window.location.search)
    const required = urlParams.get('required')
    const reason = urlParams.get('reason')
    
    if (required) {
      setRequiredAmount(parseFloat(required))
    }
    if (reason) {
      setPaymentReason(reason)
    }
  }, [])

  const handlePurchaseCredits = async (amount: number) => {
    try {
      const { apiService } = await import('@/lib/api')
      const token = localStorage.getItem('auth_token')
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to purchase credits",
          variant: "destructive",
        })
        return
      }

      // Create payment intent
      const paymentIntent = await apiService.createPaymentIntent(amount, `Credits for BizBot.store - $${amount}`)
      
      toast({
        title: "Payment Processing",
        description: `Processing payment for $${amount}...`,
      })
      
      // In production, integrate with Stripe Elements here
      // For now, simulate successful payment
      setTimeout(async () => {
        try {
          // Add credits to user account
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/v1/credits/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: amount,
              payment_intent_id: paymentIntent.payment_intent_id
            }),
          })
          
          if (response.ok) {
            toast({
              title: "Payment Successful!",
              description: `$${amount} in credits added to your account.`,
            })
            
            // Redirect to dashboard
            window.location.href = '/dashboard'
          } else {
            throw new Error('Failed to add credits')
          }
        } catch (error) {
          toast({
            title: "Payment Failed",
            description: "There was an issue processing your payment. Please try again.",
            variant: "destructive",
          })
        }
      }, 2000)
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unable to process payment",
        variant: "destructive",
      })
    }
  }

  const calculateCost = (tier: typeof pricingTiers[0], executions: number) => {
    const executionCost = executions * tier.pricePerExecution
    return Math.max(executionCost, tier.minCost)
  }

  const handleGetStarted = (tierName: string) => {
    const tier = pricingTiers.find(t => t.name === tierName)
    if (!tier) return
    
    // For required payments, use the required amount, otherwise use tier minimum
    const amount = requiredAmount || Math.max(tier.minCost, 8) // Enforce $8 minimum
    
    if (tierName === 'Solo' && !requiredAmount) {
      // Solo tier can start free if no payment required
      toast({
        title: "Starting Solo Plan",
        description: "Redirecting to dashboard...",
      })
      window.location.href = '/dashboard'
    } else {
      handlePurchaseCredits(amount)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            BizBot.store Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 max-w-3xl mx-auto">
            Transparent, competitive pricing—5% below market with 14% markup (vs. 20% industry standard). 
            No hidden fees. Pay only for what you use with minimum execution loads to ensure platform reliability.
          </p>
          
          {/* Required Payment Banner */}
          {requiredAmount && (
            <div className="mt-6 mx-auto max-w-2xl p-4 bg-orange-100 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-orange-800 dark:text-orange-200">
                <DollarSign className="h-5 w-5" />
                <span className="font-semibold">
                  {paymentReason === 'signup' 
                    ? `Welcome! Please add $${requiredAmount} minimum to start using agents.`
                    : `Please add $${requiredAmount} to continue using agents.`
                  }
                </span>
              </div>
              <p className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                This ensures platform reliability and covers minimum execution costs.
              </p>
            </div>
          )}
          
          {/* Key Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-5 w-5 text-green-600" />
              <span>99.999% uptime</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-5 w-5 text-blue-600" />
              <span>45ms latency</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-5 w-5 text-purple-600" />
              <span>500k+ daily tasks</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span>5% below market</span>
            </div>
          </div>
        </div>

        {/* ROI Calculator */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Calculator className="h-6 w-6" />
              ROI Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              See how much you can save vs. hiring a $120k/year engineer
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium mb-2">
              Monthly Executions: {calculatorExecutions[0].toLocaleString()}
            </label>
            <Slider
              value={calculatorExecutions}
              onValueChange={setCalculatorExecutions}
              max={100000}
              min={5}
              step={100}
              className="mb-6"
            />
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Traditional Hiring</p>
                <p className="text-2xl font-bold text-red-600">$10,000/mo</p>
                <p className="text-xs text-gray-500">$120k salary + benefits</p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">BizBot.store (Standard)</p>
                <p className="text-2xl font-bold text-green-600">
                  ${calculateCost(pricingTiers[3], calculatorExecutions[0]).toFixed(0)}/mo
                </p>
                <p className="text-xs text-gray-500">
                  Save ${(10000 - calculateCost(pricingTiers[3], calculatorExecutions[0])).toFixed(0)}/month
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`p-8 relative ${
                tier.popular 
                  ? 'border-2 border-blue-500 shadow-xl scale-105 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800' 
                  : 'border border-gray-200 hover:shadow-lg transition-shadow'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1 text-sm font-medium">
                    Recommended
                  </Badge>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="mb-3">
                  <p className="text-3xl font-bold text-blue-600">
                    ${tier.pricePerExecution.toFixed(4)}
                    <span className="text-sm text-gray-500 font-normal"> per execution</span>
                  </p>
                  {tier.name !== 'Solo' && (
                    <p className="text-sm text-green-600 font-medium">
                      5% below market
                    </p>
                  )}
                </div>
                <p className="text-sm font-medium text-orange-600 mb-3">
                  Minimum: {tier.minExecutions} executions/month
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {tier.description}
                </p>
              </div>

              {/* Tier Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-gray-500">Rate Limit</p>
                  <p className="font-medium">{tier.rateLimit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Team Size</p>
                  <p className="font-medium">{tier.teamSize}</p>
                </div>
                <div>
                  <p className="text-gray-500">SLA</p>
                  <p className="font-medium">{tier.sla}</p>
                </div>
                <div>
                  <p className="text-gray-500">Min Cost</p>
                  <p className="font-medium">${tier.minCost.toFixed(2)}/mo</p>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button 
                className="w-full py-3 text-lg font-medium" 
                variant={tier.popular ? 'default' : 'outline'}
                onClick={() => handleGetStarted(tier.name)}
              >
                {tier.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* BYOK Enterprise Tier */}
        <div className="mb-12">
          <Card className="p-8 border-2 border-dashed border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-3 text-purple-700">Enterprise BYOK</h3>
              <p className="text-xl font-bold text-purple-600 mb-2">
                $0.002 platform fee per execution
              </p>
              <p className="text-sm text-gray-500 mb-3">Lowest fees in industry</p>
              <p className="text-lg font-medium text-green-600 mb-4">
                No minimum executions
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-gray-500 text-sm">Rate Limit</p>
                  <p className="font-bold">Custom</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Team Size</p>
                  <p className="font-bold">Unlimited</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">SLA</p>
                  <p className="font-bold">Custom</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Tokens</p>
                  <p className="font-bold">Unlimited</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Bring Your Own Anthropic API Key</h4>
                <ul className="text-sm space-y-2 max-w-md mx-auto">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Zero markup on tokens
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Direct Anthropic billing
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Full platform access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Save 15-25% vs. Standard tier
                  </li>
                </ul>
              </div>

              <Button size="lg" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                Learn More About BYOK
              </Button>
            </div>
          </Card>
        </div>

        {/* Cost Comparison Table */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Monthly Cost Examples</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Based on average 1,000 input + 500 output tokens per execution, including minimum loads
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Executions/Month</th>
                  {pricingTiers.map((tier) => (
                    <th key={tier.name} className="text-center py-3 px-4">{tier.name}</th>
                  ))}
                  <th className="text-center py-3 px-4">BYOK</th>
                </tr>
              </thead>
              <tbody>
                {costExamples.map((example) => (
                  <tr key={example.executions} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 font-medium">{example.label}</td>
                    {pricingTiers.map((tier) => (
                      <td key={tier.name} className="text-center py-3 px-4">
                        <span className="font-bold">
                          ${calculateCost(tier, example.executions === 5 ? tier.minExecutions : example.executions).toFixed(2)}
                        </span>
                        {example.executions === 5 && (
                          <span className="block text-xs text-gray-500">
                            ({tier.minExecutions} execs)
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="text-center py-3 px-4">
                      <span className="font-bold">
                        ${(example.executions * 0.002 + (example.executions * 0.0125)).toFixed(2)}*
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            *BYOK pricing: $0.002 platform fee + Anthropic token costs (paid directly to Anthropic, ~$0.003–$0.015/token).
          </p>
        </div>

        {/* Volume Discounts */}
        <div className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-8">Volume Discounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10-11%</div>
              <div className="text-lg font-semibold mb-2">Volume Discount</div>
              <div className="text-sm opacity-90">10,000+ executions/month</div>
              <div className="text-xs opacity-75">Auto-applied</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">Custom</div>
              <div className="text-lg font-semibold mb-2">Enterprise Pricing</div>
              <div className="text-sm opacity-90">100,000+ executions/month</div>
              <div className="text-xs opacity-75">Contact sales</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">20%</div>
              <div className="text-lg font-semibold mb-2">Annual Discount</div>
              <div className="text-sm opacity-90">All tiers</div>
              <div className="text-xs opacity-75">Billed annually</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Why minimum execution loads?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Minimums ensure platform reliability while keeping costs low. Solo's free tier transitions to 5 executions/month post-trial; other tiers start at 8–25 executions to cover compute and support.
              </p>
              
              <h3 className="font-semibold mb-3">Why are your prices 5% below market?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Our 14% markup (vs. 20% industry standard) and efficient operations let us pass savings to you while delivering premium performance (99.999% uptime, 45ms latency).
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Can I switch tiers anytime?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Yes! Change tiers anytime; new rates apply instantly. Minimum loads adjust with tier changes. No contracts, no lock-in.
              </p>
              
              <h3 className="font-semibold mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                Credit cards (Visa, Mastercard, Amex), ACH, wire transfers, and purchase orders for enterprise accounts, processed securely via Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Start free with Solo or choose your tier.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button size="lg" asChild>
              <Link href="/agents">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">View API Docs</Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>(817) 675-9898</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>support@bizbot.store</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>bizbot.store</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}