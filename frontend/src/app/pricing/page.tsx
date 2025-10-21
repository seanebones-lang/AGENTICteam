import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Star, Crown, Sparkles, Gem, Key } from 'lucide-react'

const tiers = [
  {
    name: 'Solo',
    icon: Zap,
    price: 0.005,
    priceDisplay: '$0.005',
    unit: 'per execution',
    description: 'Perfect for individual developers and testing',
    features: [
      '5,000 included tokens',
      'Claude Haiku 3.5',
      '100K context window',
      '2K max output tokens',
      'Email support',
      'Basic analytics',
      'API access',
      'Community access',
    ],
    limits: {
      rateLimit: '10 requests/min',
      teamSize: '1 user',
      sla: 'None',
    },
    cta: 'Start Free',
    popular: false,
    savings: '5% below market',
  },
  {
    name: 'Basic',
    icon: Zap,
    price: 0.0095,
    priceDisplay: '$0.0095',
    unit: 'per execution',
    description: 'Fast and economical for simple tasks',
    features: [
      '10,000 included tokens',
      'Claude Haiku 3.5',
      '200K context window',
      '4K max output tokens',
      'Email support',
      'Webhook integrations',
      'Advanced analytics',
      'API access',
    ],
    limits: {
      rateLimit: '60 requests/min',
      teamSize: '3 users',
      sla: '99% uptime',
    },
    cta: 'Get Started',
    popular: false,
    savings: '5% below market',
  },
  {
    name: 'Silver',
    icon: Star,
    price: 0.038,
    priceDisplay: '$0.038',
    unit: 'per execution',
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
      'Custom workflows',
    ],
    limits: {
      rateLimit: '120 requests/min',
      teamSize: '5 users',
      sla: '99.5% uptime',
    },
    cta: 'Get Started',
    popular: false,
    savings: '5% below market',
  },
  {
    name: 'Standard',
    icon: Sparkles,
    price: 0.0475,
    priceDisplay: '$0.0475',
    unit: 'per execution',
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
      'Multi-region deployment',
    ],
    limits: {
      rateLimit: '300 requests/min',
      teamSize: '10 users',
      sla: '99.9% uptime',
    },
    cta: 'Get Started',
    popular: true,
    savings: 'Recommended',
  },
  {
    name: 'Premium',
    icon: Crown,
    price: 0.076,
    priceDisplay: '$0.076',
    unit: 'per execution',
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
      'Priority processing',
    ],
    limits: {
      rateLimit: '600 requests/min',
      teamSize: '25 users',
      sla: '99.95% uptime',
    },
    cta: 'Get Started',
    popular: false,
    savings: '5% below market',
  },
  {
    name: 'Elite',
    icon: Gem,
    price: 0.2375,
    priceDisplay: '$0.2375',
    unit: 'per execution',
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
      'Advanced security',
    ],
    limits: {
      rateLimit: '1200 requests/min',
      teamSize: 'Unlimited',
      sla: '99.99% uptime',
    },
    cta: 'Contact Sales',
    popular: false,
    savings: '5% below market',
  },
  {
    name: 'BYOK',
    icon: Key,
    price: 0.002,
    priceDisplay: '$0.002',
    unit: 'platform fee',
    description: 'Bring Your Own Anthropic API Key',
    features: [
      'Unlimited tokens (your Anthropic plan)',
      'All Claude models',
      '200K context window',
      '8K max output tokens',
      'Zero markup on tokens',
      'Direct Anthropic billing',
      'Full platform access',
      'Enterprise support',
      'Custom integrations',
      'Priority processing',
    ],
    limits: {
      rateLimit: 'Custom',
      teamSize: 'Unlimited',
      sla: 'Custom',
    },
    cta: 'Learn More',
    popular: false,
    savings: 'Lowest fees in industry',
    highlight: true,
  },
]

const volumeDiscounts = [
  {
    volume: '10,000+ executions/month',
    discount: '10-11% off',
    description: 'Automatic volume discounts applied',
  },
  {
    volume: '100,000+ executions/month',
    discount: 'Custom pricing',
    description: 'Contact sales for enterprise rates',
  },
  {
    volume: 'Annual billing',
    discount: '20% off',
    description: 'Save 20% when you pay annually',
  },
]

