import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DAY = 24 * 60 * 60 * 1000;
/** Retention periods (confirm with legal): after a final "no" vs after payment. */
const AFTER_REJECTED_OR_WITHDRAWN_DAYS = 90;
const AFTER_PAID_DAYS = 180;

/**
 * Daily (vercel.json): deletes bank details that are no longer needed. The
 * application itself is kept, minus the bank data, and the deletion is
 * recorded in its history. Vercel Cron sends `Authorization: Bearer
 * $CRON_SECRET`; without the secret configured, the job refuses to run.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = Date.now();
  const shortCutoff = new Date(now - AFTER_REJECTED_OR_WITHDRAWN_DAYS * DAY);
  const paidCutoff = new Date(now - AFTER_PAID_DAYS * DAY);

  const due = await prisma.applicationPayoutDetails.findMany({
    where: {
      application: {
        OR: [
          { status: "WITHDRAWN", withdrawnAt: { lt: shortCutoff } },
          { status: "REJECTED", reviewedAt: { lt: shortCutoff } },
          { status: "PAID", reviewedAt: { lt: paidCutoff } },
        ],
      },
    },
    select: { id: true, applicationId: true },
  });

  if (due.length) {
    await prisma.$transaction([
      prisma.applicationPayoutDetails.deleteMany({ where: { id: { in: due.map((d) => d.id) } } }),
      prisma.applicationEvent.createMany({
        data: due.map((d) => ({ applicationId: d.applicationId, type: "PAYOUT_DELETED", note: "Deleted automatically under the retention policy" })),
      }),
    ]);
  }
  return NextResponse.json({ deleted: due.length });
}
