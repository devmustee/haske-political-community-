"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, Eye, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { revealAccountNumber } from "@/lib/actions/payout";
import { runAction } from "@/lib/run-action";

const VISIBLE_SECONDS = 30;

/** Reveals one full account number after a stated reason; logged server-side, hidden again after 30s. */
export function RevealAccountButton({ applicationId, applicantName }: { applicationId: string; applicantName: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [number, setNumber] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!number) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setNumber(null);
          setOpen(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [number]);

  async function reveal() {
    setLoading(true);
    const result = await runAction(() => revealAccountNumber(applicationId, reason));
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setNumber(result.data.accountNumber);
    setSecondsLeft(VISIBLE_SECONDS);
  }

  function close() {
    setOpen(false);
    setNumber(null);
    setReason("");
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Eye className="size-4" />
        Reveal
      </Button>
      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : close())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reveal {applicantName}&apos;s account number</DialogTitle>
            <DialogDescription>Reveals are logged with your name and reason, and the number hides again after {VISIBLE_SECONDS} seconds.</DialogDescription>
          </DialogHeader>
          {number ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/40 px-4 py-3">
              <span className="font-mono text-xl tracking-wider">{number}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(number).then(() => toast.success("Copied"), () => toast.error("Couldn't copy"))}
              >
                <Copy className="size-4" /> Copy
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`reason-${applicationId}`}>Reason</Label>
              <Input id={`reason-${applicationId}`} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} placeholder="e.g. Applicant called to confirm account" />
            </div>
          )}
          <DialogFooter>
            {number ? (
              <p className="mr-auto self-center text-xs text-muted-foreground">Hides in {secondsLeft}s</p>
            ) : (
              <Button onClick={reveal} disabled={loading || reason.trim().length < 5}>
                {loading && <Loader2 className="size-4 animate-spin" />}
                Reveal
              </Button>
            )}
            <Button variant="outline" onClick={close}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
