"use client";

import { useState } from "react";
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
import { programApplicationSchema, type ProgramApplicationInput } from "@/lib/validations/program";

export function ProgramApplyDialog({ programId, programName }: { programId: string; programName: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProgramApplicationInput>({
    resolver: zodResolver(programApplicationSchema),
    defaultValues: { programId, fullName: session?.user?.name ?? "", email: session?.user?.email ?? "" },
  });

  async function onSubmit(values: ProgramApplicationInput) {
    setSubmitting(true);
    const result = await applyToProgram(values);
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
        <Link href={`/login?callbackUrl=/programs`}>Sign in to apply</Link>
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
          reset();
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
              Thanks for applying to {programName}. The campaign team will review your application.
            </p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Apply to {programName}</DialogTitle>
              <DialogDescription>Fill in your details — the campaign team will follow up.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
                <Label htmlFor="details">Tell us about yourself (optional)</Label>
                <Textarea id="details" {...register("details")} maxLength={2000} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  Submit application
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
