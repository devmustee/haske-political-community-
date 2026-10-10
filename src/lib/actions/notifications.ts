"use server";

import { prisma } from "@/lib/prisma";
import { requireUser, requireUserResult } from "@/lib/session";
import type { ActionResult } from "@/lib/actions/auth";

export async function markNotificationRead(notificationId: string): Promise<ActionResult> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;
  await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { read: true },
  });
  return { ok: true, data: undefined };
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;
  await prisma.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
  return { ok: true, data: undefined };
}

export async function updateNotificationPreferences(
  prefs: Partial<Record<
    "likes" | "comments" | "follows" | "reposts" | "pollResults" | "eventReminders" | "programUpdates" | "adminAnnouncements" | "feedbackUpdates",
    boolean
  >>
): Promise<ActionResult> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;
  await prisma.notificationPreference.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...prefs },
    update: prefs,
  });
  return { ok: true, data: undefined };
}
