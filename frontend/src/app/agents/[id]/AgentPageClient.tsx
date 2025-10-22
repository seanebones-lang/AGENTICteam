'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  Star,
  Lock,
  CreditCard,
  Sparkles,
  Gift,
  BookOpen
} from 'lucide-react'
import { useAgents } from '@/hooks/useAgents'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

// Free trial configuration
const FREE_TRIAL_AGENT = 'ticket-resolver'
const FREE_TRIAL_QUERIES = 3
const MINIMUM_PURCHASE = 20 // $20 minimum

// Paywall Modal Component
function PaywallModal({ isOpen, onClose, queriesUsed }: { isOpen: boolean, onClose: () => void, queriesUsed: number }) {
  const router = useRouter()
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 relative">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Free Trial Complete!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You've used all {queriesUsed} free queries. Ready to unlock the full platform?
          </p>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-lg text-gray-900 dark:text-white">Get Started for ${MINIMUM_PURCHASE}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              500 credits • Access all agents • Credits never expire
            </p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">10 Powerful AI Agents</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Security, support, analytics, and more</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Credits Never Expire</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use them whenever you need</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">75% Cost Savings</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">vs. hiring full-time engineers</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => router.push('/signup')}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Sign Up & Purchase Credits
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => router.push('/pricing')}
          >
            View All Pricing Options
          </Button>
          
          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2"
          >
            Maybe later
          </button>
        </div>
      </Card>
    </div>
  )
}

