"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS: { key: string; label: string }[] = [
  { key: "for-you", label: "For You" },
  { key: "latest", label: "Latest" },
  { key: "following", label: "Following" },
  { key: "official", label: "Official" },
  { key: "trending", label: "Trending" },
];

export function FeedTabs({ active }: { active: string }) {
  return (
    <div className="flex overflow-x-auto scrollbar-none">
      {TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.key === "for-you" ? "/community" : `/community?tab=${tab.key}`}
          className={cn(
            "flex-1 whitespace-nowrap px-4 py-3.5 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
            active === tab.key && "border-b-2 border-primary font-semibold text-foreground"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
