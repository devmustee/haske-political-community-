"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { ProgramCategory, ProgramStatus, ContentStatus } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { saveProgram, type ProgramFormInput } from "@/lib/actions/admin-cms";

const CATEGORIES = Object.values(ProgramCategory);
const STATUSES = Object.values(ProgramStatus);
const CONTENT_STATUSES = Object.values(ContentStatus);

type Initial = { [K in keyof ProgramFormInput]?: ProgramFormInput[K] | null } & { id?: string };

export function ProgramFormDialog({ initial, trigger }: { initial?: Initial; trigger?: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ProgramFormInput>({
    id: initial?.id,
    name: initial?.name ?? "",
    category: initial?.category ?? "YOUTH_EMPOWERMENT",
    description: initial?.description ?? "",
    targetBeneficiaries: initial?.targetBeneficiaries ?? "",
    location: initial?.location ?? "",
    status: initial?.status ?? "UPCOMING",
    eligibility: initial?.eligibility ?? "",
    resultsImpact: initial?.resultsImpact ?? "",
    adminNotes: initial?.adminNotes ?? "",
    contentStatus: initial?.contentStatus ?? "DRAFT",
    applicationDeadline: initial?.applicationDeadline ?? "",
  });

  async function handleSave() {
    setSubmitting(true);
    const result = await saveProgram(form);
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
        {trigger ?? <Button size="sm"><Plus className="size-4" /> New program</Button>}
      </div>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit program" : "New program"}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as ProgramCategory })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replaceAll("_", " ")}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as ProgramStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Description"><Textarea className="min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Target beneficiaries"><Input value={form.targetBeneficiaries} onChange={(e) => setForm({ ...form, targetBeneficiaries: e.target.value })} /></Field>
            <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          </div>
          <Field label="Eligibility"><Textarea value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} /></Field>
          <Field label="Results / impact (optional)"><Textarea value={form.resultsImpact} onChange={(e) => setForm({ ...form, resultsImpact: e.target.value })} /></Field>
          <Field label="Admin notes (private)"><Textarea value={form.adminNotes} onChange={(e) => setForm({ ...form, adminNotes: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Application deadline">
              <Input type="date" value={form.applicationDeadline?.slice(0, 10) ?? ""} onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })} />
            </Field>
            <Field label="Content status">
              <Select value={form.contentStatus} onValueChange={(v) => setForm({ ...form, contentStatus: v as ContentStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CONTENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
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
