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
import { cn, formatRelativeTime, initials } from "@/lib/utils";
import type { FeedPost } from "@/lib/queries/posts";
import { Repeat2, Megaphone, MapPin } from "lucide-react";

const ROLE_LABEL: Record<string, string> = {
  OFFICIAL: "Official",
  ORGANIZATION: "Organization",
};

/** "Mubi, Adamawa" → "Mubi". Profile locations are free text; the town is what's useful in a byline. */
function shortLocation(location: string | null) {
  const town = location?.split(",")[0]?.trim();
  return town || null;
}

export function RoleBadge({ verification, className }: { verification?: string | null; className?: string }) {
  const label = verification ? ROLE_LABEL[verification] : undefined;
  if (!label) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wider",
        verification === "OFFICIAL" ? "bg-primary text-primary-foreground" : "bg-accent-subtle text-accent-foreground ring-1 ring-accent/40 dark:text-accent",
        className
      )}
    >
      {label}
    </span>
  );
}

/**
 * A post in a feed. `variant="card"` (default) is a standalone elevated card
 * for community feeds; `variant="row"` is a flat divider row for embedding
 * inside another container (e.g. the homepage preview). `detail` is set on
 * the post's own page, where the reply composer is already shown below.
 */
export function PostCard({
  post,
  repostedBy,
  variant = "card",
  detail = false,
}: {
  post: FeedPost;
  repostedBy?: { name: string; username: string } | null;
  variant?: "card" | "row";
  detail?: boolean;
}) {
  const liked = post.likes.length > 0;
  const reposted = post.reposts.length > 0;
  const bookmarked = post.bookmarks.length > 0;
  const announcement = post.type === "ANNOUNCEMENT";
  const location = shortLocation(post.author.location);
  const createdAt = new Date(post.createdAt);

  return (
    <article
      className={cn(
        variant === "card"
          ? "mx-3 mt-3 rounded-2xl border bg-card p-4 shadow-soft transition-shadow duration-200 last:mb-3 sm:px-5"
          : "border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/30",
        variant === "card" && (announcement ? "border-accent/50 shadow-card-gold" : "border-[var(--card-border)]"),
        variant === "card" && !detail && "hover:shadow-ambient"
      )}
    >
      {(repostedBy || announcement) && (
        <div className="mb-2 flex flex-wrap items-center gap-3 pl-14 text-xs font-medium text-muted-foreground">
          {announcement && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-subtle px-2.5 py-1 font-semibold text-accent-foreground dark:text-accent">
              <Megaphone className="size-3.5" />
              Announcement
            </span>
          )}
          {repostedBy && (
            <span className="inline-flex items-center gap-1.5">
              <Repeat2 className="size-3.5" />
              {repostedBy.name} reposted
            </span>
          )}
        </div>
      )}

      <PostRowLink href={`/community/post/${post.id}`} className={cn("flex gap-3", !detail && "cursor-pointer")}>
        <StopPropagationLink href={`/community/user/${post.author.username}`} className="shrink-0">
          <Avatar className={cn("size-11", post.author.verification === "OFFICIAL" && "ring-2 ring-primary/70 ring-offset-2 ring-offset-card")}>
            <AvatarImage src={post.author.avatarUrl ?? undefined} />
            <AvatarFallback>{initials(post.author.name)}</AvatarFallback>
          </Avatar>
        </StopPropagationLink>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[15px] leading-tight">
            <StopPropagationLink href={`/community/user/${post.author.username}`} className="truncate font-semibold hover:underline">
              {post.author.name}
            </StopPropagationLink>
            <VerifiedBadge status={post.author.verification} />
            {/* The content-status badge already says "Official"; don't repeat it. */}
            {post.contentStatus !== "OFFICIAL" && <RoleBadge verification={post.author.verification} />}
            {post.contentStatus !== "COMMUNITY" && <ContentStatusBadge status={post.contentStatus} />}
          </div>
          <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[13px] text-muted-foreground">
            <span className="truncate">@{post.author.username}</span>
            {location && (
              <>
                <span aria-hidden>&middot;</span>
                <span className="inline-flex shrink-0 items-center gap-0.5">
                  <MapPin className="size-3" />
                  {location}
                </span>
              </>
            )}
            <span aria-hidden>&middot;</span>
            <time
              dateTime={createdAt.toISOString()}
              title={createdAt.toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
              className="shrink-0"
            >
              {formatRelativeTime(createdAt)}
            </time>
          </div>

          {post.content && (
            <PostContent
              content={post.content}
              className={cn("mt-2 whitespace-pre-wrap break-words leading-relaxed", detail ? "text-[17px]" : "text-[15px]")}
            />
          )}

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
            <StopClick className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/30 transition-colors hover:bg-muted/60">
              <Link href={`/community/post/${post.quoteOf.id}`} className="block p-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <Avatar className="size-5">
                    <AvatarImage src={post.quoteOf.author.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-[10px]">{initials(post.quoteOf.author.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{post.quoteOf.author.name}</span>
                  <VerifiedBadge status={post.quoteOf.author.verification} />
                  <span className="truncate text-muted-foreground">@{post.quoteOf.author.username}</span>
                </div>
                {post.quoteOf.content && <p className="mt-1 line-clamp-4 text-sm text-muted-foreground">{post.quoteOf.content}</p>}
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
            quickReply={!detail}
          />
        </div>
      </PostRowLink>
    </article>
  );
}
