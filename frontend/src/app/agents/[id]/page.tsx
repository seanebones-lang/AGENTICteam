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
  Users,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { AddToDashboardButton } from '@/components/AddToDashboardButton'
import { ViewPricingButton } from '@/components/ViewPricingButton'

const agentDetails = {
  'security-scanner': {
    id: 'security-scanner',
    name: 'Security Scanner',
    description: 'Automated security vulnerability scanning and compliance checking with OWASP Top 10 coverage.',
    icon: Shield,
    category: 'Security',
    executions: 45230,
    avgTime: '2.3s',
    successRate: 99.8,
    tier: 'All Tiers',
    features: ['OWASP Top 10', 'CVE Detection', 'Compliance Reports', 'Real-time Alerts'],
    pricing: {
      perTask: 0.50,
      monthly: 99.99
    },
    documentation: {
      overview: 'The Security Scanner Agent provides comprehensive security vulnerability scanning for web applications, APIs, and infrastructure components.',
      capabilities: [
        'Automated vulnerability detection using OWASP Top 10 guidelines',
        'CVE database integration for known vulnerability identification',
        'Compliance reporting for SOC 2, ISO 27001, and PCI DSS',
        'Real-time alerting for critical security issues',
        'Integration with CI/CD pipelines for continuous security',
        'Custom security policy enforcement'
      ],
      useCases: [
        'Pre-deployment security scanning',
        'Regular security audits',
        'Compliance reporting',
        'Vulnerability management',
        'Security policy enforcement'
      ],
      api: {
        endpoint: '/api/v1/agents/security-scanner/execute',
        method: 'POST',
        input: {
          target_url: 'string',
          scan_type: 'string',
          include_owasp_top_10: 'boolean',
          compliance_frameworks: 'array'
        },
        output: {
          vulnerabilities_found: 'number',
          critical: 'number',
          high: 'number',
          medium: 'number',
          low: 'number',
          scan_duration: 'string',
          compliance_score: 'number'
        }
      }
    }
  },
  'incident-responder': {
    id: 'incident-responder',
    name: 'Incident Responder',
    description: 'Intelligent incident triage, root cause analysis, and automated remediation for production issues.',
    icon: AlertTriangle,
    category: 'Operations',
    executions: 38920,
    avgTime: '1.8s',
    successRate: 99.5,
    tier: 'Gold+',
    features: ['Auto-triage', 'Root Cause Analysis', 'Remediation', 'Runbook Execution'],
    pricing: {
      perTask: 2.00,
      monthly: 199.99
    },
    documentation: {
      overview: 'The Incident Responder Agent automates incident management workflows, providing intelligent triage, root cause analysis, and automated remediation.',
      capabilities: [
        'Automated incident triage and classification',
        'Root cause analysis using machine learning',
        'Automated remediation based on runbooks',
        'Integration with monitoring and alerting systems',
        'Incident timeline and correlation analysis',
        'Post-incident reporting and learning'
      ],
      useCases: [
        'Production incident response',
        'Automated troubleshooting',
        'Incident correlation and analysis',
        'Runbook automation',
        'Post-incident reporting'
      ],
      api: {
        endpoint: '/api/v1/agents/incident-responder/execute',
        method: 'POST',
        input: {
          incident_id: 'string',
          severity: 'string',
          description: 'string',
          affected_systems: 'array',
          monitoring_data: 'object'
        },
        output: {
          triage_result: 'object',
          root_cause: 'string',
          remediation_actions: 'array',
          estimated_resolution_time: 'string',
          confidence_score: 'number'
        }
      }
    }
  },
  'ticket-resolver': {
    id: 'ticket-resolver',
    name: 'Ticket Resolver',
    description: 'Automated ticket classification, prioritization, and resolution with ML-powered insights.',
    icon: Ticket,
    category: 'Support',
    executions: 67540,
    avgTime: '1.2s',
    successRate: 98.9,
    tier: 'All Tiers',
    features: ['Auto-classification', 'Priority Scoring', 'Smart Routing', 'Resolution Suggestions'],
    pricing: {
      perTask: 0.25,
      monthly: 89.99
    },
    documentation: {
      overview: 'The Ticket Resolver Agent automates support ticket management with intelligent classification, prioritization, and resolution suggestions.',
      capabilities: [
        'Automatic ticket classification and categorization',
        'Priority scoring based on content and context',
        'Smart routing to appropriate teams',
        'Resolution suggestions and knowledge base integration',
        'Sentiment analysis and customer satisfaction prediction',
        'Escalation management and SLA tracking'
      ],
      useCases: [
        'Customer support automation',
        'Ticket triage and routing',
        'Knowledge base integration',
        'SLA management',
        'Customer satisfaction optimization'
      ],
      api: {
        endpoint: '/api/v1/agents/ticket-resolver/execute',
        method: 'POST',
        input: {
          ticket_id: 'string',
          subject: 'string',
          description: 'string',
          customer_tier: 'string',
          priority: 'string'
        },
        output: {
          category: 'string',
          priority: 'string',
          assigned_team: 'string',
          estimated_resolution: 'string',
          suggested_actions: 'array'
        }
      }
    }
  }
}

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string
  const [agent, setAgent] = useState(agentDetails[agentId as keyof typeof agentDetails])

  useEffect(() => {
    if (agentId && agentDetails[agentId as keyof typeof agentDetails]) {
      setAgent(agentDetails[agentId as keyof typeof agentDetails])
    }
  }, [agentId])

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested agent could not be found.
          </p>
          <Link href="/agents">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const Icon = agent.icon

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/agents">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Button>
          </Link>
          
          <div className="flex items-start gap-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-xl">
              <Icon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{agent.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {agent.description}
              </p>
              <div className="flex items-center gap-4">
                <Badge variant="outline">{agent.category}</Badge>
                <Badge variant="secondary">{agent.tier}</Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{agent.successRate}% success rate</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${agent.pricing.perTask}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">per task</div>
              <div className="text-lg font-semibold mt-2">${agent.pricing.monthly}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">per month</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{agent.executions.toLocaleString()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Executions</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{agent.avgTime}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Time</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{agent.successRate}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Link href={`/playground?agent=${agent.id}`}>
            <Button size="lg" className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Activate Agent
            </Button>
          </Link>
          <AddToDashboardButton 
            agentId={agent.id} 
            agentName={agent.name}
            variant="outline"
            size="lg"
          />
          <ViewPricingButton 
            agentId={agent.id} 
            agentName={agent.name}
            variant="outline"
            size="lg"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {agent.documentation.overview}
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Key Capabilities</h3>
              <ul className="space-y-2 mb-6">
                {agent.documentation.capabilities.map((capability, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{capability}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mb-3">Use Cases</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agent.documentation.useCases.map((useCase, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {agent.features.map((feature, index) => (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="font-semibold mb-2">{feature}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Advanced {feature.toLowerCase()} capabilities with enterprise-grade reliability.
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">API Reference</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Endpoint</h3>
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm">
                    <span className="text-blue-600 dark:text-blue-400">POST</span> {agent.documentation.api.endpoint}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Input Schema</h3>
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <pre className="text-sm font-mono">
                      {JSON.stringify(agent.documentation.api.input, null, 2)}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Output Schema</h3>
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <pre className="text-sm font-mono">
                      {JSON.stringify(agent.documentation.api.output, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="examples">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Examples</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Basic Usage</h3>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <pre className="text-sm font-mono">
{`curl -X POST "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${agent.documentation.api.endpoint}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "package_id": "${agent.id}",
    "task": "Execute ${agent.name}",
    "engine_type": "crewai"
  }'`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Expected Response</h3>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <pre className="text-sm font-mono">
{`{
  "success": true,
  "result": "Agent executed successfully...",
  "execution_id": "uuid-here",
  "execution_time": 2.3,
  "tokens_used": 150
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
