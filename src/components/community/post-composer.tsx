"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PostComposerForm } from "@/components/community/post-composer-form";

export function PostComposer({
  open,
  onOpenChange,
  quoteOfId,
  quotedPostPreview,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteOfId?: string;
  quotedPostPreview?: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-4 p-5">
        <DialogTitle className="sr-only">{quoteOfId ? "Quote post" : "Create post"}</DialogTitle>
        <PostComposerForm
          variant="dialog"
          autoFocus
          quoteOfId={quoteOfId}
          quotedPostPreview={quotedPostPreview}
          onPosted={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
