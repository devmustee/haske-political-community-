import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The eyebrow + title (+ optional description) pattern repeated across
 * homepage sections — centralized so the visual rhythm stays consistent.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  className,
  headingClassName,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  centered?: boolean;
  className?: string;
  headingClassName?: string;
}) {
  return (
    <div className={className}>
      <p className={cn("section-eyebrow", centered && "mx-auto")}>{eyebrow}</p>
      <h2 className={cn("mt-3 font-serif text-2xl font-semibold sm:text-3xl lg:text-4xl", headingClassName)}>{title}</h2>
      {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
    </div>
  );
}
