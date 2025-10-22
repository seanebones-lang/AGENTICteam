import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Key, Shield, Lock, AlertTriangle } from 'lucide-react'

export default function AuthenticationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/docs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <Badge className="mb-4">Getting Started</Badge>
          <h1 className="text-4xl font-bold mb-4">Authentication</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Secure authentication methods for accessing the Agent Marketplace API
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Key className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold">API Key Authentication</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All API requests require a valid API key. Include your API key in the Authorization header:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`curl https://api.agentmarketplace.com/v1/agents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
            </pre>
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                    Keep Your API Key Secure
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Never commit API keys to version control or expose them in client-side code. Use environment variables or secure secret management systems.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold">JWT Tokens</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              For web applications, you can exchange your API key for a short-lived JWT token:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mb-4">
              <code>{`POST /v1/auth/token
Content-Type: application/json

{
  "api_key": "YOUR_API_KEY",
  "expires_in": 3600
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}`}</code>
            </pre>
            <p className="text-gray-700 dark:text-gray-300">
              Use the JWT token in subsequent requests:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm mt-4">
              <code>{`curl https://api.agentmarketplace.com/v1/agents/execute \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json"`}</code>
            </pre>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold">Best Practices</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Use Environment Variables</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  Store API keys in environment variables, not in code:
                </p>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto text-sm">
                  <code>{`# .env file
AGENT_MARKETPLACE_API_KEY=your_api_key_here`}</code>
                </pre>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Rotate Keys Regularly</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Rotate your API keys every 90 days or immediately if compromised. Contact support to generate new keys.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Use Different Keys for Different Environments</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Use separate API keys for development, staging, and production environments.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Implement Rate Limiting</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Implement client-side rate limiting to avoid hitting API rate limits. See <Link href="/docs/api/rate-limits" className="text-blue-600 hover:underline">Rate Limits documentation</Link>.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Obtaining an API Key</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To obtain an API key, contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Website:</strong> <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">bizbot.store</a>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Phone:</strong> <a href="mailto:support@bizbot.store" className="text-blue-600 hover:underline">support@bizbot.store</a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

