import "server-only";
import { prisma } from "@/lib/prisma";

export async function getUserProfile(username: string, viewerId?: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { posts: { where: { deletedAt: null } }, followers: true, following: true } },
      followers: viewerId ? { where: { followerId: viewerId }, select: { id: true } } : false,
    },
  });

  if (!user) return null;

  return {
    ...user,
    isFollowing: viewerId ? user.followers.length > 0 : false,
  };
}
