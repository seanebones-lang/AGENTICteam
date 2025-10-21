import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Scale, AlertTriangle, FileText } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 px-4 py-1.5 text-sm font-semibold">
              Legal
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Terms of Service
            </h1>
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300 mb-4">
              Last Updated: October 21, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-yellow-50 dark:bg-yellow-900/20 border-y border-yellow-200 dark:border-yellow-800">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                PROPRIETARY SOFTWARE - FOR SALE
              </h3>
              <p className="text-yellow-800 dark:text-yellow-200">
                This software is proprietary and sold "AS IS" without warranty. All rights reserved. 
                <strong> NO EVALUATION OR USE WITHOUT LICENSE.</strong> Contact Sean McDonnell at{' '}
                <a href="https://bizbot.store" className="underline font-semibold">bizbot.store</a> or{' '}
                <a href="tel:+18176759898" className="underline font-semibold">(817) 675-9898</a> for licensing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Scale className="h-6 w-6 text-blue-600" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                By accessing or using the Agent Marketplace platform (&quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of these terms, you do not have permission to access the Service.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                This Service is proprietary software owned by Sean McDonnell and operated by BizBot. All use requires a valid commercial license.
              </p>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">2. Licensing and Use Rights</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>2.1 License Required:</strong> Use of this software requires a valid commercial license purchased from BizBot. No evaluation, testing, or use is permitted without an active license agreement.
                </p>
                <p>
                  <strong>2.2 License Grant:</strong> Upon purchase and payment in full, you are granted a non-exclusive, non-transferable license to use the Service in accordance with the terms of your specific license agreement.
                </p>
                <p>
                  <strong>2.3 Restrictions:</strong> You may not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Copy, modify, or create derivative works of the Service</li>
                  <li>Reverse engineer, decompile, or disassemble the Service</li>
                  <li>Rent, lease, lend, sell, sublicense, or transfer the Service</li>
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Remove or alter any proprietary notices or labels</li>
                </ul>
                <p>
                  <strong>2.4 Ownership:</strong> All rights, title, and interest in and to the Service remain with Sean McDonnell and BizBot. This is a license, not a sale.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">3. Acceptable Use Policy</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit malicious code, viruses, or harmful content</li>
                  <li>Attempt to gain unauthorized access to systems or networks</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Collect or harvest information about other users</li>
                  <li>Use the Service for competitive analysis or benchmarking</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">4. Payment and Fees</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>4.1 Pricing:</strong> All fees are as quoted at the time of purchase. Prices are subject to change with notice.
                </p>
                <p>
                  <strong>4.2 Payment Terms:</strong> Payment is due in full before license activation unless otherwise agreed in writing.
                </p>
                <p>
                  <strong>4.3 Refunds:</strong> All sales are final. This software is sold &quot;AS IS&quot; without warranty. No refunds will be provided except as required by law.
                </p>
                <p>
                  <strong>4.4 Taxes:</strong> Fees do not include applicable taxes. You are responsible for all taxes associated with your purchase.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">5. Disclaimer of Warranties</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="font-semibold uppercase">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, SEAN MCDONNELL AND BIZBOT DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p>
                  WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="font-semibold uppercase">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL SEAN MCDONNELL, BIZBOT, OR THEIR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p>
                  OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">7. Indemnification</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  You agree to indemnify, defend, and hold harmless Sean McDonnell, BizBot, and their officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys&apos; fees, arising out of or in any way connected with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your access to or use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any content you submit or transmit through the Service</li>
                </ul>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  The Service and its entire contents, features, and functionality (including but not limited to all information, software, code, text, displays, graphics, photographs, video, audio, design, presentation, selection, and arrangement) are owned by Sean McDonnell and BizBot and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p>
                  All trademarks, service marks, and trade names are proprietary to Sean McDonnell and BizBot.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>9.1 Termination by Us:</strong> We may terminate or suspend your license immediately, without prior notice or liability, for any reason, including if you breach these Terms.
                </p>
                <p>
                  <strong>9.2 Termination by You:</strong> You may terminate your license by ceasing all use of the Service and destroying all copies in your possession.
                </p>
                <p>
                  <strong>9.3 Effect of Termination:</strong> Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">10. Governing Law and Jurisdiction</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in Texas, and you hereby consent to personal jurisdiction and venue therein.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days&apos; notice prior to any new terms taking effect.
                </p>
                <p>
                  By continuing to access or use our Service after revisions become effective, you agree to be bound by the revised terms.
                </p>
              </div>
            </Card>

            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">12. Contact Information</h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  For questions about these Terms, please contact us:
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <p className="font-semibold mb-2">BizBot / Sean McDonnell</p>
                  <p>Website: <a href="https://bizbot.store" className="text-blue-600 hover:underline">bizbot.store</a></p>
                  <p>Phone: <a href="tel:+18176759898" className="text-blue-600 hover:underline">(817) 675-9898</a></p>
                </div>
              </div>
            </Card>

            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                Copyright © 2025 Sean McDonnell. All Rights Reserved.
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 text-center mt-2">
                See also: <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> | <Link href="/license" className="text-blue-600 hover:underline">License Information</Link>
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

