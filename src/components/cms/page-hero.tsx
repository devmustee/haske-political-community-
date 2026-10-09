import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionDivider } from "@/components/ui/section-divider";
import { Button } from "@/components/ui/button";

export function PageHero({
  eyebrow,
  title,
  description,
  watermark,
  badge,
  actions,
  primaryAction,
  secondaryAction,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional short word rendered as giant faint background type, e.g. "Agenda" */
  watermark?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-secondary/50 via-background to-background",
        className
      )}
    >
      {/* Background Dot Texture */}
      <div className="hero-dot-pattern absolute inset-0 text-primary/[0.04]" />

      {/* Atmospheric Aurora & Glow Orbs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-primary/8 blur-[120px] animate-pulse-glow" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-[360px] w-[360px] rounded-full bg-accent/8 blur-[100px] animate-pulse-glow animation-delay-300" />

      {/* Watermark Typographic Sculpture */}
      {watermark && (
        <p className="watermark-text inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none">
          {watermark}
        </p>
      )}

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:py-24 lg:py-28">
        {/* Eyebrow & Live Beacon */}
        {(eyebrow || badge) && (
          <div className="flex flex-wrap items-center gap-3 animate-slide-up">
            {eyebrow && (
              <div className="inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-background/80 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary backdrop-blur-sm shadow-soft">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-beacon-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
                {eyebrow}
              </div>
            )}
            {badge}
          </div>
        )}

        {/* Fluid Title */}
        <h1 className="mt-5 max-w-4xl text-fluid-h1 text-foreground animate-slide-up animation-delay-100">
          {title}
        </h1>

        {/* Description Lead */}
        {description && (
          <p className="mt-5 max-w-2xl text-lead leading-relaxed text-muted-foreground animate-slide-up animation-delay-200">
            {description}
          </p>
        )}

        {/* Action Slots: equal full-width stack on phones, a row from sm */}
        {(actions || primaryAction || secondaryAction) && (
          <div className="mt-8 flex max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center animate-slide-up animation-delay-300">
            {primaryAction && (
              <Button asChild size="lg" variant="gold-shimmer" className="shadow-glow-gold">
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
            )}
            {secondaryAction && (
              <Button asChild size="lg" variant="outline">
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            )}
            {actions}
          </div>
        )}
      </div>

      {/* Bottom Gradient Accent Divider */}
      <SectionDivider tone="accent" opacity={20} position="absolute-bottom" />
    </div>
  );
}
