import Link from "next/link";
import { CleanLayout, CleanCard } from "@/components/clean-layout";

export default function DocsPage() {
  const docSections = [
    {
      title: "Getting Started",
      links: [
        { name: "Quick Start", href: "/docs/quick-start", desc: "Get up and running in 5 minutes" },
        { name: "First Agent", href: "/docs/first-agent", desc: "Execute your first AI agent" },
        { name: "Authentication", href: "/docs/authentication", desc: "API keys and authentication" }
      ]
    },
    {
      title: "Deployment",
      links: [
        { name: "Deploy Guide", href: "/docs/deploy", desc: "7 deployment methods explained" },
        { name: "Docker", href: "/docs/deploy#docker", desc: "Self-hosted containers" },
        { name: "Kubernetes", href: "/docs/deploy#kubernetes", desc: "Enterprise scaling" }
      ]
    },
    {
      title: "API Reference",
      links: [
        { name: "REST API", href: "/docs/api/rest", desc: "Complete API documentation" },
        { name: "Authentication", href: "/docs/api/auth", desc: "JWT and session management" },
        { name: "Rate Limits", href: "/docs/api/rate-limits", desc: "Usage limits and quotas" }
      ]
    },
    {
      title: "Agents",
      links: [
        { name: "Ticket Resolver", href: "/docs/agents/ticket-resolver", desc: "Support automation" },
        { name: "Security Scanner", href: "/docs/agents/security-scanner", desc: "Vulnerability detection" },
        { name: "Knowledge Base", href: "/docs/agents/knowledge-base", desc: "Q&A and search" }
      ]
    }
  ];

  return (
    <CleanLayout 
      title="Documentation" 
      subtitle="Everything you need to integrate and deploy AI agents"
    >
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '24px'
      }}>
        {docSections.map((section) => (
          <CleanCard key={section.title}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: '600', 
              color: '#000000', 
              marginBottom: '16px'
            }}>
              {section.title}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {section.links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  style={{
                    display: 'block',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '500', 
                    color: '#0070f3', 
                    marginBottom: '4px'
                  }}>
                    {link.name}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#666666',
                    lineHeight: '1.4'
                  }}>
                    {link.desc}
                  </div>
                </Link>
              ))}
            </div>
          </CleanCard>
        ))}
      </div>

      {/* Quick Links */}
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <CleanCard>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#000000', 
            marginBottom: '16px'
          }}>
            Popular Resources
          </h2>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/docs/deploy"
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                backgroundColor: '#0070f3',
                borderRadius: '4px',
                textDecoration: 'none'
              }}
            >
              Deployment Guide
            </Link>
            <Link 
              href="/docs/api/rest"
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
              API Reference
            </Link>
            <Link 
              href="/playground"
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
              Try Playground
            </Link>
          </div>
        </CleanCard>
      </div>
    </CleanLayout>
  );
}
