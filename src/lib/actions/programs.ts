"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { programApplicationSchema, type ProgramApplicationInput } from "@/lib/validations/program";
import type { ActionResult } from "@/lib/actions/auth";

export async function applyToProgram(input: ProgramApplicationInput): Promise<ActionResult<{ applicationId: string }>> {
  const user = await requireUser();
  const parsed = programApplicationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid application." };
  const data = parsed.data;

  const program = await prisma.program.findUnique({ where: { id: data.programId } });
  if (!program) return { ok: false, error: "Program not found." };

  const existing = await prisma.programApplication.findFirst({ where: { programId: data.programId, userId: user.id } });
  if (existing) return { ok: false, error: "You've already applied to this program." };

  const application = await prisma.programApplication.create({
    data: {
      programId: data.programId,
      userId: user.id,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      details: data.details,
    },
  });

  return { ok: true, data: { applicationId: application.id } };
}
