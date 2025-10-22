import { GenericDocPage } from '@/components/docs/GenericDocPage'

export default function MigrationPage() {
  return (
    <GenericDocPage
      title="Migration Guide"
      category="Resources"
      description="Step-by-step guide for migrating to Agent Marketplace from other platforms"
      content={{
        sections: [
          {
            title: "Migration Overview",
            content: "Migrating to Agent Marketplace is straightforward. Our platform is designed to integrate seamlessly with existing systems. This guide covers migration from custom solutions, legacy automation tools, and competing platforms."
          },
          {
            title: "Pre-Migration Checklist",
            content: (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Inventory existing automation workflows and agents</li>
                <li>Document current integrations and dependencies</li>
                <li>Identify data migration requirements</li>
                <li>Review API compatibility and rate limits</li>
                <li>Plan rollout strategy (phased vs. big bang)</li>
                <li>Set up staging environment for testing</li>
              </ul>
            )
          },
          {
            title: "Step 1: Account Setup",
            content: (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Contact us to set up your enterprise account:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Website:</strong> <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">bizbot.store</a>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Phone:</strong> <a href="mailto:support@bizbot.store" className="text-blue-600 dark:text-blue-400 hover:underline">support@bizbot.store</a>
                  </p>
                </div>
              </div>
            )
          },
          {
            title: "Step 2: Map Existing Workflows",
            content: "Identify which of our 10 production-ready agents match your existing workflows. For custom requirements, we offer agent development services. Our team will help you map your current automation to our platform capabilities."
          },
          {
            title: "Step 3: Integration",
            content: (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Integrate using our SDK or REST API:
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{`# Install SDK
pip install agent-marketplace-sdk

# Initialize client
from agent_marketplace import AgentClient
client = AgentClient(api_key="your_api_key")

# Execute agent (replaces your existing automation)
result = client.execute_agent(
    agent_id="security-scanner",
    input_data={...}
)`}</code>
                </pre>
              </div>
            )
          },
          {
            title: "Step 4: Testing & Validation",
            content: (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Test in staging environment with production-like data</li>
                <li>Validate agent outputs against expected results</li>
                <li>Performance testing and optimization</li>
                <li>Security and compliance validation</li>
                <li>User acceptance testing</li>
              </ul>
            )
          },
          {
            title: "Step 5: Production Rollout",
            content: "We recommend a phased rollout starting with non-critical workflows. Monitor performance and gradually increase traffic. Our team provides 24/7 support during migration for Enterprise customers."
          },
          {
            title: "Data Migration",
            content: "For historical data migration, we provide bulk import APIs and migration assistance. Contact our professional services team for large-scale data migrations."
          },
          {
            title: "Support During Migration",
            content: "Enterprise customers receive dedicated migration support including architecture review, custom integration development, and 24/7 technical assistance. Contact us to discuss your migration needs."
          }
        ]
      }}
    />
  )
}

