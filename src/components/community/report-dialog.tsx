"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ActionResult } from "@/lib/actions/auth";

const REASONS = [
  "Spam",
  "Harassment or bullying",
  "Hate speech",
  "Misinformation",
  "Violence or threats",
  "Impersonation",
  "Other",
];

export function ReportDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string, details?: string) => Promise<ActionResult>;
}) {
  const [reason, setReason] = useState(REASONS[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    const result = await onSubmit(reason, details || undefined);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Thanks — our moderation team will review this.");
    setDetails("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report content</DialogTitle>
          <DialogDescription>Help us understand what&apos;s wrong. Reports are reviewed by moderators.</DialogDescription>
        </DialogHeader>

        <RadioGroup value={reason} onValueChange={setReason} className="flex flex-col gap-2">
          {REASONS.map((r) => (
            <div key={r} className="flex items-center gap-2.5">
              <RadioGroupItem value={r} id={`reason-${r}`} />
              <Label htmlFor={`reason-${r}`} className="font-normal">{r}</Label>
            </div>
          ))}
        </RadioGroup>

        <Textarea
          placeholder="Additional details (optional)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          maxLength={1000}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={submitting}>
            Submit report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
