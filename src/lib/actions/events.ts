"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/lib/actions/auth";

export async function registerForEvent(eventId: string): Promise<ActionResult<{ registered: boolean }>> {
  const user = await requireUser();

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) return { ok: false, error: "Event not found." };

  const existing = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  if (existing) {
    await prisma.eventRegistration.delete({ where: { id: existing.id } });
    revalidatePath(`/events/${event.slug}`);
    return { ok: true, data: { registered: false } };
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        if (event.capacity) {
          const count = await tx.eventRegistration.count({ where: { eventId } });
          if (count >= event.capacity) throw new Error("AT_CAPACITY");
        }
        await tx.eventRegistration.create({ data: { eventId, userId: user.id } });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  } catch (err) {
    if (err instanceof Error && err.message === "AT_CAPACITY") {
      return { ok: false, error: "This event has reached capacity." };
    }
    // Serialization failure from a concurrent registration racing the same
    // capacity check — safe to report as "full" rather than oversell.
    return { ok: false, error: "This event has reached capacity." };
  }

  revalidatePath(`/events/${event.slug}`);
  return { ok: true, data: { registered: true } };
}

export async function askEventQuestion(eventId: string, question: string): Promise<ActionResult> {
  const user = await requireUser();
  const trimmed = question.trim();
  if (!trimmed) return { ok: false, error: "Question can't be empty." };
  if (trimmed.length > 500) return { ok: false, error: "Keep your question under 500 characters." };

  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { slug: true } });
  if (!event) return { ok: false, error: "Event not found." };

  await prisma.eventQuestion.create({ data: { eventId, userId: user.id, question: trimmed } });
  revalidatePath(`/events/${event.slug}`);
  return { ok: true, data: undefined };
}
