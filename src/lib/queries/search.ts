import "server-only";
import { prisma } from "@/lib/prisma";
import { postInclude } from "@/lib/queries/posts";

export async function globalSearch(query: string, viewerId?: string) {
  const q = query.trim();
  if (!q) {
    return { people: [], posts: [], programs: [], achievements: [], events: [], media: [] };
  }

  const [people, posts, programs, achievements, events, media] = await Promise.all([
    prisma.user.findMany({
      where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { username: { contains: q, mode: "insensitive" } }] },
      take: 10,
    }),
    prisma.post.findMany({
      where: { deletedAt: null, content: { contains: q, mode: "insensitive" } },
      include: postInclude(viewerId),
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.program.findMany({
      where: {
        contentStatus: { not: "DRAFT" },
        OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
      },
      take: 10,
    }),
    prisma.achievement.findMany({
      where: {
        contentStatus: { not: "DRAFT" },
        OR: [{ title: { contains: q, mode: "insensitive" } }, { summary: { contains: q, mode: "insensitive" } }],
      },
      take: 10,
    }),
    prisma.event.findMany({
      where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] },
      take: 10,
    }),
    prisma.mediaCenterItem.findMany({
      where: {
        contentStatus: { not: "DRAFT" },
        OR: [{ title: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }],
      },
      take: 10,
    }),
  ]);

  return { people, posts, programs, achievements, events, media };
}

export async function getTrendingHashtags(take = 10) {
  return prisma.hashtag.findMany({ orderBy: { postsCount: "desc" }, take });
}
