import "server-only";
import { prisma } from "@/lib/prisma";

export async function getUserReplies(authorId: string) {
  return prisma.comment.findMany({
    where: { authorId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      post: { select: { id: true, content: true, author: { select: { username: true, name: true } } } },
    },
    take: 50,
  });
}
