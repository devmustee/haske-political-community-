import { cn } from "@/lib/utils";

/** Small count bubble pinned to the top-right of a nav icon. */
export function UnreadBadge({ count, className }: { count: number; className?: string }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-background",
        className
      )}
    >
      {count > 99 ? "99+" : count}
      <span className="sr-only"> unread notifications</span>
    </span>
  );
}
