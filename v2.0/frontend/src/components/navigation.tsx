"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Agents", href: "/agents" },
  { name: "Playground", href: "/playground" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Pricing", href: "/pricing" },
  { name: "Support", href: "/support" },
  { name: "Docs", href: "/docs" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav style={{ 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: '0',
      zIndex: '50'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {/* Logo */}
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          textDecoration: 'none'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#0070f3', 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '14px' }}>AM</span>
          </div>
          <span style={{ 
            fontWeight: '600', 
            fontSize: '20px', 
            color: '#000000'
          }}>
            Agent Marketplace
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    color: isActive ? '#0070f3' : '#666666',
                    backgroundColor: isActive ? '#f0f9ff' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link 
              href="/login"
              style={{
                padding: '8px 16px',
                fontSize: '16px',
                fontWeight: '500',
                color: '#666666',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Log in
            </Link>
            <Link 
              href="/signup"
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#0070f3',
                borderRadius: '6px',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
