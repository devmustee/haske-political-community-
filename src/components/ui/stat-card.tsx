import { cn } from "@/lib/utils";
import { formatCount } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100;
  const h = 32;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-8 w-full", className)}>
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.30 0.08 155)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="oklch(0.30 0.08 155)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#sparkFill)" />
      <polyline points={points} className="fill-none stroke-primary" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  sparkline,
  className,
}: {
  label: string;
  value: number;
  icon?: React.ElementType;
  /** Percent change vs. the prior period, e.g. 12.4 or -3.1 */
  trend?: number;
  sparkline?: number[];
  className?: string;
}) {
  const hasTrend = typeof trend === "number" && Number.isFinite(trend);
  const trendUp = hasTrend && trend! >= 0;

  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        {Icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-4" />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold tabular-nums tracking-tight">{formatCount(value)}</p>
        {hasTrend && (
          <span
            className={cn(
              "mb-0.5 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              trendUp ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-destructive/10 text-destructive"
            )}
          >
            {trendUp ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(trend!).toFixed(0)}%
          </span>
        )}
      </div>

      {sparkline && sparkline.length > 1 && <Sparkline data={sparkline} className="mt-3" />}
    </div>
  );
}
