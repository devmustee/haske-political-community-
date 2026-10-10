"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Megaphone, Send } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { sendAnnouncement } from "@/lib/actions/announcements";
import { runAction } from "@/lib/run-action";

export function AnnouncementComposer({ recipientCount }: { recipientCount: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sending, startTransition] = useTransition();

  const ready = title.trim().length >= 3 && body.trim().length >= 3;
  const people = `${recipientCount.toLocaleString()} ${recipientCount === 1 ? "person" : "people"}`;

  function send() {
    startTransition(async () => {
      const result = await runAction(() => sendAnnouncement({ title, body, link }));
      setConfirming(false);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Sent to ${result.data.recipients.toLocaleString()} people`);
      setTitle("");
      setBody("");
      setLink("");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ann-title">Title</Label>
          <Input id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} placeholder="Town hall in Yola this Saturday" />
          <p className="text-right text-xs text-muted-foreground">{title.length}/80</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ann-body">Message</Label>
          <Textarea id="ann-body" value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} className="min-h-28" placeholder="Join us at the Yola Youth Town Hall, 10:00 at the State Secretariat." />
          <p className="text-right text-xs text-muted-foreground">{body.length}/500</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ann-link">Link (optional)</Label>
          <Input id="ann-link" value={link} onChange={(e) => setLink(e.target.value)} maxLength={300} placeholder="/events/yola-youth-town-hall" />
          <p className="text-xs text-muted-foreground">A page on this site (starts with /) or a full https:// link.</p>
        </div>
        <Button onClick={() => setConfirming(true)} disabled={!ready || sending || recipientCount === 0} className="w-full sm:w-fit">
          <Send className="size-4" />
          Send to {people}
        </Button>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</p>
        <div className="flex gap-3 rounded-xl border border-border bg-primary/5 px-4 py-3.5">
          <Megaphone className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="min-w-0 text-sm">
            <p className="font-semibold">{title || "Your title"}</p>
            <p className="mt-0.5 whitespace-pre-line text-muted-foreground">{body || "Your message appears here."}</p>
            <p className="mt-1 text-xs text-muted-foreground">now</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          It appears in everyone&apos;s notifications and is pushed to devices that turned notifications on. People who switched off
          announcements in their settings won&apos;t receive it.
        </p>
      </div>

      <AlertDialog open={confirming} onOpenChange={(o) => !sending && setConfirming(o)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send to {people}?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{title.trim()}&rdquo; will go to {people} right away. You can delete it from their notifications later, but push
              notifications that already arrived can&apos;t be recalled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={sending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants()}
              disabled={sending}
              onClick={(e) => {
                e.preventDefault();
                send();
              }}
            >
              {sending && <Loader2 className="size-4 animate-spin" />}
              Send now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
