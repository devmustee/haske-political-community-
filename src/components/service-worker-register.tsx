"use client";

import { useEffect } from "react";

/**
 * Registers public/sw.js in production builds only — in `next dev` a
 * service worker would serve stale assets and fight hot reloading.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch((err) => {
      console.error("Service worker registration failed:", err);
    });
  }, []);
  return null;
}
