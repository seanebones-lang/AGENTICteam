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
  CheckCircle,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { apiService, Agent } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

const mockAgents: Agent[] = [
  {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: 'Automated security vulnerability scanning and compliance checking with OWASP Top 10 coverage.',
    category: 'Security',
    price: 99.99,
    status: 'active',
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
    category: 'Operations',
    price: 199.99,
    status: 'active',
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
    category: 'Support',
    price: 89.99,
    status: 'active',
    executions: 67540,
    avgTime: '1.2s',
    successRate: 98.9,
    tier: 'All Tiers',
    features: ['Auto-classification', 'Priority Scoring', 'Smart Routing', 'Resolution Suggestions']
  },
  {
    id: 'data-processor',
    name: 'Data Processor',
    description: 'Advanced data extraction, transformation, and loading (ETL) with AI-driven insights.',
    category: 'Data',
    price: 149.99,
    status: 'active',
    executions: 21300,
    avgTime: '3.1s',
    successRate: 99.1,
    tier: 'Silver+',
    features: ['Data Extraction', 'Data Transformation', 'Data Loading', 'AI Insights']
  },
  {
    id: 'deployment-agent',
    name: 'Deployment Agent',
    description: 'Automated, secure, and compliant application deployment across cloud environments.',
    category: 'DevOps',
    price: 299.99,
    status: 'active',
    executions: 15600,
    avgTime: '4.5s',
    successRate: 99.7,
    tier: 'Gold+',
    features: ['CI/CD Integration', 'Multi-cloud Deployment', 'Rollback', 'Compliance Checks']
  },
  {
    id: 'report-generator',
    name: 'Report Generator',
    description: 'Automated generation of business intelligence reports and dashboards from various data sources.',
    category: 'Analytics',
    price: 129.99,
    status: 'active',
    executions: 31200,
    avgTime: '2.0s',
    successRate: 99.3,
    tier: 'All Tiers',
    features: ['Custom Reports', 'Scheduled Reports', 'Data Visualization', 'PDF Export']
  },
  {
    id: 'audit-agent',
    name: 'Audit Agent',
    description: 'Continuous auditing and monitoring for regulatory compliance and internal policy adherence.',
    category: 'Compliance',
    price: 179.99,
    status: 'active',
    executions: 18700,
    avgTime: '2.8s',
    successRate: 99.6,
    tier: 'Enterprise',
    features: ['Regulatory Compliance', 'Policy Enforcement', 'Audit Trails', 'Alerting']
  },
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'AI-powered knowledge retrieval and content generation for customer support and internal teams.',
    category: 'AI',
    price: 159.99,
    status: 'active',
    executions: 50100,
    avgTime: '1.5s',
    successRate: 98.7,
    tier: 'All Tiers',
    features: ['Smart Search', 'Content Generation', 'FAQ Automation', 'Multi-language Support']
  },
  {
    id: 'workflow-orchestrator',
    name: 'Workflow Orchestrator',
    description: 'Design, automate, and manage complex business workflows with drag-and-drop simplicity.',
    category: 'Automation',
    price: 249.99,
    status: 'active',
    executions: 25400,
    avgTime: '3.5s',
    successRate: 99.2,
    tier: 'Silver+',
    features: ['Visual Workflow Builder', 'Task Automation', 'Integration Hub', 'Monitoring']
  },
  {
    id: 'analytics-engine',
    name: 'Analytics Engine',
    description: 'Real-time data analytics and predictive modeling for business insights.',
    category: 'Analytics',
    price: 219.99,
    status: 'active',
    executions: 12300,
    avgTime: '4.0s',
    successRate: 99.0,
    tier: 'Gold+',
    features: ['Predictive Analytics', 'Anomaly Detection', 'Trend Analysis', 'Custom Dashboards']
  },
]

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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Agent Marketplace</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover and deploy powerful AI agents for every business need.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search agents..."
              className="pl-9 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-grow flex flex-wrap justify-center sm:justify-end gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
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
            return (
              <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      {/* Render icon dynamically based on agent.category or a mapping */}
                      {agent.category === 'Security' && <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {agent.category === 'Operations' && <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {agent.category === 'Support' && <Ticket className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {agent.category === 'Data' && <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {agent.category === 'DevOps' && <GitBranch className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {agent.category === 'Analytics' && <BarChart className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {agent.category === 'Compliance' && <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {agent.category === 'AI' && <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {agent.category === 'Automation' && <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                      {/* Default icon if category not matched */}
                      {!['Security', 'Operations', 'Support', 'Data', 'DevOps', 'Analytics', 'Compliance', 'AI', 'Automation'].includes(agent.category) && <Bot className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                      <Badge variant="outline" className="mt-1">{agent.category}</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {agent.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    <span>{agent.executions?.toLocaleString() || 'N/A'} Executions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Avg. {agent.avgTime || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>{agent.successRate || 'N/A'}% Success</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/playground?agent=${agent.id}`}>
                      Activate Now
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