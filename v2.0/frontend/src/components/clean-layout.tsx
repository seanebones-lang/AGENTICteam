import { ReactNode } from "react";

interface CleanLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: string;
}

export function CleanLayout({ 
  children, 
  title, 
  subtitle, 
  maxWidth = "1000px" 
}: CleanLayoutProps) {
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      minHeight: '100vh', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      {title && (
        <section style={{ 
          padding: '60px 20px 40px', 
          textAlign: 'center', 
          maxWidth: maxWidth, 
          margin: '0 auto' 
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '600', 
            color: '#000000', 
            marginBottom: subtitle ? '16px' : '32px',
            lineHeight: '1.1'
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ 
              fontSize: '18px', 
              color: '#666666', 
              marginBottom: '32px',
              lineHeight: '1.5'
            }}>
              {subtitle}
            </p>
          )}
        </section>
      )}
      
      <main style={{ 
        maxWidth: maxWidth, 
        margin: '0 auto', 
        padding: '0 20px'
      }}>
        {children}
      </main>
    </div>
  );
}

export function CleanCard({ 
  children, 
  padding = "24px" 
}: { 
  children: ReactNode; 
  padding?: string; 
}) {
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      padding: padding, 
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      {children}
    </div>
  );
}

export function CleanButton({ 
  href, 
  children, 
  variant = "primary" 
}: { 
  href: string; 
  children: ReactNode; 
  variant?: "primary" | "secondary"; 
}) {
  const isPrimary = variant === "primary";
  
  return (
    <a 
      href={href}
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        color: isPrimary ? '#ffffff' : '#0070f3',
        backgroundColor: isPrimary ? '#0070f3' : 'transparent',
        border: isPrimary ? 'none' : '1px solid #e2e8f0',
        borderRadius: '6px',
        textDecoration: 'none',
        transition: 'all 0.2s ease'
      }}
    >
      {children}
    </a>
  );
}
