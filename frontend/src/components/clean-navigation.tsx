"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function CleanNavigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AM</span>
            </div>
            <span className="font-semibold text-lg">
              Agent Marketplace
            </span>
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { name: "Agents", href: "/agents" },
              { name: "Playground", href: "/playground" },
              { name: "Pricing", href: "/pricing" },
              { name: "Docs", href: "/docs" },
              { name: "Support", href: "/support" }
            ].map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right side - Auth buttons and theme toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link 
              href="/login"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
