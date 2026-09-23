"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PostComposer } from "@/components/community/post-composer";
import { initials } from "@/lib/utils";

export function ComposerPrompt() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user;

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left"
      >
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>{initials(user.name ?? user.username)}</AvatarFallback>
        </Avatar>
        <span className="text-lg text-muted-foreground">What&apos;s happening in Adamawa?</span>
      </button>
      <PostComposer open={open} onOpenChange={setOpen} />
    </>
  );
}
