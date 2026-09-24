"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FeedbackStatus } from "@prisma/client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateFeedbackStatus } from "@/lib/actions/feedback";

const STATUSES = Object.values(FeedbackStatus);

export function FeedbackStatusControl({ feedbackId, status }: { feedbackId: string; status: FeedbackStatus }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  function apply(newStatus: FeedbackStatus) {
    startTransition(async () => {
      const result = await updateFeedbackStatus(feedbackId, newStatus, note || undefined);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Status updated");
      setNote("");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={status} disabled={pending} onValueChange={(v) => apply(v as FeedbackStatus)}>
        <SelectTrigger className="h-8 w-40 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s.replace("_", " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Optional note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="h-8 w-40 text-xs"
      />
      <Button size="sm" variant="outline" disabled={pending || !note.trim()} onClick={() => apply(status)}>
        Add note
      </Button>
    </div>
  );
}
