'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Zap, ArrowRight, Sparkles, Play, Loader2, Bot, Save, Star, X, Plus, Maximize2, Minimize2 } from 'lucide-react'
import { useAgents } from '@/hooks/useAgents'
import { useToast } from '@/hooks/use-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bizbot-api.onrender.com'

interface AgentTab {
  id: string
  agentId: string
  agentName: string
  task: string
  result: any | null
  executing: boolean
  timestamp: number
}

export default function ConsolePage() {
  const { packages: agents, loading: loadingAgents } = useAgents()
  const { toast } = useToast()
  
  const [tabs, setTabs] = useState<AgentTab[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Create initial tab
  useEffect(() => {
    if (tabs.length === 0) {
      createNewTab()
    }
  }, [])

  const createNewTab = (agentId?: string) => {
    const newTab: AgentTab = {
      id: Date.now().toString(),
      agentId: agentId || '',
      agentName: agentId ? agents.find(a => a.id === agentId)?.name || '' : '',
      task: '',
      result: null,
      executing: false,
      timestamp: Date.now()
    }
    setTabs(prev => [...prev, newTab])
    setActiveTabId(newTab.id)
  }

  const closeTab = (tabId: string) => {
    const tabIndex = tabs.findIndex(t => t.id === tabId)
    const newTabs = tabs.filter(t => t.id !== tabId)
    
    if (newTabs.length === 0) {
      createNewTab()
      return
    }
    
    setTabs(newTabs)
    
    if (activeTabId === tabId) {
      const newActiveIndex = Math.max(0, tabIndex - 1)
      setActiveTabId(newTabs[newActiveIndex].id)
    }
  }

  const updateTab = (tabId: string, updates: Partial<AgentTab>) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, ...updates } : tab
    ))
  }

  const handleSavePrompt = (tab: AgentTab) => {
    if (!tab.agentId || !tab.task) {
      toast({
        title: "Nothing to Save",
        description: "Please select an agent and enter a task first",
        variant: "destructive",
      })
      return
    }

    const savedPrompts = JSON.parse(localStorage.getItem('saved_prompts') || '[]')
    
    const newPrompt = {
      id: Date.now().toString(),
      agent_id: tab.agentId,
      agent_name: tab.agentName,
      prompt: tab.task,
      created_at: new Date().toISOString()
    }
    
    savedPrompts.push(newPrompt)
    localStorage.setItem('saved_prompts', JSON.stringify(savedPrompts))
    
    toast({
      title: "Prompt Saved!",
      description: "View it in your profile page",
    })
  }

  const handleExecute = async (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId)
    if (!tab || !tab.agentId || !tab.task) {
      toast({
        title: "Missing Information",
        description: "Please select an agent and enter a task",
        variant: "destructive",
      })
      return
    }

    updateTab(tabId, { executing: true, result: null })

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/packages/${tab.agentId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.NEXT_PUBLIC_DEMO_API_KEY || 'demo-key-12345'
        },
        body: JSON.stringify({
          package_id: tab.agentId,
          task: tab.task,
          engine_type: 'crewai'
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to execute agent: ${response.statusText}`)
      }

      const data = await response.json()
      updateTab(tabId, { result: data, executing: false })
      
      // Save to execution history
      const history = JSON.parse(localStorage.getItem('execution_history') || '[]')
      history.unshift({
        id: Date.now().toString(),
        agent_name: tab.agentName,
        status: 'success',
        duration: data.duration_ms ? data.duration_ms / 1000 : 2.5,
        cost: data.cost_usd || 0.0025,
        timestamp: new Date().toISOString()
      })
      localStorage.setItem('execution_history', JSON.stringify(history.slice(0, 50)))
      
      toast({
        title: "Success!",
        description: "Agent executed successfully",
      })
    } catch (error) {
      console.error('Execution error:', error)
      updateTab(tabId, { 
        executing: false,
        result: { error: error instanceof Error ? error.message : "Failed to execute agent" }
      })
      
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "Failed to execute agent",
        variant: "destructive",
      })
    }
  }

  const activeTab = tabs.find(t => t.id === activeTabId)
  const selectedAgentData = activeTab ? agents.find(a => a.id === activeTab.agentId) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className={`mx-auto px-6 py-12 lg:px-8 ${isFullscreen ? 'max-w-full' : 'max-w-7xl'}`}>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 dark:text-white">Agent Console</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Control and execute multiple AI agents simultaneously
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button asChild>
              <Link href="/dashboard">
                <Zap className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg border-b-2 transition-all cursor-pointer group ${
                  activeTabId === tab.id
                    ? 'bg-white dark:bg-gray-800 border-blue-600 shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-900 border-transparent hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                <Bot className={`h-4 w-4 ${tab.executing ? 'animate-pulse text-blue-600' : ''}`} />
                <span className="text-sm font-medium dark:text-white whitespace-nowrap">
                  {tab.agentName || 'New Agent'}
                </span>
                {tab.executing && (
                  <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    closeTab(tab.id)
                  }}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-300 dark:hover:bg-gray-700 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => createNewTab()}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Tab
            </Button>
          </div>
        </div>

        {/* Active Tab Content */}
        {activeTab && (
          <div className={`grid gap-8 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'}`}>
            {/* Main Execution Panel */}
            <div className={isFullscreen ? 'col-span-1' : 'lg:col-span-2'}>
              {/* Agent Selection */}
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 dark:text-white">Select Agent</h2>
                
                {loadingAgents ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Loading agents...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        onClick={() => updateTab(activeTab.id, { 
                          agentId: agent.id, 
                          agentName: agent.name 
                        })}
                        className={`text-left p-4 rounded-lg border-2 transition-all ${
                          activeTab.agentId === agent.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold dark:text-white">{agent.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            3 credits
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
              {activeTab.agentId && (
                <Card className="p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">
                    Execute {selectedAgentData?.name}
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                        Task Description
                      </label>
                      <textarea
                        value={activeTab.task}
                        onChange={(e) => updateTab(activeTab.id, { task: e.target.value })}
                        placeholder="Describe what you want the agent to do..."
                        className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={activeTab.executing}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleSavePrompt(activeTab)}
                        disabled={!activeTab.task || activeTab.executing}
                        variant="outline"
                        size="lg"
                        className="flex-1"
                      >
                        <Save className="mr-2 h-5 w-5" />
                        Save Prompt
                      </Button>
                      <Button
                        onClick={() => handleExecute(activeTab.id)}
                        disabled={activeTab.executing || !activeTab.task}
                        className="flex-[2] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                      >
                        {activeTab.executing ? (
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
                  </div>
                </Card>
              )}

              {/* Results */}
              {activeTab.result && (
                <Card className="p-6">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">Results</h2>
                  
                  {activeTab.result.error ? (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400">{activeTab.result.error}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <span className="font-semibold text-green-600 dark:text-green-400">Success</span>
                        </div>
                        <div className="prose dark:prose-invert max-w-none">
                          {typeof activeTab.result.result === 'string' ? (
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {activeTab.result.result}
                            </p>
                          ) : (
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                              {JSON.stringify(activeTab.result.result, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                      
                      {(activeTab.result.duration_ms || activeTab.result.cost_usd) && (
                        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {activeTab.result.duration_ms && (
                            <span>Duration: {(activeTab.result.duration_ms / 1000).toFixed(2)}s</span>
                          )}
                          {activeTab.result.cost_usd && (
                            <span>Cost: ${activeTab.result.cost_usd.toFixed(4)}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* Sidebar - Hidden in fullscreen */}
            {!isFullscreen && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 dark:text-white">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Open Tabs</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{tabs.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Executing</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {tabs.filter(t => t.executing).length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Completed</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {tabs.filter(t => t.result && !t.result.error).length}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 dark:text-white">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/dashboard">
                        <Star className="mr-2 h-4 w-4" />
                        View Dashboard
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href="/profile">
                        <Star className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </Button>
                    
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
                  <Button size="sm" className="w-full bg-white !text-blue-600 hover:bg-gray-100" asChild>
                    <Link href="/agents/ticket-resolver">Try Now</Link>
                  </Button>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
