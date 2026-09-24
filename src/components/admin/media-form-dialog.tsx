"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { MediaCenterCategory, ContentStatus } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { saveMediaItem, type MediaFormInput } from "@/lib/actions/admin-cms";

const CATEGORIES = Object.values(MediaCenterCategory);
const STATUSES = Object.values(ContentStatus);

type Initial = { [K in keyof MediaFormInput]?: MediaFormInput[K] | null } & { id?: string };

export function MediaFormDialog({ initial, trigger }: { initial?: Initial; trigger?: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<MediaFormInput>({
    id: initial?.id,
    title: initial?.title ?? "",
    category: initial?.category ?? "NEWS",
    date: initial?.date ?? new Date().toISOString().slice(0, 10),
    author: initial?.author ?? "",
    featuredImage: initial?.featuredImage ?? "",
    content: initial?.content ?? "",
    relatedTopic: initial?.relatedTopic ?? "",
    sourceUrl: initial?.sourceUrl ?? "",
    contentStatus: initial?.contentStatus ?? "DRAFT",
  });

  async function handleSave() {
    setSubmitting(true);
    const result = await saveMediaItem(form);
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
      <div onClick={() => setOpen(true)}>{trigger ?? <Button size="sm"><Plus className="size-4" /> New item</Button>}</div>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader><DialogTitle>{form.id ? "Edit media item" : "New media item"}</DialogTitle></DialogHeader>
        <div className="flex flex-col gap-3">
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as MediaCenterCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replaceAll("_", " ")}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Date">
              <Input type="date" value={form.date?.slice(0, 10) ?? ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
          </div>
          <Field label="Content"><Textarea className="min-h-32" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Author"><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></Field>
            <Field label="Related topic"><Input value={form.relatedTopic} onChange={(e) => setForm({ ...form, relatedTopic: e.target.value })} /></Field>
          </div>
          <Field label="Featured image URL"><Input value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source URL"><Input value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} /></Field>
            <Field label="Content status">
              <Select value={form.contentStatus} onValueChange={(v) => setForm({ ...form, contentStatus: v as ContentStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={submitting}>{submitting && <Loader2 className="size-4 animate-spin" />}Save</Button>
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
