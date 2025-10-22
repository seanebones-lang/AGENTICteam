import AgentHowToGuide from '@/components/AgentHowToGuide'

export default async function HowToUsePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AgentHowToGuide agentId={id} />
}

