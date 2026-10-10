import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { decryptAccountNumber } from "@/lib/crypto/payout";
import { csvCell } from "@/lib/payout/rules";

/**
 * CSV of ACCEPTED applicants with bank details, for a bank bulk transfer.
 * Super-admin only (programs.export_payouts), logged, never cached.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  let user: { id: string };
  try {
    // Same check as server actions: signed in, active, verified, and permitted.
    user = await requirePermission("programs.export_payouts");
  } catch {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const { id } = await params;
  const program = await prisma.program.findUnique({ where: { id }, select: { id: true, slug: true, name: true } });
  if (!program) return new NextResponse("Not found", { status: 404 });

  const rows = await prisma.programApplication.findMany({
    where: { programId: program.id, status: "ACCEPTED", payout: { isNot: null } },
    orderBy: { createdAt: "asc" },
    select: { id: true, fullName: true, phone: true, email: true, lga: true, payout: true },
  });

  const header = ["Applicant", "Phone", "Email", "LGA", "Bank", "Bank code", "Account number", "Account name", "Name at bank", "Name check"];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    const p = r.payout!;
    lines.push(
      [r.fullName, r.phone, r.email, r.lga, p.bankName, p.bankCode, decryptAccountNumber(p.accountNumberEnc), p.accountName, p.verifiedName, p.nameMatch]
        .map(csvCell)
        .join(",")
    );
  }

  await logAudit(user.id, "programs.export_payouts", "Program", program.id, { rows: rows.length });
  if (rows.length) {
    await prisma.applicationEvent.createMany({ data: rows.map((r) => ({ applicationId: r.id, actorId: user.id, type: "PAYOUT_EXPORTED" })) });
  }

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${program.slug}-payouts-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
