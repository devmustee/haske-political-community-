"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applyToProgram } from "@/lib/actions/programs";
import { ADAMAWA_LGAS } from "@/lib/adamawa-lgas";
import type { Bank } from "@/lib/payout/banks";
import { PayoutDetailsFields, emptyPayoutDraft, validatePayoutDraft, type PayoutDraft } from "@/components/cms/payout-details-fields";
import { programApplicationSchema, type ProgramApplicationInput } from "@/lib/validations/program";
import { runAction } from "@/lib/run-action";

export function ProgramApplyDialog({
  programId,
  programName,
  programSlug,
  collectPayout = false,
  banks = [],
}: {
  programId: string;
  programName: string;
  programSlug: string;
  /** The program collects bank details when applying (adds a second step). */
  collectPayout?: boolean;
  banks?: Bank[];
}) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [details, setDetails] = useState<ProgramApplicationInput | null>(null);
  const [payout, setPayout] = useState<PayoutDraft>(emptyPayoutDraft);
  const [payoutErrors, setPayoutErrors] = useState<ReturnType<typeof validatePayoutDraft>>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramApplicationInput>({
    resolver: zodResolver(programApplicationSchema),
    defaultValues: { programId, fullName: "", email: "" },
  });

  // useSession() resolves asynchronously after this component's first
  // render, so the name/email can't be captured via useForm's
  // defaultValues (react-hook-form only reads those once, on mount) —
  // reset() once the session data actually arrives instead.
  useEffect(() => {
    if (session?.user) {
      reset({ programId, fullName: session.user.name ?? "", email: session.user.email ?? "" });
    }
  }, [session?.user, programId, reset]);

  async function onSubmit(values: ProgramApplicationInput) {
    if (collectPayout && step === 1) {
      setDetails(values);
      setStep(2);
      return;
    }
    await submit(values);
  }

  async function submitWithPayout() {
    const errs = validatePayoutDraft(payout);
    setPayoutErrors(errs);
    if (errs || !details) return;
    await submit(details, { ...payout, consent: true });
  }

  async function submit(values: ProgramApplicationInput, payoutInput?: PayoutDraft & { consent: true }) {
    setSubmitting(true);
    const result = await runAction(() => applyToProgram(values, payoutInput));
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setSubmitted(true);
  }

  if (!session?.user) {
    return (
      <Button asChild size="lg">
        <Link href={`/login?callbackUrl=${encodeURIComponent(`/programs/${programSlug}`)}`}>Sign in to apply</Link>
      </Button>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setSubmitted(false);
          setStep(1);
          setPayout(emptyPayoutDraft);
          setPayoutErrors(null);
          reset({ programId, fullName: session?.user?.name ?? "", email: session?.user?.email ?? "" });
        }
      }}
    >
      <Button size="lg" onClick={() => setOpen(true)}>
        Apply now
      </Button>
      <DialogContent>
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="size-10 text-primary" />
            <p className="font-medium">Application submitted</p>
            <p className="text-sm text-muted-foreground">
              Thanks for applying to {programName}. You&apos;ll get a notification whenever its status changes.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href="/applications">Track my applications</Link>
              </Button>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : (
            <>
              <DialogHeader>
                <DialogTitle>Apply to {programName}</DialogTitle>
                <DialogDescription>Fill in your details — the campaign team will follow up.</DialogDescription>
              </DialogHeader>
              {step === 2 ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 2 of 2 · Bank details</p>
                  <PayoutDetailsFields banks={banks} value={payout} onChange={setPayout} errors={payoutErrors} />
                  <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={submitting}>
                      Back
                    </Button>
                    <Button type="button" onClick={submitWithPayout} disabled={submitting}>
                      {submitting && <Loader2 className="size-4 animate-spin" />}
                      Submit application
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
              <form method="post" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                {collectPayout && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step 1 of 2 · Your details</p>
                )}
                <input type="hidden" {...register("programId")} />
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" {...register("fullName")} />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" {...register("phone")} />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="lga">Local Government Area</Label>
                  <select
                    id="lga"
                    {...register("lga")}
                    defaultValue=""
                    className="h-10 w-full rounded-xl border border-input bg-transparent px-3.5 text-sm shadow-xs focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-sm:min-h-11"
                  >
                    <option value="" disabled>
                      Select your LGA
                    </option>
                    {ADAMAWA_LGAS.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
                  {errors.lga && <p className="text-xs text-destructive">{errors.lga.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="details">Tell us about yourself (optional)</Label>
                  <Textarea id="details" {...register("details")} maxLength={2000} />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="size-4 animate-spin" />}
                    {collectPayout ? "Continue" : "Submit application"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
