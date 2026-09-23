"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/lib/actions/auth";

export async function registerForEvent(eventId: string): Promise<ActionResult<{ registered: boolean }>> {
  const user = await requireUser();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: true } } },
  });
  if (!event) return { ok: false, error: "Event not found." };

  const existing = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId, userId: user.id } },
  });
  if (existing) {
    await prisma.eventRegistration.delete({ where: { id: existing.id } });
    revalidatePath(`/events/${event.slug}`);
    return { ok: true, data: { registered: false } };
  }

  if (event.capacity && event._count.registrations >= event.capacity) {
    return { ok: false, error: "This event has reached capacity." };
  }

  await prisma.eventRegistration.create({ data: { eventId, userId: user.id } });
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
