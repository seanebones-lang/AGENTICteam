"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function CleanNavigation() {
  const pathname = usePathname();

  return (
    <nav style={{ 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #f1f5f9',
      position: 'sticky',
      top: '0',
      zIndex: '50',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px'
      }}>
        {/* Logo */}
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          textDecoration: 'none'
        }}>
          <div style={{ 
            width: '28px', 
            height: '28px', 
            backgroundColor: '#0070f3', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '12px' }}>AM</span>
          </div>
          <span style={{ 
            fontWeight: '600', 
            fontSize: '18px', 
            color: '#000000'
          }}>
            Agent Marketplace
          </span>
        </Link>

        {/* Main Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  color: isActive ? '#0070f3' : '#666666',
                  padding: '6px 12px',
                  borderRadius: '4px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link 
            href="/login"
            style={{
              padding: '6px 12px',
              fontSize: '15px',
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
              padding: '8px 16px',
              fontSize: '15px',
              fontWeight: '500',
              color: '#ffffff',
              backgroundColor: '#0070f3',
              borderRadius: '4px',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
