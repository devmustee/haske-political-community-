"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/lib/actions/auth";

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(2000),
  keys: z.object({ p256dh: z.string().min(1).max(200), auth: z.string().min(1).max(100) }),
});

/** Saves this browser's push subscription for the signed-in user. */
export async function subscribePush(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  const limited = rateLimit(`push:${user.id}`, 20, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "Too many attempts. Try again later." };

  const parsed = subscriptionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid push subscription." };
  const { endpoint, keys } = parsed.data;
  const userAgent = (await headers()).get("user-agent")?.slice(0, 300) ?? null;

  // An endpoint belongs to one browser; if another account used this browser
  // before, the subscription moves to the current user.
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userAgent, userId: user.id },
    update: { p256dh: keys.p256dh, auth: keys.auth, userAgent, userId: user.id },
  });
  return { ok: true, data: undefined };
}

/** Removes this browser's subscription (only if it belongs to the signed-in user). */
export async function unsubscribePush(endpoint: string): Promise<ActionResult> {
  const user = await requireUser();
  await prisma.pushSubscription.deleteMany({ where: { endpoint, userId: user.id } });
  return { ok: true, data: undefined };
}
