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
  },
  'data-processor': {
    id: 'data-processor',
    name: 'Data Processor',
    description: 'Advanced data extraction, transformation, and loading (ETL) with AI-driven insights.',
    icon: Database,
    category: 'Data',
    executions: 21300,
    avgTime: '3.1s',
    successRate: 99.1,
    tier: 'Silver+',
    features: ['Data Extraction', 'Data Transformation', 'Data Loading', 'AI Insights'],
    pricing: {
      perTask: 0.60,
      monthly: 149.99
    },
    documentation: {
      overview: 'The Data Processor Agent handles complex ETL operations with AI-powered data insights and automated pipeline management.',
      capabilities: [
        'Multi-source data extraction and ingestion',
        'Intelligent data transformation and cleansing',
        'Automated data quality validation',
        'Real-time and batch processing modes',
        'AI-driven data insights and anomaly detection',
        'Schema evolution and data lineage tracking'
      ],
      useCases: [
        'Data warehouse automation',
        'Real-time analytics pipelines',
        'Data migration and integration',
        'Business intelligence workflows',
        'Data quality management'
      ],
      api: {
        endpoint: '/api/v1/agents/data-processor/execute',
        method: 'POST',
        input: {
          source_config: 'object',
          transformation_rules: 'array',
          destination_config: 'object',
          processing_mode: 'string'
        },
        output: {
          processed_records: 'number',
          data_quality_score: 'number',
          insights: 'array',
          pipeline_status: 'string'
        }
      }
    }
  },
  'deployment-agent': {
    id: 'deployment-agent',
    name: 'Deployment Agent',
    description: 'Automated, secure, and compliant application deployment across cloud environments.',
    icon: GitBranch,
    category: 'DevOps',
    executions: 15600,
    avgTime: '4.5s',
    successRate: 99.7,
    tier: 'Gold+',
    features: ['CI/CD Integration', 'Multi-cloud Deployment', 'Rollback', 'Compliance Checks'],
    pricing: {
      perTask: 1.20,
      monthly: 299.99
    },
    documentation: {
      overview: 'The Deployment Agent automates secure application deployments across multiple cloud environments with built-in compliance and rollback capabilities.',
      capabilities: [
        'Multi-cloud deployment orchestration',
        'Automated security and compliance scanning',
        'Blue-green and canary deployment strategies',
        'Intelligent rollback and recovery',
        'Infrastructure as Code (IaC) integration',
        'Real-time deployment monitoring and alerts'
      ],
      useCases: [
        'Continuous deployment automation',
        'Multi-environment releases',
        'Compliance-driven deployments',
        'Disaster recovery automation',
        'Infrastructure provisioning'
      ],
      api: {
        endpoint: '/api/v1/agents/deployment-agent/execute',
        method: 'POST',
        input: {
          application_config: 'object',
          target_environments: 'array',
          deployment_strategy: 'string',
          compliance_requirements: 'array'
        },
        output: {
          deployment_id: 'string',
          status: 'string',
          deployed_environments: 'array',
          compliance_status: 'string'
        }
      }
    }
  },
  'report-generator': {
    id: 'report-generator',
    name: 'Report Generator',
    description: 'Automated generation of business intelligence reports and dashboards from various data sources.',
    icon: BarChart,
    category: 'Analytics',
    executions: 31200,
    avgTime: '2.0s',
    successRate: 99.3,
    tier: 'All Tiers',
    features: ['Custom Reports', 'Scheduled Reports', 'Data Visualization', 'PDF Export'],
    pricing: {
      perTask: 0.45,
      monthly: 129.99
    },
    documentation: {
      overview: 'The Report Generator Agent creates comprehensive business intelligence reports with automated data visualization and scheduling capabilities.',
      capabilities: [
        'Multi-source data aggregation and analysis',
        'Dynamic report generation with custom templates',
        'Interactive dashboards and visualizations',
        'Automated report scheduling and distribution',
        'Export to multiple formats (PDF, Excel, CSV)',
        'Real-time data refresh and alerts'
      ],
      useCases: [
        'Executive dashboard automation',
        'Financial reporting and analysis',
        'Performance monitoring reports',
        'Compliance and audit reporting',
        'Customer analytics and insights'
      ],
      api: {
        endpoint: '/api/v1/agents/report-generator/execute',
        method: 'POST',
        input: {
          data_sources: 'array',
          report_template: 'string',
          parameters: 'object',
          output_format: 'string'
        },
        output: {
          report_id: 'string',
          report_url: 'string',
          generated_at: 'string',
          data_points: 'number'
        }
      }
    }
  },
  'audit-agent': {
    id: 'audit-agent',
    name: 'Audit Agent',
    description: 'Continuous auditing and monitoring for regulatory compliance and internal policy adherence.',
    icon: CheckCircle,
    category: 'Compliance',
    executions: 18700,
    avgTime: '2.8s',
    successRate: 99.6,
    tier: 'Enterprise',
    features: ['Regulatory Compliance', 'Policy Enforcement', 'Audit Trails', 'Alerting'],
    pricing: {
      perTask: 0.85,
      monthly: 179.99
    },
    documentation: {
      overview: 'The Audit Agent provides continuous compliance monitoring and automated audit trail generation for regulatory and internal policy adherence.',
      capabilities: [
        'Continuous compliance monitoring and assessment',
        'Automated audit trail generation and management',
        'Policy violation detection and alerting',
        'Regulatory framework mapping and reporting',
        'Risk assessment and mitigation recommendations',
        'Evidence collection and documentation'
      ],
      useCases: [
        'SOX compliance automation',
        'GDPR privacy compliance',
        'Financial audit preparation',
        'Security policy enforcement',
        'Risk management workflows'
      ],
      api: {
        endpoint: '/api/v1/agents/audit-agent/execute',
        method: 'POST',
        input: {
          audit_scope: 'string',
          compliance_framework: 'string',
          time_period: 'object',
          audit_criteria: 'array'
        },
        output: {
          audit_id: 'string',
          compliance_score: 'number',
          violations: 'array',
          recommendations: 'array'
        }
      }
    }
  },
  'knowledge-base': {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'AI-powered knowledge retrieval and content generation for customer support and internal teams.',
    icon: Bot,
    category: 'AI',
    executions: 50100,
    avgTime: '1.5s',
    successRate: 98.7,
    tier: 'All Tiers',
    features: ['Smart Search', 'Content Generation', 'FAQ Automation', 'Multi-language Support'],
    pricing: {
      perTask: 0.35,
      monthly: 159.99
    },
    documentation: {
      overview: 'The Knowledge Base Agent provides intelligent knowledge retrieval and automated content generation with advanced search and multi-language capabilities.',
      capabilities: [
        'Semantic search across knowledge repositories',
        'Automated content generation and updates',
        'FAQ automation and chatbot integration',
        'Multi-language content translation',
        'Knowledge graph construction and maintenance',
        'Content relevance scoring and optimization'
      ],
      useCases: [
        'Customer support automation',
        'Internal knowledge management',
        'Documentation generation',
        'Chatbot and virtual assistant integration',
        'Content localization and translation'
      ],
      api: {
        endpoint: '/api/v1/agents/knowledge-base/execute',
        method: 'POST',
        input: {
          query: 'string',
          context: 'string',
          language: 'string',
          content_type: 'string'
        },
        output: {
          results: 'array',
          confidence_score: 'number',
          generated_content: 'string',
          related_topics: 'array'
        }
      }
    }
  },
  'workflow-orchestrator': {
    id: 'workflow-orchestrator',
    name: 'Workflow Orchestrator',
    description: 'Design, automate, and manage complex business workflows with drag-and-drop simplicity.',
    icon: GitBranch,
    category: 'Automation',
    executions: 25400,
    avgTime: '3.5s',
    successRate: 99.2,
    tier: 'Silver+',
    features: ['Visual Workflow Builder', 'Task Automation', 'Integration Hub', 'Monitoring'],
    pricing: {
      perTask: 0.95,
      monthly: 249.99
    },
    documentation: {
      overview: 'The Workflow Orchestrator Agent enables visual workflow design and automation with comprehensive integration capabilities and real-time monitoring.',
      capabilities: [
        'Visual drag-and-drop workflow designer',
        'Multi-system integration and orchestration',
        'Conditional logic and decision trees',
        'Real-time workflow monitoring and analytics',
        'Error handling and retry mechanisms',
        'Workflow versioning and rollback'
      ],
      useCases: [
        'Business process automation',
        'System integration workflows',
        'Approval and routing processes',
        'Data pipeline orchestration',
        'Multi-step task automation'
      ],
      api: {
        endpoint: '/api/v1/agents/workflow-orchestrator/execute',
        method: 'POST',
        input: {
          workflow_definition: 'object',
          input_data: 'object',
          execution_context: 'object',
          callback_url: 'string'
        },
        output: {
          execution_id: 'string',
          status: 'string',
          completed_steps: 'array',
          output_data: 'object'
        }
      }
    }
  },
  'analytics-engine': {
    id: 'analytics-engine',
    name: 'Analytics Engine',
    description: 'Real-time data analytics and predictive modeling for business insights.',
    icon: BarChart,
    category: 'Analytics',
    executions: 12300,
    avgTime: '4.0s',
    successRate: 99.0,
    tier: 'Gold+',
    features: ['Predictive Analytics', 'Anomaly Detection', 'Trend Analysis', 'Custom Dashboards'],
    pricing: {
      perTask: 1.05,
      monthly: 219.99
    },
    documentation: {
      overview: 'The Analytics Engine Agent provides advanced data analytics with predictive modeling, anomaly detection, and real-time business insights.',
      capabilities: [
        'Real-time data processing and analysis',
        'Machine learning model deployment and inference',
        'Anomaly detection and alerting',
        'Predictive analytics and forecasting',
        'Custom dashboard creation and management',
        'Statistical analysis and reporting'
      ],
      useCases: [
        'Business intelligence and reporting',
        'Predictive maintenance and forecasting',
        'Fraud detection and prevention',
        'Customer behavior analysis',
        'Performance optimization and monitoring'
      ],
      api: {
        endpoint: '/api/v1/agents/analytics-engine/execute',
        method: 'POST',
        input: {
          dataset: 'object',
          analysis_type: 'string',
          model_config: 'object',
          output_format: 'string'
        },
        output: {
          analysis_id: 'string',
          results: 'object',
          insights: 'array',
          confidence_score: 'number'
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
