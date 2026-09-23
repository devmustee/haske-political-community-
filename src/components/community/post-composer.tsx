"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Image as ImageIcon, Video, BarChart3, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createPost } from "@/lib/actions/posts";
import { uploadFile } from "@/lib/actions/upload";
import { initials, cn } from "@/lib/utils";

const MAX_CHARS = 2000;

interface MediaItem {
  url: string;
  type: "IMAGE" | "VIDEO";
}

export function PostComposer({
  open,
  onOpenChange,
  quoteOfId,
  quotedPostPreview,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteOfId?: string;
  quotedPostPreview?: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState(24);
  const [pollAllowMultiple, setPollAllowMultiple] = useState(false);

  const user = session?.user;

  function reset() {
    setContent("");
    setMedia([]);
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setPollDuration(24);
    setPollAllowMultiple(false);
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    if (media.length + files.length > 4) {
      toast.error("You can attach up to 4 files.");
      return;
    }

    setUploading(true);
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      const result = await uploadFile(formData, "posts");
      if (!result.ok) {
        toast.error(result.error);
        continue;
      }
      setMedia((prev) => [...prev, { url: result.data.url, type: file.type.startsWith("video") ? "VIDEO" : "IMAGE" }]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function updatePollOption(index: number, value: string) {
    setPollOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  function addPollOption() {
    if (pollOptions.length >= 6) return;
    setPollOptions((prev) => [...prev, ""]);
  }

  function removePollOption(index: number) {
    if (pollOptions.length <= 2) return;
    setPollOptions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    if (showPoll) {
      const validOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (!pollQuestion.trim() || validOptions.length < 2) {
        toast.error("Add a poll question and at least 2 options.");
        return;
      }
    } else if (!content.trim() && media.length === 0) {
      toast.error("Write something, attach media, or add a poll.");
      return;
    }

    setSubmitting(true);
    const result = await createPost({
      content: content.trim() || undefined,
      media: media.length ? media : undefined,
      quoteOfId,
      poll: showPoll
        ? {
            question: pollQuestion.trim(),
            options: pollOptions.map((o) => o.trim()).filter(Boolean),
            allowMultiple: pollAllowMultiple,
            durationHours: pollDuration,
            resultsVisibility: "AFTER_VOTE",
          }
        : undefined,
    });
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(quoteOfId ? "Quote reposted." : "Posted to Haske Community.");
    reset();
    onOpenChange(false);
    router.refresh();
  }

  if (!user) return null;

  const charsLeft = MAX_CHARS - content.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-4 p-5">
        <DialogTitle className="sr-only">{quoteOfId ? "Quote post" : "Create post"}</DialogTitle>

        <div className="flex gap-3">
          <Avatar className="size-11 shrink-0">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback>{initials(user.name ?? user.username)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <Textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
              placeholder={quoteOfId ? "Add a comment..." : "What's happening in Adamawa?"}
              className="min-h-24 resize-none border-none p-0 text-lg shadow-none focus-visible:ring-0"
            />

            {quotedPostPreview && <div className="mt-2 rounded-xl border border-border p-3">{quotedPostPreview}</div>}

            {media.length > 0 && (
              <div className={cn("mt-3 grid gap-2", media.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
                {media.map((m, i) => (
                  <div key={i} className="relative overflow-hidden rounded-xl border border-border">
                    {m.type === "IMAGE" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt="" className="aspect-video w-full object-cover" />
                    ) : (
                      <video src={m.url} className="aspect-video w-full object-cover" controls />
                    )}
                    <button
                      onClick={() => setMedia((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showPoll && (
              <div className="mt-3 flex flex-col gap-2.5 rounded-xl border border-border p-3.5">
                <Input
                  placeholder="Ask a question"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  maxLength={280}
                />
                {pollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => updatePollOption(i, e.target.value)}
                      maxLength={80}
                    />
                    {pollOptions.length > 2 && (
                      <button onClick={() => removePollOption(i)} className="text-muted-foreground hover:text-foreground">
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 6 && (
                  <Button type="button" variant="ghost" size="sm" onClick={addPollOption} className="w-fit">
                    + Add option
                  </Button>
                )}
                <div className="flex flex-wrap items-center gap-4 border-t border-border pt-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="poll-duration" className="text-muted-foreground">Runs for</Label>
                    <select
                      id="poll-duration"
                      value={pollDuration}
                      onChange={(e) => setPollDuration(Number(e.target.value))}
                      className="rounded-md border border-input bg-transparent px-2 py-1 text-sm"
                    >
                      <option value={1}>1 hour</option>
                      <option value={24}>1 day</option>
                      <option value={72}>3 days</option>
                      <option value={168}>7 days</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="poll-multi" checked={pollAllowMultiple} onCheckedChange={setPollAllowMultiple} />
                    <Label htmlFor="poll-multi" className="text-muted-foreground">Allow multiple answers</Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is a community platform poll, not a scientific opinion survey.
                </p>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPoll(false)} className="w-fit text-destructive">
                  Remove poll
                </Button>
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  hidden
                  onChange={handleFileSelect}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-primary"
                  disabled={showPoll || uploading}
                  onClick={() => fileInputRef.current?.click()}
                  title="Add photo or video"
                >
                  {uploading ? <Loader2 className="size-5 animate-spin" /> : <ImageIcon className="size-5" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-primary"
                  disabled={media.length > 0}
                  onClick={() => setShowPoll((v) => !v)}
                  title="Add poll"
                >
                  <BarChart3 className="size-5" />
                </Button>
                <Video className="hidden" />
              </div>

              <div className="flex items-center gap-3">
                {content.length > 0 && (
                  <span className={cn("text-xs tabular-nums", charsLeft < 50 ? "text-destructive" : "text-muted-foreground")}>
                    {charsLeft}
                  </span>
                )}
                <Button onClick={handleSubmit} disabled={submitting || uploading}>
                  {submitting && <Loader2 className="size-4 animate-spin" />}
                  {quoteOfId ? "Repost" : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
