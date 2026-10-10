"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addBlockedWord, removeBlockedWord } from "@/lib/actions/admin-moderation";
import { runAction } from "@/lib/run-action";

export function BlockedWordsManager({ words }: { words: string[] }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();

  function add() {
    if (!value.trim()) return;
    startTransition(async () => {
      const result = await runAction(() => addBlockedWord(value));
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setValue("");
      router.refresh();
    });
  }

  function remove(word: string) {
    startTransition(async () => {
      await runAction(() => removeBlockedWord(word));
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Add a blocked word" onKeyDown={(e) => e.key === "Enter" && add()} />
        <Button disabled={pending} onClick={add}>
          Add
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {words.length === 0 && <p className="text-sm text-muted-foreground">No blocked words configured.</p>}
        {words.map((w) => (
          <Badge key={w} variant="secondary" className="gap-1.5">
            {w}
            <button onClick={() => remove(w)} disabled={pending}>
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
