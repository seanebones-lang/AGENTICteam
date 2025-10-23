import { ModernLayout, ModernCard, ModernButton, ModernSection } from "@/components/modern-layout";
import { ArrowLeft, Play, Star, Clock, Users } from "lucide-react";

export default function AgentDetailPage() {
  return (
    <ModernLayout
      title="Agent Details"
      subtitle="Detailed information about this agent"
      description="Learn more about this agent's capabilities, performance metrics, and usage."
      showHero={true}
    >
      <div className="mb-6">
        <ModernButton href="/agents" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agents
        </ModernButton>
      </div>

      <ModernSection title="Agent Information">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ModernCard className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">Customer Support Agent</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">4.8 rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">5.1M requests</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Intelligent customer service agent with natural language processing capabilities. 
                    Handles customer inquiries, provides support, and escalates complex issues to human agents.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/20 px-3 py-1 text-sm text-blue-700 dark:text-blue-300">
                      Multilingual Support
                    </span>
                    <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/20 px-3 py-1 text-sm text-green-700 dark:text-green-300">
                      24/7 Availability
                    </span>
                    <span className="inline-flex items-center rounded-full bg-purple-100 dark:bg-purple-900/20 px-3 py-1 text-sm text-purple-700 dark:text-purple-300">
                      Context Awareness
                    </span>
                    <span className="inline-flex items-center rounded-full bg-orange-100 dark:bg-orange-900/20 px-3 py-1 text-sm text-orange-700 dark:text-orange-300">
                      Sentiment Analysis
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-green-500">99.2%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-blue-500">1.2s</div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-purple-500">85%</div>
                      <div className="text-sm text-muted-foreground">Resolution Rate</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="text-2xl font-bold text-orange-500">4.7</div>
                      <div className="text-sm text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </ModernCard>
          </div>

          <div className="space-y-6">
            <ModernCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <ModernButton href="/playground?agent=customer-support" className="w-full">
                  <Play className="mr-2 h-4 w-4" />
                  Test Agent
                </ModernButton>
                <ModernButton href="/dashboard" variant="outline" className="w-full">
                  View Analytics
                </ModernButton>
                <ModernButton href="/docs" variant="outline" className="w-full">
                  Documentation
                </ModernButton>
              </div>
            </ModernCard>

            <ModernCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Pricing</h3>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">$0.02</div>
                <div className="text-sm text-muted-foreground mb-4">per request</div>
                <ModernButton href="/pricing" className="w-full">
                  View Pricing Plans
                </ModernButton>
              </div>
            </ModernCard>
          </div>
        </div>
      </ModernSection>
    </ModernLayout>
  );
}
