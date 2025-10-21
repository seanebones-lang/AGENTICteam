import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { HelpCircle } from 'lucide-react'

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I get started with Agent Marketplace?",
      answer: "Contact us at bizbot.store or call (817) 675-9898 to obtain an API key and license. Then follow our Quick Start guide to deploy your first agent in under 5 minutes."
    },
    {
      question: "What agents are available?",
      answer: "We offer 10 production-ready agents including Security Scanner, Incident Responder, Ticket Resolver, Knowledge Base, Data Processor, Deployment Agent, Audit Agent, Workflow Orchestrator, Report Generator, and Escalation Manager."
    },
    {
      question: "What is the pricing model?",
      answer: "Pricing varies by agent and usage. Contact our sales team for detailed pricing information and volume discounts. Enterprise customers receive custom pricing based on their needs."
    },
    {
      question: "What is the uptime SLA?",
      answer: "We guarantee 99.999% uptime, which allows for only 5.26 minutes of downtime per year. Enterprise customers receive SLA credits for any downtime beyond this threshold."
    },
    {
      question: "Is my data secure?",
      answer: "Yes. We use military-grade security with zero-trust architecture, end-to-end encryption, and are SOC 2, ISO 27001, and FedRAMP ready compliant. All data is encrypted in transit and at rest."
    },
    {
      question: "Can I customize agents?",
      answer: "Yes. We offer custom agent development services for enterprise customers. Contact us to discuss your specific requirements."
    },
    {
      question: "What support is included?",
      answer: "All licenses include technical support during business hours. Enterprise customers receive 24/7 priority support with dedicated account management."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Please contact our sales team to discuss trial options and demo access for your organization."
    },
    {
      question: "What are the rate limits?",
      answer: "Rate limits vary by tier: Free (100 req/hour), Pro (1,000 req/hour), Enterprise (custom). See our Rate Limits documentation for details."
    },
    {
      question: "How do I report a bug or request a feature?",
      answer: "Contact our support team at bizbot.store or call (817) 675-9898. Enterprise customers can use their dedicated support channel."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <Link href="/docs" className="text-sm text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Documentation
          </Link>
          <Badge className="mb-4">Resources</Badge>
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Common questions about Agent Marketplace
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Our team is here to help. Contact us for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://bizbot.store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Visit BizBot.store
            </a>
            <a
              href="tel:+18176759898"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Call (817) 675-9898
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

