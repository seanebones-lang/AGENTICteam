import { ModernLayout, ModernCard, ModernButton, ModernSection } from "@/components/modern-layout";
import { ArrowRight } from "lucide-react";

export default function UagentsPage() {
  return (
    <ModernLayout
      title="agents"
      subtitle="Professional AI agent platform"
      description="This page is being updated with our new modern design."
      showHero={true}
    >
      <ModernSection title="agents">
        <ModernCard className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">agents</h2>
          <p className="text-muted-foreground mb-6">
            This page is being updated with our new modern design.
          </p>
          <div className="flex gap-4 justify-center">
            <ModernButton href="/agents">
              Try Agents
            </ModernButton>
            <ModernButton href="/docs" variant="outline">
              Documentation
            </ModernButton>
          </div>
        </ModernCard>
      </ModernSection>
    </ModernLayout>
  );
}
