import AgentPageClient from './AgentPageClient'

// Generate static params for all agent IDs
export async function generateStaticParams() {
  const agentIds = [
    'security-scanner',
    'ticket-resolver', 
    'knowledge-base',
    'incident-responder',
    'data-processor',
    'deployment-agent',
    'audit-agent',
    'report-generator',
    'workflow-orchestrator',
    'escalation-manager'
  ]
  
  return agentIds.map((id) => ({
    id: id,
  }))
}

export default function AgentPage() {
  return <AgentPageClient />
}