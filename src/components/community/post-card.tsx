import Link from "next/link";
import { PostRowLink } from "@/components/community/post-row-link";
import { StopPropagationLink } from "@/components/community/stop-propagation-link";
import { StopClick } from "@/components/community/stop-click";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/community/verified-badge";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { PostContent } from "@/components/community/post-content";
import { MediaGrid } from "@/components/community/media-grid";
import { PollCard } from "@/components/community/poll-card";
import { PostActions } from "@/components/community/post-actions";
import { formatRelativeTime, initials } from "@/lib/utils";
import type { FeedPost } from "@/lib/queries/posts";
import { Repeat2, Megaphone } from "lucide-react";

export function PostCard({ post, repostedBy }: { post: FeedPost; repostedBy?: { name: string; username: string } | null }) {
  const liked = post.likes.length > 0;
  const reposted = post.reposts.length > 0;
  const bookmarked = post.bookmarks.length > 0;

  return (
    <article className="border-b border-border px-4 py-3 transition-colors hover:bg-muted/30">
      {repostedBy && (
        <div className="mb-1.5 flex items-center gap-2 pl-8 text-xs font-medium text-muted-foreground">
          <Repeat2 className="size-3.5" />
          {repostedBy.name} reposted
        </div>
      )}
      {post.type === "ANNOUNCEMENT" && (
        <div className="mb-1.5 flex items-center gap-2 pl-8 text-xs font-medium text-accent-foreground">
          <Megaphone className="size-3.5" />
          Announcement
        </div>
      )}

      <PostRowLink href={`/community/post/${post.id}`} className="flex gap-3 cursor-pointer">
        <StopPropagationLink href={`/community/user/${post.author.username}`}>
          <Avatar className="size-11 shrink-0">
            <AvatarImage src={post.author.avatarUrl ?? undefined} />
            <AvatarFallback>{initials(post.author.name)}</AvatarFallback>
          </Avatar>
        </StopPropagationLink>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 text-[15px]">
            <StopPropagationLink
              href={`/community/user/${post.author.username}`}
              className="font-semibold hover:underline"
            >
              {post.author.name}
            </StopPropagationLink>
            <VerifiedBadge status={post.author.verification} />
            <span className="text-muted-foreground">@{post.author.username}</span>
            <span className="text-muted-foreground">&middot;</span>
            <span className="text-muted-foreground">{formatRelativeTime(post.createdAt)}</span>
            {post.contentStatus !== "COMMUNITY" && <ContentStatusBadge status={post.contentStatus} className="ml-1" />}
          </div>

          {post.content && <PostContent content={post.content} className="mt-0.5 whitespace-pre-wrap text-[15px] leading-normal" />}

          <MediaGrid media={post.media} />

          {post.poll && (
            <PollCard
              pollId={post.poll.id}
              question={post.poll.question}
              allowMultiple={post.poll.allowMultiple}
              isOfficial={post.poll.isOfficial}
              endAt={post.poll.endAt.toISOString()}
              hasVoted={post.poll.votes.length > 0}
              options={post.poll.options.map((o) => ({ id: o.id, text: o.text, votesCount: o.votesCount }))}
            />
          )}

          {post.quoteOf && (
            <StopClick className="mt-2 rounded-xl border border-border p-3">
              <Link href={`/community/post/${post.quoteOf.id}`} className="block">
                <div className="flex items-center gap-1.5 text-sm">
                  <Avatar className="size-5">
                    <AvatarImage src={post.quoteOf.author.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-[10px]">{initials(post.quoteOf.author.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{post.quoteOf.author.name}</span>
                  <VerifiedBadge status={post.quoteOf.author.verification} />
                  <span className="text-muted-foreground">@{post.quoteOf.author.username}</span>
                </div>
                {post.quoteOf.content && (
                  <p className="mt-1 line-clamp-4 text-sm text-muted-foreground">{post.quoteOf.content}</p>
                )}
                <MediaGrid media={post.quoteOf.media} />
              </Link>
            </StopClick>
          )}

          <PostActions
            postId={post.id}
            authorId={post.authorId}
            authorName={post.author.name}
            authorUsername={post.author.username}
            contentPreview={post.content ?? undefined}
            likesCount={post.likesCount}
            commentsCount={post.commentsCount}
            repostsCount={post.repostsCount}
            liked={liked}
            reposted={reposted}
            bookmarked={bookmarked}
          />
        </div>
      </PostRowLink>
    </article>
  );
}
