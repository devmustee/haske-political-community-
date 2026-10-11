"use client";

import { useState } from "react";
import { MailWarning } from "lucide-react";
import { toast } from "sonner";
import { resendVerificationEmail } from "@/lib/actions/auth";
import { runAction } from "@/lib/run-action";

/**
 * Shown to signed-in members whose email isn't verified yet: until it is,
 * they can read but not post, comment, like or apply.
 */
export function VerifyEmailBanner() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  async function resend() {
    setState("sending");
    const result = await runAction(() => resendVerificationEmail());
    if (!result.ok) {
      toast.error(result.error);
      setState("idle");
      return;
    }
    setState("sent");
  }

  return (
    <div role="status" className="flex items-start gap-3 border-b border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <MailWarning className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p className="flex-1">
        <span className="font-semibold">Verify your email to post and comment.</span>{" "}
        {state === "sent" ? "We've sent a new link. Check your inbox and spam folder." : "Open the link we sent to your inbox."}
      </p>
      {state !== "sent" && (
        <button
          onClick={resend}
          disabled={state === "sending"}
          className="shrink-0 font-semibold underline underline-offset-2 disabled:opacity-60 max-sm:-my-2 max-sm:py-2"
        >
          {state === "sending" ? "Sending…" : "Resend email"}
        </button>
      )}
    </div>
  );
}
