"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { BellRing, BellOff, Loader2, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentSubscription, disablePush, enablePush, pushSupport, type PushSupport } from "@/lib/push-client";

const noopSubscribe = () => () => {};

/**
 * Turns push notifications on/off for this device. Permission is only
 * requested when the user taps the button. Hidden where push can't work
 * (unsupported browser, no VAPID keys, or no service worker, i.e. dev).
 */
export function PushToggle() {
  const support = useSyncExternalStore<PushSupport>(noopSubscribe, pushSupport, () => "unsupported");
  const [state, setState] = useState<"loading" | "off" | "on" | "blocked" | "no-sw">("loading");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (support !== "ready") return;
    navigator.serviceWorker.getRegistration("/").then(async (reg) => {
      if (!reg) return setState("no-sw");
      if (Notification.permission === "denied") return setState("blocked");
      setState((await currentSubscription()) ? "on" : "off");
    });
  }, [support]);

  if (support === "needs-install") {
    return (
      <div className="flex items-start gap-3 border-b border-border bg-secondary/40 px-4 py-3 text-sm">
        <BellRing className="mt-0.5 size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          To get notifications on iPhone, add Haske to your Home Screen: tap <Share className="inline size-3.5" /> Share, then
          &ldquo;Add to Home Screen&rdquo;, and open it from there.
        </p>
      </div>
    );
  }
  if (support !== "ready" || state === "loading" || state === "no-sw") return null;

  async function toggle() {
    setBusy(true);
    if (state === "on") {
      await disablePush();
      setState("off");
      toast.success("Notifications turned off on this device");
    } else {
      const result = await enablePush();
      if (result.ok) {
        setState("on");
        toast.success("Notifications turned on for this device");
      } else {
        if (Notification.permission === "denied") setState("blocked");
        toast.error(result.error);
      }
    }
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3">
      {state === "on" ? <BellRing className="size-4 shrink-0 text-primary" /> : <BellOff className="size-4 shrink-0 text-muted-foreground" />}
      <p className="min-w-0 flex-1 text-sm text-muted-foreground">
        {state === "on" && "Notifications are on for this device."}
        {state === "off" && "Get likes, replies and updates as notifications on this device."}
        {state === "blocked" && "Notifications are blocked. Allow them for this site in your browser settings."}
      </p>
      {state !== "blocked" && (
        <Button size="sm" variant={state === "on" ? "outline" : "default"} onClick={toggle} disabled={busy}>
          {busy && <Loader2 className="size-4 animate-spin" />}
          {state === "on" ? "Turn off" : "Turn on"}
        </Button>
      )}
    </div>
  );
}