export default function AgentPageClient() {
  const params = useParams()
  const router = useRouter()
  const agentId = params?.id as string
  const { packages, loading, error } = useAgents()
  const { toast } = useToast()
  
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<any>(null)
  const [task, setTask] = useState('')
  const [freeQueriesUsed, setFreeQueriesUsed] = useState(0)
  const [showPaywall, setShowPaywall] = useState(false)
  
  // Find the specific agent from packages
  const agent = packages.find(pkg => pkg.id === agentId)
  
  // Check if this is the free trial agent
  const isFreeTrialAgent = agentId === FREE_TRIAL_AGENT
  const hasFreeTrial = isFreeTrialAgent && freeQueriesUsed < FREE_TRIAL_QUERIES
  const freeQueriesRemaining = Math.max(0, FREE_TRIAL_QUERIES - freeQueriesUsed)
  
  // Load free query count from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('free_queries_used')
      if (stored) {
        setFreeQueriesUsed(parseInt(stored, 10))
      }
    }
  }, [])
  
  // Set pre-filled example for Ticket Resolver
  useEffect(() => {
    if (agentId === 'ticket-resolver' && !task) {
      setTask('Customer says: "I cannot reset my password. When I click the reset link, I get error 403 Forbidden."')
    }
  }, [agentId, task])

  const handleExecute = async () => {
    if (!task.trim()) return
    
    // Check if user needs to pay
    if (!hasFreeTrial && isFreeTrialAgent) {
      setShowPaywall(true)
      return
    }
    
    setIsExecuting(true)
    setExecutionResult(null)
    
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bizbot-api.onrender.com'
      const apiKey = process.env.NEXT_PUBLIC_DEMO_API_KEY || localStorage.getItem('api_key')
      
      const response = await fetch(`${API_BASE_URL}/api/v1/packages/${agentId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'X-API-Key': apiKey }),
        },
        body: JSON.stringify({
          package_id: agentId,
          task: task,
          engine_type: 'crewai'
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || `API Error: ${response.status}`)
      }
      
      const result = await response.json()
      setExecutionResult(result)
      
      // Increment free query counter if applicable
      if (hasFreeTrial) {
        const newCount = freeQueriesUsed + 1
        setFreeQueriesUsed(newCount)
        localStorage.setItem('free_queries_used', newCount.toString())
        
        // Show paywall if this was the last free query
        if (newCount >= FREE_TRIAL_QUERIES) {
          setTimeout(() => setShowPaywall(true), 2000)
        }
        
        toast({
          title: "Success!",
          description: `Free query ${newCount}/${FREE_TRIAL_QUERIES} used. ${FREE_TRIAL_QUERIES - newCount} remaining.`,
        })
      } else {
        toast({
          title: "Agent Executed Successfully",
          description: `${agent?.name} completed your task.`,
        })
      }
      
    } catch (error) {
      console.error('Execution failed:', error)
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "Failed to execute agent",
        variant: "destructive",
      })
    } finally {
      setIsExecuting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading agent details...</p>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Agent Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested agent could not be found.</p>
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
  
  // Get credit cost from agent data
  const creditCost = (agent as any).credit_cost || 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)}
        queriesUsed={freeQueriesUsed}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* How to Use Guide Link - Prominent (ALL AGENTS) */}
        <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white">New to this agent?</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Learn how to use it effectively and what it can (and can't) do
                </p>
              </div>
            </div>
            <Link href={`/agents/${agentId}/how-to-use`}>
              <Button variant="outline" className="border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                <BookOpen className="h-4 w-4 mr-2" />
                How to Use Guide
              </Button>
            </Link>
          </div>
        </Card>
        
        {/* Free Trial Banner with Progress */}
        {isFreeTrialAgent && hasFreeTrial && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">🎁 Free Trial Active!</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No credit card required • Instant results
                  </p>
                </div>
              </div>
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                  View Pricing
                </Button>
              </Link>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Query {freeQueriesUsed + 1} of {FREE_TRIAL_QUERIES}
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-medium">
                  {freeQueriesRemaining} {freeQueriesRemaining === 1 ? 'query' : 'queries'} remaining
                </span>
              </div>
              
              <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((freeQueriesUsed) / FREE_TRIAL_QUERIES) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mt-3">
                {[...Array(FREE_TRIAL_QUERIES)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i < freeQueriesUsed 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 scale-110' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
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
              
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <Badge variant="secondary" className="px-3 py-1">
                  {agent.category}
                </Badge>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="font-medium">{creditCost} credits</span>
                  <span className="ml-1">per execution</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-1" />
                  <span>All Tiers</span>
                </div>
                {isFreeTrialAgent && (
                  <Badge className="bg-green-500 text-white px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Free Trial Available
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">(4.9/5 from 1,234 executions)</span>
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
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Agent Overview</h3>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
                    {agentId === 'ticket-resolver' && (
                      <>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2 flex items-center">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Pre-filled Example (Try Now!)
                          </h4>
                          <code className="text-sm text-green-800 bg-white p-2 rounded block">
                            Customer says: "I cannot reset my password. When I click the reset link, I get error 403 Forbidden."
                          </code>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Another Example</h4>
                          <code className="text-sm text-gray-600 bg-white p-2 rounded block">
                            User reports: "The checkout page is showing a blank screen after I add items to cart."
                          </code>
                        </div>
                      </>
                    )}
                    {agentId !== 'ticket-resolver' && (
                      <>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Basic Usage</h4>
                          <code className="text-sm text-gray-600 bg-white p-2 rounded block">
                            Execute {agent.name.toLowerCase()} with your specific task requirements
                          </code>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Advanced Usage</h4>
                          <code className="text-sm text-gray-600 bg-white p-2 rounded block">
                            Execute with custom parameters and detailed analysis options
                          </code>
                        </div>
                      </>
                    )}
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
                        <span className="text-2xl font-bold text-gray-900">{creditCost} credits</span>
                        <p className="text-sm text-gray-600">${(creditCost * 0.04).toFixed(2)} per execution</p>
                      </div>
                    </div>
                    
                    {isFreeTrialAgent && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2 flex items-center">
                          <Sparkles className="h-5 w-5 mr-2" />
                          Free Trial Available
                        </h4>
                        <p className="text-sm text-green-800">
                          Try this agent {FREE_TRIAL_QUERIES} times for free! No credit card required.
                        </p>
                      </div>
                    )}
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Credit Packages</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• $20 = 500 credits (${MINIMUM_PURCHASE} minimum to start)</li>
                        <li>• $50 = 1,500 credits</li>
                        <li>• $100 = 3,500 credits</li>
                        <li>• $250 = 10,000 credits</li>
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
                  ) : hasFreeTrial ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Try Free ({freeQueriesRemaining} left)
                    </>
                  ) : !isFreeTrialAgent ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Execute Agent
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Purchase Credits to Continue
                    </>
                  )}
                </Button>
                
                {isFreeTrialAgent && !hasFreeTrial && (
                  <p className="text-sm text-center text-gray-600">
                    Free trial complete. <Link href="/pricing" className="text-blue-600 hover:underline">View pricing</Link>
                  </p>
                )}
              </div>
              
              {executionResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Execution Result</h4>
                  <div className="text-sm text-green-800 space-y-2">
                    <p><strong>Status:</strong> {executionResult.success ? 'Success' : 'Failed'}</p>
                    <p><strong>Duration:</strong> {executionResult.duration_ms}ms</p>
                    {executionResult.result && (
                      <details className="mt-2">
                        <summary className="cursor-pointer font-medium">View Full Result</summary>
                        <pre className="mt-2 text-xs bg-white p-2 rounded overflow-x-auto">
                          {JSON.stringify(executionResult.result, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Agent Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Agent Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Credit Cost</span>
                  <span className="font-semibold text-blue-600">{creditCost} credits</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Dollar Cost</span>
                  <span className="font-semibold">${(creditCost * 0.04).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">99.2%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Response Time</span>
                  <span className="font-semibold">2.3s</span>
                </div>
              </div>
            </Card>

            {/* CTA Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold mb-2">Ready for More?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Access all 10 agents with our credit packages starting at ${MINIMUM_PURCHASE}.
              </p>
              <Link href="/pricing">
                <Button className="w-full" variant="default">
                  View Pricing
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

