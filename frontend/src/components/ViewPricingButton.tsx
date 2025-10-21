'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/Card'
import { Check, DollarSign, Zap, Clock } from 'lucide-react'
import { apiService } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface ViewPricingButtonProps {
  agentId: string
  agentName: string
  variant?: 'default' | 'outline'
  size?: 'sm' | 'lg'
}

export function ViewPricingButton({ 
  agentId, 
  agentName, 
  variant = 'outline', 
  size = 'lg' 
}: ViewPricingButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePurchaseCredits = async (amount: number) => {
    setIsLoading(true)
    
    try {
      const paymentIntent = await apiService.createPaymentIntent(
        amount, 
        `Credits for ${agentName} agent`
      )
      
      toast({
        title: "Payment Intent Created",
        description: `Ready to purchase $${amount} in credits`,
      })
      
      // In a real app, you would redirect to Stripe Checkout or use Stripe Elements
      console.log('Payment Intent:', paymentIntent)
      
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Unable to create payment intent",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const pricingTiers = [
    {
      name: 'Solo',
      price: 0,
      pricePerExecution: 0.005,
      minExecutions: 5,
      minCost: 0.025,
      description: 'Perfect for individual developers and testing',
      features: ['5,000 included tokens (free tier)', 'Claude Haiku 3.5', '100K context window', '2K max output tokens', 'Email support', 'Basic analytics', 'API access', 'Community access'],
      popular: false,
      sla: 'None',
      rateLimit: '10 requests/min',
      teamSize: '1 user',
      cta: 'Start Free'
    },
    {
      name: 'Basic',
      price: 0,
      pricePerExecution: 0.0095,
      minExecutions: 8,
      minCost: 0.076,
      description: 'Fast and economical for simple tasks',
      features: ['10,000 included tokens', 'Claude Haiku 3.5', '200K context window', '4K max output tokens', 'Email support', 'Webhook integrations', 'Advanced analytics', 'API access'],
      popular: false,
      sla: '99% uptime',
      rateLimit: '60 requests/min',
      teamSize: '3 users',
      cta: 'Get Started'
    },
    {
      name: 'Silver',
      price: 0,
      pricePerExecution: 0.038,
      minExecutions: 12,
      minCost: 0.456,
      description: 'Enhanced features for growing teams',
      features: ['15,000 included tokens', 'Claude Sonnet 4', '200K context window', '6K max output tokens', 'Priority support', 'Advanced analytics', 'Webhook integrations', 'Team collaboration', 'Custom workflows'],
      popular: false,
      sla: '99.5% uptime',
      rateLimit: '120 requests/min',
      teamSize: '5 users',
      cta: 'Get Started'
    },
    {
      name: 'Standard',
      price: 0,
      pricePerExecution: 0.0475,
      minExecutions: 15,
      minCost: 0.7125,
      description: 'Balanced performance for most workloads',
      features: ['20,000 included tokens', 'Claude Sonnet 4', '200K context window', '8K max output tokens', 'Priority support', 'Full API access', 'Webhook integrations', 'Usage analytics', 'Team collaboration', 'Multi-region deployment'],
      popular: true,
      sla: '99.9% uptime',
      rateLimit: '300 requests/min',
      teamSize: '10 users',
      cta: 'Get Started'
    },
    {
      name: 'Premium',
      price: 0,
      pricePerExecution: 0.076,
      minExecutions: 20,
      minCost: 1.52,
      description: 'Advanced agents and complex orchestration',
      features: ['25,000 included tokens', 'Claude Sonnet 4.5', '200K context window', '8K max output tokens', 'Dedicated support', 'Advanced orchestration', 'Multi-agent workflows', 'Custom integrations', 'Dedicated account manager', 'Priority processing'],
      popular: false,
      sla: '99.95% uptime',
      rateLimit: '600 requests/min',
      teamSize: '25 users',
      cta: 'Get Started'
    },
    {
      name: 'Elite',
      price: 0,
      pricePerExecution: 0.19,
      minExecutions: 25,
      minCost: 4.75,
      description: 'Maximum intelligence for mission-critical tasks',
      features: ['30,000 included tokens', 'Claude Opus 4.1', '200K context window', '8K max output tokens', 'White-glove support', 'Maximum intelligence', 'Complex reasoning', 'Security audits', 'Custom SLAs', 'Dedicated infrastructure', 'Advanced security'],
      popular: false,
      sla: '99.99% uptime',
      rateLimit: '1200 requests/min',
      teamSize: 'Unlimited',
      cta: 'Contact Sales'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size}>
          <DollarSign className="h-4 w-4 mr-2" />
          View Pricing
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-2">BizBot.store Pricing</DialogTitle>
          <DialogDescription className="text-center text-lg">
            Transparent, competitive pricing—5% below market with 14% markup (vs. 20% industry standard). 
            No hidden fees. Pay only for what you use with minimum execution loads to ensure platform reliability.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`border rounded-lg p-6 relative ${
                  tier.popular ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 scale-105' : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Recommended
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                  <div className="mb-2">
                    <p className="text-2xl font-bold text-blue-600">
                      ${tier.pricePerExecution.toFixed(4)}
                      <span className="text-sm text-gray-500"> per execution</span>
                    </p>
                    {tier.name !== 'Solo' && (
                      <p className="text-sm text-gray-600">
                        5% below market
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-orange-600 mb-2">
                    Minimum: {tier.minExecutions} executions/month
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tier.description}
                  </p>
                </div>

                <div className="mb-4 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate Limit:</span>
                    <span className="font-medium">{tier.rateLimit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Size:</span>
                    <span className="font-medium">{tier.teamSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SLA:</span>
                    <span className="font-medium">{tier.sla}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 text-sm">
                  {tier.features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {tier.features.length > 6 && (
                    <li className="text-gray-500 text-xs">
                      +{tier.features.length - 6} more features
                    </li>
                  )}
                </ul>

                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Monthly minimum cost:</p>
                  <p className="font-bold text-lg">${tier.minCost.toFixed(2)}</p>
                </div>

                <Button 
                  className="w-full" 
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={() => handlePurchaseCredits(tier.minCost)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : tier.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* BYOK Tier */}
          <div className="mt-8 border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/10">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">Enterprise BYOK</h3>
              <p className="text-lg font-bold text-purple-600 mb-2">
                $0.002 platform fee per execution
                <span className="text-sm text-gray-500 block">Lowest fees in industry</span>
              </p>
              <p className="text-sm font-medium text-green-600 mb-2">
                No minimum executions
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Bring Your Own Anthropic API Key
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-600">Rate Limit:</span>
                  <p className="font-medium">Custom</p>
                </div>
                <div>
                  <span className="text-gray-600">Team Size:</span>
                  <p className="font-medium">Unlimited</p>
                </div>
                <div>
                  <span className="text-gray-600">SLA:</span>
                  <p className="font-medium">Custom</p>
                </div>
                <div>
                  <span className="text-gray-600">Tokens:</span>
                  <p className="font-medium">Unlimited</p>
                </div>
              </div>

              <Button variant="outline" className="mb-4">
                Learn More
              </Button>
              
              <p className="text-xs text-gray-500">
                Save 15-25% vs. Standard tier for enterprises with existing Anthropic contracts
              </p>
            </div>
          </div>

          {/* Volume Discounts */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-4 text-center">Volume Discounts</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="font-medium">10,000+ executions/month</p>
                <p className="text-blue-600 font-bold">10-11% off</p>
                <p className="text-gray-500">Auto-applied</p>
              </div>
              <div className="text-center">
                <p className="font-medium">100,000+ executions/month</p>
                <p className="text-purple-600 font-bold">Custom pricing</p>
                <p className="text-gray-500">Contact sales</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Annual billing</p>
                <p className="text-green-600 font-bold">20% off all tiers</p>
                <p className="text-gray-500">All plans</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-8 space-y-4">
            <h4 className="text-lg font-semibold text-center">Frequently Asked Questions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-medium mb-2">Why minimum execution loads?</h5>
                <p className="text-gray-600">Minimums ensure platform reliability while keeping costs low. Solo's free tier transitions to 5 executions/month post-trial; other tiers start at 8–25 executions to cover compute and support.</p>
              </div>
              <div>
                <h5 className="font-medium mb-2">Why are your prices 5% below market?</h5>
                <p className="text-gray-600">Our 14% markup (vs. 20% industry standard) and efficient operations let us pass savings to you while delivering premium performance (99.999% uptime, 45ms latency).</p>
              </div>
              <div>
                <h5 className="font-medium mb-2">Can I switch tiers anytime?</h5>
                <p className="text-gray-600">Yes! Change tiers anytime; new rates apply instantly. Minimum loads adjust with tier changes. No contracts, no lock-in.</p>
              </div>
              <div>
                <h5 className="font-medium mb-2">What payment methods do you accept?</h5>
                <p className="text-gray-600">Credit cards (Visa, Mastercard, Amex), ACH, wire transfers, and purchase orders for enterprise accounts, processed securely via Stripe.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
