"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requirePermission, requireUserResult } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";
import { decryptAccountNumber, isPayoutConfigured } from "@/lib/crypto/payout";
import { buildPayoutRecord } from "@/lib/payout/record";
import { canSetPayoutDetails, type PayoutDetailsInput } from "@/lib/payout/rules";
import type { ActionResult } from "@/lib/actions/auth";

/** The applicant adds or updates bank details on their own application. */
export async function savePayoutDetails(
  applicationId: string,
  input: PayoutDetailsInput
): Promise<ActionResult<{ nameMatch: string; verifiedName: string | null }>> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;
  const limited = rateLimit(`payout:${user.id}`, 10, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "Too many attempts. Please try again in a few minutes." };
  if (!isPayoutConfigured()) return { ok: false, error: "Payout details can't be collected right now. Please try again later." };

  const application = await prisma.programApplication.findFirst({
    where: { id: applicationId, userId: user.id },
    select: {
      id: true,
      status: true,
      fullName: true,
      payout: { select: { id: true } },
      program: { select: { requiresPayoutDetails: true, payoutDetailsStage: true } },
    },
  });
  if (!application) return { ok: false, error: "Application not found." };
  const allowed = canSetPayoutDetails({
    requiresPayoutDetails: application.program.requiresPayoutDetails,
    stage: application.program.payoutDetailsStage,
    status: application.status,
    hasPayout: !!application.payout,
  });
  if (!allowed) return { ok: false, error: "Bank details can't be changed at this stage. Contact the team if they're wrong." };

  const record = await buildPayoutRecord(input, application.fullName);
  if (!record.ok) return record;

  await prisma.applicationPayoutDetails.upsert({
    where: { applicationId: application.id },
    create: { applicationId: application.id, ...record.data },
    update: record.data,
  });
  // Never record the number itself in history: only that details changed.
  await prisma.applicationEvent.create({
    data: { applicationId: application.id, type: application.payout ? "PAYOUT_UPDATED" : "PAYOUT_ADDED" },
  });
  revalidatePath("/applications");
  return { ok: true, data: { nameMatch: record.data.nameMatch, verifiedName: record.data.verifiedName } };
}

/**
 * Reveals one applicant's full account number to an authorised admin. Needs a
 * reason; every reveal is rate-limited and logged (history + audit log).
 */
export async function revealAccountNumber(applicationId: string, reason: string): Promise<ActionResult<{ accountNumber: string }>> {
  const admin = await requirePermission("programs.view_payout_details");
  const parsedReason = z.string().trim().min(5, "Give a short reason (at least 5 characters)").max(300).safeParse(reason);
  if (!parsedReason.success) return { ok: false, error: parsedReason.error.issues[0]?.message ?? "Give a reason." };
  const limited = rateLimit(`reveal:${admin.id}`, 30, 60 * 60_000);
  if (!limited.ok) return { ok: false, error: "Too many reveals in the last hour." };

  const payout = await prisma.applicationPayoutDetails.findUnique({
    where: { applicationId },
    select: { accountNumberEnc: true, applicationId: true },
  });
  if (!payout) return { ok: false, error: "No bank details on this application." };

  let accountNumber: string;
  try {
    accountNumber = decryptAccountNumber(payout.accountNumberEnc);
  } catch {
    return { ok: false, error: "Couldn't decrypt these details. Check PAYOUT_ENCRYPTION_KEY." };
  }

  await prisma.applicationEvent.create({
    data: { applicationId, actorId: admin.id, type: "PAYOUT_REVEALED", note: parsedReason.data },
  });
  await logAudit(admin.id, "programs.reveal_account_number", "ProgramApplication", applicationId, { reason: parsedReason.data });
  return { ok: true, data: { accountNumber } };
}
