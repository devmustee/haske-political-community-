import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.ComponentProps<"div"> {
  interactive?: boolean;
  variant?: "default" | "glass" | "elevated" | "gold";
  highlight?: boolean;
}

function Card({
  className,
  interactive = false,
  variant = "default",
  highlight = true,
  children,
  ...props
}: CardProps) {
  const variantClass = {
    default: "border border-border/80 bg-card text-card-foreground shadow-ambient",
    glass: "surface-glass-card text-card-foreground",
    elevated: "border border-border/80 bg-card text-card-foreground shadow-elevated",
    gold: "border border-accent/30 bg-card text-card-foreground shadow-card-gold",
  }[variant];

  return (
    <div
      data-slot="card"
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300 ease-out",
        variantClass,
        interactive && "card-link cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Specular top highlight */}
      {highlight && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-70" />
      )}
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("font-serif font-semibold leading-tight tracking-tight", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
