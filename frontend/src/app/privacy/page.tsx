import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Shield, Lock, Eye, Database, UserCheck, Globe } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 px-4 py-1.5 text-sm font-semibold">
              Privacy & Security
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300 mb-4">
              Last Updated: October 21, 2025
            </p>
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Military-Grade Security</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                End-to-end encryption and zero-trust architecture
              </p>
            </Card>
            <Card className="p-6 text-center">
              <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Full compliance with international data protection laws
              </p>
            </Card>
            <Card className="p-6 text-center">
              <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your Data, Your Control</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                You own your data and can request deletion at any time
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-blue-600" />
                1. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>1.1 Information You Provide:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (name, email, company details)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Communications with our support team</li>
                  <li>Agent configuration and execution data</li>
                </ul>
                <p>
                  <strong>1.2 Automatically Collected Information:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Usage data and analytics (page views, features used, session duration)</li>
                  <li>Device information (browser type, operating system, IP address)</li>
                  <li>Performance metrics and error logs</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
                <p>
                  <strong>1.3 Information from Third Parties:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Authentication providers (if you use SSO)</li>
                  <li>Payment processors</li>
                  <li>Analytics and monitoring services</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-600" />
                2. How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Provide the Service:</strong> Process agent executions, manage your account, and deliver features</li>
                  <li><strong>Improve the Service:</strong> Analyze usage patterns, fix bugs, and develop new features</li>
                  <li><strong>Communicate with You:</strong> Send service updates, security alerts, and support messages</li>
                  <li><strong>Ensure Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
                  <li><strong>Comply with Legal Obligations:</strong> Meet regulatory requirements and respond to legal requests</li>
                  <li><strong>Process Payments:</strong> Handle billing and payment transactions</li>
                  <li><strong>Personalize Experience:</strong> Customize the Service based on your preferences and usage</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">3. How We Share Your Information</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>We do not sell your personal information. We may share your information with:</p>
                <p>
                  <strong>3.1 Service Providers:</strong> Third-party vendors who help us operate the Service (hosting, payment processing, analytics, customer support). These providers are contractually obligated to protect your data.
                </p>
                <p>
                  <strong>3.2 Legal Requirements:</strong> When required by law, court order, or government request, or to protect our rights and safety.
                </p>
                <p>
                  <strong>3.3 Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
                </p>
                <p>
                  <strong>3.4 With Your Consent:</strong> We may share information with third parties when you explicitly authorize us to do so.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-blue-600" />
                4. Data Security
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We implement industry-leading security measures to protect your information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                  <li><strong>Zero-Trust Architecture:</strong> Multi-layered security with least-privilege access controls</li>
                  <li><strong>Regular Audits:</strong> Continuous security monitoring and penetration testing</li>
                  <li><strong>Secure Infrastructure:</strong> SOC 2, ISO 27001, and FedRAMP ready compliance</li>
                  <li><strong>Data Isolation:</strong> Multi-tenant architecture with strict data segregation</li>
                  <li><strong>Incident Response:</strong> 24/7 security monitoring and rapid response protocols</li>
                </ul>
                <p className="mt-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We retain your information for as long as necessary to provide the Service and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                </p>
                <p>
                  <strong>Account Data:</strong> Retained while your account is active and for a reasonable period thereafter for legal and business purposes.
                </p>
                <p>
                  <strong>Usage Data:</strong> Typically retained for 12-24 months for analytics and service improvement.
                </p>
                <p>
                  <strong>Backup Data:</strong> May be retained in backup systems for up to 90 days after deletion.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-blue-600" />
                6. Your Rights and Choices
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                  <li><strong>Objection:</strong> Object to processing of your information for certain purposes</li>
                  <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                  <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing where consent was the legal basis</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at <a href="https://bizbot.store" className="text-blue-600 hover:underline">bizbot.store</a> or <a href="mailto:support@bizbot.store" className="text-blue-600 hover:underline">support@bizbot.store</a>.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking Technologies</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintain your session and remember your preferences</li>
                  <li>Analyze usage patterns and improve the Service</li>
                  <li>Provide security features and prevent fraud</li>
                  <li>Deliver personalized content and features</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings. Note that disabling cookies may affect Service functionality.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-blue-600" />
                8. International Data Transfers
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.
                </p>
                <p>
                  We ensure appropriate safeguards are in place for international transfers, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard Contractual Clauses approved by the European Commission</li>
                  <li>Adequacy decisions by relevant authorities</li>
                  <li>Your explicit consent where required</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Children&apos;s Privacy</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  The Service is not intended for children under 13 years of age (or 16 in the EEA). We do not knowingly collect personal information from children.
                </p>
                <p>
                  If you believe we have collected information from a child, please contact us immediately and we will delete the information.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">10. California Privacy Rights</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Right to know what personal information is collected, used, shared, or sold</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
                  <li>Right to non-discrimination for exercising your rights</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of material changes by:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Posting the new policy on this page with an updated &quot;Last Updated&quot; date</li>
                  <li>Sending an email notification to your registered email address</li>
                  <li>Displaying a prominent notice in the Service</li>
                </ul>
                <p className="mt-4">
                  Your continued use of the Service after changes become effective constitutes acceptance of the updated policy.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="font-semibold mb-2">BizBot / Sean McDonnell</p>
                  <p>Website: <a href="https://bizbot.store" className="text-blue-600 hover:underline">bizbot.store</a></p>
                  <p>Phone: <a href="mailto:support@bizbot.store" className="text-blue-600 hover:underline">support@bizbot.store</a></p>
                  <p className="mt-2 text-sm">Response time: Within 30 days of receipt</p>
                </div>
              </div>
            </Card>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                Copyright © 2025 Sean McDonnell. All Rights Reserved.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center mt-2">
                See also: <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> | <Link href="/license" className="text-blue-600 hover:underline">License Information</Link>
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

