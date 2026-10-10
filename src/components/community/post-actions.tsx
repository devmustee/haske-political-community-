"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, Quote, Trash2, Flag, Link2, MessageSquareShare, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { toggleLike, toggleRepost, deletePost } from "@/lib/actions/posts";
import { toggleBookmark } from "@/lib/actions/posts";
import { reportContent } from "@/lib/actions/reports";
import { useGuestGate } from "@/components/community/guest-gate";
import { PostComposer } from "@/components/community/post-composer";
import { ReportDialog } from "@/components/community/report-dialog";
import { CommentComposer } from "@/components/community/comment-composer";
import { cn, formatCount } from "@/lib/utils";
import { runAction } from "@/lib/run-action";

export function PostActions({
  postId,
  authorId,
  authorName,
  authorUsername,
  contentPreview,
  likesCount,
  commentsCount,
  repostsCount,
  liked,
  reposted,
  bookmarked,
  quickReply = true,
}: {
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  contentPreview?: string;
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
  /** Reply opens an inline composer under the post instead of navigating to it. */
  quickReply?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { guard, GateDialog } = useGuestGate();
  const [pending, startTransition] = useTransition();

  const [likeState, setLikeState] = useState({ liked, count: likesCount });
  const [repostState, setRepostState] = useState({ reposted, count: repostsCount });
  const [bookmarkState, setBookmarkState] = useState(bookmarked);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.share === "function",
    () => false
  );

  const isOwner = session?.user?.id === authorId;

  const handleLike = guard(() => {
    setLikeState((s) => ({ liked: !s.liked, count: s.liked ? s.count - 1 : s.count + 1 }));
    startTransition(async () => {
      const result = await runAction(() => toggleLike(postId));
      if (!result.ok) {
        toast.error(result.error);
        setLikeState({ liked, count: likesCount });
      }
    });
  });

  const handleRepost = guard(() => {
    setRepostState((s) => ({ reposted: !s.reposted, count: s.reposted ? s.count - 1 : s.count + 1 }));
    startTransition(async () => {
      const result = await runAction(() => toggleRepost(postId));
      if (!result.ok) {
        toast.error(result.error);
        setRepostState({ reposted, count: repostsCount });
      } else {
        toast.success(result.data.reposted ? "Reposted" : "Repost removed");
      }
    });
  });

  const handleQuote = guard(() => setQuoteOpen(true));

  const handleBookmark = guard(() => {
    setBookmarkState((v) => !v);
    startTransition(async () => {
      const result = await runAction(() => toggleBookmark(postId));
      if (!result.ok) {
        toast.error(result.error);
        setBookmarkState(bookmarked);
      } else {
        toast.success(result.data.bookmarked ? "Added to bookmarks" : "Removed from bookmarks");
      }
    });
  });

  const postUrl = () => `${window.location.origin}/community/post/${postId}`;
  const shareText = () => (contentPreview ? `${contentPreview.slice(0, 180)}${contentPreview.length > 180 ? "…" : ""}` : `Post by ${authorName} on Haske Community`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl());
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  };

  const openShareWindow = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  const handleNativeShare = () => {
    navigator.share({ title: `${authorName} on Haske Community`, text: shareText(), url: postUrl() }).catch(() => {});
  };

  const handleReply = () => {
    if (quickReply) setReplyOpen((v) => !v);
    else router.push(`/community/post/${postId}`);
  };

  const handleReport = guard(() => setReportOpen(true));

  async function handleDelete() {
    setDeleteOpen(false);
    const result = await runAction(() => deletePost(postId));
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Post deleted");
    router.refresh();
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
    <div className="mt-3 flex items-center justify-between text-muted-foreground">
      <button
        onClick={handleReply}
        aria-expanded={quickReply ? replyOpen : undefined}
        aria-label="Reply"
        className={cn("group flex items-center gap-1.5 rounded-full p-2 -m-2 hover:text-primary", replyOpen && "text-primary")}
      >
        <span className="rounded-full p-1.5 group-hover:bg-primary/10">
          <MessageCircle className="size-[18px]" />
        </span>
        {commentsCount > 0 && <span className="text-xs">{formatCount(commentsCount)}</span>}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            disabled={pending}
            aria-label={repostState.reposted ? "Undo repost or quote" : "Repost or quote"}
            className={cn(
              "group flex items-center gap-1.5 rounded-full p-2 -m-2 hover:text-emerald-600",
              repostState.reposted && "text-emerald-600"
            )}
          >
            <span className="rounded-full p-1.5 group-hover:bg-emerald-600/10">
              <Repeat2 className="size-[18px]" />
            </span>
            {repostState.count > 0 && <span className="text-xs">{formatCount(repostState.count)}</span>}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={handleRepost}>
            <Repeat2 className="size-4" /> {repostState.reposted ? "Undo repost" : "Repost"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleQuote}>
            <Quote className="size-4" /> Quote
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <button
        onClick={handleLike}
        disabled={pending}
        aria-label={likeState.liked ? "Unlike" : "Like"}
        aria-pressed={likeState.liked}
        className={cn(
          "group flex items-center gap-1.5 rounded-full p-2 -m-2 transition-all duration-200 hover:text-rose-600 active:scale-125",
          likeState.liked && "text-rose-600"
        )}
      >
        <span className="rounded-full p-1.5 group-hover:bg-rose-600/10 transition-transform group-hover:scale-110">
          <Heart className={cn("size-[18px] transition-transform", likeState.liked && "fill-current animate-zoom-in")} />
        </span>
        {likeState.count > 0 && <span className="text-xs font-semibold font-tnum">{formatCount(likeState.count)}</span>}
      </button>

      <button
        onClick={handleBookmark}
        aria-label={bookmarkState ? "Remove bookmark" : "Bookmark"}
        aria-pressed={bookmarkState}
        className={cn(
          "rounded-full p-2 -m-2 transition-all duration-200 hover:text-accent hover:bg-accent/10 active:scale-125 max-sm:p-[13px] max-sm:-m-[13px]",
          bookmarkState && "text-accent"
        )}
      >
        <Bookmark className={cn("size-[18px] transition-transform", bookmarkState && "fill-current animate-zoom-in")} />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Share"
            className="rounded-full p-2 -m-2 transition-all duration-200 hover:text-primary hover:bg-primary/10 active:scale-125 max-sm:p-[13px] max-sm:-m-[13px]"
          >
            <Share className="size-[18px]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            <Link2 className="size-4" /> Copy link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openShareWindow(`https://wa.me/?text=${encodeURIComponent(`${shareText()} ${postUrl()}`)}`)}>
            <MessageSquareShare className="size-4" /> Share to WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              openShareWindow(`https://x.com/intent/post?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent(postUrl())}`)
            }
          >
            <Send className="size-4" /> Share to X
          </DropdownMenuItem>
          {canNativeShare && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleNativeShare}>
                <Share className="size-4" /> More options…
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button aria-label="More options" className="rounded-full p-2 -m-2 hover:text-primary max-sm:p-[13px] max-sm:-m-[13px]">
            <MoreHorizontal className="size-[18px]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOwner ? (
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="size-4" /> Delete post
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem variant="destructive" onClick={handleReport}>
              <Flag className="size-4" /> Report post
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

    </div>

      {replyOpen && (
        <div className="mt-3 border-t border-border pt-3">
          <CommentComposer
            postId={postId}
            autoFocus
            placeholder={`Reply to @${authorUsername}`}
            onDone={() => {
              setReplyOpen(false);
              toast.success("Reply posted");
            }}
          />
        </div>
      )}

      {GateDialog}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>It will be removed from your profile and from community feeds. This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <PostComposer
        open={quoteOpen}
        onOpenChange={setQuoteOpen}
        quoteOfId={postId}
        quotedPostPreview={
          <div className="text-sm">
            <span className="font-medium">{authorName}</span>{" "}
            <span className="text-muted-foreground">@{authorUsername}</span>
            {contentPreview && <p className="mt-1 line-clamp-3 text-muted-foreground">{contentPreview}</p>}
          </div>
        }
      />
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={(reason, details) => reportContent({ targetType: "POST", postId, reason, details })}
      />
    </div>
  );
}

const noopSubscribe = () => () => {};
