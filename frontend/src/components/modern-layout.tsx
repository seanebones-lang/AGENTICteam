import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModernLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  showHero?: boolean;
}

export function ModernLayout({ 
  children, 
  title, 
  subtitle, 
  description,
  className,
  showHero = true
}: ModernLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {showHero && title && (
        <section className="border-b bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mb-8 text-xl text-muted-foreground sm:text-2xl">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="text-lg text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

export function ModernCard({ 
  children, 
  className,
  hover = false
}: { 
  children: ReactNode; 
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      hover && "transition-all hover:shadow-md hover:shadow-primary/5",
      className
    )}>
      {children}
    </div>
  );
}

export function ModernButton({ 
  href, 
  children, 
  variant = "default",
  size = "default",
  className
}: { 
  href: string; 
  children: ReactNode; 
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground"
  };
  
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg"
  };
  
  return (
    <a 
      href={href}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </a>
  );
}

export function ModernSection({ 
  children, 
  className,
  title,
  description
}: { 
  children: ReactNode; 
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className={cn("py-16", className)}>
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="mx-auto max-w-2xl text-center mb-12">
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function ModernGrid({ 
  children, 
  cols = 3,
  className
}: { 
  children: ReactNode; 
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const gridClasses = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };
  
  return (
    <div className={cn("grid gap-6", gridClasses[cols], className)}>
      {children}
    </div>
  );
}
