import Link from "next/link";

const agents = [
  { id: "ticket-resolver", name: "Ticket Resolver", desc: "AI-powered support ticket resolution", credits: 3, category: "Support" },
  { id: "security-scanner", name: "Security Scanner", desc: "OWASP vulnerability detection", credits: 5, category: "Security" },
  { id: "knowledge-base", name: "Knowledge Base", desc: "Intelligent Q&A and search", credits: 2, category: "Support" },
  { id: "incident-responder", name: "Incident Responder", desc: "Incident triage and response", credits: 4, category: "Operations" },
  { id: "data-processor", name: "Data Processor", desc: "Extract and transform data", credits: 4, category: "Analytics" },
  { id: "report-generator", name: "Report Generator", desc: "AI-powered business reports", credits: 5, category: "Analytics" },
  { id: "deployment-agent", name: "Deployment Agent", desc: "Automated deployment management", credits: 4, category: "DevOps" },
  { id: "audit-agent", name: "Audit Agent", desc: "Compliance and security auditing", credits: 5, category: "Security" },
  { id: "workflow-orchestrator", name: "Workflow Orchestrator", desc: "Multi-step workflow automation", credits: 4, category: "Automation" },
  { id: "escalation-manager", name: "Escalation Manager", desc: "Smart escalation routing", credits: 3, category: "Support" }
];

export default function AgentsPage() {
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      {/* Header */}
      <section style={{ 
        padding: '60px 20px 40px', 
        textAlign: 'center', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: '600', 
          color: '#000000', 
          marginBottom: '16px'
        }}>
          AI Agents
        </h1>
        <p style={{ 
          fontSize: '18px', 
          color: '#666666', 
          marginBottom: '32px'
        }}>
          10 production-ready agents. Universal free trial: 3 queries across all agents.
        </p>
        
        <div style={{ 
          display: 'inline-flex', 
          padding: '8px', 
          backgroundColor: '#f8fafc', 
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <span style={{ 
            padding: '8px 16px', 
            backgroundColor: '#0070f3', 
            color: '#ffffff', 
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            All
          </span>
          {['Support', 'Security', 'Operations', 'Analytics', 'DevOps', 'Automation'].map(cat => (
            <span key={cat} style={{ 
              padding: '8px 16px', 
              color: '#666666',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Agent Grid */}
      <section style={{ 
        padding: '0 20px 60px', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px'
        }}>
          {agents.map((agent) => (
            <div key={agent.id} style={{ 
              backgroundColor: '#ffffff', 
              padding: '24px', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#000000',
                  margin: '0'
                }}>
                  {agent.name}
                </h3>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#666666',
                  backgroundColor: '#f8fafc',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {agent.credits} credits
                </span>
              </div>
              
              <p style={{ 
                fontSize: '14px', 
                color: '#666666', 
                marginBottom: '16px',
                lineHeight: '1.4'
              }}>
                {agent.desc}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ 
                  fontSize: '12px', 
                  color: '#0070f3',
                  backgroundColor: '#f0f9ff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  {agent.category}
                </span>
                
                <Link 
                  href={`/agents/${agent.id}`}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#ffffff',
                    backgroundColor: '#0070f3',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Try Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}