"use client";

import { subscribePush, unsubscribePush } from "@/lib/actions/push";

export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

export type PushSupport = "unsupported" | "needs-install" | "unconfigured" | "ready";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as { standalone?: boolean }).standalone === true;
}

/** Whether this browser can receive push. iOS only allows it for installed (home-screen) apps. */
export function pushSupport(): PushSupport {
  if (!VAPID_PUBLIC_KEY) return "unconfigured";
  if (isIos() && !isStandalone()) return "needs-install";
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "unsupported";
  return "ready";
}

async function registration() {
  // The service worker is registered in production builds (ServiceWorkerRegister).
  return navigator.serviceWorker.getRegistration("/");
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  const reg = await registration();
  return reg ? reg.pushManager.getSubscription() : null;
}

/** Asks permission (must be called from a user gesture) and saves the subscription. */
export async function enablePush(): Promise<{ ok: true } | { ok: false; error: string }> {
  const reg = await registration();
  if (!reg) return { ok: false, error: "Notifications aren't available yet. Reload the page and try again." };
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return { ok: false, error: "Notifications are blocked in your browser settings." };
  const sub =
    (await reg.pushManager.getSubscription()) ??
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) }));
  const result = await subscribePush(sub.toJSON());
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

/** Removes this browser's subscription, locally and on the server. Safe to call when none exists. */
export async function disablePush(): Promise<void> {
  const sub = await currentSubscription().catch(() => null);
  if (!sub) return;
  await unsubscribePush(sub.endpoint).catch(() => {});
  await sub.unsubscribe().catch(() => {});
}
