import { ModernLayout, ModernCard, ModernButton, ModernSection, ModernGrid } from "@/components/modern-layout";
import { Zap, Shield, Clock, Users, ArrowRight, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <ModernLayout
      title="Agent Marketplace"
      subtitle="Deploy AI agents that actually work"
      description="Enterprise-grade AI agents with 99.7% success rate, military-grade security, and 45ms global latency."
      showHero={true}
    >
      {/* Hero CTA */}
      <div className="flex flex-col items-center gap-4 mb-16">
        <div className="flex gap-4">
          <ModernButton href="/agents" size="lg">
            Explore Agents
            <ArrowRight className="ml-2 h-4 w-4" />
          </ModernButton>
          <ModernButton href="/playground" variant="outline" size="lg">
            Try Playground
          </ModernButton>
        </div>
        <p className="text-sm text-muted-foreground">
          No credit card required • Start free • Deploy in minutes
        </p>
      </div>

      {/* Features Grid */}
      <ModernSection title="Why choose Agent Marketplace?" description="Built for enterprise scale with developer-first design">
        <ModernGrid cols={3}>
          <ModernCard hover className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">Lightning Fast</h3>
            </div>
            <p className="text-muted-foreground">
              45ms global latency with edge computing. Your agents respond instantly, anywhere in the world.
            </p>
          </ModernCard>

          <ModernCard hover className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold">Military Grade Security</h3>
            </div>
            <p className="text-muted-foreground">
              SOC 2 Type II compliant with end-to-end encryption. Your data is protected at every step.
            </p>
          </ModernCard>

          <ModernCard hover className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold">99.7% Uptime</h3>
            </div>
            <p className="text-muted-foreground">
              Enterprise SLA with automatic failover. Your agents are always available when you need them.
            </p>
          </ModernCard>
        </ModernGrid>
      </ModernSection>

      {/* Stats Section */}
      <ModernSection className="bg-muted/30">
        <ModernGrid cols={4}>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-2">99.7%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-2">45ms</div>
            <div className="text-sm text-muted-foreground">Global Latency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-2">10M+</div>
            <div className="text-sm text-muted-foreground">Requests/Day</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground mb-2">150+</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
        </ModernGrid>
      </ModernSection>

      {/* Agent Types */}
      <ModernSection title="Pre-built Agent Templates" description="Choose from our library of enterprise-ready agents">
        <ModernGrid cols={2}>
          <ModernCard hover className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Support</h3>
                <p className="text-muted-foreground mb-4">
                  Handle customer inquiries with natural language processing and context awareness.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/20 px-2 py-1 text-xs text-blue-700 dark:text-blue-300">
                    <CheckCircle className="h-3 w-3" />
                    Multilingual
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/20 px-2 py-1 text-xs text-green-700 dark:text-green-300">
                    <CheckCircle className="h-3 w-3" />
                    24/7 Available
                  </span>
                </div>
              </div>
            </div>
          </ModernCard>

          <ModernCard hover className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Security Scanner</h3>
                <p className="text-muted-foreground mb-4">
                  Automated security analysis and vulnerability detection for your applications.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/20 px-2 py-1 text-xs text-red-700 dark:text-red-300">
                    <CheckCircle className="h-3 w-3" />
                    Real-time
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-900/20 px-2 py-1 text-xs text-orange-700 dark:text-orange-300">
                    <CheckCircle className="h-3 w-3" />
                    Compliance
                  </span>
                </div>
              </div>
            </div>
          </ModernCard>
        </ModernGrid>
      </ModernSection>

      {/* CTA Section */}
      <ModernSection className="text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
            Ready to deploy your first agent?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of developers building the future with AI agents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ModernButton href="/signup" size="lg">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </ModernButton>
            <ModernButton href="/docs" variant="outline" size="lg">
              View Documentation
            </ModernButton>
          </div>
        </div>
      </ModernSection>
    </ModernLayout>
  );
}
