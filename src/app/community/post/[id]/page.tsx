import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { getPostById } from "@/lib/queries/posts";
import { getCommentTree, type CommentNode } from "@/lib/queries/comments";
import { PostCard } from "@/components/community/post-card";
import { CommentComposer } from "@/components/community/comment-composer";
import { CommentThread, type CommentThreadItem } from "@/components/community/comment-thread";

function serializeComment(node: CommentNode): CommentThreadItem {
  return {
    id: node.id,
    postId: node.postId,
    authorId: node.authorId,
    content: node.content,
    createdAt: node.createdAt.toISOString(),
    deletedAt: node.deletedAt ? node.deletedAt.toISOString() : null,
    likesCount: node.likesCount,
    liked: node.likes.length > 0,
    author: {
      name: node.author.name,
      username: node.author.username,
      avatarUrl: node.author.avatarUrl,
      verification: node.author.verification,
    },
    children: node.children.map(serializeComment),
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return {};
  return {
    title: post.content ? post.content.slice(0, 80) : `Post by ${post.author.name}`,
    description: post.content ?? undefined,
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const post = await getPostById(id, session?.user?.id);
  if (!post) notFound();

  const commentTree = await getCommentTree(id, session?.user?.id);

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link href="/community" className="rounded-full p-2 hover:bg-muted">
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-serif text-lg font-semibold">Post</h1>
      </div>

      <PostCard post={post} detail />

      <div className="border-b border-border px-4 py-3">
        <CommentComposer postId={post.id} />
      </div>

      <div className="px-4">
        {commentTree.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No replies yet. Start the conversation.</p>
        ) : (
          commentTree.map((c) => <CommentThread key={c.id} comment={serializeComment(c)} />)
        )}
      </div>
    </div>
  );
}
