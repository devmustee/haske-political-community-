import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionDivider } from "@/components/ui/section-divider";

export function DetailHeader({
  backHref,
  backLabel,
  badges,
  title,
  meta,
  className,
}: {
  backHref: string;
  backLabel: string;
  badges?: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative border-b border-border bg-gradient-to-b from-secondary/30 to-background", className)}>
      {/* Decorative dot pattern */}
      <div className="hero-dot-pattern absolute inset-0 text-primary/[0.03]" />
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href={backHref}
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" /> {backLabel}
        </Link>
        {badges && <div className="mt-6 flex flex-wrap items-center gap-2">{badges}</div>}
        <h1 className="mt-5 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
        {meta && <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">{meta}</div>}
      </div>
      {/* Bottom gradient line */}
      <SectionDivider tone="primary" opacity={15} position="absolute-bottom" />
    </div>
  );
}

export function DetailMetaItem({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <Icon className="size-4 text-primary/60" /> {children}
    </span>
  );
}
