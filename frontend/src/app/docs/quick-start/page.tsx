import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Terminal, Key, Zap, CheckCircle } from 'lucide-react'

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/docs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <Badge className="mb-4">Getting Started</Badge>
          <h1 className="text-4xl font-bold mb-4">Quick Start Guide</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Deploy your first AI agent in under 5 minutes
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Key className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold">Step 1: Get Your API Key</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Contact us to obtain your API key and license:
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Website:</strong> <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">bizbot.store</a>
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Phone:</strong> <a href="tel:+18176759898" className="text-blue-600 hover:underline">(817) 675-9898</a>
              </p>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Once you have your API key, set it as an environment variable:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-4 overflow-x-auto">
              <code>{`export AGENT_MARKETPLACE_API_KEY="your_api_key_here"`}</code>
            </pre>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Terminal className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold">Step 2: Install the SDK</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Install our Python SDK using pip:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{`pip install agent-marketplace-sdk`}</code>
            </pre>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
              Or use npm for JavaScript/TypeScript:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-2 overflow-x-auto">
              <code>{`npm install @agent-marketplace/sdk`}</code>
            </pre>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold">Step 3: Execute Your First Agent</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Here&apos;s a simple example using the Security Scanner agent:
            </p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold mb-2">Python:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`from agent_marketplace import AgentClient

# Initialize client
client = AgentClient(api_key="your_api_key")

# Execute Security Scanner
result = client.execute_agent(
    agent_id="security-scanner",
    input_data={
        "target": "https://example.com",
        "scan_type": "full",
        "compliance_checks": ["OWASP", "PCI-DSS"]
    }
)

print(f"Scan Status: {result.status}")
print(f"Vulnerabilities Found: {len(result.vulnerabilities)}")
print(f"Compliance Score: {result.compliance_score}")`}</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2">JavaScript/TypeScript:</p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`import { AgentClient } from '@agent-marketplace/sdk';

// Initialize client
const client = new AgentClient({ apiKey: 'your_api_key' });

// Execute Security Scanner
const result = await client.executeAgent({
  agentId: 'security-scanner',
  inputData: {
    target: 'https://example.com',
    scanType: 'full',
    complianceChecks: ['OWASP', 'PCI-DSS']
  }
});

console.log(\`Scan Status: \${result.status}\`);
console.log(\`Vulnerabilities Found: \${result.vulnerabilities.length}\`);
console.log(\`Compliance Score: \${result.complianceScore}\`);`}</code>
                </pre>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold">Step 4: Monitor Results</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              View execution results in your dashboard or via API:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`# Get execution history
history = client.get_execution_history(
    agent_id="security-scanner",
    limit=10
)

for execution in history:
    print(f"ID: {execution.id}")
    print(f"Status: {execution.status}")
    print(f"Duration: {execution.duration_ms}ms")
    print(f"Timestamp: {execution.timestamp}")
    print("---")`}</code>
            </pre>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <h2 className="text-2xl font-bold mb-4">🎉 You&apos;re All Set!</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You&apos;ve successfully executed your first agent. Here&apos;s what to explore next:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="/docs/agents/security-scanner">
                  Explore Agent Packages
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/api/rest">
                  View API Reference
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/playground">
                  Try Interactive Playground
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/authentication">
                  Learn About Authentication
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

