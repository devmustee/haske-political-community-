"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { votePoll } from "@/lib/actions/polls";
import { useGuestGate } from "@/components/community/guest-gate";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatCount } from "@/lib/utils";
import { Check, CheckCircle2 } from "lucide-react";
import { runAction } from "@/lib/run-action";

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

  // Find max votes for winning highlight
  const maxVotes = Math.max(...options.map((o) => o.votesCount), 0);

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
      const result = await runAction(() => votePoll(pollId, selected));
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setVoted(true);
    });
  });

  return (
    <div
      className="mt-3 overflow-hidden rounded-2xl border border-border/80 bg-secondary/30 p-4 sm:p-5 shadow-soft"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-foreground text-[15px]">{question}</p>
        {isOfficial && (
          <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-0.5 text-xs sm:text-[11px] font-bold text-accent-foreground uppercase tracking-wider">
            Official
          </span>
        )}
      </div>

      {isOfficial && (
        <p className="mt-1 text-xs text-muted-foreground">
          Official community consultation poll &middot; Public participant representation.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2.5">
        {options.map((opt) => {
          const pct = totalVotes > 0 ? Math.round((opt.votesCount / totalVotes) * 100) : 0;
          const isWinner = totalVotes > 0 && opt.votesCount === maxVotes;

          if (showResults) {
            return (
              <div
                key={opt.id}
                className={cn(
                  "relative flex items-center justify-between overflow-hidden rounded-xl border border-border/70 p-3 text-sm font-medium",
                  isWinner ? "border-accent/40 bg-accent/5 font-semibold" : "bg-card/70"
                )}
              >
                {/* Animated Spring Fill Bar */}
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-1000 ease-out",
                    isWinner ? "bg-accent/25" : "bg-primary/10"
                  )}
                  style={{ width: `${pct}%` }}
                />

                {/* Option Label */}
                <div className="relative z-10 flex items-center gap-2">
                  <span>{opt.text}</span>
                  {isWinner && totalVotes > 0 && (
                    <CheckCircle2 className="size-4 text-accent shrink-0" />
                  )}
                </div>

                {/* Percentage with Tabular Numbers */}
                <span className="relative z-10 font-tnum font-bold text-xs text-foreground/90 pl-3">
                  {pct}%
                </span>
              </div>
            );
          }

          return (
            <button
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              className={cn(
                "group flex items-center gap-2.5 rounded-xl border border-border/80 bg-card px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 active:scale-[0.99]",
                selected.includes(opt.id) && "border-primary bg-primary/10 shadow-soft"
              )}
            >
              {allowMultiple ? (
                <Checkbox checked={selected.includes(opt.id)} className="pointer-events-none" />
              ) : (
                <div
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 transition-colors",
                    selected.includes(opt.id) && "border-primary bg-primary text-primary-foreground"
                  )}
                >
                  {selected.includes(opt.id) && <div className="size-2 rounded-full bg-white" />}
                </div>
              )}
              <span className="flex-1">{opt.text}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
        <span className="font-medium font-tnum">
          {formatCount(totalVotes)} vote{totalVotes === 1 ? "" : "s"} &middot; {ended ? "Poll closed" : "Voting active"}
        </span>
        {!showResults && (
          <Button size="sm" variant="gold-shimmer" disabled={pending} onClick={submit} className="px-5 shadow-soft">
            Cast Vote
          </Button>
        )}
      </div>
      {GateDialog}
    </div>
  );
}
