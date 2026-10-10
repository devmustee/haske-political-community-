"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { EventStatus } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { saveEvent, type EventFormInput } from "@/lib/actions/admin-cms";
import { runAction } from "@/lib/run-action";

const STATUSES = Object.values(EventStatus);

type Initial = { [K in keyof EventFormInput]?: EventFormInput[K] | null } & { id?: string };

export function EventFormDialog({ initial, trigger }: { initial?: Initial; trigger?: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<EventFormInput>({
    id: initial?.id,
    title: initial?.title ?? "",
    description: initial?.description ?? "",
    date: initial?.date ?? "",
    venue: initial?.venue ?? "",
    lga: initial?.lga ?? "",
    speaker: initial?.speaker ?? "",
    imageUrl: initial?.imageUrl ?? "",
    registrationRequired: initial?.registrationRequired ?? true,
    capacity: initial?.capacity ?? undefined,
    eventType: initial?.eventType ?? "",
    status: initial?.status ?? "UPCOMING",
    summary: initial?.summary ?? "",
  });

  async function handleSave() {
    setSubmitting(true);
    const result = await runAction(() => saveEvent(form));
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
      <div onClick={() => setOpen(true)}>{trigger ?? <Button size="sm"><Plus className="size-4" /> New event</Button>}</div>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader><DialogTitle>{form.id ? "Edit event" : "New event"}</DialogTitle></DialogHeader>
        <div className="flex flex-col gap-3">
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Description"><Textarea className="min-h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date & time">
              <Input type="datetime-local" value={form.date?.slice(0, 16) ?? ""} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as EventStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Venue"><Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></Field>
            <Field label="LGA"><Input value={form.lga} onChange={(e) => setForm({ ...form, lga: e.target.value })} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Speaker"><Input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} /></Field>
            <Field label="Event type"><Input value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} /></Field>
          </div>
          <Field label="Image URL"><Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Capacity (optional)">
              <Input type="number" value={form.capacity ?? ""} onChange={(e) => setForm({ ...form, capacity: e.target.value ? Number(e.target.value) : undefined })} />
            </Field>
            <div className="flex items-center gap-2.5 pt-6">
              <Switch checked={form.registrationRequired} onCheckedChange={(v) => setForm({ ...form, registrationRequired: v })} />
              <Label>Registration required</Label>
            </div>
          </div>
          <Field label="Summary (post-event, optional)"><Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
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
