"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { notify } from "@/lib/notify";
import { containsBlockedWord, extractHashtags } from "@/lib/moderation";
import { rateLimit } from "@/lib/rate-limit";
import { createPostSchema, createCommentSchema, type CreatePostInput, type CreateCommentInput } from "@/lib/validations/post";
import type { ActionResult } from "@/lib/actions/auth";
import { PostType } from "@prisma/client";

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
  const user = await requireUser();

  const limited = rateLimit(`post:${user.id}`, 20, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "You're posting too fast. Slow down a little." };

  const parsed = createPostSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid post." };
  const data = parsed.data;

  if (data.content && (await containsBlockedWord(data.content))) {
    return { ok: false, error: "Your post contains language that isn't allowed here." };
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
  const user = await requireUser();
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
  const user = await requireUser();

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
  const user = await requireUser();

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
  const user = await requireUser();

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

export async function createComment(input: CreateCommentInput): Promise<ActionResult<{ commentId: string }>> {
  const user = await requireUser();

  const limited = rateLimit(`comment:${user.id}`, 30, 10 * 60_000);
  if (!limited.ok) return { ok: false, error: "You're commenting too fast. Slow down a little." };

  const parsed = createCommentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid comment." };
  const { postId, parentId, content } = parsed.data;

  if (await containsBlockedWord(content)) {
    return { ok: false, error: "Your comment contains language that isn't allowed here." };
  }

  const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true, deletedAt: true } });
  if (!post || post.deletedAt) return { ok: false, error: "Post not found." };

  let parentAuthorId: string | null = null;
  if (parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: parentId }, select: { authorId: true } });
    if (!parent) return { ok: false, error: "The comment you're replying to no longer exists." };
    parentAuthorId = parent.authorId;
  }

  const comment = await prisma.comment.create({
    data: { postId, authorId: user.id, parentId, content },
  });

  await prisma.post.update({ where: { id: postId }, data: { commentsCount: { increment: 1 } } });

  if (parentAuthorId) {
    await notify({ userId: parentAuthorId, actorId: user.id, type: "REPLY", postId, commentId: comment.id });
  } else {
    await notify({ userId: post.authorId, actorId: user.id, type: "COMMENT", postId, commentId: comment.id });
  }

  revalidatePath(`/community/post/${postId}`);
  return { ok: true, data: { commentId: comment.id } };
}

export async function toggleCommentLike(commentId: string): Promise<ActionResult<{ liked: boolean }>> {
  const user = await requireUser();

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
  const user = await requireUser();
  const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { authorId: true, postId: true } });
  if (!comment) return { ok: false, error: "Comment not found." };
  if (comment.authorId !== user.id) return { ok: false, error: "You can only delete your own comments." };

  await prisma.$transaction([
    prisma.comment.update({ where: { id: commentId }, data: { deletedAt: new Date(), content: "[deleted]" } }),
    prisma.post.update({ where: { id: comment.postId }, data: { commentsCount: { decrement: 1 } } }),
  ]);
  revalidatePath(`/community/post/${comment.postId}`);
  return { ok: true, data: undefined };
}
