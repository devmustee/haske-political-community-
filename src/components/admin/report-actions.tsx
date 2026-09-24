"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resolveReport, removePost, removeComment } from "@/lib/actions/admin-moderation";
import type { ActionResult } from "@/lib/actions/auth";

export function ReportActions({ reportId, postId, commentId }: { reportId: string; postId?: string | null; commentId?: string | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action();
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Done");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {postId && (
        <Button size="sm" variant="destructive" disabled={pending} onClick={() => run(() => removePost(postId, "Violated community guidelines"))}>
          Remove post
        </Button>
      )}
      {commentId && (
        <Button size="sm" variant="destructive" disabled={pending} onClick={() => run(() => removeComment(commentId, "Violated community guidelines"))}>
          Remove comment
        </Button>
      )}
      <Button size="sm" variant="outline" disabled={pending} onClick={() => run(() => resolveReport(reportId, "ACTIONED"))}>
        Mark actioned
      </Button>
      <Button size="sm" variant="ghost" disabled={pending} onClick={() => run(() => resolveReport(reportId, "DISMISSED"))}>
        Dismiss
      </Button>
    </div>
  );
}
