import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react'

export default function SecurityScannerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/docs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <Badge className="mb-4">Agent Packages</Badge>
          <div className="flex items-center gap-4 mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold">Security Scanner</h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Automated security vulnerability scanning and compliance checking with OWASP Top 10 coverage
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The Security Scanner agent performs comprehensive security assessments of web applications, APIs, and infrastructure. It identifies vulnerabilities, checks compliance with security standards, and provides actionable remediation guidance.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">99.8%</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2.3s</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Avg Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$0.05</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Per Execution</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">45K+</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">Executions</div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Features</h2>
            <div className="space-y-3">
              {[
                'OWASP Top 10 vulnerability detection',
                'CVE database integration',
                'PCI-DSS, GDPR, HIPAA compliance checking',
                'SSL/TLS configuration analysis',
                'Security header validation',
                'Authentication & authorization testing',
                'SQL injection & XSS detection',
                'Automated remediation recommendations'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Usage Example</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`from agent_marketplace import AgentClient

client = AgentClient(api_key="your_api_key")

result = client.execute_agent(
    agent_id="security-scanner",
    input_data={
        "target": "https://example.com",
        "scan_type": "full",
        "compliance_checks": ["OWASP", "PCI-DSS", "GDPR"],
        "max_depth": 5,
        "timeout_seconds": 300
    }
)

print(f"Vulnerabilities: {len(result.vulnerabilities)}")
print(f"Compliance Score: {result.compliance_score}/100")`}</code>
            </pre>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Input Schema</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="py-3 px-4">Field</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Required</th>
                    <th className="py-3 px-4">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-mono">target</td>
                    <td className="py-3 px-4">string</td>
                    <td className="py-3 px-4">Yes</td>
                    <td className="py-3 px-4">Target URL to scan</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-mono">scan_type</td>
                    <td className="py-3 px-4">string</td>
                    <td className="py-3 px-4">No</td>
                    <td className="py-3 px-4">quick, standard, or full (default: standard)</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-mono">compliance_checks</td>
                    <td className="py-3 px-4">array</td>
                    <td className="py-3 px-4">No</td>
                    <td className="py-3 px-4">List of compliance standards to check</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-3 px-4 font-mono">max_depth</td>
                    <td className="py-3 px-4">integer</td>
                    <td className="py-3 px-4">No</td>
                    <td className="py-3 px-4">Maximum crawl depth (default: 3)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-mono">timeout_seconds</td>
                    <td className="py-3 px-4">integer</td>
                    <td className="py-3 px-4">No</td>
                    <td className="py-3 px-4">Maximum scan duration (default: 300)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Deploy the Security Scanner agent in your environment today
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/playground?agent=security-scanner">
                  Try in Playground
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/quick-start">
                  Quick Start Guide
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

