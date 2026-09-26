import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The icon + title (+ optional description/action) empty state pattern
 * already used across achievements/programs/events/media — centralized
 * so community pages follow the same visual language instead of bare text.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-6 py-16 text-center", className)}>
      <Icon className="size-10 text-muted-foreground/30" />
      <p className="mt-2 font-medium">{title}</p>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}
