"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { publishManifesto } from "@/lib/actions/admin-cms";
import { runAction } from "@/lib/run-action";

export function PublishManifestoDialog({ pillars }: { pillars: { id: string; name: string }[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [version, setVersion] = useState("1.0");
  const [introduction, setIntroduction] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handlePublish() {
    setSubmitting(true);
    const result = await runAction(() => publishManifesto({ title, version, introduction, pillarIds: selected }));
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Manifesto published as current");
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Publish new manifesto version</Button>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Publish current manifesto</DialogTitle>
          <DialogDescription>This becomes the active manifesto shown on the public Agenda page.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Haske 2027 Agenda for Adamawa" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Version</Label>
            <Input value={version} onChange={(e) => setVersion(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Introduction</Label>
            <Textarea className="min-h-24" value={introduction} onChange={(e) => setIntroduction(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Include policy pillars</Label>
            <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
              {pillars.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggle(p.id)} />
                  {p.name}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handlePublish} disabled={submitting || !title.trim() || !introduction.trim()}>
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Publish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
