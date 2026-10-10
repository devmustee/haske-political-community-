"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createComment } from "@/lib/actions/posts";
import { useGuestGate } from "@/components/community/guest-gate";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";
import { runAction } from "@/lib/run-action";

export function CommentComposer({
  postId,
  parentId,
  placeholder = "Post your reply",
  autoFocus = false,
  onDone,
}: {
  postId: string;
  parentId?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onDone?: () => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { guard, GateDialog, isGuest } = useGuestGate();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const user = session?.user;

  const submit = guard(() => {
    if (!content.trim()) return;
    setSubmitting(true);
    (async () => {
      const result = await runAction(() => createComment({ postId, parentId, content: content.trim() }));
      setSubmitting(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setContent("");
      router.refresh();
      onDone?.();
    })();
  });

  if (isGuest && !parentId) {
    return (
      <button
        onClick={guard(() => {})}
        className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left text-muted-foreground"
      >
        <div className="size-9 rounded-full bg-muted" />
        Sign in to reply
        {GateDialog}
      </button>
    );
  }

  return (
    <div className="flex gap-3">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={user?.image ?? undefined} />
        <AvatarFallback>{user ? initials(user.name ?? user.username) : "?"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          autoFocus={autoFocus}
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, 1000))}
          placeholder={placeholder}
          className="min-h-16 resize-none border-none p-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex justify-end border-t border-border pt-2">
          <Button size="sm" disabled={submitting || !content.trim()} onClick={submit}>
            Reply
          </Button>
        </div>
      </div>
      {GateDialog}
    </div>
  );
}
