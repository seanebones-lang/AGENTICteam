import Link from "next/link";
import { CleanLayout, CleanCard } from "@/components/clean-layout";

const payGoPlans = [
  { name: "Starter", price: "$20", credits: 500, pricePerCredit: "$0.040", popular: false },
  { name: "Growth", price: "$50", credits: 1500, pricePerCredit: "$0.033", popular: true },
  { name: "Business", price: "$100", credits: 3500, pricePerCredit: "$0.029", popular: false },
  { name: "Enterprise", price: "$250", credits: 10000, pricePerCredit: "$0.025", popular: false }
];

const subscriptionPlans = [
  { name: "Basic", price: "$49", period: "/month", credits: 1000, popular: false },
  { name: "Pro", price: "$99", period: "/month", credits: 3000, popular: true },
  { name: "Enterprise", price: "$299", period: "/month", credits: 15000, popular: false }
];

export default function PricingPage() {
  return (
    <CleanLayout 
      title="Simple, Transparent Pricing" 
      subtitle="Choose between pay-as-you-go credits or monthly subscriptions. All plans include access to all 10 AI agents."
    >
      {/* Pay-as-you-go Plans */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#000000', 
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Pay-as-you-go Credits
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px'
        }}>
          {payGoPlans.map((plan) => (
            <div key={plan.name} style={{ position: 'relative' }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#0070f3',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Best Value
                </div>
              )}
              
              <CleanCard>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#000000', 
                    marginBottom: '8px'
                  }}>
                    {plan.name}
                  </h3>
                  <div style={{ 
                    fontSize: '36px', 
                    fontWeight: '700', 
                    color: '#000000', 
                    marginBottom: '8px'
                  }}>
                    {plan.price}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#666666', 
                    marginBottom: '24px'
                  }}>
                    {plan.credits} credits ({plan.pricePerCredit}/credit)
                  </div>
                  
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: plan.popular ? '#ffffff' : '#0070f3',
                    backgroundColor: plan.popular ? '#0070f3' : '#f0f9ff',
                    border: plan.popular ? 'none' : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    Buy Credits
                  </button>
                </div>
              </CleanCard>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Plans */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#000000', 
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Monthly Subscriptions
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '20px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {subscriptionPlans.map((plan) => (
            <div key={plan.name} style={{ position: 'relative' }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#0070f3',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  Most Popular
                </div>
              )}
              
              <CleanCard>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '600', 
                    color: '#000000', 
                    marginBottom: '8px'
                  }}>
                    {plan.name}
                  </h3>
                  <div style={{ 
                    fontSize: '36px', 
                    fontWeight: '700', 
                    color: '#000000', 
                    marginBottom: '8px'
                  }}>
                    {plan.price}
                    <span style={{ fontSize: '16px', fontWeight: '400', color: '#666666' }}>
                      {plan.period}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#666666', 
                    marginBottom: '24px'
                  }}>
                    {plan.credits} credits/month
                  </div>
                  
                  <button style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: plan.popular ? '#ffffff' : '#0070f3',
                    backgroundColor: plan.popular ? '#0070f3' : '#f0f9ff',
                    border: plan.popular ? 'none' : '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    Subscribe
                  </button>
                </div>
              </CleanCard>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise CTA */}
      <CleanCard>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#000000', 
            marginBottom: '12px'
          }}>
            Enterprise Deployment
          </h2>
          <p style={{ 
            fontSize: '16px', 
            color: '#666666', 
            marginBottom: '24px'
          }}>
            Deploy agents in your infrastructure. Starting at $50,000/year.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link 
              href="/docs/deploy"
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#ffffff',
                backgroundColor: '#0070f3',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              View Options
            </Link>
            <Link 
              href="/contact"
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#0070f3',
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </CleanCard>
    </CleanLayout>
  );
}