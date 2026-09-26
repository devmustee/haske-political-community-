"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { notify } from "@/lib/notify";
import type { ActionResult } from "@/lib/actions/auth";

export async function votePoll(pollId: string, optionIds: string[]): Promise<ActionResult> {
  const user = await requireUser();
  if (optionIds.length === 0) return { ok: false, error: "Choose at least one option." };

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: true, post: { select: { id: true, authorId: true } } },
  });
  if (!poll) return { ok: false, error: "Poll not found." };
  if (poll.endAt < new Date()) return { ok: false, error: "This poll has ended." };
  if (!poll.allowMultiple && optionIds.length > 1) return { ok: false, error: "This poll only allows one choice." };

  const validIds = new Set(poll.options.map((o) => o.id));
  if (!optionIds.every((id) => validIds.has(id))) return { ok: false, error: "Invalid poll option." };

  try {
    await prisma.$transaction(
      async (tx) => {
        const existingVotes = await tx.pollVote.findMany({ where: { pollId, userId: user.id } });
        if (existingVotes.length > 0) throw new Error("ALREADY_VOTED");

        await tx.pollVote.createMany({ data: optionIds.map((optionId) => ({ pollId, optionId, userId: user.id })) });
        for (const optionId of optionIds) {
          await tx.pollOption.update({ where: { id: optionId }, data: { votesCount: { increment: 1 } } });
        }
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  } catch {
    // Either the "already voted" check failed, or Postgres aborted this
    // transaction because it conflicted with a concurrent vote from the
    // same user (serialization failure) — both mean the same thing here.
    return { ok: false, error: "You've already voted in this poll." };
  }

  await notify({ userId: poll.post.authorId, actorId: user.id, type: "POLL_RESULT", postId: poll.post.id });

  revalidatePath("/community");
  revalidatePath(`/community/post/${poll.post.id}`);
  return { ok: true, data: undefined };
}
