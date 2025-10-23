import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Agent definitions with minimalistic design
const agents = [
  {
    id: "ticket-resolver",
    name: "Ticket Resolver",
    description: "AI-powered ticket classification and resolution",
    icon: "🎫",
    category: "Support",
    model: "Haiku",
    credits: 3,
  },
  {
    id: "security-scanner", 
    name: "Security Scanner",
    description: "OWASP Top 10 vulnerability detection",
    icon: "🔒",
    category: "Security",
    model: "Sonnet",
    credits: 5,
  },
  {
    id: "knowledge-base",
    name: "Knowledge Base",
    description: "Intelligent knowledge retrieval and Q&A",
    icon: "📚",
    category: "Support",
    model: "Haiku",
    credits: 2,
  },
  {
    id: "incident-responder",
    name: "Incident Responder", 
    description: "Intelligent incident triage and root cause analysis",
    icon: "🚨",
    category: "Operations",
    model: "Sonnet",
    credits: 4,
  },
  {
    id: "data-processor",
    name: "Data Processor",
    description: "Multi-source data extraction and transformation",
    icon: "📊",
    category: "Analytics",
    model: "Sonnet",
    credits: 4,
  },
  {
    id: "report-generator",
    name: "Report Generator",
    description: "AI-powered report generation with insights",
    icon: "📈",
    category: "Analytics",
    model: "Sonnet",
    credits: 5,
  },
  {
    id: "deployment-agent",
    name: "Deployment Agent",
    description: "Automated deployment planning and execution",
    icon: "🚀",
    category: "DevOps",
    model: "Sonnet",
    credits: 4,
  },
  {
    id: "audit-agent",
    name: "Audit Agent",
    description: "Compliance and security auditing",
    icon: "🔍",
    category: "Security",
    model: "Sonnet",
    credits: 5,
  },
  {
    id: "workflow-orchestrator",
    name: "Workflow Orchestrator",
    description: "Multi-step workflow automation",
    icon: "⚙️",
    category: "Automation",
    model: "Sonnet",
    credits: 4,
  },
  {
    id: "escalation-manager",
    name: "Escalation Manager",
    description: "Smart escalation routing and management",
    icon: "📞",
    category: "Support",
    model: "Haiku",
    credits: 3,
  },
];

const categories = ["All", "Support", "Security", "Operations", "Analytics", "DevOps", "Automation"];

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            AI Agents
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            10 production-ready AI agents powered by Claude 4.5. 
            Universal free trial: 3 queries across all agents.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
              className="text-sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-3xl">{agent.icon}</div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">{agent.model}</div>
                    <div className="text-xs font-medium">{agent.credits} credits</div>
                  </div>
                </div>
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <CardDescription className="text-sm">
                  {agent.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {agent.category}
                  </span>
                  <Button size="sm" asChild>
                    <Link href={`/agents/${agent.id}`}>
                      Try Now
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">10</div>
            <div className="text-sm text-muted-foreground">AI Agents</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">98.7%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">2.1s</div>
            <div className="text-sm text-muted-foreground">Avg Response</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">99.99%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Ready to get started?</h2>
          <p className="text-muted-foreground">
            Try any agent with 3 free queries. No credit card required.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/playground">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
