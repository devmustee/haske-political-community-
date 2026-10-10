"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Copy, Loader2, LogIn, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitFeedback } from "@/lib/actions/feedback";
import { runAction } from "@/lib/run-action";

const DESKS = {
  enterprise: "Commercial & Agro-Industry",
  foundation: "AB Haske Foundation Intervention",
  media: "Media & Press Relations",
  civic: "Grassroots 2027 Campaign & Civic",
  general: "General Executive Inquiry",
} as const;

// Mirrors feedbackSchema's limits; the message leaves room for the desk line
// prepended below.
const contactSchema = z.object({
  desk: z.enum(Object.keys(DESKS) as [keyof typeof DESKS, ...(keyof typeof DESKS)[]]),
  subject: z.string().trim().min(4, "Give it a short subject").max(150),
  message: z.string().trim().min(10, "Tell us a bit more").max(2900),
});
type ContactInput = z.infer<typeof contactSchema>;

const fieldClass =
  "w-full min-h-[44px] rounded-xl border border-border/80 bg-background/80 px-3.5 py-2.5 text-sm sm:text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5";

/**
 * Contact desk form. Submissions go into Speak to Haske (FeedbackSubmission)
 * so they get a tracking ID and land in the admin feedback queue; the chosen
 * desk is recorded on the first line of the message for triage.
 */
export function ContactForm() {
  const { data: session, status } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { desk: "general" } });

  async function onSubmit(values: ContactInput) {
    setSubmitting(true);
    const result = await runAction(() => submitFeedback({
      type: "QUESTION",
      subject: values.subject,
      description: `Contact desk: ${DESKS[values.desk]}\n\n${values.message}`,
    }));
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setTrackingId(result.data.trackingId);
    reset({ desk: values.desk, subject: "", message: "" });
  }

  if (status === "loading") {
    return <div className="h-80 animate-pulse rounded-2xl bg-secondary/40" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <div className="rounded-2xl border border-border/80 bg-secondary/30 p-6 text-center sm:p-8">
        <div className="mx-auto mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground">
          <ShieldCheck className="size-3.5 text-accent" /> Secure Citizen Access
        </div>
        <p className="font-serif text-lg font-bold text-foreground">Sign in to send a message</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          Messages go through Speak to Haske, so every one gets a tracking ID you can follow. Signing in keeps that
          record yours and keeps out spam.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg" variant="gold-shimmer" className="w-full shadow-glow-gold sm:w-auto">
            <Link href="/login?callbackUrl=/contact">
              <LogIn className="size-4" />
              Sign in
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/register">Create an account</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (trackingId) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-medium">Message received</p>
        <p className="text-sm text-muted-foreground">Your tracking ID is:</p>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(trackingId).then(() => toast.success("Copied"), () => {});
          }}
          className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-mono text-lg font-semibold"
        >
          {trackingId}
          <Copy className="size-4 text-muted-foreground" />
        </button>
        <p className="text-sm text-muted-foreground">
          Follow its status under &ldquo;Track Status&rdquo; on{" "}
          <Link href="/speak-to-haske" className="font-medium text-primary hover:underline">
            Speak to Haske
          </Link>
          .
        </p>
        <Button variant="outline" onClick={() => setTrackingId(null)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form method="post" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="rounded-xl bg-secondary/40 px-3.5 py-2.5 text-xs text-muted-foreground">
        Sending as <span className="font-semibold text-foreground">{session.user.name ?? session.user.username}</span>
        {session.user.email && <> ({session.user.email})</>}
      </p>

      <div>
        <label htmlFor="contact-desk" className={labelClass}>
          Inquiry Category *
        </label>
        <select id="contact-desk" {...register("desk")} className={fieldClass}>
          {Object.entries(DESKS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject *
        </label>
        <input id="contact-subject" {...register("subject")} placeholder="Brief headline of your message" className={fieldClass} />
        {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message Details *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          placeholder="Please provide complete context regarding your inquiry..."
          className={`${fieldClass} resize-none`}
        />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <div className="pt-2">
        <Button type="submit" variant="gold-shimmer" size="lg" className="w-full" disabled={submitting}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Send message
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          You&apos;ll get a tracking ID, and can follow replies on Speak to Haske.
        </p>
      </div>
    </form>
  );
}
