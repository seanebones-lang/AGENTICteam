'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  AlertTriangle,
  Zap,
  Clock,
  Target,
  BookOpen,
  PlayCircle
} from 'lucide-react'

interface UseCase {
  title: string
  description: string
  example: string
  output: string[]
}

interface AgentGuideProps {
  agentId: string
  agentName: string
  agentDescription: string
  useCases: UseCase[]
  limitations: string[]
  bestPractices: { good: string; bad: string }
  proTips: string[]
}

const AGENT_GUIDES: Record<string, AgentGuideProps> = {
  'ticket-resolver': {
    agentId: 'ticket-resolver',
    agentName: 'Ticket Resolver',
    agentDescription: 'AI-powered support assistant that analyzes customer support tickets and provides instant solutions',
    useCases: [
      {
        title: 'Technical Support Issues',
        description: 'Troubleshoot technical problems, errors, bugs, and system issues',
        example: 'Customer reports: The app crashes every time I try to upload a photo. Using iPhone 14, iOS 17.2. Error: "Upload failed - network error"',
        output: [
          'Issue: Photo upload failure on iOS app',
          'Root Cause: Network timeout or file size limit',
          'Priority: Medium',
          'Solution: Check photo size, try WiFi, update app, clear cache'
        ]
      },
      {
        title: 'Account Access & Login',
        description: 'Handle password resets, locked accounts, and authentication problems',
        example: 'User cannot reset password. Clicking reset link shows error 403 Forbidden.',
        output: [
          'Issue: Password reset link returning 403 error',
          'Root Cause: Expired token or permissions issue',
          'Priority: High',
          'Solution: Generate new reset link, check token expiry'
        ]
      },
      {
        title: 'Billing & Payment Issues',
        description: 'Resolve payment failures, subscription problems, and refund requests',
        example: 'Customer charged twice for monthly subscription. Two $29.99 charges on same date.',
        output: [
          'Issue: Duplicate billing charge',
          'Root Cause: Payment retry or system glitch',
          'Priority: High',
          'Solution: Verify charges, process refund'
        ]
      }
    ],
    limitations: [
      'Cannot access your systems directly - analyzes text only',
      'Cannot make changes automatically - provides recommendations only',
      'Cannot guarantee 100% accuracy - review before implementing',
      'Cannot handle extremely sensitive data - redact PII before analysis',
      'Cannot learn your specific policies - include them in description',
      'Cannot replace human judgment - use as assistance tool'
    ],
    bestPractices: {
      good: 'Customer (John Doe, account #12345) reports: Cannot access dashboard. Gets "Session expired" error. Using Chrome 120 on Windows 11. Last login 2 hours ago. Tried clearing cache.',
      bad: 'It\'s broken'
    },
    proTips: [
      'Batch similar tickets: "3 users report login issues: User A sees X, User B sees Y"',
      'Include history: "User tried clearing cache, restarting - still failing"',
      'Use priority keywords: "URGENT", "CRITICAL", "BLOCKING PRODUCTION"',
      'Output is copy-paste ready for your ticketing system'
    ]
  },
  'security-scanner': {
    agentId: 'security-scanner',
    agentName: 'Security Scanner',
    agentDescription: 'Analyzes code, configurations, and systems for security vulnerabilities and compliance issues',
    useCases: [
      {
        title: 'Code Security Analysis',
        description: 'Scan code for vulnerabilities, injection flaws, and security anti-patterns',
        example: 'Analyze this API endpoint: app.post("/login", (req, res) => { db.query("SELECT * FROM users WHERE email = \'" + req.body.email + "\'") })',
        output: [
          'Vulnerability: SQL Injection (CRITICAL)',
          'Location: Login endpoint',
          'Risk: Attacker can bypass authentication',
          'Fix: Use parameterized queries or ORM'
        ]
      },
      {
        title: 'Configuration Audit',
        description: 'Review server configs, API keys, and security settings',
        example: 'Check security of: AWS S3 bucket with public-read ACL, no encryption, versioning disabled',
        output: [
          'Issue: Publicly accessible S3 bucket',
          'Risk: Data breach, compliance violation',
          'Priority: CRITICAL',
          'Fix: Enable private ACL, encryption at rest, versioning'
        ]
      },
      {
        title: 'Dependency Vulnerabilities',
        description: 'Identify outdated or vulnerable dependencies',
        example: 'Package.json includes: express@4.16.0, lodash@4.17.11, axios@0.18.0',
        output: [
          'Found: 3 packages with known vulnerabilities',
          'Critical: lodash@4.17.11 (prototype pollution)',
          'High: axios@0.18.0 (SSRF vulnerability)',
          'Recommended: Update all to latest versions'
        ]
      }
    ],
    limitations: [
      'Cannot execute code or run live scans - analyzes provided code/config only',
      'Cannot access your repositories - paste code/config to analyze',
      'Cannot fix vulnerabilities automatically - provides recommendations',
      'Cannot guarantee finding all vulnerabilities - use with professional tools',
      'Cannot assess business logic flaws - focuses on technical vulnerabilities',
      'Cannot perform penetration testing - static analysis only'
    ],
    bestPractices: {
      good: 'Analyze this authentication function: [paste complete code with context, including imports and dependencies]',
      bad: 'Check if my code is secure'
    },
    proTips: [
      'Include full context: imports, dependencies, environment variables',
      'Specify framework/language version for accurate analysis',
      'Mention compliance requirements: GDPR, HIPAA, PCI-DSS, SOC 2',
      'Prioritize findings by risk level: Critical > High > Medium > Low'
    ]
  },
  'data-processor': {
    agentId: 'data-processor',
    agentName: 'Data Processor',
    agentDescription: 'Transforms, cleans, and analyzes data with intelligent processing and validation',
    useCases: [
      {
        title: 'Data Cleaning & Validation',
        description: 'Clean messy data, remove duplicates, validate formats',
        example: 'Clean this CSV: emails with spaces, phone numbers in different formats, duplicate entries, missing values',
        output: [
          'Found: 45 duplicates removed',
          'Fixed: 23 email addresses (trimmed whitespace)',
          'Standardized: Phone numbers to E.164 format',
          'Flagged: 12 rows with missing required fields'
        ]
      },
      {
        title: 'Data Transformation',
        description: 'Convert between formats, restructure data, merge datasets',
        example: 'Convert JSON user data to CSV format with columns: name, email, signup_date, subscription_tier',
        output: [
          'Converted: 1,250 JSON records to CSV',
          'Columns: name, email, signup_date, subscription_tier',
          'Date format: ISO 8601 standardized',
          'Output ready for Excel/Google Sheets'
        ]
      },
      {
        title: 'Data Analysis & Insights',
        description: 'Extract patterns, calculate statistics, identify anomalies',
        example: 'Analyze sales data: 500 transactions, identify top products, revenue trends, outliers',
        output: [
          'Total Revenue: $45,230',
          'Top Product: Widget A (35% of sales)',
          'Trend: 12% growth month-over-month',
          'Anomaly: 3 transactions >$5,000 (investigate)'
        ]
      }
    ],
    limitations: [
      'Cannot process extremely large files (>10MB) - use in batches',
      'Cannot access databases directly - export and paste data',
      'Cannot modify original files - provides processed output',
      'Cannot handle binary formats - text-based data only',
      'Cannot perform real-time processing - one-time analysis',
      'Cannot guarantee data privacy - redact sensitive info first'
    ],
    bestPractices: {
      good: 'Process this customer data: [paste sample rows with headers, specify desired output format, mention any business rules]',
      bad: 'Clean my data'
    },
    proTips: [
      'Provide sample data (10-20 rows) for format understanding',
      'Specify output format clearly: CSV, JSON, Excel, SQL',
      'Mention business rules: "Remove users inactive >90 days"',
      'Use for data migration planning before full automation'
    ]
  },
  'knowledge-base': {
    agentId: 'knowledge-base',
    agentName: 'Knowledge Base Agent',
    agentDescription: 'Organizes, searches, and retrieves information from your documentation and knowledge base',
    useCases: [
      {
        title: 'Documentation Search',
        description: 'Find relevant information across multiple documents',
        example: 'Find all documentation about password reset process, including API endpoints, user flows, and troubleshooting',
        output: [
          'Found: 5 relevant documents',
          'API: POST /auth/reset-password endpoint',
          'User Flow: 3-step process with email verification',
          'Troubleshooting: Common issues and solutions'
        ]
      },
      {
        title: 'Content Organization',
        description: 'Categorize and structure documentation',
        example: 'Organize these 50 help articles into logical categories with tags',
        output: [
          'Created: 8 main categories',
          'Tagged: All articles with relevant keywords',
          'Identified: 12 duplicate/overlapping articles',
          'Suggested: 5 missing topics to document'
        ]
      },
      {
        title: 'Answer Generation',
        description: 'Generate answers from existing documentation',
        example: 'User asks: "How do I export my data?" Search docs and provide answer',
        output: [
          'Answer: Go to Settings > Data Export > Download',
          'Source: User Guide, page 23',
          'Related: GDPR compliance, data formats',
          'Time estimate: Export takes 5-10 minutes'
        ]
      }
    ],
    limitations: [
      'Cannot access your actual knowledge base - paste content to analyze',
      'Cannot update documentation automatically - provides suggestions',
      'Cannot handle images/videos - text content only',
      'Cannot learn in real-time - analyzes provided content only',
      'Cannot integrate with your CMS - manual copy/paste required',
      'Cannot verify accuracy - relies on provided information'
    ],
    bestPractices: {
      good: 'Search these docs for "API authentication": [paste relevant doc sections with titles and context]',
      bad: 'Find something about APIs'
    },
    proTips: [
      'Provide document titles/sources for proper attribution',
      'Include metadata: last updated, author, version',
      'Use for documentation gap analysis',
      'Generate FAQ from common support tickets'
    ]
  },
  'incident-responder': {
    agentId: 'incident-responder',
    agentName: 'Incident Responder',
    agentDescription: 'Analyzes system incidents, outages, and errors to provide rapid response guidance',
    useCases: [
      {
        title: 'Outage Analysis',
        description: 'Diagnose system outages and service disruptions',
        example: 'Production down: API returning 503 errors, database CPU at 98%, 500 users affected, started 10 minutes ago',
        output: [
          'Severity: CRITICAL (P1)',
          'Root Cause: Database overload',
          'Impact: 500 users, revenue loss ~$2,000/hour',
          'Immediate Action: Scale DB, enable read replicas',
          'Communication: Post status page update'
        ]
      },
      {
        title: 'Error Triage',
        description: 'Prioritize and categorize error reports',
        example: 'Error spike: 1,000 "Payment failed" errors in last hour, Stripe webhook returning 500',
        output: [
          'Issue: Stripe webhook failure',
          'Impact: Payment processing blocked',
          'Priority: P1 (revenue impacting)',
          'Action: Check webhook endpoint, verify Stripe status',
          'Escalate: Payment team + DevOps'
        ]
      },
      {
        title: 'Performance Degradation',
        description: 'Identify and resolve performance issues',
        example: 'App slow: Page load 15s (normally 2s), memory usage 85%, no errors in logs',
        output: [
          'Issue: Performance degradation',
          'Likely Cause: Memory leak or inefficient query',
          'Priority: P2 (user experience impact)',
          'Investigation: Check recent deployments, DB queries',
          'Mitigation: Restart service, monitor memory'
        ]
      }
    ],
    limitations: [
      'Cannot access your monitoring tools - paste metrics/logs',
      'Cannot execute commands or restart services',
      'Cannot guarantee root cause - provides likely scenarios',
      'Cannot predict future incidents - reactive analysis only',
      'Cannot access production systems - requires manual data',
      'Cannot replace incident management tools - use as assistant'
    ],
    bestPractices: {
      good: 'Incident: API 503 errors, started 15:30 UTC, 500 users affected, DB CPU 98%, recent deploy at 15:25, error logs show connection timeouts',
      bad: 'Site is down'
    },
    proTips: [
      'Include timeline: when started, recent changes, patterns',
      'Provide metrics: CPU, memory, error rates, user impact',
      'Mention severity: P1 (critical), P2 (high), P3 (medium)',
      'Use for post-mortem analysis and prevention'
    ]
  }
}

