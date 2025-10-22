'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Play, Loader2, CheckCircle, XCircle, Clock, Zap } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { apiService } from '@/lib/api'

const mockAgents = [
  { id: 'security-scanner', name: 'Security Scanner' },
  { id: 'incident-responder', name: 'Incident Responder' },
  { id: 'ticket-resolver', name: 'Ticket Resolver' },
  { id: 'data-processor', name: 'Data Processor' },
  { id: 'deployment-agent', name: 'Deployment Agent' },
  { id: 'report-generator', name: 'Report Generator' },
  { id: 'audit-agent', name: 'Audit Agent' },
  { id: 'knowledge-base', name: 'Knowledge Base' },
  { id: 'workflow-orchestrator', name: 'Workflow Orchestrator' },
  { id: 'escalation-manager', name: 'Escalation Manager' },
]

const mockScenarios = {
  'security-scanner': {
    title: 'Scan Web Application',
    input: 'Scan https://example.com for vulnerabilities',
    placeholderText: 'e.g., Scan our production website for security issues'
  },
  'ticket-resolver': {
    title: 'Classify Support Ticket',
    input: 'Customer says: I cannot login to my dashboard, getting error 500',
    placeholderText: 'e.g., Customer cannot access their account after password reset'
  },
  'knowledge-base': {
    title: 'Query Knowledge Base',
    input: 'How do I configure multi-factor authentication?',
    placeholderText: 'e.g., How do I reset my password?'
  },
  'incident-responder': {
    title: 'Analyze Incident',
    input: 'Our API is returning 500 errors for all authenticated requests',
    placeholderText: 'e.g., Database is showing high CPU usage'
  },
  'data-processor': {
    title: 'Process Data',
    input: 'Analyze user signup trends from the last 30 days',
    placeholderText: 'e.g., Summarize sales data from Q4'
  },
  'deployment-agent': {
    title: 'Deploy Application',
    input: 'Deploy version 2.0 to production with zero downtime',
    placeholderText: 'e.g., Roll back to previous version'
  },
  'report-generator': {
    title: 'Generate Report',
    input: 'Create a weekly performance report for all services',
    placeholderText: 'e.g., Generate monthly revenue report'
  },
  'audit-agent': {
    title: 'Audit System',
    input: 'Audit all user access logs from the past 7 days',
    placeholderText: 'e.g., Review security compliance'
  },
  'workflow-orchestrator': {
    title: 'Orchestrate Workflow',
    input: 'Coordinate deployment across dev, staging, and production environments',
    placeholderText: 'e.g., Set up automated testing pipeline'
  },
  'escalation-manager': {
    title: 'Manage Escalation',
    input: 'Critical bug reported by enterprise customer - needs immediate attention',
    placeholderText: 'e.g., High priority incident needs escalation'
  }
}

// Helper function to format agent response for display
function formatResponse(data: any): string {
  if (!data) return 'No response'
  
  // If there's a result field, extract and format it
  if (data.result) {
    if (typeof data.result === 'string') {
      return data.result
    }
    if (typeof data.result === 'object') {
      // Handle structured results from agents
      let formatted = ''
      
      // Handle ticket analysis results
      if (data.result.priority) {
        formatted += `Priority: ${data.result.priority}\n`
      }
      if (data.result.category) {
        formatted += `Category: ${data.result.category}\n`
      }
      if (data.result.estimated_resolution_time) {
        formatted += `Estimated Time: ${data.result.estimated_resolution_time}\n`
      }
      if (data.result.analysis) {
        formatted += `\nAnalysis:\n${data.result.analysis}\n`
      }
      if (data.result.resolution_steps) {
        formatted += `\nResolution Steps:\n`
        data.result.resolution_steps.forEach((step: string, i: number) => {
          formatted += `${i + 1}. ${step}\n`
        })
      }
      
      // If no formatted content, stringify the object nicely
      if (!formatted) {
        formatted = JSON.stringify(data.result, null, 2)
      }
      
      return formatted
    }
  }
  
  // Fallback to full data
  return JSON.stringify(data, null, 2)
}

