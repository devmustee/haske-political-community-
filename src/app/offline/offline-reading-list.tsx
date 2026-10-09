"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

// Must match PAGES and READABLE_OFFLINE in public/sw.js.
const PAGES_CACHE = "haske-pages-v2";
const LABELS: Record<string, string> = {
  "/biography": "Biography",
  "/timeline": "Timeline",
  "/manifesto": "2027 Manifesto",
  "/mission": "Mission & Priorities",
  "/vision": "Vision for Adamawa",
  "/leadership": "Leadership Covenant",
  "/public-record": "Public Record",
  "/programs": "Public Programs",
};

/** Lists the public pages the service worker has saved, so they can be read offline. */
export function OfflineReadingList() {
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    if (!("caches" in window)) return;
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.keys())
      .then((requests) => setPaths(requests.map((r) => new URL(r.url).pathname).filter((p) => p in LABELS)))
      .catch(() => {});
  }, []);

  if (paths.length === 0) return null;

  return (
    <div className="mt-10 w-full max-w-xs text-left">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">Available offline</p>
      <ul className="overflow-hidden rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5">
        {paths.map((p) => (
          <li key={p} className="border-b border-primary-foreground/10 last:border-b-0">
            {/* Full page load (not client navigation) so the service worker serves the saved copy. */}
            <a href={p} className="flex min-h-11 items-center gap-2.5 px-4 text-sm hover:bg-primary-foreground/10">
              <BookOpen className="size-4 shrink-0 text-accent" />
              {LABELS[p]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
