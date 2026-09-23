"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { submitCommunityIssue } from "@/lib/actions/feedback";
import { communityIssueSchema, type CommunityIssueInput } from "@/lib/validations/feedback";

const CATEGORIES: CommunityIssueInput["category"][] = [
  "ROADS",
  "WATER",
  "ELECTRICITY",
  "HEALTHCARE",
  "EDUCATION",
  "AGRICULTURE",
  "SECURITY",
  "YOUTH_EMPLOYMENT",
  "ENVIRONMENT",
  "OTHER",
];

export function CommunityIssueForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CommunityIssueInput>({ resolver: zodResolver(communityIssueSchema), defaultValues: { category: "ROADS" } });

  async function onSubmit(values: CommunityIssueInput) {
    setSubmitting(true);
    const result = await submitCommunityIssue(values);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Issue reported — thank you.");
    reset({ category: "ROADS", title: "", description: "", lga: "" });
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-2xl border border-border p-5">
      <div className="flex flex-col gap-1.5">
        <Label>Category</Label>
        <Select value={watch("category")} onValueChange={(v) => setValue("category", v as CommunityIssueInput["category"])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c.replaceAll("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="issue-title">Title</Label>
        <Input id="issue-title" {...register("title")} placeholder="e.g. Bad road at Jimeta roundabout" />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="issue-lga">Local Government Area</Label>
        <Input id="issue-lga" {...register("lga")} placeholder="e.g. Yola North" />
        {errors.lga && <p className="text-xs text-destructive">{errors.lga.message}</p>}
        <p className="text-xs text-muted-foreground">LGA level only — no precise home address needed.</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="issue-description">Description</Label>
        <Textarea id="issue-description" {...register("description")} className="min-h-28" />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="w-fit">
        {submitting && <Loader2 className="size-4 animate-spin" />}
        Report issue
      </Button>
    </form>
  );
}
