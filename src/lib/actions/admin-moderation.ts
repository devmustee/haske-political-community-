"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { notify } from "@/lib/notify";
import type { ActionResult } from "@/lib/actions/auth";

export async function resolveReport(reportId: string, action: "ACTIONED" | "DISMISSED"): Promise<ActionResult> {
  const admin = await requirePermission("moderation.review");

  await prisma.report.update({
    where: { id: reportId },
    data: { status: action, reviewedById: admin.id, reviewedAt: new Date() },
  });

  await logAudit(admin.id, `report.${action.toLowerCase()}`, "Report", reportId);
  revalidatePath("/admin/moderation");
  return { ok: true, data: undefined };
}

export async function removePost(postId: string, reason: string): Promise<ActionResult> {
  const admin = await requirePermission("moderation.review");

  const post = await prisma.post.update({ where: { id: postId }, data: { deletedAt: new Date() } });
  await prisma.moderationAction.create({
    data: { moderatorId: admin.id, actionType: "REMOVE_POST", postId, targetUserId: post.authorId, reason },
  });
  await logAudit(admin.id, "moderation.remove_post", "Post", postId, { reason });
  revalidatePath("/admin/moderation");
  return { ok: true, data: undefined };
}

export async function removeComment(commentId: string, reason: string): Promise<ActionResult> {
  const admin = await requirePermission("moderation.review");

  const comment = await prisma.comment.update({
    where: { id: commentId },
    data: { deletedAt: new Date(), content: "[removed by moderator]" },
  });
  await prisma.moderationAction.create({
    data: { moderatorId: admin.id, actionType: "REMOVE_COMMENT", commentId, targetUserId: comment.authorId, reason },
  });
  await logAudit(admin.id, "moderation.remove_comment", "Comment", commentId, { reason });
  revalidatePath("/admin/moderation");
  return { ok: true, data: undefined };
}

export async function moderateUser(
  userId: string,
  action: "WARN_USER" | "SUSPEND_USER" | "BAN_USER" | "UNSUSPEND_USER" | "UNBAN_USER" | "VERIFY_USER" | "UNVERIFY_USER",
  opts?: { reason?: string; suspendDays?: number; verification?: "OFFICIAL" | "ORGANIZATION" }
): Promise<ActionResult> {
  const admin = await requirePermission("community.manage_users");

  const data: Record<string, unknown> = {};
  if (action === "SUSPEND_USER") {
    data.status = "SUSPENDED";
    data.suspendedUntil = new Date(Date.now() + (opts?.suspendDays ?? 7) * 24 * 60 * 60 * 1000);
  } else if (action === "BAN_USER") {
    data.status = "BANNED";
    data.bannedAt = new Date();
  } else if (action === "UNSUSPEND_USER" || action === "UNBAN_USER") {
    data.status = "ACTIVE";
    data.suspendedUntil = null;
    data.bannedAt = null;
  } else if (action === "VERIFY_USER") {
    data.verification = opts?.verification ?? "OFFICIAL";
  } else if (action === "UNVERIFY_USER") {
    data.verification = "NONE";
  }

  if (Object.keys(data).length > 0) {
    await prisma.user.update({ where: { id: userId }, data });
  }

  await prisma.moderationAction.create({
    data: { moderatorId: admin.id, actionType: action, targetUserId: userId, reason: opts?.reason },
  });
  await logAudit(admin.id, `moderation.${action.toLowerCase()}`, "User", userId, opts);

  if (action === "WARN_USER") {
    await notify({ userId, type: "ADMIN_ANNOUNCEMENT", message: opts?.reason ? `Warning from moderators: ${opts.reason}` : "You have received a moderation warning." });
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/moderation");
  return { ok: true, data: undefined };
}

export async function addBlockedWord(word: string): Promise<ActionResult> {
  const admin = await requirePermission("moderation.review");
  const trimmed = word.trim().toLowerCase();
  if (!trimmed) return { ok: false, error: "Word can't be empty." };

  await prisma.blockedWord.upsert({ where: { word: trimmed }, update: {}, create: { word: trimmed } });
  await logAudit(admin.id, "moderation.add_blocked_word", "BlockedWord", undefined, { word: trimmed });
  revalidatePath("/admin/moderation");
  return { ok: true, data: undefined };
}

export async function removeBlockedWord(word: string): Promise<ActionResult> {
  const admin = await requirePermission("moderation.review");
  await prisma.blockedWord.delete({ where: { word } }).catch(() => {});
  await logAudit(admin.id, "moderation.remove_blocked_word", "BlockedWord", undefined, { word });
  revalidatePath("/admin/moderation");
  return { ok: true, data: undefined };
}
