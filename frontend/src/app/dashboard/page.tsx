'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Zap, ArrowRight, Sparkles, Play, Loader2, Bot } from 'lucide-react'
import { useAgents } from '@/hooks/useAgents'
import { useToast } from '@/hooks/use-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bizbot-api.onrender.com'

export default function DashboardPage() {
  const { packages: agents, loading: loadingAgents } = useAgents()
  const { toast } = useToast()
  const [selectedAgent, setSelectedAgent] = useState<string>('')
  const [task, setTask] = useState('')
  const [executing, setExecuting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleExecute = async () => {
    if (!selectedAgent || !task) {
      toast({
        title: "Missing Information",
        description: "Please select an agent and enter a task",
        variant: "destructive",
      })
      return
    }

    setExecuting(true)
    setResult(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/packages/${selectedAgent}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_DEMO_API_KEY || 'demo-key-12345'
        },
        body: JSON.stringify({
          package_id: selectedAgent,
          task: task,
          engine_type: 'crewai'
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to execute agent: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
      
      toast({
        title: "Success!",
        description: "Agent executed successfully",
      })
    } catch (error) {
      console.error('Execution error:', error)
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "Failed to execute agent",
        variant: "destructive",
      })
    } finally {
      setExecuting(false)
    }
  }

  const selectedAgentData = agents.find(a => a.id === selectedAgent)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Execute agents directly from your dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Execution Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Selector */}
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Select Agent</h2>
              
              {loadingAgents ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400 mt-2">Loading agents...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedAgent === agent.id
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold dark:text-white">{agent.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {agent.credit_cost || 3} credits
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {agent.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Task Input */}
            {selectedAgent && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  Execute {selectedAgentData?.name}
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Task Description
                    </label>
                    <textarea
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="Describe what you want the agent to do..."
                      className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <Button
                    onClick={handleExecute}
                    disabled={executing || !task}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    {executing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Execute Agent
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {/* Results */}
            {result && (
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center dark:text-white">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  Result
                </h2>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>

                {result.execution_id && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Execution ID: {result.execution_id}
                  </p>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 dark:text-white">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Available Agents</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{agents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Credits</span>
                  <span className="font-bold text-green-600 dark:text-green-400">Check Balance</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 dark:text-white">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/agents">
                    <Bot className="mr-2 h-4 w-4" />
                    Browse All Agents
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/pricing">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get More Credits
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/support">
                    <Zap className="mr-2 h-4 w-4" />
                    Get Support
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Free Trial Banner */}
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
              <h3 className="font-bold mb-2">Try Free Agent</h3>
              <p className="text-sm text-blue-100 mb-4">
                Test the Ticket Resolver with 3 free queries
              </p>
              <Button 
                size="sm" 
                className="w-full bg-white !text-blue-600 hover:bg-gray-100"
                asChild
              >
                <Link href="/agents/ticket-resolver" className="!text-blue-600">
                  Try Now →
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
