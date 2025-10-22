import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Rocket, Zap, Shield, Bug } from 'lucide-react'

export default function ChangelogPage() {
  const releases = [
    {
      version: "2.1.0",
      date: "October 21, 2025",
      type: "major",
      changes: [
        { type: "feature", icon: Rocket, text: "Multi-modal agent support (text, image, voice)" },
        { type: "feature", icon: Zap, text: "AI-driven autoscaling with ML-based prediction" },
        { type: "feature", icon: Shield, text: "Zero-trust sandbox architecture" },
        { type: "improvement", icon: Zap, text: "45ms global P99 latency (improved from 120ms)" },
        { type: "improvement", icon: Zap, text: "Agent execution caching for 40% cost reduction" }
      ]
    },
    {
      version: "2.0.0",
      date: "September 15, 2025",
      type: "major",
      changes: [
        { type: "feature", icon: Rocket, text: "Real-time agent collaboration (swarms)" },
        { type: "feature", icon: Shield, text: "Federated learning marketplace" },
        { type: "feature", icon: Zap, text: "WebSocket API for real-time updates" },
        { type: "improvement", icon: Zap, text: "99.999% uptime SLA" },
        { type: "fix", icon: Bug, text: "Fixed rate limiting edge cases" }
      ]
    },
    {
      version: "1.5.0",
      date: "August 1, 2025",
      type: "minor",
      changes: [
        { type: "feature", icon: Rocket, text: "Kubernetes deployment manifests" },
        { type: "feature", icon: Shield, text: "SOC 2 Type II readiness" },
        { type: "improvement", icon: Zap, text: "Batch execution API" },
        { type: "improvement", icon: Zap, text: "Enhanced error messages" }
      ]
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
          <h1 className="text-4xl font-bold mb-4">Changelog</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Latest updates, features, and improvements to Agent Marketplace
          </p>
        </div>

        <div className="space-y-8">
          {releases.map((release) => (
            <Card key={release.version} className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Version {release.version}</h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{release.date}</p>
                </div>
                <Badge variant={release.type === 'major' ? 'default' : 'outline'}>
                  {release.type === 'major' ? 'Major Release' : 'Minor Release'}
                </Badge>
              </div>
              <div className="space-y-3">
                {release.changes.map((change, idx) => {
                  const Icon = change.icon
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        change.type === 'feature' ? 'text-green-600 dark:text-green-400' :
                        change.type === 'improvement' ? 'text-blue-600 dark:text-blue-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`} />
                      <div>
                        <Badge variant="outline" className="text-xs mr-2">
                          {change.type}
                        </Badge>
                        <span className="text-gray-700 dark:text-gray-300">{change.text}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Subscribe to our changelog to receive notifications about new releases and updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://bizbot.store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact for Updates
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

