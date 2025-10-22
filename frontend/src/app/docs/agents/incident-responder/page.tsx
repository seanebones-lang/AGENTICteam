import { GenericDocPage } from '@/components/docs/GenericDocPage'

export default function IncidentResponderPage() {
  return (
    <GenericDocPage
      title="Incident Responder"
      category="Agent Packages"
      description="Intelligent incident triage, root cause analysis, and automated remediation for production issues"
      content={{
        sections: [
          {
            title: "Overview",
            content: "The Incident Responder agent automatically triages production incidents, performs root cause analysis, and executes remediation procedures. It integrates with your monitoring systems and can automatically resolve common issues or escalate complex problems to the appropriate team."
          },
          {
            title: "Key Features",
            content: (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Automatic incident triage and prioritization</li>
                <li>Root cause analysis using ML algorithms</li>
                <li>Automated remediation for common issues</li>
                <li>Runbook execution and automation</li>
                <li>Integration with PagerDuty, Opsgenie, ServiceNow</li>
                <li>Post-incident report generation</li>
                <li>99.5% success rate, 1.8s average response time</li>
              </ul>
            )
          },
          {
            title: "Usage Example",
            content: (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`from agent_marketplace import AgentClient

client = AgentClient(api_key="your_api_key")

result = client.execute_agent(
    agent_id="incident-responder",
    input_data={
        "incident_id": "INC-12345",
        "severity": "high",
        "description": "API latency spike",
        "auto_remediate": True
    }
)

print(f"Root Cause: {result.root_cause}")
print(f"Actions Taken: {result.actions}")`}</code>
              </pre>
            )
          },
          {
            title: "Pricing & Performance",
            content: (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99.5%</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1.8s</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Avg Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$0.08</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Per Execution</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">38K+</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">Executions</div>
                </div>
              </div>
            )
          }
        ]
      }}
    />
  )
}

