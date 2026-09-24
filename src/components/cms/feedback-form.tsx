"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { submitFeedback } from "@/lib/actions/feedback";
import { feedbackSchema, type FeedbackInput } from "@/lib/validations/feedback";

const TYPE_OPTIONS: { value: FeedbackInput["type"]; label: string }[] = [
  { value: "IDEA", label: "Idea" },
  { value: "COMMUNITY_PROBLEM", label: "Community Problem" },
  { value: "SUGGESTION", label: "Suggestion" },
  { value: "QUESTION", label: "Question" },
  { value: "PROGRAM_FEEDBACK", label: "Program Feedback" },
  { value: "POLICY_FEEDBACK", label: "Policy Feedback" },
];

export function FeedbackForm() {
  const [submitting, setSubmitting] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FeedbackInput>({ resolver: zodResolver(feedbackSchema), defaultValues: { type: "IDEA" } });

  async function onSubmit(values: FeedbackInput) {
    setSubmitting(true);
    const result = await submitFeedback(values);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setTrackingId(result.data.trackingId);
    reset({ type: "IDEA", subject: "", description: "", lga: "" });
  }

  if (trackingId) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-8 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-medium">Submission received</p>
        <p className="text-sm text-muted-foreground">Your tracking ID is:</p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(trackingId);
            toast.success("Copied");
          }}
          className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-mono text-lg font-semibold"
        >
          {trackingId}
          <Copy className="size-4 text-muted-foreground" />
        </button>
        <p className="text-sm text-muted-foreground">Save this ID to track your submission&apos;s status below.</p>
        <Button variant="outline" onClick={() => setTrackingId(null)}>
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Type</Label>
        <Select value={watch("type")} onValueChange={(v) => setValue("type", v as FeedbackInput["type"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" {...register("subject")} placeholder="Brief summary" />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Details</Label>
        <Textarea id="description" {...register("description")} className="min-h-32" placeholder="Tell us more..." />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="lga">Local Government Area (optional)</Label>
        <Input id="lga" {...register("lga")} placeholder="e.g. Yola North" />
      </div>

      <Button type="submit" disabled={submitting} size="lg" className="mt-2 w-fit">
        {submitting && <Loader2 className="size-4 animate-spin" />}
        Submit
      </Button>
    </form>
  );
}
