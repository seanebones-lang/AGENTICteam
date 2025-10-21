import Link from 'next/link'
import { Zap, Phone, Globe } from 'lucide-react'

const navigation = {
  product: [
    { name: 'Agents', href: '/agents' },
    { name: 'Playground', href: '/playground' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Documentation', href: '/docs' },
  ],
  company: [
    { name: 'About', href: '/about' },
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
            
            {/* Legal Notice */}
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                ⚠️ PROPRIETARY SOFTWARE - FOR SALE
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                This software is sold "AS IS" without warranty. All rights reserved.
              </p>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100">
                  Contact for Purchase:
                </p>
                <div className="flex items-center gap-2 text-xs text-yellow-800 dark:text-yellow-200">
                  <Globe className="h-3 w-3" />
                  <a href="https://bizbot.store" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold">
                    bizbot.store
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs text-yellow-800 dark:text-yellow-200">
                  <Phone className="h-3 w-3" />
                  <a href="tel:+18176759898" className="hover:underline font-semibold">
                    (817) 675-9898
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
          <div className="flex gap-6">
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

