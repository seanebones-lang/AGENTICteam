import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const payGoPlans = [
  {
    name: "Starter",
    price: "$20",
    credits: 500,
    pricePerCredit: "$0.040",
    description: "Perfect for trying out all agents",
    features: [
      "500 credits",
      "All 10 agents",
      "Email support",
      "Credits never expire"
    ],
    popular: false
  },
  {
    name: "Growth", 
    price: "$50",
    credits: 1500,
    pricePerCredit: "$0.033",
    description: "Best value for regular usage",
    features: [
      "1,500 credits",
      "All 10 agents", 
      "Priority support",
      "Credits never expire",
      "Usage analytics"
    ],
    popular: true
  },
  {
    name: "Business",
    price: "$100", 
    credits: 3500,
    pricePerCredit: "$0.029",
    description: "For teams and heavy usage",
    features: [
      "3,500 credits",
      "All 10 agents",
      "Priority support", 
      "Credits never expire",
      "Usage analytics",
      "Team management"
    ],
    popular: false
  },
  {
    name: "Enterprise",
    price: "$250",
    credits: 10000,
    pricePerCredit: "$0.025",
    description: "Maximum value for enterprises",
    features: [
      "10,000 credits",
      "All 10 agents",
      "24/7 support",
      "Credits never expire", 
      "Advanced analytics",
      "Team management",
      "Custom integrations"
    ],
    popular: false
  }
];

const subscriptionPlans = [
  {
    name: "Basic",
    price: "$49",
    period: "/month",
    credits: 1000,
    pricePerCredit: "$0.049",
    description: "Consistent monthly usage",
    features: [
      "1,000 credits/month",
      "All 10 agents",
      "Email support",
      "Rollover up to 500 credits"
    ],
    popular: false
  },
  {
    name: "Pro",
    price: "$99", 
    period: "/month",
    credits: 3000,
    pricePerCredit: "$0.033",
    description: "For growing teams",
    features: [
      "3,000 credits/month",
      "All 10 agents",
      "Priority support",
      "Rollover up to 1,500 credits",
      "Usage analytics",
      "Slack integration"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$299",
    period: "/month", 
    credits: 15000,
    pricePerCredit: "$0.020",
    description: "Unlimited scale for enterprises",
    features: [
      "15,000 credits/month",
      "All 10 agents",
      "24/7 support",
      "Unlimited rollover",
      "Advanced analytics", 
      "Team management",
      "Custom integrations",
      "SLA guarantee"
    ],
    popular: false
  }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose between pay-as-you-go credits or monthly subscriptions. 
            All plans include access to all 10 AI agents.
          </p>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <div>✅ No setup fees</div>
            <div>✅ Cancel anytime</div>
            <div>✅ Credits never expire</div>
          </div>
        </div>

        {/* Pay-as-you-go Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Pay-as-you-go Credits</h2>
            <p className="text-muted-foreground">Buy credits once, use them forever</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {payGoPlans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Best Value
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.credits} credits ({plan.pricePerCredit}/credit)
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"}>
                    Buy Credits
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Monthly Subscriptions</h2>
            <p className="text-muted-foreground">Predictable monthly billing with rollover credits</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold">
                      {plan.price}<span className="text-lg font-normal text-muted-foreground">{plan.period}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.credits} credits/month ({plan.pricePerCredit}/credit)
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={plan.popular ? "default" : "outline"}>
                    Subscribe
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Enterprise */}
        <div className="text-center bg-gray-50 dark:bg-gray-900 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Enterprise Deployment</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Deploy agents in your infrastructure with Docker, Kubernetes, or air-gapped environments. 
            Starting at $50,000/year for unlimited usage.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/docs/deploy">View Deployment Options</Link>
            </Button>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-medium mb-2">Do credits expire?</h3>
              <p className="text-sm text-muted-foreground">
                No, pay-as-you-go credits never expire. Subscription credits rollover with limits.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Can I change plans?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, upgrade or downgrade anytime. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-muted-foreground">
                All major credit cards, PayPal, and bank transfers for enterprise.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Is there a free trial?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! 3 free queries across all agents, no credit card required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
