"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";
import { sendPushToUser } from "@/lib/push";
import type { ActionResult } from "@/lib/actions/auth";

const announcementSchema = z.object({
  title: z.string().trim().min(3, "Give it a short title").max(80, "Keep the title under 80 characters"),
  body: z.string().trim().min(3, "Write a message").max(500, "Keep the message under 500 characters"),
  link: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || (v.startsWith("/") && !v.startsWith("//")) || /^https:\/\/[^\s]+$/.test(v), {
      message: "Use a site path like /events/town-hall or a full https:// link",
    })
    .optional(),
});
export type AnnouncementInput = z.infer<typeof announcementSchema>;

/** Users who receive broadcasts: active, and not opted out of announcements. */
const recipientWhere = {
  status: "ACTIVE" as const,
  NOT: { notificationPref: { is: { adminAnnouncements: false } } },
};

export async function countAnnouncementRecipients() {
  await requirePermission("notifications.broadcast");
  return prisma.user.count({ where: recipientWhere });
}

/**
 * Sends an announcement to every eligible user: one in-app notification each
 * (created in batches), then push to their devices after the response.
 */
export async function sendAnnouncement(input: AnnouncementInput): Promise<ActionResult<{ recipients: number }>> {
  const admin = await requirePermission("notifications.broadcast");
  const limited = rateLimit(`broadcast:${admin.id}`, 5, 60 * 60_000);
  if (!limited.ok) return { ok: false, error: "You've sent several announcements recently. Try again later." };

  const parsed = announcementSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid announcement." };
  const { title, body } = parsed.data;
  const link = parsed.data.link || null;

  const recipients = await prisma.user.findMany({ where: recipientWhere, select: { id: true } });
  const announcement = await prisma.announcement.create({
    data: { title, body, link, createdById: admin.id, recipientCount: recipients.length },
  });

  const BATCH = 1000;
  for (let i = 0; i < recipients.length; i += BATCH) {
    await prisma.notification.createMany({
      data: recipients.slice(i, i + BATCH).map((r) => ({
        userId: r.id,
        type: "ADMIN_ANNOUNCEMENT" as const,
        message: title,
        announcementId: announcement.id,
      })),
    });
  }

  await logAudit(admin.id, "notifications.broadcast", "Announcement", announcement.id, { title, recipients: recipients.length });

  // Push after the response. A few at a time so a large audience doesn't open
  // thousands of connections at once. Taps open same-origin links only
  // (the service worker enforces this); external links go to notifications.
  const pushUrl = link && link.startsWith("/") ? link : "/community/notifications";
  after(async () => {
    const CONCURRENCY = 10;
    for (let i = 0; i < recipients.length; i += CONCURRENCY) {
      await Promise.all(
        recipients.slice(i, i + CONCURRENCY).map((r) =>
          sendPushToUser(r.id, { title, body: body.length > 140 ? `${body.slice(0, 139)}…` : body, url: pushUrl, tag: `announcement:${announcement.id}` })
        )
      );
    }
  });

  revalidatePath("/admin/announcements");
  return { ok: true, data: { recipients: recipients.length } };
}

/** Removes an announcement and its notifications (pushes already delivered can't be recalled). */
export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  const admin = await requirePermission("notifications.broadcast");
  const announcement = await prisma.announcement.findUnique({ where: { id }, select: { id: true, title: true } });
  if (!announcement) return { ok: false, error: "Announcement not found." };
  await prisma.announcement.delete({ where: { id } }); // notifications cascade
  await logAudit(admin.id, "notifications.delete_broadcast", "Announcement", id, { title: announcement.title });
  revalidatePath("/admin/announcements");
  return { ok: true, data: undefined };
}
