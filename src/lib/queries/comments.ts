import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

function commentInclude(viewerId?: string) {
  return {
    author: true,
    // Always keep the relation selected (see postInclude for why `false`
    // for guests is unsafe) but match nothing when there's no viewer.
    likes: { where: { userId: viewerId ?? "__no-viewer__" }, select: { id: true } },
  } satisfies Prisma.CommentInclude;
}

export type FlatComment = Prisma.CommentGetPayload<{ include: ReturnType<typeof commentInclude> }>;

export interface CommentNode extends FlatComment {
  children: CommentNode[];
}

export async function getCommentTree(postId: string, viewerId?: string): Promise<CommentNode[]> {
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
    include: commentInclude(viewerId),
  });

  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const c of comments) byId.set(c.id, { ...c, children: [] });

  for (const c of comments) {
    const node = byId.get(c.id)!;
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
