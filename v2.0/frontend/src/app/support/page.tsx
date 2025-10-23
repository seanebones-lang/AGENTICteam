import { CleanLayout, CleanCard } from "@/components/clean-layout";
import Link from "next/link";

export default function SupportPage() {
  return (
    <CleanLayout 
      title="Support" 
      subtitle="Get help with Agent Marketplace. Fast response times guaranteed."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Contact Options */}
        <CleanCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📧</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000000', marginBottom: '8px' }}>
              Email Support
            </h3>
            <p style={{ fontSize: '14px', color: '#666666', marginBottom: '16px' }}>
              Get help within 1 hour during business hours
            </p>
            <a 
              href="mailto:support@agentmarketplace.com"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                backgroundColor: '#0070f3',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              Email Us
            </a>
          </div>
        </CleanCard>

        <CleanCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>💬</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000000', marginBottom: '8px' }}>
              Live Chat
            </h3>
            <p style={{ fontSize: '14px', color: '#666666', marginBottom: '16px' }}>
              Instant help with our live chat system
            </p>
            <button style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff',
              backgroundColor: '#0070f3',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Start Chat
            </button>
          </div>
        </CleanCard>

        <CleanCard>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000000', marginBottom: '8px' }}>
              Documentation
            </h3>
            <p style={{ fontSize: '14px', color: '#666666', marginBottom: '16px' }}>
              Comprehensive guides and API documentation
            </p>
            <Link 
              href="/docs"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#0070f3',
                backgroundColor: '#f0f9ff',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              View Docs
            </Link>
          </div>
        </CleanCard>
      </div>

      {/* FAQ */}
      <CleanCard>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '600', 
          color: '#000000', 
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Frequently Asked Questions
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {[
            {
              q: "How does the free trial work?",
              a: "You get 3 queries across all 10 agents. No credit card required. Perfect for testing our capabilities."
            },
            {
              q: "What deployment options do you offer?",
              a: "7 methods: SaaS API, Docker, Kubernetes, SDK, Serverless, Edge, and Air-gapped for maximum flexibility."
            },
            {
              q: "How do credits work?",
              a: "Each agent uses 2-5 credits per query. Pay-as-you-go credits never expire. Subscriptions include monthly credits."
            },
            {
              q: "What's your success rate?",
              a: "98.7% success rate across all agents with Claude 4.5 integration and production-grade reliability."
            }
          ].map((faq, index) => (
            <div key={index}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#000000', 
                marginBottom: '8px'
              }}>
                {faq.q}
              </h4>
              <p style={{ 
                fontSize: '14px', 
                color: '#666666', 
                lineHeight: '1.5'
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </CleanCard>
    </CleanLayout>
  );
}
