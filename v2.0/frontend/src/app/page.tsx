import Link from "next/link";

export default function Home() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Hero Section - Stripe/Vercel inspired */}
      <section style={{ padding: '120px 20px', textAlign: 'center', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '72px', 
          fontWeight: '700', 
          color: '#000000', 
          marginBottom: '24px',
          lineHeight: '1.1',
          letterSpacing: '-0.02em'
        }}>
          AI Agents for Enterprise
        </h1>
        
        <p style={{ 
          fontSize: '24px', 
          color: '#666666', 
          marginBottom: '48px', 
          maxWidth: '800px', 
          margin: '0 auto 48px auto',
          lineHeight: '1.5'
        }}>
          10 production-ready AI agents with 98.7% success rate. Deploy anywhere: SaaS, Docker, Kubernetes, Edge, Air-gapped.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '64px' }}>
          <Link 
            href="/agents"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#0070f3',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              border: 'none'
            }}
          >
            Try Free (3 Queries)
          </Link>
          
          <Link 
            href="/docs/deploy"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              color: '#0070f3',
              backgroundColor: 'transparent',
              border: '2px solid #0070f3',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Deploy Guide
          </Link>
        </div>
        
        {/* Stats - Clean and minimal */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '48px', 
          fontSize: '16px',
          color: '#666666'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#00d4aa', fontSize: '18px' }}>✓</span>
            <span>10 Agents</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#00d4aa', fontSize: '18px' }}>✓</span>
            <span>98.7% Success</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#00d4aa', fontSize: '18px' }}>✓</span>
            <span>2.1s Response</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#00d4aa', fontSize: '18px' }}>✓</span>
            <span>7 Deploy Methods</span>
          </div>
        </div>
      </section>

      {/* Features Section - OpenAI inspired */}
      <section style={{ 
        backgroundColor: '#f8fafc', 
        padding: '80px 20px',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ 
              fontSize: '48px', 
              fontWeight: '700', 
              color: '#000000', 
              marginBottom: '16px'
            }}>
              Enterprise-Ready AI Agents
            </h2>
            <p style={{ 
              fontSize: '20px', 
              color: '#666666',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Deploy anywhere with unmatched flexibility and performance
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '32px'
          }}>
            {/* Feature Cards */}
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '32px', 
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>🚀</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#000000', marginBottom: '12px' }}>
                7 Deployment Methods
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.6' }}>
                SaaS, Docker, Kubernetes, SDK, Serverless, Edge, Air-gapped. Deploy anywhere with complete flexibility.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '32px', 
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>⚡</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#000000', marginBottom: '12px' }}>
                Universal Free Trial
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.6' }}>
                3 queries across ALL agents. No credit card required. Test every agent before you buy.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#ffffff', 
              padding: '32px', 
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💰</div>
              <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#000000', marginBottom: '12px' }}>
                50-60% Cost Savings
              </h3>
              <p style={{ color: '#666666', lineHeight: '1.6' }}>
                Smart model selection and competitive pricing. Significantly cheaper than OpenAI, Anthropic, Google.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Stripe inspired */}
      <section style={{ 
        padding: '80px 20px', 
        textAlign: 'center',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '48px', 
            fontWeight: '700', 
            color: '#000000', 
            marginBottom: '24px'
          }}>
            Ready to get started?
          </h2>
          <p style={{ 
            fontSize: '20px', 
            color: '#666666', 
            marginBottom: '40px'
          }}>
            Try any agent with 3 free queries. No credit card required.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link 
              href="/agents"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#0070f3',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Start Free Trial
            </Link>
            
            <Link 
              href="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: '600',
                color: '#666666',
                backgroundColor: 'transparent',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}