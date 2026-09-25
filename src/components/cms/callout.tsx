import { cn } from "@/lib/utils";

export function Callout({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon?: React.ElementType;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6 rounded-2xl border border-border bg-gradient-to-br from-secondary/40 to-secondary/10 p-6 shadow-soft transition-shadow hover:shadow-elevated", className)}>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
        )}
        <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</h2>
      </div>
      <div className="mt-3 text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

export function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-8 border-l-2 border-primary/20 pl-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</h2>
      <p className="mt-2 text-[15px] leading-relaxed">{children}</p>
    </div>
  );
}
