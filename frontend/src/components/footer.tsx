import Link from 'next/link'
import { Zap, Mail } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const navigation = {
  product: [
    { name: 'Agents', href: '/agents' },
    { name: 'Playground', href: '/playground' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Documentation', href: '/docs' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Support', href: '/support' },
    { name: 'Contact', href: 'https://bizbot.store' },
    { name: 'Status', href: '/status' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'License', href: '/license' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">Agent Marketplace</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-4">
              Agentic AI Solutions with military-grade security. Deploy, manage, and scale autonomous agents.
            </p>
            
            {/* Contact Information */}
            <div className="mb-4 space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Contact Us
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:support@bizbot.store" className="hover:text-blue-600 dark:hover:text-blue-400">
                    support@bizbot.store
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:hello@bizbot.store" className="hover:text-blue-600 dark:hover:text-blue-400">
                    hello@bizbot.store
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:info@bizbot.store" className="hover:text-blue-600 dark:hover:text-blue-400">
                    info@bizbot.store
                  </a>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-gray-600 dark:text-gray-400">All systems operational</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            © 2025 Sean McDonnell. All rights reserved. Proprietary Software.
          </p>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            {navigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