// Add more agent guides for remaining agents
AGENT_GUIDES['deployment-agent'] = {
  agentId: 'deployment-agent',
  agentName: 'Deployment Agent',
  agentDescription: 'Manages and automates deployment processes with intelligent rollback and monitoring',
  useCases: [
    {
      title: 'Deployment Planning',
      description: 'Plan safe deployments with rollback strategies',
      example: 'Plan deployment: Frontend React app, 10,000 active users, zero-downtime required, rollback strategy needed',
      output: [
        'Strategy: Blue-green deployment',
        'Steps: Deploy to staging, smoke tests, gradual traffic shift',
        'Rollback: Keep old version running, instant DNS switch',
        'Monitoring: Track error rates, response times'
      ]
    },
    {
      title: 'CI/CD Pipeline Review',
      description: 'Analyze and optimize deployment pipelines',
      example: 'Review pipeline: Build takes 15 min, tests 10 min, deploy 5 min. Too slow.',
      output: [
        'Bottleneck: Test suite (10 min)',
        'Optimization: Parallelize tests, cache dependencies',
        'Expected: Reduce to 5 min total',
        'Implement: Docker layer caching, test splitting'
      ]
    },
    {
      title: 'Rollback Decisions',
      description: 'Determine when and how to rollback deployments',
      example: 'Deployed 10 min ago, error rate increased from 0.1% to 5%, 50 user complaints',
      output: [
        'Decision: ROLLBACK IMMEDIATELY',
        'Reason: 50x error rate increase',
        'Action: Revert to previous version',
        'Investigation: Analyze logs post-rollback'
      ]
    }
  ],
  limitations: [
    'Cannot execute deployments - provides guidance only',
    'Cannot access your CI/CD tools directly',
    'Cannot monitor live deployments - requires manual updates',
    'Cannot make rollback decisions automatically',
    'Cannot modify pipeline configs - provides recommendations',
    'Cannot handle infrastructure provisioning'
  ],
  bestPractices: {
    good: 'Plan deployment: Node.js API, 5,000 req/min, database migration required, 99.9% uptime SLA, current version v2.3.1',
    bad: 'How do I deploy?'
  },
  proTips: [
    'Include SLA requirements and user impact tolerance',
    'Mention database migrations and breaking changes',
    'Specify environment: staging, production, canary',
    'Use for disaster recovery planning'
  ]
}

