"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { AchievementCategory, ContentStatus } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { saveAchievement, type AchievementFormInput } from "@/lib/actions/admin-cms";
import { runAction } from "@/lib/run-action";

const CATEGORIES = Object.values(AchievementCategory);
const STATUSES = Object.values(ContentStatus);

type Initial = {
  [K in keyof AchievementFormInput]?: AchievementFormInput[K] | null;
} & { id?: string };

export function AchievementFormDialog({ initial, trigger }: { initial?: Initial; trigger?: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AchievementFormInput>({
    id: initial?.id,
    title: initial?.title ?? "",
    category: initial?.category ?? "COMMUNITY_DEVELOPMENT",
    year: initial?.year ?? "",
    location: initial?.location ?? "",
    summary: initial?.summary ?? "",
    description: initial?.description ?? "",
    impact: initial?.impact ?? "",
    source: initial?.source ?? "",
    sourceUrl: initial?.sourceUrl ?? "",
    contentStatus: initial?.contentStatus ?? "DRAFT",
    featured: initial?.featured ?? false,
  });

  async function handleSave() {
    setSubmitting(true);
    const result = await runAction(() => saveAchievement(form));
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Saved");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {trigger ?? (
          <Button size="sm">
            <Plus className="size-4" /> New achievement
          </Button>
        )}
      </div>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit achievement" : "New achievement"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Field label="Title">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as AchievementCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replaceAll("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Content status">
              <Select value={form.contentStatus} onValueChange={(v) => setForm({ ...form, contentStatus: v as ContentStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Year"><Input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></Field>
            <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          </div>
          <Field label="Summary"><Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
          <Field label="Full description"><Textarea className="min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <Field label="Impact (optional)"><Textarea value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source"><Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} /></Field>
            <Field label="Source URL"><Input value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} /></Field>
          </div>
          <div className="flex items-center gap-2.5">
            <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
            <Label>Featured on homepage</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={submitting}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
