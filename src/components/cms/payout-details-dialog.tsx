"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Landmark, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { savePayoutDetails } from "@/lib/actions/payout";
import type { Bank } from "@/lib/payout/banks";
import { PayoutDetailsFields, emptyPayoutDraft, validatePayoutDraft, type PayoutDraft } from "@/components/cms/payout-details-fields";
import { runAction } from "@/lib/run-action";

export function PayoutDetailsDialog({
  applicationId,
  programName,
  banks,
  hasExisting,
}: {
  applicationId: string;
  programName: string;
  banks: Bank[];
  hasExisting: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PayoutDraft>(emptyPayoutDraft);
  const [errors, setErrors] = useState<ReturnType<typeof validatePayoutDraft>>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    const errs = validatePayoutDraft(draft);
    setErrors(errs);
    if (errs) return;
    setSaving(true);
    const result = await runAction(() => savePayoutDetails(applicationId, { ...draft, consent: true }));
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    if (result.data.nameMatch === "MISMATCH" || result.data.nameMatch === "PARTIAL") {
      toast.warning(`Saved, but the bank has this account as "${result.data.verifiedName}". If that's not you, please update it.`);
    } else {
      toast.success("Bank details saved");
    }
    setOpen(false);
    setDraft(emptyPayoutDraft);
    router.refresh();
  }

  return (
    <>
      <Button variant={hasExisting ? "outline" : "default"} size="sm" onClick={() => setOpen(true)}>
        <Landmark className="size-4" />
        {hasExisting ? "Update bank details" : "Add bank details"}
      </Button>
      <Dialog open={open} onOpenChange={(o) => !saving && setOpen(o)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bank details for {programName}</DialogTitle>
            <DialogDescription>Used only to pay you if you&apos;re selected for this program.</DialogDescription>
          </DialogHeader>
          <PayoutDetailsFields banks={banks} value={draft} onChange={setDraft} errors={errors} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="size-4 animate-spin" />}
              Save bank details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