// Add remaining agents with similar structure
const remainingAgents = ['audit-agent', 'report-generator', 'workflow-orchestrator', 'escalation-manager']
remainingAgents.forEach(agentId => {
  const names: Record<string, string> = {
    'audit-agent': 'Audit Agent',
    'report-generator': 'Report Generator',
    'workflow-orchestrator': 'Workflow Orchestrator',
    'escalation-manager': 'Escalation Manager'
  }
  
  AGENT_GUIDES[agentId] = {
    agentId,
    agentName: names[agentId],
    agentDescription: `AI-powered ${names[agentId].toLowerCase()} for automated business operations`,
    useCases: [
      {
        title: 'Primary Use Case',
        description: 'Main application of this agent',
        example: 'Provide specific task details here',
        output: ['Analysis result', 'Recommendations', 'Action items']
      }
    ],
    limitations: [
      'Cannot access external systems directly',
      'Provides recommendations, not automatic execution',
      'Requires clear input for accurate results'
    ],
    bestPractices: {
      good: 'Detailed task with context, requirements, and expected outcome',
      bad: 'Generic request without details'
    },
    proTips: [
      'Provide complete context for better results',
      'Include specific requirements and constraints'
    ]
  }
})

export default function AgentHowToGuide({ agentId }: { agentId: string }) {
  const guide = AGENT_GUIDES[agentId]
  
  if (!guide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2">Guide Not Available</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Documentation for this agent is coming soon.
          </p>
          <Link href={`/agents/${agentId}`}>
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agent
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/agents/${agentId}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {guide.agentName}
          </Link>
          
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                How to Use: {guide.agentName}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {guide.agentDescription}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-green-500 text-white px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              5 min read
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Target className="h-4 w-4 mr-2" />
              Beginner Friendly
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              {guide.useCases.length}+ Use Cases
            </Badge>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-4">
            <PlayCircle className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-3">Quick Start (30 Seconds)</h2>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  <span>Describe your task or problem clearly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  <span>Paste it into the "Task Description" field</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  <span>Click "Execute Agent" and get instant analysis</span>
                </li>
              </ol>
              <Link href={`/agents/${agentId}`}>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Try It Now
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Use Cases */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Target className="h-8 w-8 text-purple-600" />
            Common Use Cases
          </h2>
          
          <div className="space-y-6">
            {guide.useCases.map((useCase, idx) => (
              <Card key={idx} className="p-6">
                <h3 className="text-xl font-bold mb-2">{idx + 1}. {useCase.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{useCase.description}</p>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-3">
                  <p className="text-sm font-semibold mb-2">Example Input:</p>
                  <code className="text-sm text-gray-700 dark:text-gray-300">{useCase.example}</code>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-2">What You Get:</p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    {useCase.output.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Best Practices */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-yellow-600" />
            Best Practices
          </h2>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  DO: Provide Complete Context
                </h3>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-2">Good Example:</p>
                  <code className="text-sm text-gray-700 dark:text-gray-300">{guide.bestPractices.good}</code>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  DON'T: Use Vague Descriptions
                </h3>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <p className="text-sm font-semibold mb-2">Bad Example:</p>
                  <code className="text-sm text-gray-700 dark:text-gray-300">{guide.bestPractices.bad}</code>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    ❌ Too vague - agent cannot provide accurate analysis
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Limitations */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            What This Agent CANNOT Do
          </h2>
          
          <Card className="p-6 border-2 border-orange-200 dark:border-orange-800">
            <div className="space-y-3">
              {guide.limitations.map((limitation, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">{limitation}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Pro Tips */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">💡 Pro Tips</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guide.proTips.map((tip, idx) => (
              <Card key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-bold">Tip #{idx + 1}:</span> {tip}
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <Card className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Try It?</h2>
          <p className="text-xl mb-6 text-purple-100">
            Put this agent to work on your tasks
          </p>
          <Link href={`/agents/${agentId}`}>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
              Use {guide.agentName} Now
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}

