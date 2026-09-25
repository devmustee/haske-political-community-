import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  watermark,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Optional short word rendered as giant faint background type, e.g. "Agenda" */
  watermark?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden border-b border-border bg-gradient-to-b from-secondary/40 to-secondary/10", className)}>
      <div className="hero-dot-pattern absolute inset-0 text-primary/[0.04]" />
      {watermark && <p className="watermark-text inset-x-0 top-0 text-center">{watermark}</p>}
      {/* Decorative gradient orb */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-accent/5 blur-[80px]" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {eyebrow && <p className="eyebrow-bar">{eyebrow}</p>}
        <h1 className="mt-5 max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
        {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    </div>
  );
}
