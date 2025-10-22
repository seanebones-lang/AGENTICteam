import { GenericDocPage } from '@/components/docs/GenericDocPage'
import Link from 'next/link'

export default function DataPrivacyPage() {
  return (
    <GenericDocPage
      title="Data Privacy"
      category="Security"
      description="Data privacy practices, user rights, and information handling policies"
      content={{
        sections: [
          {
            title: "Data Collection",
            content: (
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p>We collect only the data necessary to provide our services:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Account information (name, email, company)</li>
                  <li>Agent execution data and results</li>
                  <li>Usage analytics and performance metrics</li>
                  <li>Billing and payment information</li>
                  <li>Support communications</li>
                </ul>
              </div>
            )
          },
          {
            title: "Data Usage",
            content: "Your data is used solely to provide and improve our services. We do not sell your data to third parties. Agent execution data is used to improve agent performance and accuracy. Usage analytics help us optimize platform performance and user experience."
          },
          {
            title: "Data Storage & Retention",
            content: (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li>All data encrypted at rest (AES-256) and in transit (TLS 1.3)</li>
                <li>Data stored in secure, access-controlled facilities</li>
                <li>Regional data residency options available</li>
                <li>Automated backups with 30-day retention</li>
                <li>Data retained per your subscription terms</li>
                <li>Secure deletion upon account termination</li>
              </ul>
            )
          },
          {
            title: "Your Privacy Rights",
            content: (
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Access:</strong> Request a copy of your data</li>
                <li><strong>Correction:</strong> Update inaccurate information</li>
                <li><strong>Deletion:</strong> Request data deletion (subject to legal obligations)</li>
                <li><strong>Portability:</strong> Export your data in machine-readable format</li>
                <li><strong>Objection:</strong> Object to certain data processing</li>
                <li><strong>Restriction:</strong> Request processing restrictions</li>
              </ul>
            )
          },
          {
            title: "Contact & Full Policy",
            content: (
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  For privacy inquiries or to exercise your rights, contact us at:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Website:</strong> <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">bizbot.store</a>
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Phone:</strong> <a href="mailto:support@bizbot.store" className="text-blue-600 hover:underline">support@bizbot.store</a>
                  </p>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  View our complete <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> for detailed information.
                </p>
              </div>
            )
          }
        ]
      }}
    />
  )
}

