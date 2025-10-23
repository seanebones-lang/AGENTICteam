"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState({
    name: "Sean McDonnell",
    email: "seanebones@gmail.com",
    tier: "Basic",
    credits: 25.0,
    totalQueries: 47,
    successRate: 98.7
  });

  const [recentActivity] = useState([
    { agent: "Ticket Resolver", query: "Customer billing issue", time: "2 minutes ago", status: "success" },
    { agent: "Security Scanner", query: "Code vulnerability scan", time: "15 minutes ago", status: "success" },
    { agent: "Knowledge Base", query: "API documentation lookup", time: "1 hour ago", status: "success" },
    { agent: "Data Processor", query: "CSV data transformation", time: "2 hours ago", status: "success" },
  ]);

  const agentUsage = [
    { name: "Ticket Resolver", usage: 15, color: "#0070f3" },
    { name: "Security Scanner", usage: 12, color: "#00d4aa" },
    { name: "Knowledge Base", usage: 8, color: "#ff6b6b" },
    { name: "Data Processor", usage: 6, color: "#4ecdc4" },
    { name: "Others", usage: 6, color: "#95a5a6" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user.name}
            </p>
          </div>
          <Button asChild>
            <Link href="/agents">Use Agents</Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits</CardTitle>
              <span className="text-2xl">💳</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.credits}</div>
              <p className="text-xs text-muted-foreground">
                Available credits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <span className="text-2xl">📊</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.totalQueries}</div>
              <p className="text-xs text-muted-foreground">
                Across all agents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <span className="text-2xl">✅</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.successRate}%</div>
              <p className="text-xs text-muted-foreground">
                Query success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan</CardTitle>
              <span className="text-2xl">🎯</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.tier}</div>
              <p className="text-xs text-muted-foreground">
                <Link href="/pricing" className="text-blue-600 hover:text-blue-500">
                  Upgrade →
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest agent interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{activity.agent}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {activity.query}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                      <div className="text-xs">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                          {activity.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/history">View all history</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agent Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Usage</CardTitle>
              <CardDescription>
                Your most used agents this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentUsage.map((agent, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{agent.name}</span>
                        <span className="text-sm text-muted-foreground">{agent.usage}</span>
                      </div>
                      <div className="mt-1 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            backgroundColor: agent.color,
                            width: `${(agent.usage / 15) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/agents/ticket-resolver">
                    🎫 Resolve Ticket
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/agents/security-scanner">
                    🔒 Security Scan
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/agents/knowledge-base">
                    📚 Ask Question
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/pricing">
                    💳 Buy Credits
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Info */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Plan:</span>
                  <span className="text-sm text-muted-foreground">{user.tier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Member since:</span>
                  <span className="text-sm text-muted-foreground">October 2025</span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      Security Settings
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
