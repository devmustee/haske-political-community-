"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil } from "lucide-react";
import { ContentStatus } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { savePolicyPillar, type PolicyPillarFormInput } from "@/lib/actions/admin-cms";
import type { PolicyPillar } from "@prisma/client";

const STATUSES = Object.values(ContentStatus);

export function PolicyPillarFormDialog({ pillar }: { pillar: PolicyPillar }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<PolicyPillarFormInput>({
    id: pillar.id,
    name: pillar.name,
    category: pillar.category,
    problem: pillar.problem ?? "",
    currentSituation: pillar.currentSituation ?? "",
    proposedApproach: pillar.proposedApproach ?? "",
    objectives: pillar.objectives ?? "",
    proposedActions: pillar.proposedActions ?? "",
    expectedOutcomes: pillar.expectedOutcomes ?? "",
    contentStatus: pillar.contentStatus,
  });

  async function handleSave() {
    setSubmitting(true);
    const result = await savePolicyPillar(form);
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
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Pencil className="size-4" />
      </Button>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader><DialogTitle>Edit {pillar.name}</DialogTitle></DialogHeader>
        <div className="flex flex-col gap-3">
          <Field label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></Field>
          <Field label="The problem"><Textarea value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} /></Field>
          <Field label="Current situation"><Textarea value={form.currentSituation} onChange={(e) => setForm({ ...form, currentSituation: e.target.value })} /></Field>
          <Field label="Proposed approach"><Textarea value={form.proposedApproach} onChange={(e) => setForm({ ...form, proposedApproach: e.target.value })} /></Field>
          <Field label="Objectives"><Textarea value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} /></Field>
          <Field label="Proposed actions"><Textarea value={form.proposedActions} onChange={(e) => setForm({ ...form, proposedActions: e.target.value })} /></Field>
          <Field label="Expected outcomes"><Textarea value={form.expectedOutcomes} onChange={(e) => setForm({ ...form, expectedOutcomes: e.target.value })} /></Field>
          <Field label="Content status">
            <Select value={form.contentStatus} onValueChange={(v) => setForm({ ...form, contentStatus: v as ContentStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
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
