"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Share, SquarePlus, X } from "lucide-react";
import { isIos, isStandalone } from "@/lib/push-client";

const DISMISS_KEY = "haske:install-hint-dismissed";
const noopSubscribe = () => () => {};

function shouldShow() {
  if (!isIos() || isStandalone()) return false;
  try {
    return localStorage.getItem(DISMISS_KEY) !== "1";
  } catch {
    return true;
  }
}

/**
 * One-time "Add to Home Screen" tip for iPhone/iPad Safari, which has no
 * install prompt. Installing is also what enables push notifications on iOS.
 */
export function InstallHint() {
  const eligible = useSyncExternalStore(noopSubscribe, shouldShow, () => false);
  const [dismissed, setDismissed] = useState(false);
  if (!eligible || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private mode etc.: the tip just shows again next visit.
    }
  }

  return (
    <div className="relative mx-3 mt-3 flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent-subtle p-4 pr-12">
      <Image src="/icons/icon-192.png" alt="" width={40} height={40} className="size-10 shrink-0 rounded-xl" />
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-foreground">Install Haske on your iPhone</p>
        <p className="mt-0.5 text-muted-foreground">
          Tap <Share className="inline size-3.5 align-[-2px]" /> Share, then{" "}
          <SquarePlus className="inline size-3.5 align-[-2px]" /> &ldquo;Add to Home Screen&rdquo;. You&apos;ll get a full-screen app
          and can turn on notifications.
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss install tip"
        className="absolute right-1.5 top-1.5 flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-background/60"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
