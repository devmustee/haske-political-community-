import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background select-none cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "relative overflow-hidden bg-primary text-primary-foreground shadow-ambient hover:bg-primary/95 hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0",
        gold:
          "relative overflow-hidden bg-accent text-accent-foreground shadow-ambient hover:bg-accent/90 hover:shadow-glow-gold hover:-translate-y-0.5 active:translate-y-0 font-bold",
        "gold-shimmer":
          "relative overflow-hidden bg-gradient-to-r from-accent via-accent-hover to-accent text-accent-foreground shadow-glow-gold hover:-translate-y-0.5 hover:shadow-card-gold active:translate-y-0 font-bold ring-1 ring-white/20",
        destructive:
          "bg-destructive text-destructive-foreground shadow-soft hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-border/80 bg-background/50 backdrop-blur-sm hover:border-primary/40 hover:bg-primary/8 hover:text-primary hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "hover:bg-primary/8 hover:text-primary active:bg-primary/12",
        link:
          "text-primary underline-offset-4 hover:underline rounded-none p-0 h-auto",
        glass:
          "glass border border-white/20 text-foreground hover:bg-white/20 shadow-soft hover:shadow-elevated hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-5 py-2 max-sm:min-h-11",
        sm: "h-8 px-4 text-xs font-semibold max-sm:min-h-10",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-base font-bold tracking-wide",
        icon: "size-9 max-sm:min-h-11 max-sm:min-w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
