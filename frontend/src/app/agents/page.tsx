'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Bot, 
  Shield, 
  FileText, 
  Zap, 
  AlertTriangle, 
  Database,
  GitBranch,
  BarChart,
  Ticket,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { apiService, Agent } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const agents = [
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: 'Automated security vulnerability scanning and compliance checking with OWASP Top 10 coverage.',
    icon: Shield,
    category: 'Security',
    executions: 45230,
    avgTime: '2.3s',
    successRate: 99.8,
    tier: 'All Tiers',
    features: ['OWASP Top 10', 'CVE Detection', 'Compliance Reports', 'Real-time Alerts']
  },
  {
    id: 'incident-responder',
    name: 'Incident Responder',
    description: 'Intelligent incident triage, root cause analysis, and automated remediation for production issues.',
    icon: AlertTriangle,
    category: 'Operations',
    executions: 38920,
    avgTime: '1.8s',
    successRate: 99.5,
    tier: 'Gold+',
    features: ['Auto-triage', 'Root Cause Analysis', 'Remediation', 'Runbook Execution']
  },
  {
    id: 'ticket-resolver',
    name: 'Ticket Resolver',
    description: 'Automated ticket classification, prioritization, and resolution with ML-powered insights.',
    icon: Ticket,
    category: 'Support',
    executions: 67540,
    avgTime: '1.2s',
    successRate: 98.9,
    tier: 'All Tiers',
    features: ['Auto-classification', 'Priority Scoring', 'Smart Routing', 'Resolution Suggestions']
  },
  {
    id: 'data-processor',
    name: 'Data Processor',
    description: 'ETL pipeline automation with data validation, transformation, and quality monitoring.',
    icon: Database,
    category: 'Data',
    executions: 52100,
    avgTime: '3.5s',
    successRate: 99.2,
    tier: 'Silver+',
    features: ['ETL Automation', 'Data Validation', 'Quality Checks', 'Schema Migration']
  },
  {
    id: 'deployment-agent',
    name: 'Deployment Agent',
    description: 'CI/CD orchestration with blue-green deployments, rollback automation, and health checks.',
    icon: GitBranch,
    category: 'DevOps',
    executions: 29870,
    avgTime: '4.2s',
    successRate: 99.9,
    tier: 'Gold+',
    features: ['Blue-Green Deploy', 'Auto-rollback', 'Health Checks', 'Canary Releases']
  },
  {
    id: 'report-generator',
    name: 'Report Generator',
    description: 'Automated report generation with data aggregation, visualization, and distribution.',
    icon: FileText,
    category: 'Analytics',
    executions: 41230,
    avgTime: '2.1s',
    successRate: 99.6,
    tier: 'All Tiers',
    features: ['Multi-format Export', 'Scheduled Reports', 'Custom Templates', 'Email Distribution']
  },
  {
    id: 'audit-agent',
    name: 'Audit Agent',
    description: 'Compliance auditing and regulatory reporting with SOC 2, ISO 27001, and GDPR support.',
    icon: CheckCircle,
    category: 'Compliance',
    executions: 18920,
    avgTime: '3.8s',
    successRate: 99.7,
    tier: 'Platinum',
    features: ['SOC 2 Reports', 'ISO 27001', 'GDPR Compliance', 'Audit Trails']
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'RAG-powered knowledge management with semantic search and intelligent Q&A.',
    icon: Bot,
    category: 'AI',
    executions: 89340,
    avgTime: '0.9s',
    successRate: 98.5,
    tier: 'All Tiers',
    features: ['Semantic Search', 'Vector DB', 'Multi-modal', 'Context-aware']
  },
  {
    id: 'workflow-orchestrator',
    name: 'Workflow Orchestrator',
    description: 'Complex workflow automation with parallel execution, error handling, and state management.',
    icon: Zap,
    category: 'Automation',
    executions: 34560,
    avgTime: '2.7s',
    successRate: 99.4,
    tier: 'Silver+',
    features: ['Parallel Execution', 'Error Recovery', 'State Management', 'Visual Builder']
  },
  {
    id: 'analytics-engine',
    name: 'Analytics Engine',
    description: 'Real-time analytics with predictive insights, anomaly detection, and trend analysis.',
    icon: BarChart,
    category: 'Analytics',
    executions: 56780,
    avgTime: '1.5s',
    successRate: 99.1,
    tier: 'Gold+',
    features: ['Predictive Analytics', 'Anomaly Detection', 'Trend Analysis', 'Custom Dashboards']
  },
]

// Mock agents as fallback
const mockAgents = agents

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const response = await apiService.getAgents()
        setAgents(response.packages)
      } catch (error) {
        console.error('Failed to load agents:', error)
        toast({
          title: "Failed to load agents",
          description: "Using mock data instead",
          variant: "destructive",
        })
        // Fallback to mock data
        setAgents(mockAgents)
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [toast])

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...Array.from(new Set(agents.map(agent => agent.category)))]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Agent Marketplace</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Browse and deploy production-ready AI agents. All agents are battle-tested and enterprise-grade.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading agents...</p>
          </div>
        )}

        {/* Agent Grid */}
        {!loading && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAgents.map((agent) => {
            const Icon = agent.icon
            return (
              <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                      <Badge variant="outline" className="mt-1">{agent.category}</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {agent.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Executions</span>
                    <span className="font-semibold">{agent.executions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Avg Time</span>
                    <span className="font-semibold">{agent.avgTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                    <span className="font-semibold text-green-600">{agent.successRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Required Tier</span>
                    <Badge variant="secondary">{agent.tier}</Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">KEY FEATURES</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {agent.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{agent.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/playground?agent=${agent.id}`}>
                      Try Now
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/agents/${agent.id}`}>
                      Details
                    </Link>
                  </Button>
                </div>
              </Card>
            )
          })}
          </div>
        )}

        {!loading && filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No agents found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
