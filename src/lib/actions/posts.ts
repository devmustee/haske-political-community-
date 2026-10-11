"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserResult } from "@/lib/session";
import { notify } from "@/lib/notify";
import { containsBlockedWord, extractHashtags } from "@/lib/moderation";
import { rateLimit } from "@/lib/rate-limit";
import { createPostSchema, createCommentSchema, type CreatePostInput, type CreateCommentInput } from "@/lib/validations/post";
import type { ActionResult } from "@/lib/actions/auth";
import type { CommentThreadItem } from "@/lib/comment-item";
import { PostType } from "@prisma/client";

/**
 * A repeat of the same text by the same person within this window is treated
 * as a double tap or a retry on a slow connection, and returns the first copy
 * instead of saving a duplicate.
 */
const DUPLICATE_WINDOW_MS = 2 * 60_000;

function inferPostType(input: CreatePostInput): PostType {
  if (input.poll) return PostType.POLL;
  if (input.media?.some((m) => m.type === "VIDEO")) return PostType.VIDEO;
  if (input.media?.length) return PostType.IMAGE;
  if (input.linkUrl) return PostType.LINK;
  return PostType.TEXT;
}

async function attachHashtags(postId: string, content: string) {
  const tags = extractHashtags(content);
  for (const tag of tags) {
    const hashtag = await prisma.hashtag.upsert({
      where: { tag },
      create: { tag, postsCount: 1 },
      update: { postsCount: { increment: 1 } },
    });
    await prisma.postHashtag.create({ data: { postId, hashtagId: hashtag.id } }).catch(() => {});
  }
}

export async function createPost(input: CreatePostInput): Promise<ActionResult<{ postId: string }>> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;

  const limited = rateLimit(`post:${user.id}`, 20, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "You're posting too fast. Slow down a little." };

  const parsed = createPostSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid post." };
  const data = parsed.data;

  if (data.content && (await containsBlockedWord(data.content))) {
    return { ok: false, error: "Your post contains language that isn't allowed here." };
  }

  if (data.content && !data.media?.length && !data.poll) {
    const duplicate = await prisma.post.findFirst({
      where: {
        authorId: user.id,
        content: data.content,
        quoteOfId: data.quoteOfId ?? null,
        deletedAt: null,
        createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
      },
      select: { id: true },
    });
    if (duplicate) return { ok: true, data: { postId: duplicate.id } };
  }

  if (data.quoteOfId) {
    const original = await prisma.post.findUnique({ where: { id: data.quoteOfId }, select: { id: true, deletedAt: true } });
    if (!original || original.deletedAt) return { ok: false, error: "The post you're quoting no longer exists." };
  }

  const post = await prisma.post.create({
    data: {
      authorId: user.id,
      type: inferPostType(data),
      content: data.content || null,
      linkUrl: data.linkUrl || null,
      quoteOfId: data.quoteOfId,
      contentStatus: "COMMUNITY",
      media: data.media?.length
        ? { create: data.media.map((m, i) => ({ url: m.url, type: m.type, altText: m.altText, width: m.width, height: m.height, order: i })) }
        : undefined,
      poll: data.poll
        ? {
            create: {
              question: data.poll.question,
              allowMultiple: data.poll.allowMultiple,
              resultsVisibility: data.poll.resultsVisibility,
              endAt: new Date(Date.now() + data.poll.durationHours * 60 * 60 * 1000),
              options: { create: data.poll.options.map((text, order) => ({ text, order })) },
            },
          }
        : undefined,
    },
  });

  if (data.content) await attachHashtags(post.id, data.content);

  if (data.quoteOfId) {
    const original = await prisma.post.update({
      where: { id: data.quoteOfId },
      data: { repostsCount: { increment: 1 } },
      select: { authorId: true },
    });
    await notify({ userId: original.authorId, actorId: user.id, type: "QUOTE_REPOST", postId: post.id });
  }

  revalidatePath("/community");
  return { ok: true, data: { postId: post.id } };
}

export async function deletePost(postId: string): Promise<ActionResult> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { authorId: true, hashtags: { select: { hashtagId: true } } },
  });
  if (!post) return { ok: false, error: "Post not found." };
  if (post.authorId !== user.id) return { ok: false, error: "You can only delete your own posts." };

  await prisma.$transaction([
    prisma.post.update({ where: { id: postId }, data: { deletedAt: new Date() } }),
    ...post.hashtags.map(({ hashtagId }) =>
      prisma.hashtag.update({ where: { id: hashtagId }, data: { postsCount: { decrement: 1 } } })
    ),
  ]);
  revalidatePath("/community");
  return { ok: true, data: undefined };
}

export async function toggleLike(postId: string): Promise<ActionResult<{ liked: boolean }>> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;

  const existing = await prisma.postLike.findUnique({ where: { userId_postId: { userId: user.id, postId } } });
  if (existing) {
    await prisma.$transaction([
      prisma.postLike.delete({ where: { id: existing.id } }),
      prisma.post.update({ where: { id: postId }, data: { likesCount: { decrement: 1 } } }),
    ]);
    return { ok: true, data: { liked: false } };
  }

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (!post) return { ok: false, error: "Post not found." };

  await prisma.$transaction([
    prisma.postLike.create({ data: { userId: user.id, postId } }),
    prisma.post.update({ where: { id: postId }, data: { likesCount: { increment: 1 } } }),
  ]);
  await notify({ userId: post.authorId, actorId: user.id, type: "LIKE", postId });

  return { ok: true, data: { liked: true } };
}

