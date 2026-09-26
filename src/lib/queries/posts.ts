import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// A viewer-scoped filter that always keeps the relation selected (so the
// result shape is stable and typed), but matches zero rows when there is no
// signed-in viewer. Passing `false` for the relation instead would omit the
// field from the result entirely rather than yielding `[]`, which crashes
// any code that reads `.length` on it for guests.
function viewerScoped(viewerId: string | undefined) {
  return { userId: viewerId ?? "__no-viewer__" };
}

export function postInclude(viewerId?: string) {
  return {
    author: true,
    media: { orderBy: { order: "asc" as const } },
    poll: {
      include: {
        options: { orderBy: { order: "asc" as const } },
        votes: { where: viewerScoped(viewerId) },
      },
    },
    quoteOf: {
      where: { deletedAt: null },
      include: {
        author: true,
        media: { orderBy: { order: "asc" as const } },
      },
    },
    likes: { where: viewerScoped(viewerId), select: { id: true } },
    reposts: { where: viewerScoped(viewerId), select: { id: true } },
    bookmarks: { where: viewerScoped(viewerId), select: { id: true } },
  } satisfies Prisma.PostInclude;
}

export type FeedPost = Prisma.PostGetPayload<{ include: ReturnType<typeof postInclude> }>;

export async function getFeedPosts(opts: {
  viewerId?: string;
  tab: "for-you" | "latest" | "following" | "official" | "trending";
  cursor?: string;
  take?: number;
}): Promise<FeedPost[]> {
  const { viewerId, tab, cursor, take = 20 } = opts;

  const where: Prisma.PostWhereInput = { deletedAt: null, quoteOfId: null };

  if (tab === "official") {
    where.contentStatus = "OFFICIAL";
  } else if (tab === "following" && viewerId) {
    const following = await prisma.follow.findMany({ where: { followerId: viewerId }, select: { followingId: true } });
    where.authorId = { in: [...following.map((f) => f.followingId), viewerId] };
  }

  const orderBy: Prisma.PostOrderByWithRelationInput =
    tab === "trending" ? { likesCount: "desc" } : { createdAt: "desc" };

  return prisma.post.findMany({
    where,
    orderBy,
    take,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: postInclude(viewerId),
  });
}

export async function getPostById(id: string, viewerId?: string): Promise<FeedPost | null> {
  return prisma.post.findFirst({
    where: { id, deletedAt: null },
    include: postInclude(viewerId),
  });
}

export async function getUserPosts(authorId: string, viewerId: string | undefined, mediaOnly = false): Promise<FeedPost[]> {
  return prisma.post.findMany({
    where: { authorId, deletedAt: null, ...(mediaOnly ? { media: { some: {} } } : {}) },
    orderBy: { createdAt: "desc" },
    include: postInclude(viewerId),
  });
}

export async function getUserLikedPosts(userId: string, viewerId: string | undefined): Promise<FeedPost[]> {
  const likes = await prisma.postLike.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { post: { include: postInclude(viewerId) } },
  });
  return likes.filter((l) => !l.post.deletedAt).map((l) => l.post as unknown as FeedPost);
}

export async function getUserBookmarkedPosts(userId: string): Promise<FeedPost[]> {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { post: { include: postInclude(userId) } },
  });
  return bookmarks.filter((b) => !b.post.deletedAt).map((b) => b.post as unknown as FeedPost);
}
