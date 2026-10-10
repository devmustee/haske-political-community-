/**
 * Program application rules shared by the server actions and the UI, so
 * "can I apply / withdraw?" is decided in one place.
 */
import type { ApplicationStatus, ContentStatus, ProgramStatus } from "@prisma/client";

const LAGOS_OFFSET_MS = 60 * 60 * 1000; // WAT, UTC+1, no DST

/**
 * When applications close. Deadlines are saved from a date input as UTC
 * midnight of that date; applications stay open until the end of that day
 * in Adamawa (23:59:59 WAT).
 */
export function applicationsCloseAt(deadline: Date): Date {
  return new Date(deadline.getTime() + 24 * 60 * 60 * 1000 - LAGOS_OFFSET_MS - 1);
}

export type ApplyBlock = "NOT_PUBLISHED" | "NOT_OPEN" | "DEADLINE_PASSED";

/** Null when the program accepts applications now, otherwise why not. */
export function applyBlockReason(
  program: { status: ProgramStatus; contentStatus: ContentStatus; applicationDeadline: Date | null },
  now = new Date()
): ApplyBlock | null {
  if (program.contentStatus === "DRAFT" || program.contentStatus === "ARCHIVED") return "NOT_PUBLISHED";
  if (program.status !== "OPEN" && program.status !== "ONGOING") return "NOT_OPEN";
  if (program.applicationDeadline && now > applicationsCloseAt(program.applicationDeadline)) return "DEADLINE_PASSED";
  return null;
}

export const APPLY_BLOCK_MESSAGE: Record<ApplyBlock, string> = {
  NOT_PUBLISHED: "This program isn't available.",
  NOT_OPEN: "Applications for this program aren't open.",
  DEADLINE_PASSED: "The application deadline for this program has passed.",
};

/** What applicants see for each status (admin-only notes are never shown). */
export const APPLICATION_STATUS_INFO: Record<ApplicationStatus, { label: string; description: string; tone: "neutral" | "progress" | "good" | "bad" }> = {
  SUBMITTED: { label: "Submitted", description: "We've received your application.", tone: "neutral" },
  UNDER_REVIEW: { label: "Under review", description: "The team is reviewing your application.", tone: "progress" },
  SHORTLISTED: { label: "Shortlisted", description: "You've been shortlisted. We'll be in touch about next steps.", tone: "progress" },
  WAITLISTED: { label: "Waitlisted", description: "You're on the waitlist. We'll contact you if a place opens.", tone: "progress" },
  ACCEPTED: { label: "Accepted", description: "Congratulations — your application was accepted.", tone: "good" },
  PAID: { label: "Completed", description: "Your support from this program has been completed.", tone: "good" },
  REJECTED: { label: "Not selected", description: "Your application wasn't selected this time.", tone: "bad" },
  WITHDRAWN: { label: "Withdrawn", description: "You withdrew this application.", tone: "bad" },
};

/** Applicants may withdraw until a final outcome. */
export function canWithdraw(status: ApplicationStatus) {
  return status !== "REJECTED" && status !== "WITHDRAWN" && status !== "PAID";
}

/** Statuses an admin may set (WITHDRAWN is the applicant's action only). */
export const ADMIN_SETTABLE_STATUSES = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "WAITLISTED", "ACCEPTED", "REJECTED", "PAID"] as const satisfies readonly ApplicationStatus[];
