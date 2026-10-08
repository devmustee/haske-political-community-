"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, Quote, Trash2, Flag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toggleLike, toggleRepost, deletePost } from "@/lib/actions/posts";
import { toggleBookmark } from "@/lib/actions/posts";
import { reportContent } from "@/lib/actions/reports";
import { useGuestGate } from "@/components/community/guest-gate";
import { PostComposer } from "@/components/community/post-composer";
import { ReportDialog } from "@/components/community/report-dialog";
import { cn, formatCount } from "@/lib/utils";

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

  const isOwner = session?.user?.id === authorId;

  const handleLike = guard(() => {
    setLikeState((s) => ({ liked: !s.liked, count: s.liked ? s.count - 1 : s.count + 1 }));
    startTransition(async () => {
      const result = await toggleLike(postId);
      if (!result.ok) {
        toast.error(result.error);
        setLikeState({ liked, count: likesCount });
      }
    });
  });

  const handleRepost = guard(() => {
    setRepostState((s) => ({ reposted: !s.reposted, count: s.reposted ? s.count - 1 : s.count + 1 }));
    startTransition(async () => {
      const result = await toggleRepost(postId);
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
      const result = await toggleBookmark(postId);
      if (!result.ok) {
        toast.error(result.error);
        setBookmarkState(bookmarked);
      } else {
        toast.success(result.data.bookmarked ? "Added to bookmarks" : "Removed from bookmarks");
      }
    });
  });

  const handleShare = () => {
    const url = `${window.location.origin}/community/post/${postId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleReport = guard(() => setReportOpen(true));

  async function handleDelete() {
    const result = await deletePost(postId);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Post deleted");
    router.refresh();
  }

  return (
    <div className="mt-2 flex items-center justify-between text-muted-foreground" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => router.push(`/community/post/${postId}`)}
        className="group flex items-center gap-1.5 rounded-full p-2 -m-2 hover:text-primary"
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
        className={cn(
          "rounded-full p-2 -m-2 transition-all duration-200 hover:text-accent hover:bg-accent/10 active:scale-125",
          bookmarkState && "text-accent"
        )}
      >
        <Bookmark className={cn("size-[18px] transition-transform", bookmarkState && "fill-current animate-zoom-in")} />
      </button>

      <button
        onClick={handleShare}
        className="rounded-full p-2 -m-2 transition-all duration-200 hover:text-primary hover:bg-primary/10 active:scale-125"
      >
        <Share className="size-[18px]" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full p-2 -m-2 hover:text-primary">
            <MoreHorizontal className="size-[18px]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOwner ? (
            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
              <Trash2 className="size-4" /> Delete post
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem variant="destructive" onClick={handleReport}>
              <Flag className="size-4" /> Report post
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {GateDialog}
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
