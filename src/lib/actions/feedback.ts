"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { notify } from "@/lib/notify";
import { feedbackSchema, communityIssueSchema, type FeedbackInput, type CommunityIssueInput } from "@/lib/validations/feedback";
import type { ActionResult } from "@/lib/actions/auth";

function randomTrackingSuffix() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

async function generateTrackingId(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const candidate = `HC-${randomTrackingSuffix()}`;
    const existing = await prisma.feedbackSubmission.findUnique({ where: { trackingId: candidate } });
    if (!existing) return candidate;
  }
  return `HC-${Date.now().toString().slice(-6)}`;
}

export async function submitFeedback(input: FeedbackInput): Promise<ActionResult<{ trackingId: string }>> {
  const user = await requireUser();
  const parsed = feedbackSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  const data = parsed.data;

  const trackingId = await generateTrackingId();

  const submission = await prisma.feedbackSubmission.create({
    data: {
      trackingId,
      userId: user.id,
      type: data.type,
      subject: data.subject,
      description: data.description,
      lga: data.lga,
    },
  });

  return { ok: true, data: { trackingId: submission.trackingId } };
}

export async function getFeedbackStatus(trackingId: string) {
  const user = await requireUser();
  return prisma.feedbackSubmission.findFirst({
    where: { trackingId: trackingId.trim().toUpperCase(), userId: user.id },
    include: { updates: { orderBy: { createdAt: "desc" } } },
  });
}

export async function getMyFeedback() {
  const user = await requireUser();
  return prisma.feedbackSubmission.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
}

export async function submitCommunityIssue(input: CommunityIssueInput): Promise<ActionResult<{ issueId: string }>> {
  const user = await requireUser();
  const parsed = communityIssueSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." };
  const data = parsed.data;

  const issue = await prisma.communityIssue.create({
    data: {
      category: data.category,
      title: data.title,
      description: data.description,
      lga: data.lga,
      reportedById: user.id,
    },
  });

  return { ok: true, data: { issueId: issue.id } };
}

export async function assignFeedback(feedbackId: string, assignedToId: string | null, note?: string): Promise<ActionResult> {
  const admin = await requireUser();
  const feedback = await prisma.feedbackSubmission.update({
    where: { id: feedbackId },
    data: { assignedToId, status: assignedToId ? "ASSIGNED" : undefined },
  });
  await prisma.feedbackUpdate.create({
    data: { feedbackId, status: feedback.status, note, updatedById: admin.id },
  });
  await notify({ userId: feedback.userId, type: "FEEDBACK_STATUS", message: `Your feedback ${feedback.trackingId} was updated.` });
  return { ok: true, data: undefined };
}

export async function updateFeedbackStatus(
  feedbackId: string,
  status: "RECEIVED" | "UNDER_REVIEW" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED",
  note?: string
): Promise<ActionResult> {
  const admin = await requireUser();
  const feedback = await prisma.feedbackSubmission.update({ where: { id: feedbackId }, data: { status } });
  await prisma.feedbackUpdate.create({ data: { feedbackId, status, note, updatedById: admin.id } });
  await notify({ userId: feedback.userId, type: "FEEDBACK_STATUS", message: `Your feedback ${feedback.trackingId} is now "${status.replace("_", " ")}".` });
  return { ok: true, data: undefined };
}
