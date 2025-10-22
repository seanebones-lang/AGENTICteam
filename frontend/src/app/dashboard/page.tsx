'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Zap, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bizbot-api.onrender.com'
const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

interface PlatformStats {
  total_users: number
  total_executions: number
  total_revenue: number
  popular_agents: Array<{ agent_id: string; executions: number }>
}

interface Execution {
  id: string
  package_id: string
  status: string
  execution_time: number
  created_at: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, executionsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/stats`),
        fetch(`${API_BASE_URL}/api/v1/user/executions`)
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData.platform_stats)
      }

      if (executionsRes.ok) {
        const executionsData = await executionsRes.json()
        setExecutions(executionsData.executions || [])
      }

      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const successRate = executions.length > 0
    ? ((executions.filter(e => e.status === 'success').length / executions.length) * 100).toFixed(1)
    : '0.0'

  const avgExecutionTime = executions.length > 0
    ? (executions.reduce((sum, e) => sum + (e.execution_time || 0), 0) / executions.length).toFixed(2)
    : '0.00'
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time analytics and system performance • Updated {formatTimeAgo(lastUpdated.toISOString())}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDashboardData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge className="px-4 py-2 bg-green-500">
              <Activity className="mr-2 h-4 w-4" />
              Live
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1 dark:text-white">
              {loading ? '...' : (stats?.total_executions || 0).toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Executions</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1 dark:text-white">{successRate}%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1 dark:text-white">{avgExecutionTime}s</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Execution Time</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1 dark:text-white">
              {loading ? '...' : (stats?.total_users || 0).toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
          </Card>
        </div>

        {/* Popular Agents */}
        {stats && stats.popular_agents && stats.popular_agents.length > 0 && (
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Most Popular Agents</h3>
            <div className="space-y-3">
              {stats.popular_agents.slice(0, 5).map((agent, index) => (
                <div key={agent.agent_id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium dark:text-white">{agent.agent_id}</span>
                  </div>
                  <Badge variant="outline">
                    {agent.executions.toLocaleString()} executions
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Executions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Recent Executions</h3>
            <Badge variant="outline" className="text-xs">
              {executions.length} total
            </Badge>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 dark:text-gray-400">Loading executions...</p>
              </div>
            ) : executions.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No executions yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Execute an agent to see data here
                </p>
              </div>
            ) : (
              executions.slice(0, 10).map((execution) => (
                <div key={execution.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    {execution.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                    <div>
                      <p className="font-semibold dark:text-white">{execution.package_id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{execution.id.substring(0, 16)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-semibold dark:text-white">{execution.execution_time.toFixed(2)}s</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{formatTimeAgo(execution.created_at)}</p>
                    </div>
                    <Badge variant={execution.status === 'success' ? 'default' : 'destructive'}>
                      {execution.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

