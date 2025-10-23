import Link from "next/link";

export default function Home() {
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      {/* Simple Hero Section */}
      <section style={{ 
        padding: '80px 20px', 
        textAlign: 'center', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: '600', 
          color: '#000000', 
          marginBottom: '24px',
          lineHeight: '1.1'
        }}>
          AI Agents for Enterprise
        </h1>
        
        <p style={{ 
          fontSize: '20px', 
          color: '#666666', 
          marginBottom: '40px',
          lineHeight: '1.5'
        }}>
          10 production-ready AI agents. Try 3 queries free, then choose your plan.
        </p>
        
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link 
            href="/agents"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#ffffff',
              backgroundColor: '#0070f3',
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            Try Free
          </Link>
          
          <Link 
            href="/pricing"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#0070f3',
              backgroundColor: 'transparent',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              textDecoration: 'none'
            }}
          >
            Pricing
          </Link>
        </div>
      </section>

      {/* Clean Agent Grid */}
      <section style={{ 
        padding: '60px 20px', 
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: '600', 
            color: '#000000', 
            textAlign: 'center',
            marginBottom: '48px'
          }}>
            Available Agents
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px'
          }}>
            {/* Agent Cards */}
            {[
              { name: "Ticket Resolver", desc: "AI-powered support ticket resolution", credits: "3 credits" },
              { name: "Security Scanner", desc: "OWASP vulnerability detection", credits: "5 credits" },
              { name: "Knowledge Base", desc: "Intelligent Q&A and search", credits: "2 credits" },
              { name: "Data Processor", desc: "Extract and transform data", credits: "4 credits" },
              { name: "Report Generator", desc: "AI-powered business reports", credits: "5 credits" },
              { name: "Deployment Agent", desc: "Automated deployment management", credits: "4 credits" }
            ].map((agent, index) => (
              <div key={index} style={{ 
                backgroundColor: '#ffffff', 
                padding: '24px', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#000000', 
                  marginBottom: '8px'
                }}>
                  {agent.name}
                </h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#666666', 
                  marginBottom: '16px',
                  lineHeight: '1.4'
                }}>
                  {agent.desc}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#999999' }}>{agent.credits}</span>
                  <Link 
                    href="/agents"
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#0070f3',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '4px',
                      textDecoration: 'none'
                    }}
                  >
                    Try Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section style={{ 
        padding: '60px 20px', 
        textAlign: 'center',
        backgroundColor: '#ffffff'
      }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: '600', 
          color: '#000000', 
          marginBottom: '16px'
        }}>
          Ready to get started?
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#666666', 
          marginBottom: '32px'
        }}>
          Try any agent with 3 free queries. No credit card required.
        </p>
        
        <Link 
          href="/agents"
          style={{
            display: 'inline-block',
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '500',
            color: '#ffffff',
            backgroundColor: '#0070f3',
            borderRadius: '6px',
            textDecoration: 'none'
          }}
        >
          Start Free Trial
        </Link>
      </section>
    </div>
  );
}