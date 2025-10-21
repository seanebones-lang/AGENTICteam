'use client'

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
  ArrowDownRight
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const executionData = [
  { time: '00:00', executions: 120, success: 118, failed: 2 },
  { time: '04:00', executions: 89, success: 87, failed: 2 },
  { time: '08:00', executions: 245, success: 242, failed: 3 },
  { time: '12:00', executions: 389, success: 385, failed: 4 },
  { time: '16:00', executions: 421, success: 418, failed: 3 },
  { time: '20:00', executions: 312, success: 309, failed: 3 },
]

const agentUsageData = [
  { name: 'Knowledge Base', value: 35, executions: 89340 },
  { name: 'Ticket Resolver', value: 25, executions: 67540 },
  { name: 'Analytics Engine', value: 15, executions: 56780 },
  { name: 'Data Processor', value: 12, executions: 52100 },
  { name: 'Security Scanner', value: 13, executions: 45230 },
]

const performanceData = [
  { metric: 'Avg Latency', value: '1.8s', change: -12, status: 'good' },
  { metric: 'Success Rate', value: '99.2%', change: 0.3, status: 'good' },
  { metric: 'Throughput', value: '1,576/hr', change: 8, status: 'good' },
  { metric: 'Error Rate', value: '0.8%', change: -0.2, status: 'good' },
]

const recentExecutions = [
  { id: 'exec-1234', agent: 'Knowledge Base', status: 'success', duration: '0.9s', time: '2 min ago' },
  { id: 'exec-1235', agent: 'Ticket Resolver', status: 'success', duration: '1.2s', time: '3 min ago' },
  { id: 'exec-1236', agent: 'Security Scanner', status: 'success', duration: '2.3s', time: '5 min ago' },
  { id: 'exec-1237', agent: 'Analytics Engine', status: 'failed', duration: '0.5s', time: '7 min ago' },
  { id: 'exec-1238', agent: 'Data Processor', status: 'success', duration: '3.5s', time: '9 min ago' },
]

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time analytics and system performance
            </p>
          </div>
          <Badge className="px-4 py-2">
            <Activity className="mr-2 h-4 w-4" />
            Live
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="secondary" className="text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8.2%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">1,576</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Executions Today</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <Badge variant="secondary" className="text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                0.3%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">99.2%</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <Badge variant="secondary" className="text-green-600">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                12%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">1.8s</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Latency</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <Badge variant="secondary" className="text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5.1%
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-1">10</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Agents</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Execution Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Execution Timeline (24h)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={executionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="success" stackId="1" stroke="#10b981" fill="#10b981" name="Success" />
                <Area type="monotone" dataKey="failed" stackId="1" stroke="#ef4444" fill="#ef4444" name="Failed" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Agent Usage Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Agent Usage Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={agentUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {agentUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {performanceData.map((metric) => (
              <div key={metric.metric} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{metric.metric}</span>
                  <Badge variant={metric.change > 0 ? 'default' : 'secondary'} className="text-xs">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{metric.value}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Executions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Executions</h3>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentExecutions.map((execution) => (
              <div key={execution.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-4">
                  {execution.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold">{execution.agent}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{execution.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-semibold">{execution.duration}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{execution.time}</p>
                  </div>
                  <Badge variant={execution.status === 'success' ? 'default' : 'destructive'}>
                    {execution.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

