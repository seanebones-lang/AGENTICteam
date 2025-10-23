import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CleanLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: string;
  className?: string;
}

export function CleanLayout({ 
  children, 
  title, 
  subtitle, 
  maxWidth = "max-w-4xl",
  className
}: CleanLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      {title && (
        <section className="py-16 px-4 text-center">
          <div className={cn("mx-auto", maxWidth)}>
            <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        </section>
      )}
      
      <main className={cn("mx-auto px-4", maxWidth)}>
        {children}
      </main>
    </div>
  );
}

export function CleanCard({ 
  children, 
  padding = "p-6",
  className
}: { 
  children: ReactNode; 
  padding?: string;
  className?: string;
}) {
  return (
    <div className={cn(
      "bg-card text-card-foreground rounded-lg border border-border shadow-sm",
      padding,
      className
    )}>
      {children}
    </div>
  );
}

export function CleanButton({ 
  href, 
  children, 
  variant = "primary",
  className
}: { 
  href: string; 
  children: ReactNode; 
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const isPrimary = variant === "primary";
  
  return (
    <a 
      href={href}
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-md transition-colors",
        isPrimary 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      {children}
    </a>
  );
}
