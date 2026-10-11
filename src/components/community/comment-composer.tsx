"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCommentList } from "@/components/community/comment-list";
import { useGuestGate } from "@/components/community/guest-gate";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";

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
  const list = useCommentList();
  const { guard, GateDialog, isGuest } = useGuestGate();
  const [content, setContent] = useState("");
  const user = session?.user;

  // The comment appears in the list at once (marked "Sending…") and the box
  // clears, so there's nothing to tap twice. A failed send stays in the list
  // with Retry, so the text is never lost.
  const submit = guard(() => {
    const text = content.trim();
    if (!text || !list) return;
    setContent("");
    void list.send({ postId, parentId, content: text });
    onDone?.();
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
          <Button size="sm" disabled={!content.trim()} onClick={submit}>
            Reply
          </Button>
        </div>
      </div>
      {GateDialog}
    </div>
  );
}
