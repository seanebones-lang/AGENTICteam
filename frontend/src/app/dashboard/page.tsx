'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Clock, 
  CheckCircle,
  XCircle,
  Users,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Bot,
  Star
} from 'lucide-react'
import { getCredits } from '@/lib/credits'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bizbot-api.onrender.com'

interface DashboardStats {
  total_executions: number
  successful_executions: number
  failed_executions: number
  total_credits_used: number
  total_spent: number
  avg_execution_time: number
  success_rate: number
  credits_remaining: number
}

interface RecentExecution {
  id: string
  agent_name: string
  status: 'success' | 'failed'
  duration: number
  cost: number
  timestamp: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_executions: 0,
    successful_executions: 0,
    failed_executions: 0,
    total_credits_used: 0,
    total_spent: 0,
    avg_execution_time: 0,
    success_rate: 0,
    credits_remaining: 0
  })
  
  const [recentExecutions, setRecentExecutions] = useState<RecentExecution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load from localStorage for now
    const savedExecutions = localStorage.getItem('execution_history')
    if (savedExecutions) {
      const executions = JSON.parse(savedExecutions)
      setRecentExecutions(executions.slice(0, 10))
      
      // Calculate stats
      const total = executions.length
      const successful = executions.filter((e: RecentExecution) => e.status === 'success').length
      const failed = total - successful
      const totalSpent = executions.reduce((sum: number, e: RecentExecution) => sum + e.cost, 0)
      const avgTime = executions.length > 0 
        ? executions.reduce((sum: number, e: RecentExecution) => sum + e.duration, 0) / executions.length 
        : 0
      
      setStats({
        total_executions: total,
        successful_executions: successful,
        failed_executions: failed,
        total_credits_used: total * 3, // Assuming 3 credits per execution
        total_spent: totalSpent,
        avg_execution_time: avgTime,
        success_rate: total > 0 ? (successful / total) * 100 : 0,
        credits_remaining: getCredits().remaining
      })
    }
    setLoading(false)
  }, [])

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'blue' 
  }: { 
    title: string
    value: string | number
    icon: any
    trend?: 'up' | 'down'
    trendValue?: string
    color?: string
  }) => (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold dark:text-white">{value}</p>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 dark:text-white">Analytics Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your agent performance and usage metrics
            </p>
          </div>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Link href="/console">
              <Zap className="mr-2 h-4 w-4" />
              Go to Console
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Executions"
            value={stats.total_executions}
            icon={Activity}
            trend="up"
            trendValue="+12%"
            color="blue"
          />
          <StatCard
            title="Success Rate"
            value={`${stats.success_rate.toFixed(1)}%`}
            icon={CheckCircle}
            trend="up"
            trendValue="+5%"
            color="green"
          />
          <StatCard
            title="Total Spent"
            value={`$${stats.total_spent.toFixed(2)}`}
            icon={DollarSign}
            color="purple"
          />
          <StatCard
            title="Avg Response Time"
            value={`${stats.avg_execution_time.toFixed(2)}s`}
            icon={Clock}
            trend="down"
            trendValue="-8%"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-white flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Recent Executions
                </h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/console">View All</Link>
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 animate-pulse text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">Loading executions...</p>
                </div>
              ) : recentExecutions.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No executions yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Start using agents to see your activity here
                  </p>
                  <Button asChild>
                    <Link href="/console">Execute First Agent</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentExecutions.map((execution) => (
                    <div
                      key={execution.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        {execution.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold dark:text-white">{execution.agent_name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(execution.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium dark:text-white">{execution.duration.toFixed(2)}s</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">${execution.cost.toFixed(4)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Credits Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
              <h3 className="font-bold mb-2 flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Credits Remaining
              </h3>
              <div className="text-4xl font-bold mb-4">{stats.credits_remaining}</div>
              <Button size="sm" className="w-full bg-white !text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/pricing">Get More Credits</Link>
              </Button>
            </Card>

            {/* Performance Summary */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 dark:text-white">Performance Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Successful</span>
                    <span className="font-medium dark:text-white">{stats.successful_executions}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${stats.success_rate}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Failed</span>
                    <span className="font-medium dark:text-white">{stats.failed_executions}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${100 - stats.success_rate}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 dark:text-white">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/console">
                    <Zap className="mr-2 h-4 w-4" />
                    Execute Agent
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/agents">
                    <Bot className="mr-2 h-4 w-4" />
                    Browse Agents
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/profile">
                    <Star className="mr-2 h-4 w-4" />
                    View Profile
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