export async function toggleRepost(postId: string): Promise<ActionResult<{ reposted: boolean }>> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;

  const existing = await prisma.repost.findUnique({ where: { userId_postId: { userId: user.id, postId } } });
  if (existing) {
    await prisma.$transaction([
      prisma.repost.delete({ where: { id: existing.id } }),
      prisma.post.update({ where: { id: postId }, data: { repostsCount: { decrement: 1 } } }),
    ]);
    return { ok: true, data: { reposted: false } };
  }

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
  if (!post) return { ok: false, error: "Post not found." };

  await prisma.$transaction([
    prisma.repost.create({ data: { userId: user.id, postId } }),
    prisma.post.update({ where: { id: postId }, data: { repostsCount: { increment: 1 } } }),
  ]);
  await notify({ userId: post.authorId, actorId: user.id, type: "REPOST", postId });

  revalidatePath("/community");
  return { ok: true, data: { reposted: true } };
}

export async function toggleBookmark(postId: string): Promise<ActionResult<{ bookmarked: boolean }>> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;

  const existing = await prisma.bookmark.findUnique({ where: { userId_postId: { userId: user.id, postId } } });
  if (existing) {
    await prisma.$transaction([
      prisma.bookmark.delete({ where: { id: existing.id } }),
      prisma.post.update({ where: { id: postId }, data: { bookmarksCount: { decrement: 1 } } }),
    ]);
    return { ok: true, data: { bookmarked: false } };
  }

  await prisma.$transaction([
    prisma.bookmark.create({ data: { userId: user.id, postId } }),
    prisma.post.update({ where: { id: postId }, data: { bookmarksCount: { increment: 1 } } }),
  ]);
  return { ok: true, data: { bookmarked: true } };
}

export async function createComment(input: CreateCommentInput): Promise<ActionResult<{ comment: CommentThreadItem; duplicate: boolean }>> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;

  const limited = rateLimit(`comment:${user.id}`, 30, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "You're commenting too fast. Slow down a little." };

  const parsed = createCommentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid comment." };
  const { postId, parentId, content } = parsed.data;

  if (await containsBlockedWord(content)) {
    return { ok: false, error: "Your comment contains language that isn't allowed here." };
  }

  const [post, parent, duplicate] = await Promise.all([
    prisma.post.findUnique({ where: { id: postId }, select: { authorId: true, deletedAt: true } }),
    parentId ? prisma.comment.findUnique({ where: { id: parentId }, select: { authorId: true, postId: true } }) : null,
    prisma.comment.findFirst({
      where: {
        postId,
        parentId: parentId ?? null,
        authorId: user.id,
        content,
        deletedAt: null,
        createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
      },
      include: { author: { select: commentAuthorSelect } },
    }),
  ]);
  if (!post || post.deletedAt) return { ok: false, error: "Post not found." };
  if (parentId && (!parent || parent.postId !== postId)) return { ok: false, error: "The comment you're replying to no longer exists." };
  if (duplicate) return { ok: true, data: { comment: toCommentItem(duplicate), duplicate: true } };

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: { postId, authorId: user.id, parentId, content },
      include: { author: { select: commentAuthorSelect } },
    }),
    prisma.post.update({ where: { id: postId }, data: { commentsCount: { increment: 1 } } }),
  ]);

  // The UI shows the new comment straight from this response, so neither the
  // notification nor a page re-render needs to hold it up.
  after(() =>
    notify(
      parent
        ? { userId: parent.authorId, actorId: user.id, type: "REPLY", postId, commentId: comment.id }
        : { userId: post.authorId, actorId: user.id, type: "COMMENT", postId, commentId: comment.id }
    ).catch((err) => console.error("Comment notification failed:", err))
  );
  return { ok: true, data: { comment: toCommentItem(comment), duplicate: false } };
}

const commentAuthorSelect = { name: true, username: true, avatarUrl: true, verification: true } as const;

function toCommentItem(c: {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  deletedAt: Date | null;
  likesCount: number;
  author: { name: string; username: string; avatarUrl: string | null; verification: string };
}): CommentThreadItem {
  return {
    id: c.id,
    postId: c.postId,
    authorId: c.authorId,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    deletedAt: c.deletedAt ? c.deletedAt.toISOString() : null,
    likesCount: c.likesCount,
    liked: false,
    author: c.author,
    children: [],
  };
}

export async function toggleCommentLike(commentId: string): Promise<ActionResult<{ liked: boolean }>> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;

  const existing = await prisma.commentLike.findUnique({ where: { userId_commentId: { userId: user.id, commentId } } });
  if (existing) {
    await prisma.$transaction([
      prisma.commentLike.delete({ where: { id: existing.id } }),
      prisma.comment.update({ where: { id: commentId }, data: { likesCount: { decrement: 1 } } }),
    ]);
    return { ok: true, data: { liked: false } };
  }

  await prisma.$transaction([
    prisma.commentLike.create({ data: { userId: user.id, commentId } }),
    prisma.comment.update({ where: { id: commentId }, data: { likesCount: { increment: 1 } } }),
  ]);
  return { ok: true, data: { liked: true } };
}

export async function deleteComment(commentId: string): Promise<ActionResult> {
  const authResult = await requireUserResult();
  if (!authResult.ok) return authResult;
  const user = authResult.user;
  const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { authorId: true, postId: true } });
  if (!comment) return { ok: false, error: "Comment not found." };
  if (comment.authorId !== user.id) return { ok: false, error: "You can only delete your own comments." };

  await prisma.$transaction([
    prisma.comment.update({ where: { id: commentId }, data: { deletedAt: new Date(), content: "[deleted]" } }),
    prisma.post.update({ where: { id: comment.postId }, data: { commentsCount: { decrement: 1 } } }),
  ]);
  return { ok: true, data: undefined };
}
