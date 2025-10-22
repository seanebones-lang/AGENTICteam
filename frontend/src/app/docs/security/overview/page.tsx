import { GenericDocPage } from '@/components/docs/GenericDocPage'

export default function SecurityOverviewPage() {
  return (
    <GenericDocPage
      title="Security Overview"
      category="Security"
      description="Comprehensive security architecture and practices protecting the Agent Marketplace platform"
      content={{
        sections: [
          {
            title: "Security Architecture",
            content: "Agent Marketplace is built with military-grade security from the ground up. Our zero-trust architecture ensures that every request is authenticated, authorized, and encrypted. We employ multiple layers of defense including network isolation, application-level security, and data encryption."
          },
          {
            title: "Key Security Features",
            content: (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Zero-trust architecture with least-privilege access</li>
                <li>End-to-end encryption (TLS 1.3 in transit, AES-256 at rest)</li>
                <li>Multi-factor authentication (MFA) for all accounts</li>
                <li>API key rotation and management</li>
                <li>Network segmentation and isolation</li>
                <li>Real-time threat detection and prevention</li>
                <li>24/7 security monitoring and incident response</li>
                <li>Regular penetration testing and security audits</li>
              </ul>
            )
          },
          {
            title: "Compliance Certifications",
            content: (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-bold text-blue-600 dark:text-blue-400">SOC 2 Type II</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">Ready</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-bold text-blue-600 dark:text-blue-400">ISO 27001</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">Ready</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-bold text-blue-600 dark:text-blue-400">GDPR</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">Compliant</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="font-bold text-blue-600 dark:text-blue-400">HIPAA</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 mt-1">Ready</div>
                </div>
              </div>
            )
          },
          {
            title: "Data Protection",
            content: (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li>Data residency options for regional compliance</li>
                <li>Automated backup with point-in-time recovery</li>
                <li>Data retention policies and secure deletion</li>
                <li>Access logging and audit trails</li>
                <li>Customer data isolation and multi-tenancy security</li>
              </ul>
            )
          },
          {
            title: "Incident Response",
            content: "Our security team monitors the platform 24/7 and maintains a comprehensive incident response plan. In the event of a security incident, we follow industry best practices for containment, eradication, and recovery. Enterprise customers receive direct notification and detailed incident reports."
          }
        ]
      }}
    />
  )
}

