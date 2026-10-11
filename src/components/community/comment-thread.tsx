"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Heart, MessageCircle, Trash2, Flag, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/community/verified-badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CommentComposer } from "@/components/community/comment-composer";
import { ReportDialog } from "@/components/community/report-dialog";
import { useGuestGate } from "@/components/community/guest-gate";
import { useCommentList } from "@/components/community/comment-list";
import { toggleCommentLike } from "@/lib/actions/posts";
import { reportContent } from "@/lib/actions/reports";
import { cn, formatRelativeTime, initials } from "@/lib/utils";
import { runAction } from "@/lib/run-action";
import type { CommentThreadItem } from "@/lib/comment-item";

export type { CommentThreadItem };

/** The comments of the nearest CommentListProvider, or `empty` when there are none. */
export function CommentList({ empty }: { empty?: React.ReactNode }) {
  const list = useCommentList();
  if (!list || list.comments.length === 0) return <>{empty}</>;
  return (
    <>
      {list.comments.map((c) => (
        <CommentThread key={c.id} comment={c} />
      ))}
    </>
  );
}

export function CommentThread({ comment, depth = 0 }: { comment: CommentThreadItem; depth?: number }) {
  const { data: session } = useSession();
  const list = useCommentList();
  const { guard, GateDialog } = useGuestGate();
  const [replying, setReplying] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [likeState, setLikeState] = useState({ liked: comment.liked, count: comment.likesCount });

  const isOwner = session?.user?.id === comment.authorId;

  const handleLike = guard(() => {
    setLikeState((s) => ({ liked: !s.liked, count: s.liked ? s.count - 1 : s.count + 1 }));
    (async () => {
      const result = await runAction(() => toggleCommentLike(comment.id));
      if (!result.ok) {
        toast.error(result.error);
        setLikeState({ liked: comment.liked, count: comment.likesCount });
      }
    })();
  });

  const unsent = comment.status !== undefined;

  return (
    <div className={cn(depth > 0 && "ml-6 border-l border-border pl-4 sm:ml-11", comment.status === "sending" && "opacity-70")}>
      <div className="flex gap-3 py-3">
        <Link href={`/community/user/${comment.author.username}`}>
          <Avatar className="size-9 shrink-0">
            <AvatarImage src={comment.author.avatarUrl ?? undefined} />
            <AvatarFallback>{initials(comment.author.name)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <Link href={`/community/user/${comment.author.username}`} className="font-semibold hover:underline">
              {comment.author.name}
            </Link>
            <VerifiedBadge status={comment.author.verification} />
            <span className="text-muted-foreground">@{comment.author.username}</span>
            <span className="text-muted-foreground">&middot;</span>
            <span className="text-muted-foreground">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <p className={cn("mt-0.5 whitespace-pre-wrap text-[15px]", comment.deletedAt && "italic text-muted-foreground")}>
            {comment.content}
          </p>

          {comment.status === "sending" && <p className="mt-1 text-xs text-muted-foreground">Sending…</p>}
          {comment.status === "failed" && (
            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs">
              <span className="text-destructive">Not sent.</span>
              <button onClick={() => list?.retry(comment.id)} className="font-semibold text-primary hover:underline max-sm:py-2">
                Retry
              </button>
              <button onClick={() => list?.discard(comment.id)} className="text-muted-foreground hover:underline max-sm:py-2">
                Discard
              </button>
            </p>
          )}

          {!comment.deletedAt && !unsent && (
            <div className="mt-1.5 flex items-center gap-4 text-muted-foreground">
              <button onClick={() => setReplying((v) => !v)} className="flex items-center gap-1.5 hover:text-primary">
                <MessageCircle className="size-4" />
                <span className="text-xs">Reply</span>
              </button>
              <button onClick={handleLike} className={cn("flex items-center gap-1.5 hover:text-rose-600", likeState.liked && "text-rose-600")}>
                <Heart className={cn("size-4", likeState.liked && "fill-current")} />
                {likeState.count > 0 && <span className="text-xs">{likeState.count}</span>}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hover:text-primary">
                    <MoreHorizontal className="size-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {isOwner ? (
                    <DropdownMenuItem variant="destructive" onClick={() => list?.remove(comment.id)}>
                      <Trash2 className="size-4" /> Delete
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem variant="destructive" onClick={guard(() => setReportOpen(true))}>
                      <Flag className="size-4" /> Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {replying && (
            <div className="mt-2">
              <CommentComposer
                postId={comment.postId}
                parentId={comment.id}
                placeholder={`Reply to @${comment.author.username}`}
                autoFocus
                onDone={() => setReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {comment.children.map((child) => (
        <CommentThread key={child.id} comment={child} depth={depth + 1} />
      ))}

      {GateDialog}
      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={(reason, details) => reportContent({ targetType: "COMMENT", commentId: comment.id, reason, details })}
      />
    </div>
  );
}
