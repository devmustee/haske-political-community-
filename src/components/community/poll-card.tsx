"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { votePoll } from "@/lib/actions/polls";
import { useGuestGate } from "@/components/community/guest-gate";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatCount } from "@/lib/utils";

interface PollOption {
  id: string;
  text: string;
  votesCount: number;
}

export function PollCard({
  pollId,
  question,
  options,
  allowMultiple,
  isOfficial,
  endAt,
  hasVoted,
}: {
  pollId: string;
  question: string;
  options: PollOption[];
  allowMultiple: boolean;
  isOfficial: boolean;
  endAt: string;
  hasVoted: boolean;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [voted, setVoted] = useState(hasVoted);
  const [pending, startTransition] = useTransition();
  const { guard, GateDialog } = useGuestGate();

  const ended = new Date(endAt) < new Date();
  const totalVotes = options.reduce((sum, o) => sum + o.votesCount, 0);
  const showResults = voted || ended;

  function toggleOption(id: string) {
    if (allowMultiple) {
      setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    } else {
      setSelected([id]);
    }
  }

  const submit = guard(() => {
    if (selected.length === 0) {
      toast.error("Choose an option first.");
      return;
    }
    startTransition(async () => {
      const result = await votePoll(pollId, selected);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setVoted(true);
    });
  });

  return (
    <div className="mt-2 rounded-xl border border-border p-3.5" onClick={(e) => e.stopPropagation()}>
      <p className="font-medium">{question}</p>
      {isOfficial && (
        <p className="mt-0.5 text-xs text-muted-foreground">
          Official community poll — reflects platform participants only, not a scientific survey.
        </p>
      )}

      <div className="mt-3 flex flex-col gap-2">
        {options.map((opt) => {
          const pct = totalVotes > 0 ? Math.round((opt.votesCount / totalVotes) * 100) : 0;
          if (showResults) {
            return (
              <div key={opt.id} className="relative">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{opt.text}</span>
                  <span className="text-muted-foreground">{pct}%</span>
                </div>
                <Progress value={pct} className="mt-1 h-6 rounded-md" />
              </div>
            );
          }
          return (
            <button
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg border border-input px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                selected.includes(opt.id) && "border-primary bg-primary/5"
              )}
            >
              {allowMultiple && <Checkbox checked={selected.includes(opt.id)} className="pointer-events-none" />}
              {opt.text}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {formatCount(totalVotes)} vote{totalVotes === 1 ? "" : "s"} &middot; {ended ? "Poll ended" : "Poll active"}
        </span>
        {!showResults && (
          <Button size="sm" disabled={pending} onClick={submit}>
            Vote
          </Button>
        )}
      </div>
      {GateDialog}
    </div>
  );
}
