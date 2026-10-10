"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { ApplicationStatus } from "@prisma/client";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { updateApplicationStatus } from "@/lib/actions/admin-cms";
import { ADMIN_SETTABLE_STATUSES, APPLICATION_STATUS_INFO } from "@/lib/applications";
import { runAction } from "@/lib/run-action";

const label = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replaceAll("_", " ");

/**
 * Status control for one application. Choosing a status opens a confirmation
 * (it notifies the applicant), with an optional internal note.
 */
export function ApplicationStatusSelect({
  applicationId,
  status,
  applicantName,
}: {
  applicationId: string;
  status: ApplicationStatus;
  applicantName: string;
}) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null);
  const [note, setNote] = useState("");
  const [saving, startTransition] = useTransition();

  if (status === "WITHDRAWN") return <Badge variant="outline">Withdrawn by applicant</Badge>;

  function confirm() {
    if (!pendingStatus) return;
    startTransition(async () => {
      const result = await runAction(() => updateApplicationStatus(applicationId, pendingStatus, note));
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Marked ${label(pendingStatus)}; ${applicantName} has been notified.`);
      setPendingStatus(null);
      setNote("");
      router.refresh();
    });
  }

  return (
    <>
      <Select value={status} onValueChange={(v) => v !== status && setPendingStatus(v as ApplicationStatus)}>
        <SelectTrigger className="h-9 w-44 text-xs" aria-label={`Status for ${applicantName}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ADMIN_SETTABLE_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {label(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={pendingStatus !== null} onOpenChange={(o) => !o && !saving && setPendingStatus(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Mark as {pendingStatus && label(pendingStatus)}?
            </DialogTitle>
            <DialogDescription>
              {applicantName} will be notified: &ldquo;{pendingStatus && APPLICATION_STATUS_INFO[pendingStatus].description}&rdquo;
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`note-${applicationId}`}>Internal note (optional, never shown to the applicant)</Label>
            <Textarea id={`note-${applicationId}`} value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} className="min-h-20" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingStatus(null)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={confirm} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
