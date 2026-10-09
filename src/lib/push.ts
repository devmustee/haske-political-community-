import "server-only";
import webpush from "web-push";
import { prisma } from "@/lib/prisma";

let configured: boolean | null = null;

/** True when VAPID keys are set. Without them push is silently disabled. */
export function isPushConfigured(): boolean {
  if (configured !== null) return configured;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return (configured = false);
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@haskecommunity.ng", publicKey, privateKey);
  return (configured = true);
}

export interface PushPayload {
  title: string;
  body: string;
  /** Same-origin path to open when the notification is tapped. */
  url: string;
  /** Collapses repeat notifications of the same kind on the device. */
  tag?: string;
}

/**
 * Sends a push to every device the user subscribed. Never throws: push is
 * best-effort on top of the in-app notification. Subscriptions the push
 * service reports as gone (404/410) are deleted.
 */
export async function sendPushToUser(userId: string, payload: PushPayload): Promise<void> {
  if (!isPushConfigured()) return;
  const subs = await prisma.pushSubscription.findMany({ where: { userId } });
  const body = JSON.stringify(payload);

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, body, {
          TTL: 60 * 60 * 24,
        });
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error("Push send failed:", status ?? err);
        }
      }
    })
  );
}
