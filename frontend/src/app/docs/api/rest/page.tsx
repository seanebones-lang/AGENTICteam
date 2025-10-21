import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Code, Server, Zap } from 'lucide-react'

export default function RestAPIPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/docs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <Badge className="mb-4">API Reference</Badge>
          <h1 className="text-4xl font-bold mb-4">REST API</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Complete REST API reference for Agent Marketplace
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Base URL</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>https://api.agentmarketplace.com/v1</code>
            </pre>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Server className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold">Authentication</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All API requests require authentication using an API key in the Authorization header:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>Authorization: Bearer YOUR_API_KEY</code>
            </pre>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold">Endpoints</h2>
            </div>

            <div className="space-y-8">
              {/* List Agents */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">GET</Badge>
                  <code className="text-sm">/agents</code>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  List all available agent packages
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl https://api.agentmarketplace.com/v1/agents \\
  -H "Authorization: Bearer YOUR_API_KEY"

Response:
{
  "agents": [
    {
      "id": "security-scanner",
      "name": "Security Scanner",
      "category": "Security",
      "version": "2.1.0",
      "price": 0.05,
      "success_rate": 99.8
    }
  ],
  "total": 10
}`}</code>
                </pre>
              </div>

              {/* Execute Agent */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">POST</Badge>
                  <code className="text-sm">/agents/:agent_id/execute</code>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  Execute an agent with specified input data
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl -X POST https://api.agentmarketplace.com/v1/agents/security-scanner/execute \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": {
      "target": "https://example.com",
      "scan_type": "full"
    }
  }'

Response:
{
  "execution_id": "exec_abc123",
  "status": "processing",
  "created_at": "2025-10-21T10:00:00Z"
}`}</code>
                </pre>
              </div>

              {/* Get Execution Status */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">GET</Badge>
                  <code className="text-sm">/executions/:execution_id</code>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  Get the status and results of an agent execution
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl https://api.agentmarketplace.com/v1/executions/exec_abc123 \\
  -H "Authorization: Bearer YOUR_API_KEY"

Response:
{
  "execution_id": "exec_abc123",
  "agent_id": "security-scanner",
  "status": "completed",
  "result": {
    "vulnerabilities": [...],
    "compliance_score": 95
  },
  "duration_ms": 2340,
  "created_at": "2025-10-21T10:00:00Z",
  "completed_at": "2025-10-21T10:00:02Z"
}`}</code>
                </pre>
              </div>

              {/* List Execution History */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">GET</Badge>
                  <code className="text-sm">/executions</code>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                  List execution history with optional filters
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`curl "https://api.agentmarketplace.com/v1/executions?agent_id=security-scanner&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"

Response:
{
  "executions": [...],
  "total": 127,
  "page": 1,
  "limit": 10
}`}</code>
                </pre>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              API rate limits vary by tier. See <Link href="/docs/api/rate-limits" className="text-blue-600 hover:underline">Rate Limits documentation</Link> for details.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Free Tier:</strong> 100 requests/hour<br/>
                <strong>Pro Tier:</strong> 1,000 requests/hour<br/>
                <strong>Enterprise:</strong> Custom limits
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The API uses standard HTTP status codes. See <Link href="/docs/api/errors" className="text-blue-600 hover:underline">Error Handling documentation</Link> for details.
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`{
  "error": {
    "code": "invalid_input",
    "message": "The 'target' field is required",
    "details": {
      "field": "target",
      "reason": "missing_required_field"
    }
  }
}`}</code>
            </pre>
          </Card>
        </div>
      </div>
    </div>
  )
}