const costComparison = [
  { executions: '1,000', solo: '$8', basic: '$12', silver: '$45', standard: '$56', premium: '$84', elite: '$280', byok: '$12.50*' },
  { executions: '10,000', solo: '$80', basic: '$120', silver: '$450', standard: '$560', premium: '$840', elite: '$2,800', byok: '$125*' },
  { executions: '100,000', solo: '$800', basic: '$1,200', silver: '$4,500', standard: '$5,600', premium: '$8,400', elite: '$28,000', byok: '$1,250*' },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge className="mb-4 bg-green-600 hover:bg-green-700">5% Below Market Rates</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Transparent, Competitive Pricing
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            7 tiers to fit every need. All pricing 5% below market with 14% markup (vs 20% industry standard).
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No hidden fees. No monthly minimums. Pay only for what you use.
          </p>
        </div>

        {/* Pricing Tiers - Horizontal Scroll on Mobile */}
        <div className="mb-16">
          <div className="overflow-x-auto pb-4">
            <div className="inline-flex gap-6 lg:grid lg:grid-cols-4 min-w-max lg:min-w-0">
              {tiers.map((tier) => {
                const Icon = tier.icon
                return (
                  <Card
                    key={tier.name}
                    className={`relative p-6 w-72 lg:w-auto ${
                      tier.popular
                        ? 'ring-2 ring-blue-600 shadow-xl scale-105'
                        : tier.highlight
                        ? 'ring-2 ring-yellow-500 shadow-xl'
                        : ''
                    }`}
                  >
                    {tier.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                        Recommended
                      </Badge>
                    )}
                    {tier.highlight && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-600">
                        Enterprise
                      </Badge>
                    )}
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <h3 className="text-xl font-bold">{tier.name}</h3>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {tier.description}
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{tier.priceDisplay}</span>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{tier.unit}</span>
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {tier.savings}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      className="w-full mb-4 text-sm"
                      variant={tier.popular ? 'default' : 'outline'}
                    >
                      <Link href={tier.name === 'BYOK' ? '/docs/api/auth' : tier.name === 'Elite' ? 'https://bizbot.store' : '/signup'}>
                        {tier.cta}
                      </Link>
                    </Button>

                    <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Rate Limit:</span>
                          <span className="font-semibold">{tier.limits.rateLimit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Team Size:</span>
                          <span className="font-semibold">{tier.limits.teamSize}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">SLA:</span>
                          <span className="font-semibold">{tier.limits.sla}</span>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>

        {/* Cost Comparison Table */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Monthly Cost Examples</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Based on average 1,000 input + 500 output tokens per execution
            </p>
          </div>

          <Card className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Executions/Month</th>
                  <th className="text-right py-3 px-4 font-semibold">Solo</th>
                  <th className="text-right py-3 px-4 font-semibold">Basic</th>
                  <th className="text-right py-3 px-4 font-semibold">Silver</th>
                  <th className="text-right py-3 px-4 font-semibold bg-blue-50 dark:bg-blue-900/20">Standard</th>
                  <th className="text-right py-3 px-4 font-semibold">Premium</th>
                  <th className="text-right py-3 px-4 font-semibold">Elite</th>
                  <th className="text-right py-3 px-4 font-semibold bg-yellow-50 dark:bg-yellow-900/20">BYOK</th>
                </tr>
              </thead>
              <tbody>
                {costComparison.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 px-4 font-semibold">{row.executions}</td>
                    <td className="text-right py-3 px-4">{row.solo}</td>
                    <td className="text-right py-3 px-4">{row.basic}</td>
                    <td className="text-right py-3 px-4">{row.silver}</td>
                    <td className="text-right py-3 px-4 bg-blue-50 dark:bg-blue-900/20 font-semibold">{row.standard}</td>
                    <td className="text-right py-3 px-4">{row.premium}</td>
                    <td className="text-right py-3 px-4">{row.elite}</td>
                    <td className="text-right py-3 px-4 bg-yellow-50 dark:bg-yellow-900/20 font-semibold">{row.byok}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
              * BYOK pricing includes $0.002 platform fee + Anthropic token costs (paid directly to Anthropic)
            </p>
          </Card>
        </div>

        {/* Volume Discounts */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Volume Discounts</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Save more as you scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {volumeDiscounts.map((discount) => (
              <Card key={discount.volume} className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{discount.volume}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-2">{discount.discount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{discount.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto max-w-3xl mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Why are your prices 5% below market?</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                We believe in transparent, competitive pricing. By operating efficiently with a 14% markup (vs 20% industry standard), we pass the savings directly to you while maintaining premium service quality.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">What is BYOK (Bring Your Own Key)?</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                BYOK allows you to use your own Anthropic API key. You pay us only $0.002 per execution for platform access, and pay Anthropic directly for token usage at their standard rates. Perfect for enterprise customers with existing Anthropic contracts.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Can I switch tiers anytime?</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Yes! You can change tiers at any time. Since pricing is per-execution, you'll automatically use the new tier's rates for subsequent requests. No contracts, no lock-in.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">What payment methods do you accept?</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                We accept all major credit cards (Visa, Mastercard, Amex), ACH transfers, wire transfers, and purchase orders for enterprise accounts. All payments are processed securely through Stripe.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Do you offer annual discounts?</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Yes! Save 20% when you commit to annual billing. Volume discounts (10-11% off) automatically apply at 10K+ executions/month. Contact sales for custom enterprise pricing at 100K+ executions.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Which tier should I choose?</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Solo:</strong> Testing and prototyping | <strong>Basic:</strong> Simple, high-volume tasks | <strong>Silver:</strong> Growing teams | <strong>Standard:</strong> Most users (recommended) | <strong>Premium:</strong> Complex agents | <strong>Elite:</strong> Mission-critical | <strong>BYOK:</strong> Enterprise with existing Anthropic contracts
              </p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="p-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Start with our Solo tier for free, or choose the plan that fits your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Link href="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link href="https://bizbot.store" target="_blank">Contact Sales</Link>
              </Button>
              <Button size="lg" variant="outline">
                <Link href="/docs/api/auth">View API Docs</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-6">
              Questions? Call us at <a href="tel:+18176759898" className="font-semibold text-blue-600 hover:underline">(817) 675-9898</a> or visit <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-600 hover:underline">bizbot.store</a>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
