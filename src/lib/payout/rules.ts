/**
 * Pure rules for payout details (shared by server actions, UI and tests).
 */
import { z } from "zod";
import type { ApplicationStatus, NameMatch, PayoutDetailsStage } from "@prisma/client";

/** Bump when the consent wording changes; stored with each submission. */
export const PAYOUT_CONSENT_VERSION = "2026-10-v1";
export const PAYOUT_CONSENT_TEXT =
  "I confirm this account is in my name, and I agree that Haske Community may store these bank details securely and use them only to pay me if I'm selected for this program. They will be deleted after the program ends. I understand Haske Community will never ask for my BVN, PIN, password or OTP.";

export const payoutDetailsSchema = z.object({
  bankCode: z.string().trim().regex(/^\d{3,6}$/, "Choose your bank"),
  accountNumber: z
    .string()
    .transform((v) => v.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{10}$/, "Account numbers are 10 digits")),
  accountName: z
    .string()
    .trim()
    .min(2, "Enter the name on the account")
    .max(100)
    // \p{M}: combining accents, e.g. Yoruba names like "Ọlá Adébáyọ̀".
    .regex(/^[\p{L}\p{M} .'-]+$/u, "Use letters only for the account name"),
  consent: z.literal(true, { message: "Please confirm to continue" }),
});
export type PayoutDetailsInput = z.input<typeof payoutDetailsSchema>;

const EDITABLE_BEFORE_DECISION: ApplicationStatus[] = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "WAITLISTED"];

/**
 * Whether the applicant may add/update payout details now.
 * - Collected at application: editable until a decision is made.
 * - Either stage: once ACCEPTED, they can add them if none exist yet.
 * After that, changes go through support (changing bank details right before
 * payment is the classic fraud move).
 */
export function canSetPayoutDetails(opts: {
  requiresPayoutDetails: boolean;
  stage: PayoutDetailsStage;
  status: ApplicationStatus;
  hasPayout: boolean;
}): boolean {
  if (!opts.requiresPayoutDetails) return false;
  if (opts.status === "ACCEPTED") return !opts.hasPayout;
  return opts.stage === "AT_APPLICATION" && EDITABLE_BEFORE_DECISION.includes(opts.status);
}

export function maskAccountNumber(last4: string) {
  return `******${last4}`;
}

const TITLES = new Set(["MR", "MRS", "MS", "MISS", "DR", "ENGR", "ALHAJI", "ALHAJA", "HAJIA", "MALLAM", "CHIEF", "PROF", "BARR", "HON"]);

function nameTokens(name: string): Set<string> {
  return new Set(
    name
      .toUpperCase()
      .normalize("NFKD")
      .replace(/[^A-Z\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1 && !TITLES.has(t))
  );
}

/**
 * Compares the bank's account name with the names the applicant gave.
 * Order and initials vary, so it's token-based and never blocks: MISMATCH is
 * a flag for reviewers, not a rejection.
 */
export function compareNames(bankName: string, ...givenNames: string[]): NameMatch {
  const bank = nameTokens(bankName);
  if (bank.size === 0) return "UNVERIFIED";
  let best: NameMatch = "MISMATCH";
  for (const given of givenNames) {
    const g = nameTokens(given);
    if (g.size === 0) continue;
    const overlap = [...g].filter((t) => bank.has(t)).length;
    const smaller = Math.min(g.size, bank.size);
    if (overlap >= 2 && overlap >= smaller) return "MATCH";
    if (overlap >= 1) best = "PARTIAL";
  }
  return best;
}

/** One CSV cell: quoted, and neutralised against spreadsheet formula injection. */
export function csvCell(value: string | null | undefined): string {
  let v = value ?? "";
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return `"${v.replace(/"/g, '""')}"`;
}
