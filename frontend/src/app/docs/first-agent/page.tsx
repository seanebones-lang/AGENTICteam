import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Rocket, Code, Play, CheckCircle } from 'lucide-react'

export default function FirstAgentPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/docs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <Badge className="mb-4">Getting Started</Badge>
          <h1 className="text-4xl font-bold mb-4">Your First Agent</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            A step-by-step tutorial for deploying and executing your first AI agent
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Tutorial: Deploy a Security Scanner Agent</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              In this tutorial, we&apos;ll deploy a Security Scanner agent to scan a web application for vulnerabilities. This agent uses OWASP Top 10 checks and provides compliance reporting.
            </p>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <h3 className="font-semibold text-lg">Install the SDK</h3>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm ml-11">
                  <code>{`pip install agent-marketplace-sdk`}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <h3 className="font-semibold text-lg">Initialize the Client</h3>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm ml-11">
                  <code>{`from agent_marketplace import AgentClient
import os

# Initialize with your API key
client = AgentClient(
    api_key=os.getenv("AGENT_MARKETPLACE_API_KEY")
)`}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <h3 className="font-semibold text-lg">Configure Agent Parameters</h3>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm ml-11">
                  <code>{`# Define scan parameters
scan_config = {
    "target": "https://example.com",
    "scan_type": "full",  # Options: quick, standard, full
    "compliance_checks": [
        "OWASP",
        "PCI-DSS",
        "GDPR"
    ],
    "max_depth": 5,
    "timeout_seconds": 300
}`}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">4</div>
                  <h3 className="font-semibold text-lg">Execute the Agent</h3>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm ml-11">
                  <code>{`# Execute the security scanner
result = client.execute_agent(
    agent_id="security-scanner",
    input_data=scan_config
)

print(f"Execution ID: {result.execution_id}")
print(f"Status: {result.status}")`}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">5</div>
                  <h3 className="font-semibold text-lg">Process the Results</h3>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm ml-11">
                  <code>{`# Wait for completion (if async)
if result.status == "processing":
    result = client.wait_for_completion(result.execution_id)

# Access results
print(f"\\nScan Complete!")
print(f"Vulnerabilities Found: {len(result.vulnerabilities)}")
print(f"Compliance Score: {result.compliance_score}/100")

# Print high-severity vulnerabilities
for vuln in result.vulnerabilities:
    if vuln.severity == "high":
        print(f"\\n[HIGH] {vuln.title}")
        print(f"  Description: {vuln.description}")
        print(f"  Remediation: {vuln.remediation}")`}</code>
                </pre>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Complete Example</h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{`from agent_marketplace import AgentClient
import os
import json

def main():
    # Initialize client
    client = AgentClient(api_key=os.getenv("AGENT_MARKETPLACE_API_KEY"))
    
    # Configure scan
    scan_config = {
        "target": "https://example.com",
        "scan_type": "full",
        "compliance_checks": ["OWASP", "PCI-DSS"],
        "max_depth": 5,
        "timeout_seconds": 300
    }
    
    print("Starting security scan...")
    
    # Execute agent
    result = client.execute_agent(
        agent_id="security-scanner",
        input_data=scan_config
    )
    
    # Wait for completion if async
    if result.status == "processing":
        print(f"Execution ID: {result.execution_id}")
        print("Waiting for completion...")
        result = client.wait_for_completion(result.execution_id)
    
    # Display results
    print(f"\\n{'='*50}")
    print(f"Scan Results")
    print(f"{'='*50}")
    print(f"Status: {result.status}")
    print(f"Duration: {result.duration_ms}ms")
    print(f"Vulnerabilities: {len(result.vulnerabilities)}")
    print(f"Compliance Score: {result.compliance_score}/100")
    
    # Save detailed report
    with open("security_report.json", "w") as f:
        json.dump(result.to_dict(), f, indent=2)
    
    print(f"\\nDetailed report saved to security_report.json")

if __name__ == "__main__":
    main()`}</code>
            </pre>
          </Card>

          <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold">Congratulations!</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You&apos;ve successfully deployed and executed your first AI agent. Here&apos;s what to explore next:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="/docs/agents/security-scanner">
                  <Code className="mr-2 h-4 w-4" />
                  Security Scanner Docs
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/api/rest">
                  <Rocket className="mr-2 h-4 w-4" />
                  Full API Reference
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/agents">
                  <Play className="mr-2 h-4 w-4" />
                  Browse All Agents
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/playground">
                  <Play className="mr-2 h-4 w-4" />
                  Try Playground
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

