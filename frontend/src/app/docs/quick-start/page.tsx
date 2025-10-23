import { CleanLayout, CleanCard } from "@/components/clean-layout";
import Link from "next/link";

export default function DocsQuickStartPage() {
  return (
    <CleanLayout 
      title="Docs › Quick Start" 
      subtitle="Professional AI agent platform - Docs › Quick Start"
    >
      <CleanCard>
        <div style={ textAlign: 'center', padding: '40px 20px' }>
          <h2 style={ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#000000', 
            marginBottom: '16px'
          }>
            Docs › Quick Start
          </h2>
          <p style={ 
            fontSize: '16px', 
            color: '#666666', 
            marginBottom: '24px'
          }>
            This page is being updated with our new clean design.
          </p>
          
          <div style={ display: 'flex', gap: '12px', justifyContent: 'center' }>
            <Link 
              href="/agents"
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
              Try Agents
            </Link>
            <Link 
              href="/docs"
              style={{
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#0070f3',
                backgroundColor: '#f0f9ff',
                borderRadius: '6px',
                textDecoration: 'none'
              }}
            >
              Documentation
            </Link>
          </div>
        </div>
      </CleanCard>
    </CleanLayout>
  );
}