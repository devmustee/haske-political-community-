"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Image as ImageIcon, BarChart3, X, Loader2, ImagePlus, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createPost } from "@/lib/actions/posts";
import { uploadFile } from "@/lib/actions/upload";
import { compressImage, type PreparedImage } from "@/lib/compress-image";
import { initials, cn } from "@/lib/utils";
import { runAction } from "@/lib/run-action";

const MAX_CHARS = 2000;
const MAX_ATTACHMENTS = 4;
const TOPIC_TAGS = ["Adamawa2027", "YolaNorth", "Mubi", "Agriculture", "Education", "Health", "Youth"];

interface Attachment {
  id: string;
  previewUrl: string;
  type: "IMAGE" | "VIDEO";
  status: "uploading" | "done";
  url?: string;
  width?: number;
  height?: number;
}

function hasTag(content: string, tag: string) {
  return new RegExp(`#${tag}\\b`, "i").test(content);
}

/**
 * Post composer body shared by the feed's inline composer and the modal
 * PostComposer. Handles text, up to 4 attachments (picker, paste or
 * drag-and-drop, images downscaled client-side), polls and topic tags.
 */
export function PostComposerForm({
  variant,
  quoteOfId,
  quotedPostPreview,
  autoFocus,
  onPosted,
}: {
  variant: "inline" | "dialog";
  quoteOfId?: string;
  quotedPostPreview?: React.ReactNode;
  autoFocus?: boolean;
  onPosted?: () => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dragDepth = useRef(0);

  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(variant === "dialog");
  const [dragActive, setDragActive] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState(24);
  const [pollAllowMultiple, setPollAllowMultiple] = useState(false);

  // Object URLs for previews are released when attachments go away.
  const attachmentsRef = useRef(attachments);
  useEffect(() => {
    attachmentsRef.current = attachments;
  }, [attachments]);
  useEffect(() => () => attachmentsRef.current.forEach((a) => URL.revokeObjectURL(a.previewUrl)), []);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [content, expanded]);

  const user = session?.user;
  if (!user) return null;

  const uploading = attachments.some((a) => a.status === "uploading");
  const charsLeft = MAX_CHARS - content.length;

  function reset() {
    attachments.forEach((a) => URL.revokeObjectURL(a.previewUrl));
    setContent("");
    setAttachments([]);
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setPollDuration(24);
    setPollAllowMultiple(false);
    if (variant === "inline") setExpanded(false);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((a) => a.id !== id);
    });
  }

  async function addFiles(incoming: File[]) {
    if (showPoll) {
      toast.error("Remove the poll to attach photos or video.");
      return;
    }
    const files = incoming.filter((f) => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (files.length < incoming.length) toast.error("Only photos and videos can be attached.");
    const room = MAX_ATTACHMENTS - attachments.length;
    if (files.length > room) toast.error(`You can attach up to ${MAX_ATTACHMENTS} files.`);
    const accepted = files.slice(0, Math.max(0, room));
    if (accepted.length === 0) return;

    setExpanded(true);
    const pending = accepted.map((file) => {
      const attachment: Attachment = {
        id: crypto.randomUUID(),
        previewUrl: URL.createObjectURL(file),
        type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
        status: "uploading",
      };
      return { file, attachment };
    });
    setAttachments((prev) => [...prev, ...pending.map((p) => p.attachment)]);

    // Server Actions from one client run one at a time anyway, so upload sequentially.
    for (const { file, attachment } of pending) {
      const prepared: PreparedImage = attachment.type === "IMAGE" ? await compressImage(file) : { file };
      const formData = new FormData();
      formData.append("file", prepared.file);
      const result = await runAction(() => uploadFile(formData, "posts")).catch(() => ({ ok: false as const, error: "Upload failed. Please try again." }));
      if (!result.ok) {
        toast.error(result.error);
        removeAttachment(attachment.id);
        continue;
      }
      setAttachments((prev) =>
        prev.map((a) =>
          a.id === attachment.id
            ? { ...a, status: "done", url: result.data.url, width: prepared.width, height: prepared.height }
            : a
        )
      );
    }
  }

  function toggleTag(tag: string) {
    setContent((prev) => {
      if (hasTag(prev, tag)) return prev.replace(new RegExp(`\\s?#${tag}\\b`, "ig"), "").trimStart();
      const sep = prev.length === 0 || /\s$/.test(prev) ? "" : " ";
      return `${prev}${sep}#${tag} `.slice(0, MAX_CHARS);
    });
    textareaRef.current?.focus();
  }

  async function handleSubmit() {
    if (uploading || submitting) return;
    if (showPoll) {
      const validOptions = pollOptions.map((o) => o.trim()).filter(Boolean);
      if (!pollQuestion.trim() || validOptions.length < 2) {
        toast.error("Add a poll question and at least 2 options.");
        return;
      }
    } else if (!content.trim() && attachments.length === 0) {
      toast.error("Write something, attach media, or add a poll.");
      return;
    }

    setSubmitting(true);
    const media = attachments
      .filter((a) => a.url)
      .map((a) => ({ url: a.url!, type: a.type, width: a.width, height: a.height }));
    const result = await runAction(() => createPost({
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
    }));
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success(quoteOfId ? "Quote reposted." : "Posted to Haske Community.");
    reset();
    onPosted?.();
    router.refresh();
  }

  const dragHandlers = {
    onDragEnter: (e: React.DragEvent) => {
      if (!e.dataTransfer.types.includes("Files")) return;
      e.preventDefault();
      dragDepth.current += 1;
      setDragActive(true);
    },
    onDragOver: (e: React.DragEvent) => {
      if (e.dataTransfer.types.includes("Files")) e.preventDefault();
    },
    onDragLeave: () => {
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (dragDepth.current === 0) setDragActive(false);
    },
    onDrop: (e: React.DragEvent) => {
      if (!e.dataTransfer.files.length) return;
      e.preventDefault();
      dragDepth.current = 0;
      setDragActive(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
  };

  const inline = variant === "inline";

  return (
    <div {...dragHandlers} className={cn("relative flex gap-3", inline && "px-4 pb-3 pt-4")}>
      {dragActive && (
        <div className="pointer-events-none absolute inset-1 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary bg-primary/5 text-sm font-medium text-primary backdrop-blur-[1px]">
          <ImagePlus className="size-6" />
          Drop photos or video to attach
        </div>
      )}

      <Avatar className={cn("shrink-0", inline ? "size-10" : "size-11")}>
        <AvatarImage src={user.image ?? undefined} />
        <AvatarFallback>{initials(user.name ?? user.username)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <textarea
          ref={textareaRef}
          autoFocus={autoFocus}
          rows={1}
          value={content}
          onFocus={() => setExpanded(true)}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
          onPaste={(e) => {
            const files = Array.from(e.clipboardData.files);
            if (files.length === 0) return;
            e.preventDefault();
            addFiles(files);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={quoteOfId ? "Add a comment..." : "What's happening in Adamawa?"}
          aria-label={quoteOfId ? "Quote comment" : "Post text"}
          className={cn(
            "block max-h-[60vh] w-full resize-none overflow-y-auto bg-transparent pt-1.5 text-lg outline-none placeholder:text-muted-foreground",
            expanded ? "min-h-20" : "min-h-9"
          )}
        />

        {quotedPostPreview && <div className="mt-2 rounded-xl border border-border p-3">{quotedPostPreview}</div>}

        {attachments.length > 0 && (
          <div className={cn("mt-3 grid gap-2", attachments.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
            {attachments.map((a) => (
              <div key={a.id} className="relative overflow-hidden rounded-xl border border-border bg-muted">
                {a.type === "IMAGE" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.previewUrl} alt="" className="aspect-video w-full object-cover" />
                ) : (
                  <video src={a.previewUrl} className="aspect-video w-full object-cover" controls={a.status === "done"} muted />
                )}
                {a.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                    <Loader2 className="size-6 animate-spin" />
                    <span className="sr-only">Uploading</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  aria-label="Remove attachment"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showPoll && (
          <PollBuilder
            question={pollQuestion}
            onQuestionChange={setPollQuestion}
            options={pollOptions}
            onOptionsChange={setPollOptions}
            duration={pollDuration}
            onDurationChange={setPollDuration}
            allowMultiple={pollAllowMultiple}
            onAllowMultipleChange={setPollAllowMultiple}
            onRemove={() => setShowPoll(false)}
          />
        )}

        {expanded && !quoteOfId && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {TOPIC_TAGS.map((tag) => {
              const active = hasTag(content, tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                  )}
                >
                  <Hash className="size-3" />
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        <div className={cn("mt-3 flex items-center justify-between", (expanded || !inline) && "border-t border-border pt-3")}>
          <div className="flex items-center gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              onChange={(e) => {
                addFiles(Array.from(e.target.files ?? []));
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-primary"
              disabled={showPoll || attachments.length >= MAX_ATTACHMENTS}
              onClick={() => fileInputRef.current?.click()}
              title="Add photos or video"
              aria-label="Add photos or video"
            >
              <ImageIcon className="size-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn("text-primary", showPoll && "bg-primary/10")}
              disabled={attachments.length > 0}
              onClick={() => {
                setShowPoll((v) => !v);
                setExpanded(true);
              }}
              title="Add poll"
              aria-label="Add poll"
              aria-pressed={showPoll}
            >
              <BarChart3 className="size-5" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {content.length > 0 && (
              <span className={cn("text-xs tabular-nums", charsLeft < 50 ? "text-destructive" : "text-muted-foreground")}>
                {charsLeft}
              </span>
            )}
            <Button onClick={handleSubmit} disabled={submitting || uploading} size={inline ? "sm" : "default"} className={cn(inline && "h-9 px-5")}>
              {(submitting || uploading) && <Loader2 className="size-4 animate-spin" />}
              {uploading ? "Uploading" : quoteOfId ? "Repost" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PollBuilder({
  question,
  onQuestionChange,
  options,
  onOptionsChange,
  duration,
  onDurationChange,
  allowMultiple,
  onAllowMultipleChange,
  onRemove,
}: {
  question: string;
  onQuestionChange: (v: string) => void;
  options: string[];
  onOptionsChange: (v: string[]) => void;
  duration: number;
  onDurationChange: (v: number) => void;
  allowMultiple: boolean;
  onAllowMultipleChange: (v: boolean) => void;
  onRemove: () => void;
}) {
  const id = useId();
  return (
    <div className="mt-3 flex flex-col gap-2.5 rounded-xl border border-border p-3.5">
      <Input placeholder="Ask a question" value={question} onChange={(e) => onQuestionChange(e.target.value)} maxLength={280} />
      {options.map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => onOptionsChange(options.map((o, idx) => (idx === i ? e.target.value : o)))}
            maxLength={80}
          />
          {options.length > 2 && (
            <button
              type="button"
              onClick={() => onOptionsChange(options.filter((_, idx) => idx !== i))}
              className="text-muted-foreground hover:text-foreground"
              aria-label={`Remove option ${i + 1}`}
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      ))}
      {options.length < 6 && (
        <Button type="button" variant="ghost" size="sm" onClick={() => onOptionsChange([...options, ""])} className="w-fit">
          + Add option
        </Button>
      )}
      <div className="flex flex-wrap items-center gap-4 border-t border-border pt-2.5 text-sm">
        <div className="flex items-center gap-2">
          <Label htmlFor={`${id}-duration`} className="text-muted-foreground">Runs for</Label>
          <select
            id={`${id}-duration`}
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm shadow-xs transition-colors focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value={1}>1 hour</option>
            <option value={24}>1 day</option>
            <option value={72}>3 days</option>
            <option value={168}>7 days</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Switch id={`${id}-multi`} checked={allowMultiple} onCheckedChange={onAllowMultipleChange} />
          <Label htmlFor={`${id}-multi`} className="text-muted-foreground">Allow multiple answers</Label>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">This is a community platform poll, not a scientific opinion survey.</p>
      <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="w-fit text-destructive">
        Remove poll
      </Button>
    </div>
  );
}
