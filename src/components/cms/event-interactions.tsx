"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { registerForEvent, askEventQuestion } from "@/lib/actions/events";
import { runAction } from "@/lib/run-action";

export function EventRegisterButton({
  eventId,
  initialRegistered,
  full,
}: {
  eventId: string;
  initialRegistered: boolean;
  full: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [registered, setRegistered] = useState(initialRegistered);
  const [pending, setPending] = useState(false);

  if (!session?.user) {
    return (
      <Button size="lg" asChild>
        <Link href="/login">Sign in to register</Link>
      </Button>
    );
  }

  async function handleClick() {
    setPending(true);
    const result = await runAction(() => registerForEvent(eventId));
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setRegistered(result.data.registered);
    toast.success(result.data.registered ? "You're registered" : "Registration cancelled");
    router.refresh();
  }

  return (
    <Button size="lg" variant={registered ? "outline" : "default"} disabled={pending || (full && !registered)} onClick={handleClick}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {registered ? "Cancel registration" : full ? "Event full" : "Register"}
    </Button>
  );
}

export function ShareEventButton() {
  return (
    <Button
      size="lg"
      variant="outline"
      onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }}
    >
      <Share2 className="size-4" /> Share
    </Button>
  );
}

export function EventQuestionForm({ eventId }: { eventId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!session?.user) {
    return (
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">Sign in</Link> to ask a question.
      </p>
    );
  }

  async function submit() {
    if (!question.trim()) return;
    setSubmitting(true);
    const result = await runAction(() => askEventQuestion(eventId, question));
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setQuestion("");
    toast.success("Question submitted");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea value={question} onChange={(e) => setQuestion(e.target.value.slice(0, 500))} placeholder="Ask a question about this event" />
      <Button size="sm" className="w-fit" disabled={submitting || !question.trim()} onClick={submit}>
        Submit question
      </Button>
    </div>
  );
}
