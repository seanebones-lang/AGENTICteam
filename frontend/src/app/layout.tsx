import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { CleanNavigation } from '@/components/clean-navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agent Marketplace - Agentic AI Solutions',
  description: 'Deploy, manage, and scale AI agents with military-grade security. 99.999% uptime, 45ms global latency.',
  keywords: 'AI agents, enterprise AI, agent marketplace, autonomous agents, AI automation',
  authors: [{ name: 'Sean McDonnell', url: 'https://bizbot.store' }],
  openGraph: {
    title: 'Agent Marketplace - Agentic AI Solutions',
    description: 'Deploy, manage, and scale AI agents with military-grade security',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ backgroundColor: '#ffffff', color: '#000000', margin: '0', padding: '0' }}>
        <CleanNavigation />
        {children}
      </body>
    </html>
  )
}
