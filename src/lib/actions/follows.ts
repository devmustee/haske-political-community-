"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { notify } from "@/lib/notify";
import type { ActionResult } from "@/lib/actions/auth";

export async function toggleFollow(targetUserId: string): Promise<ActionResult<{ following: boolean }>> {
  const user = await requireUser();
  if (user.id === targetUserId) return { ok: false, error: "You can't follow yourself." };

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: user.id, followingId: targetUserId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    return { ok: true, data: { following: false } };
  }

  const target = await prisma.user.findUnique({ where: { id: targetUserId }, select: { username: true } });
  if (!target) return { ok: false, error: "User not found." };

  await prisma.follow.create({ data: { followerId: user.id, followingId: targetUserId } });
  await notify({ userId: targetUserId, actorId: user.id, type: "FOLLOW" });

  revalidatePath(`/community/user/${target.username}`);
  return { ok: true, data: { following: true } };
}
