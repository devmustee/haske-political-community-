"use client";

import { PostComposerForm } from "@/components/community/post-composer-form";

/** Always-visible composer at the top of the feed. Renders nothing for guests. */
export function InlinePostComposer() {
  return (
    <div className="border-b border-border">
      <PostComposerForm variant="inline" />
    </div>
  );
}
