import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SupportChatbot } from '@/components/support-chatbot'

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
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <SupportChatbot />
        </Providers>
      </body>
    </html>
  )
}
