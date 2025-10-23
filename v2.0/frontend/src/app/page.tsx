import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section - Minimalistic */}
        <div className="text-center space-y-8 mb-20">
          <h1 className="text-5xl font-bold tracking-tight">
            AI Agents for Enterprise
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            10 production-ready AI agents with 98.7% success rate. 
            Deploy anywhere: SaaS, Docker, Kubernetes, Edge, Air-gapped.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/agents">Try Free (3 Queries)</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/docs/deploy">Deploy Guide</Link>
            </Button>
          </div>

          {/* Key Stats */}
          <div className="flex justify-center gap-8 text-sm text-muted-foreground mt-8">
            <div>✅ 10 Agents</div>
            <div>✅ 98.7% Success</div>
            <div>✅ 2.1s Response</div>
            <div>✅ 7 Deploy Methods</div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Universal Free Trial</CardTitle>
              <CardDescription>
                3 queries across ALL agents before paywall
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No "special" agent focus - all 10 agents have equal access from day one.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>JWT Authentication</CardTitle>
              <CardDescription>
                Secure sessions with refresh tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                15-minute access tokens with 7-day refresh cycles for seamless experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme System</CardTitle>
              <CardDescription>
                Light/Dark mode with system detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes with the button in the bottom-right corner.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-4 border rounded-lg">
              <div className="font-medium">Frontend</div>
              <div className="text-muted-foreground">Next.js 16 + React 19.2</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium">Backend</div>
              <div className="text-muted-foreground">FastAPI 0.119.1 + Python 3.13</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium">AI Models</div>
              <div className="text-muted-foreground">Claude Haiku/Sonnet 4.5</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium">Databases</div>
              <div className="text-muted-foreground">PostgreSQL 18 + Redis 8.0.4</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}