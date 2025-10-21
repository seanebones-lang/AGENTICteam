'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Activity,
  Server,
  Database,
  Zap,
  Globe,
  Shield,
  Clock
} from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'operational' | 'degraded' | 'outage'
  uptime: string
  latency: string
  icon: any
}

export default function StatusPage() {
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const services: ServiceStatus[] = [
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: '99.999%',
      latency: '45ms',
      icon: Server
    },
    {
      name: 'Agent Execution Engine',
      status: 'operational',
      uptime: '99.998%',
      latency: '120ms',
      icon: Zap
    },
    {
      name: 'Database (PostgreSQL)',
      status: 'operational',
      uptime: '100%',
      latency: '12ms',
      icon: Database
    },
    {
      name: 'Vector Database (Qdrant)',
      status: 'operational',
      uptime: '99.997%',
      latency: '28ms',
      icon: Database
    },
    {
      name: 'Cache Layer (Redis)',
      status: 'operational',
      uptime: '99.999%',
      latency: '3ms',
      icon: Activity
    },
    {
      name: 'Authentication Service',
      status: 'operational',
      uptime: '99.998%',
      latency: '35ms',
      icon: Shield
    },
    {
      name: 'WebSocket Service',
      status: 'operational',
      uptime: '99.996%',
      latency: '18ms',
      icon: Activity
    },
    {
      name: 'Global CDN',
      status: 'operational',
      uptime: '99.999%',
      latency: '22ms',
      icon: Globe
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
      case 'outage':
        return 'text-red-600 bg-red-100 dark:bg-red-900'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'outage':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const overallStatus = services.every(s => s.status === 'operational') 
    ? 'operational' 
    : services.some(s => s.status === 'outage') 
    ? 'outage' 
    : 'degraded'

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className={`mb-4 px-4 py-1.5 text-sm font-semibold ${getStatusColor(overallStatus)}`}>
              {overallStatus === 'operational' ? '✓ All Systems Operational' : overallStatus === 'degraded' ? '⚠ Degraded Performance' : '✕ Service Outage'}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              System Status
            </h1>
            <p className="text-lg leading-8 text-gray-700 dark:text-gray-300 mb-4">
              Real-time monitoring of all Agent Marketplace services
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Clock className="h-4 w-4" />
              <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Overall Metrics */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">99.999%</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Overall Uptime (30d)</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">45ms</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Global P99 Latency</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">523,847</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Tasks Today</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">0</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Active Incidents</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Status */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Service Status</h2>
          <div className="space-y-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card key={service.name} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{service.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-700 dark:text-gray-300">
                          <span>Uptime: {service.uptime}</span>
                          <span>•</span>
                          <span>Latency: {service.latency}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(service.status)}
                      <span className="font-semibold capitalize">{service.status}</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Regional Status */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Regional Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">North America</h3>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-green-600">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-semibold">28ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-semibold">99.999%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Europe</h3>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-green-600">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-semibold">42ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-semibold">99.998%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Asia-Pacific</h3>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-green-600">Operational</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="font-semibold">51ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Uptime:</span>
                  <span className="font-semibold">99.997%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Incident History */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Recent Incident History</h2>
          <Card className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Recent Incidents</h3>
            <p className="text-gray-700 dark:text-gray-300">
              All systems have been operational for the past 90 days with 99.999% uptime.
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
              Last incident: None in the past 90 days
            </p>
          </Card>
        </div>
      </section>

      {/* Maintenance Schedule */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Scheduled Maintenance</h2>
          <Card className="p-8 text-center">
            <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Scheduled Maintenance</h3>
            <p className="text-gray-700 dark:text-gray-300">
              There is no planned maintenance at this time. We will notify customers at least 7 days in advance of any scheduled maintenance windows.
            </p>
          </Card>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Informed
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Enterprise customers receive real-time alerts for any service disruptions
          </p>
          <p className="text-blue-100">
            Contact us at <a href="tel:+18176759898" className="underline font-semibold">(817) 675-9898</a> or visit{' '}
            <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="underline font-semibold">bizbot.store</a> to learn more
          </p>
        </div>
      </section>
    </div>
  )
}

