'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Agents', href: '/agents' },
  { name: 'Playground', href: '/playground' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Support', href: '/support' },
  { name: 'Docs', href: '/docs' },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">Agent Marketplace</span>
          </Link>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-sm font-semibold leading-6 transition-colors hover:text-blue-600',
                pathname === item.href
                  ? 'text-blue-600'
                  : 'text-gray-900 dark:text-gray-100'
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
          <ThemeToggle />
          <Button variant="ghost" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-2 px-6 pb-6 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-800',
                  pathname === item.href
                    ? 'bg-gray-50 dark:bg-gray-800 text-blue-600'
                    : ''
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t">
              <ThemeToggle />
              <Button variant="ghost" className="flex-1" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

