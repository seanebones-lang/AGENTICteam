import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Book, Code, Zap, Shield, Rocket, FileText } from 'lucide-react'

const sections = [
  {
    title: 'Getting Started',
    icon: Rocket,
    description: 'Quick start guide and basic concepts',
    links: [
      { name: 'Introduction', href: '/docs/introduction' },
      { name: 'Quick Start', href: '/docs/quick-start' },
      { name: 'Authentication', href: '/docs/authentication' },
      { name: 'Your First Agent', href: '/docs/first-agent' },
    ]
  },
  {
    title: 'Agent Packages',
    icon: Zap,
    description: 'Comprehensive guide to all available agents',
    links: [
      { name: 'Security Scanner', href: '/docs/agents/security-scanner' },
      { name: 'Incident Responder', href: '/docs/agents/incident-responder' },
      { name: 'Ticket Resolver', href: '/docs/agents/ticket-resolver' },
      { name: 'Knowledge Base', href: '/docs/agents/knowledge-base' },
      { name: 'View All Agents', href: '/agents' },
    ]
  },
  {
    title: 'API Reference',
    icon: Code,
    description: 'Complete API documentation and examples',
    links: [
      { name: 'REST API', href: '/docs/api/rest' },
      { name: 'WebSocket API', href: '/docs/api/websocket' },
      { name: 'Authentication', href: '/docs/api/auth' },
      { name: 'Rate Limits', href: '/docs/api/rate-limits' },
      { name: 'Error Handling', href: '/docs/api/errors' },
    ]
  },
  {
    title: 'Security',
    icon: Shield,
    description: 'Security best practices and compliance',
    links: [
      { name: 'Security Overview', href: '/docs/security/overview' },
      { name: 'Zero-Trust Architecture', href: '/docs/security/zero-trust' },
      { name: 'Compliance', href: '/docs/security/compliance' },
      { name: 'Data Privacy', href: '/docs/security/privacy' },
    ]
  },
  {
    title: 'Guides',
    icon: Book,
    description: 'In-depth tutorials and best practices',
    links: [
      { name: 'Agent Orchestration', href: '/docs/guides/orchestration' },
      { name: 'Multi-Modal Processing', href: '/docs/guides/multimodal' },
      { name: 'Performance Optimization', href: '/docs/guides/performance' },
      { name: 'Monitoring & Logging', href: '/docs/guides/monitoring' },
    ]
  },
  {
    title: 'Resources',
    icon: FileText,
    description: 'Additional resources and support',
    links: [
      { name: 'Changelog', href: '/docs/changelog' },
      { name: 'Migration Guide', href: '/docs/migration' },
      { name: 'FAQ', href: '/docs/faq' },
      { name: 'Support', href: 'https://bizbot.store' },
    ]
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <Badge className="mb-4">Documentation</Badge>
          <h1 className="text-4xl font-bold mb-4">Agent Marketplace Documentation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Everything you need to build, deploy, and scale AI agents. From quick starts to advanced topics.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <Rocket className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Quick Start</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get up and running in under 5 minutes
            </p>
            <Link href="/docs/quick-start" className="text-sm font-semibold text-blue-600 hover:underline">
              Start Building →
            </Link>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <Code className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">API Reference</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Complete API documentation with examples
            </p>
            <Link href="/docs/api/rest" className="text-sm font-semibold text-purple-600 hover:underline">
              View API Docs →
            </Link>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <Zap className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Try Playground</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Test agents interactively in your browser
            </p>
            <Link href="/playground" className="text-sm font-semibold text-green-600 hover:underline">
              Launch Playground →
            </Link>
          </Card>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {section.description}
                </p>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-blue-600 hover:underline"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>

        {/* Support Section */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can&apos;t find what you&apos;re looking for? Our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://bizbot.store"
                target="_blank"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Try Interactive Demo
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

