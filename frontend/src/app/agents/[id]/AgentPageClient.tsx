'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  FileText, 
  Zap, 
  AlertTriangle, 
  Database,
  GitBranch,
  BarChart,
  Ticket,
  CheckCircle,
  Bot,
  Play,
  ArrowLeft,
  Clock,
  DollarSign,
  Users,
  Star
} from 'lucide-react'
import { useAgents } from '@/hooks/useAgents'
import Link from 'next/link'

export default function AgentPageClient() {
  const params = useParams()
  const agentId = params?.id as string
  const { packages, loading, error } = useAgents()
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [task, setTask] = useState('')
  
  // Find the specific agent from packages
  const agent = packages.find(pkg => pkg.id === agentId)

  const handleExecute = async () => {
    if (!task.trim()) return
    
    setIsExecuting(true)
    try {
      // Simulate agent execution for demo
      const result = {
        success: true,
        message: `Agent ${agentId} executed successfully`,
        task: task,
        timestamp: new Date().toISOString()
      }
      setExecutionResult(result)
    } catch (error) {
      console.error('Execution failed:', error)
    } finally {
      setIsExecuting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent details...</p>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h1>
          <p className="text-gray-600 mb-4">The requested agent could not be found.</p>
          <Link href="/agents">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getAgentIcon = (id: string) => {
    const icons: Record<string, any> = {
      'security-scanner': Shield,
      'ticket-resolver': Ticket,
      'knowledge-base': Database,
      'incident-responder': AlertTriangle,
      'data-processor': BarChart,
      'deployment-agent': GitBranch,
      'audit-agent': CheckCircle,
      'report-generator': FileText,
      'workflow-orchestrator': Zap,
      'escalation-manager': Bot
    }
    return icons[id] || Bot
  }

  const Icon = getAgentIcon(agentId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/agents" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Agents
          </Link>
          
          <div className="flex items-start gap-6">
            <div className="p-4 bg-white rounded-xl shadow-sm">
              <Icon className="h-12 w-12 text-blue-600" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{agent.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{agent.description}</p>
              
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="px-3 py-1">
                  {agent.category}
                </Badge>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="font-medium">${agent.price}</span>
                  <span className="ml-1">per execution</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span>All Tiers</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.9/5 from 1,234 executions)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Agent Overview</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      {agent.description}
                    </p>
                    
                    <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
                    <ul className="space-y-2">
                      {agent.features?.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="capabilities" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Capabilities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agent.features?.map((capability: string, index: number) => (
                      <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{capability}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="examples" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Usage Examples</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Basic Usage</h4>
                      <code className="text-sm text-gray-600 bg-white p-2 rounded block">
                        Execute {agent.name.toLowerCase()} with task: "Analyze security vulnerabilities"
                      </code>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Advanced Usage</h4>
                      <code className="text-sm text-gray-600 bg-white p-2 rounded block">
                        Execute with custom parameters and detailed analysis options
                      </code>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="pricing" className="mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Pricing Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Per Execution</h4>
                        <p className="text-sm text-gray-600">Pay as you use</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-gray-900">${agent.price}</span>
                        <p className="text-sm text-gray-600">per execution</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Subscription Benefits</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Reduced per-execution costs with higher tiers</li>
                        <li>• Priority execution queue</li>
                        <li>• Advanced analytics and reporting</li>
                        <li>• 24/7 premium support</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Execute Agent */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Execute Agent</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="task" className="block text-sm font-medium text-gray-700 mb-2">
                    Task Description
                  </label>
                  <textarea
                    id="task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder={`Describe the task for ${agent.name}...`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                  />
                </div>
                
                <Button
                  onClick={handleExecute}
                  disabled={!task.trim() || isExecuting}
                  className="w-full"
                >
                  {isExecuting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Agent
                    </>
                  )}
                </Button>
              </div>
              
              {executionResult && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Execution Result</h4>
                  <pre className="text-sm text-green-800 whitespace-pre-wrap">
                    {JSON.stringify(executionResult, null, 2)}
                  </pre>
                </div>
              )}
            </Card>

            {/* Agent Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agent Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Executions</span>
                  <span className="font-semibold">1,234</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">99.2%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold">2.3s</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-semibold">2 hours ago</span>
                </div>
              </div>
            </Card>

            {/* Related Agents */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Related Agents</h3>
              
              <div className="space-y-3">
                <Link href="/agents/incident-responder" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Incident Responder</h4>
                      <p className="text-sm text-gray-600">Security incident analysis</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/agents/audit-agent" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-900">Audit Agent</h4>
                      <p className="text-sm text-gray-600">Compliance auditing</p>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
