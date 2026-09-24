"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateSiteSetting } from "@/lib/actions/admin-cms";

export function SiteSettingEditor({ settingKey, value }: { settingKey: string; value: unknown }) {
  const router = useRouter();
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      setError("Invalid JSON — check your syntax.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const result = await updateSiteSetting(settingKey, parsed);
    setSubmitting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`"${settingKey}" updated`);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-64 font-mono text-xs"
        spellCheck={false}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button size="sm" className="w-fit" onClick={handleSave} disabled={submitting}>
        {submitting && <Loader2 className="size-4 animate-spin" />}
        Save {settingKey}
      </Button>
    </div>
  );
}
