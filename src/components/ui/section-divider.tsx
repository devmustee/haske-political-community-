import { cn } from "@/lib/utils";

type Tone = "accent" | "primary";
type Position = "static" | "absolute-top" | "absolute-bottom";

// Only the combinations actually used across the site — kept as literal
// class names (not template-built) so Tailwind's scanner picks them up.
const LINE_CLASS: Record<string, string> = {
  "accent-50": "via-accent/50",
  "accent-40": "via-accent/40",
  "accent-30": "via-accent/30",
  "primary-20": "via-primary/20",
  "primary-15": "via-primary/15",
};

const DOT_CLASS: Record<Tone, string> = {
  accent: "text-accent",
  primary: "text-primary",
};

const POSITION_CLASS: Record<Position, string> = {
  static: "relative",
  "absolute-top": "absolute top-0 left-0 right-0",
  "absolute-bottom": "absolute bottom-0 left-0 right-0",
};

/**
 * A ceremonial gold/green section divider: a thin gradient rule with a
 * small centered diamond ornament, used consistently at section and
 * card-hero boundaries site-wide.
 */
export function SectionDivider({
  tone = "primary",
  opacity = 20,
  position = "static",
  className,
}: {
  tone?: Tone;
  opacity?: 15 | 20 | 30 | 40 | 50;
  position?: Position;
  className?: string;
}) {
  const lineClass = LINE_CLASS[`${tone}-${opacity}`] ?? LINE_CLASS["primary-20"];

  return (
    <div className={cn(POSITION_CLASS[position], "h-px w-full bg-gradient-to-r from-transparent to-transparent", lineClass, className)}>
      <svg
        width="9"
        height="9"
        viewBox="0 0 9 9"
        aria-hidden
        className={cn("absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2", DOT_CLASS[tone])}
        style={{ opacity: 0.7 }}
      >
        <rect x="0" y="0" width="9" height="9" fill="currentColor" transform="rotate(45 4.5 4.5)" />
      </svg>
    </div>
  );
}
