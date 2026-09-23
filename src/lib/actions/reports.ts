"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { reportSchema, type ReportInput } from "@/lib/validations/post";
import type { ActionResult } from "@/lib/actions/auth";

export async function reportContent(input: ReportInput): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid report." };
  const data = parsed.data;

  await prisma.report.create({
    data: {
      reporterId: user.id,
      targetType: data.targetType,
      postId: data.postId,
      commentId: data.commentId,
      reportedUserId: data.reportedUserId,
      reason: data.reason,
      details: data.details,
    },
  });

  return { ok: true, data: undefined };
}
