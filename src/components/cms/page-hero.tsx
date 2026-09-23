import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-border bg-secondary/30", className)}>
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl font-serif text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
