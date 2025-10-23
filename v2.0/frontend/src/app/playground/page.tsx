"use client";

import { useState } from "react";
import { CleanLayout, CleanCard } from "@/components/clean-layout";

const agents = [
  { id: "ticket-resolver", name: "Ticket Resolver", credits: 3 },
  { id: "security-scanner", name: "Security Scanner", credits: 5 },
  { id: "knowledge-base", name: "Knowledge Base", credits: 2 },
  { id: "incident-responder", name: "Incident Responder", credits: 4 },
  { id: "data-processor", name: "Data Processor", credits: 4 },
  { id: "report-generator", name: "Report Generator", credits: 5 },
  { id: "deployment-agent", name: "Deployment Agent", credits: 4 },
  { id: "audit-agent", name: "Audit Agent", credits: 5 },
  { id: "workflow-orchestrator", name: "Workflow Orchestrator", credits: 4 },
  { id: "escalation-manager", name: "Escalation Manager", credits: 3 }
];

export default function PlaygroundPage() {
  const [selectedAgent, setSelectedAgent] = useState("ticket-resolver");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [trialRemaining, setTrialRemaining] = useState(3);

  const handleExecute = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock result
      setResult({
        success: true,
        agent_id: selectedAgent,
        result: {
          response: `Mock response from ${agents.find(a => a.id === selectedAgent)?.name}: ${query}`,
          confidence: 0.95
        },
        execution_time_ms: 1800,
        credits_used: agents.find(a => a.id === selectedAgent)?.credits || 3
      });
      
      setTrialRemaining(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      setResult({
        success: false,
        error: "Execution failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CleanLayout 
      title="AI Agent Playground" 
      subtitle="Test any agent with your free trial queries. No signup required."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '40px' }}>
        {/* Agent Selection */}
        <CleanCard>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#000000', 
            marginBottom: '16px'
          }}>
            Select Agent
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent.id)}
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  backgroundColor: selectedAgent === agent.id ? '#f0f9ff' : '#ffffff',
                  border: selectedAgent === agent.id ? '1px solid #0070f3' : '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: selectedAgent === agent.id ? '#0070f3' : '#000000',
                  marginBottom: '4px'
                }}>
                  {agent.name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666666'
                }}>
                  {agent.credits} credits
                </div>
              </button>
            ))}
          </div>
        </CleanCard>

        {/* Query Interface */}
        <CleanCard>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#000000'
              }}>
                {agents.find(a => a.id === selectedAgent)?.name}
              </h3>
              <div style={{ 
                fontSize: '12px', 
                color: '#666666',
                backgroundColor: '#f8fafc',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                Trial: {trialRemaining}/3 remaining
              </div>
            </div>
            
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query here..."
              style={{
                width: '100%',
                height: '120px',
                padding: '12px',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                color: '#000000',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>
          
          <button
            onClick={handleExecute}
            disabled={loading || !query.trim() || trialRemaining <= 0}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: '#ffffff',
              backgroundColor: loading || !query.trim() || trialRemaining <= 0 ? '#cccccc' : '#0070f3',
              border: 'none',
              borderRadius: '6px',
              cursor: loading || !query.trim() || trialRemaining <= 0 ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Executing..." : trialRemaining <= 0 ? "Trial Exhausted" : "Execute Agent"}
          </button>
          
          {trialRemaining <= 0 && (
            <div style={{ 
              marginTop: '12px', 
              padding: '12px',
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', color: '#92400e', marginBottom: '8px' }}>
                Free trial exhausted. Sign up for unlimited access.
              </p>
              <a 
                href="/signup"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ffffff',
                  backgroundColor: '#0070f3',
                  borderRadius: '4px',
                  textDecoration: 'none'
                }}
              >
                Sign Up
              </a>
            </div>
          )}
        </CleanCard>
      </div>

      {/* Results */}
      {result && (
        <CleanCard>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#000000', 
            marginBottom: '16px'
          }}>
            Result
          </h3>
          
          {result.success ? (
            <div>
              <div style={{ 
                padding: '16px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '14px', color: '#166534', fontWeight: '500', marginBottom: '8px' }}>
                  ✅ Success
                </div>
                <div style={{ fontSize: '14px', color: '#166534', lineHeight: '1.4' }}>
                  {result.result.response}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#666666' }}>
                <span>Confidence: {Math.round(result.result.confidence * 100)}%</span>
                <span>Time: {result.execution_time_ms}ms</span>
                <span>Credits: {result.credits_used}</span>
              </div>
            </div>
          ) : (
            <div style={{ 
              padding: '16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              ❌ {result.error}
            </div>
          )}
        </CleanCard>
      )}
    </CleanLayout>
  );
}
