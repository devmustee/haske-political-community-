"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUserResult } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { notify } from "@/lib/notify";
import { APPLY_BLOCK_MESSAGE, applyBlockReason, canWithdraw } from "@/lib/applications";
import { programApplicationSchema, type ProgramApplicationInput } from "@/lib/validations/program";
import { isPayoutConfigured } from "@/lib/crypto/payout";
import { buildPayoutRecord, type PayoutRecord } from "@/lib/payout/record";
import type { PayoutDetailsInput } from "@/lib/payout/rules";
import type { ActionResult } from "@/lib/actions/auth";

export async function applyToProgram(
  input: ProgramApplicationInput,
  payoutInput?: PayoutDetailsInput
): Promise<ActionResult<{ applicationId: string }>> {
  // requireUser also rejects suspended/banned users and unverified emails.
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;

  const limited = rateLimit(`apply:${user.id}`, 10, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "Too many attempts. Please try again in a few minutes." };

  const parsed = programApplicationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid application." };
  const data = parsed.data;

  const program = await prisma.program.findUnique({
    where: { id: data.programId },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      contentStatus: true,
      applicationDeadline: true,
      requiresPayoutDetails: true,
      payoutDetailsStage: true,
    },
  });
  if (!program) return { ok: false, error: "Program not found." };
  // The UI hides the button, but the server is the source of truth.
  const blocked = applyBlockReason(program);
  if (blocked) return { ok: false, error: APPLY_BLOCK_MESSAGE[blocked] };

  // Programs that collect bank details at application need them now.
  let payout: PayoutRecord | null = null;
  if (program.requiresPayoutDetails && program.payoutDetailsStage === "AT_APPLICATION") {
    if (!isPayoutConfigured()) return { ok: false, error: "Applications for this program are temporarily paused. Please try again later." };
    if (!payoutInput) return { ok: false, error: "Please add your bank details." };
    const record = await buildPayoutRecord(payoutInput, data.fullName);
    if (!record.ok) return record;
    payout = record.data;
  }

  try {
    const application = await prisma.programApplication.create({
      data: {
        programId: program.id,
        userId: user.id,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        lga: data.lga,
        details: data.details,
        events: {
          create: payout ? [{ type: "SUBMITTED", toStatus: "SUBMITTED" }, { type: "PAYOUT_ADDED" }] : [{ type: "SUBMITTED", toStatus: "SUBMITTED" }],
        },
        ...(payout ? { payout: { create: payout } } : {}),
      },
    });

    await notify({
      userId: user.id,
      type: "APPLICATION_STATUS",
      message: `We received your application to ${program.name}. We'll let you know when its status changes.`,
    });
    revalidatePath("/applications");
    revalidatePath(`/programs/${program.slug}`);
    return { ok: true, data: { applicationId: application.id } };
  } catch (err) {
    // A DB-level unique constraint (programId, userId) is the source of
    // truth for "one application per program" — this catches the race a
    // plain pre-check-then-insert would miss under concurrent submissions.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, error: "You've already applied to this program." };
    }
    throw err;
  }
}

/** The applicant withdraws their own application (until a final outcome). */
export async function withdrawApplication(applicationId: string): Promise<ActionResult> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;
  const application = await prisma.programApplication.findFirst({
    where: { id: applicationId, userId: user.id },
    select: { id: true, status: true, program: { select: { slug: true } } },
  });
  if (!application) return { ok: false, error: "Application not found." };
  if (!canWithdraw(application.status)) return { ok: false, error: "This application can no longer be withdrawn." };

  // Conditional update so a concurrent admin decision can't be overwritten.
  const updated = await prisma.programApplication.updateMany({
    where: { id: application.id, status: application.status },
    data: { status: "WITHDRAWN", withdrawnAt: new Date() },
  });
  if (updated.count === 0) return { ok: false, error: "This application was just updated. Please refresh and try again." };

  await prisma.applicationEvent.create({
    data: { applicationId: application.id, type: "WITHDRAWN", fromStatus: application.status, toStatus: "WITHDRAWN" },
  });
  revalidatePath("/applications");
  revalidatePath(`/programs/${application.program.slug}`);
  return { ok: true, data: undefined };
}