function PlaygroundContent() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [selectedAgent, setSelectedAgent] = useState(searchParams.get('agent') || 'security-scanner')
  const [mode, setMode] = useState<'live' | 'mock'>('live')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    const scenario = mockScenarios[selectedAgent as keyof typeof mockScenarios]
    if (scenario) {
      setInput(scenario.input)
      setOutput('')
      setExecutionStatus('idle')
      setExecutionTime(null)
    }
  }, [selectedAgent])

  const handleExecute = async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter a task for the agent to execute",
        variant: "destructive"
      })
      return
    }

    setIsExecuting(true)
    setExecutionStatus('idle')
    setOutput('')
    
    const startTime = Date.now()

    try {
      if (mode === 'mock') {
        // Simulate execution delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
        
        const mockResponse = `Task executed successfully!\n\nYour request: "${input}"\n\nThe ${mockAgents.find(a => a.id === selectedAgent)?.name} has processed your request. This is a mock response for demonstration purposes.\n\nIn live mode, you would receive a detailed analysis powered by Claude AI.\n\nExecution completed in ${((Date.now() - startTime) / 1000).toFixed(2)}s`
        
        setOutput(mockResponse)
        setExecutionStatus('success')
        setExecutionTime(Date.now() - startTime)
        
        toast({
          title: "Execution Successful",
          description: `Agent executed in ${((Date.now() - startTime) / 1000).toFixed(2)}s`,
        })
      } else {
        // Live mode - call actual API with plain text input
        const data = await apiService.executeAgent(
          selectedAgent,
          input, // Pass the plain text directly
          'crewai'
        )
        
        // Format the response for human readability
        const formattedOutput = formatResponse(data)
        setOutput(formattedOutput)
        setExecutionStatus('success')
        setExecutionTime(Date.now() - startTime)
        
        toast({
          title: "Execution Successful",
          description: `Agent executed in ${((Date.now() - startTime) / 1000).toFixed(2)}s`,
        })
      }
    } catch (error) {
      setExecutionStatus('error')
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setOutput(`❌ Execution Failed\n\n${errorMessage}\n\nPlease check:\n• Your API connection\n• Agent is available\n• You have sufficient credits\n• Input is valid`)
      
      toast({
        title: "Execution Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const scenario = mockScenarios[selectedAgent as keyof typeof mockScenarios]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Agent Playground</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test agents in real-time with natural language - just type what you need in plain English!
          </p>
        </div>

        {/* Mode Toggle */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="mode-toggle" className="text-base font-semibold">
                Execution Mode
              </Label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {mode === 'mock' ? 'Using simulated responses for demonstration' : 'Connected to live Claude AI'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={mode === 'mock' ? 'font-semibold' : 'text-gray-500'}>Mock</span>
              <Switch
                id="mode-toggle"
                checked={mode === 'live'}
                onCheckedChange={(checked) => setMode(checked ? 'live' : 'mock')}
              />
              <span className={mode === 'live' ? 'font-semibold text-green-600' : 'text-gray-500'}>Live</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="agent-select">Select Agent</Label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger id="agent-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {scenario && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Example Scenario
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      {scenario.title}
                    </p>
                  </div>
                )}

                <Button 
                  onClick={handleExecute} 
                  disabled={isExecuting || !input.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Execute Agent
                    </>
                  )}
                </Button>

                {executionStatus !== 'idle' && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <div className="flex items-center gap-2">
                        {executionStatus === 'success' ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-semibold">Success</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600 font-semibold">Failed</span>
                          </>
                        )}
                      </div>
                    </div>
                    {executionTime && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Execution Time</span>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="font-semibold">{(executionTime / 1000).toFixed(2)}s</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Mode</span>
                      <Badge variant={mode === 'live' ? 'default' : 'secondary'}>
                        {mode === 'live' ? '🟢 Live AI' : 'Mock'}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Input/Output Panel */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Tabs defaultValue="input">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="input">Your Task</TabsTrigger>
                  <TabsTrigger value="output">Agent Response</TabsTrigger>
                </TabsList>
                
                <TabsContent value="input" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="input-text">What would you like the agent to do? (Plain English)</Label>
                    <Textarea
                      id="input-text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={scenario?.placeholderText || "Type your request in plain English..."}
                      className="text-sm min-h-[400px]"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 Tip: Just describe what you need in normal English - no JSON or technical format required!
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="output" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="output-text">Agent Response</Label>
                    <Textarea
                      id="output-text"
                      value={output}
                      readOnly
                      placeholder="The agent's response will appear here in plain English..."
                      className="text-sm min-h-[400px] bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Info Banner */}
        <Card className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Natural Language Interface</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Our playground uses natural language processing - just type what you need in plain English! 
                In Live mode, real Claude AI powers your requests with intelligent responses.
                Try your first 3 queries free, then upgrade for unlimited access.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PlaygroundContent />
    </Suspense>
  )
}
