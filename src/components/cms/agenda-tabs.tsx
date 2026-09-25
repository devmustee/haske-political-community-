"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentStatus } from "@prisma/client";

export interface AgendaPillar {
  id: string;
  slug: string;
  name: string;
  category: string;
  proposedApproach: string | null;
  objectives: string | null;
  expectedOutcomes: string | null;
  contentStatus: ContentStatus;
}

function letterOf(category: string) {
  return category.match(/\(([A-Z])\)/)?.[1] ?? category[0];
}

function labelOf(category: string) {
  return category.replace(/\s*\([A-Z]\)\s*$/, "");
}

export function AgendaTabs({ pillars }: { pillars: AgendaPillar[] }) {
  if (pillars.length === 0) return null;

  return (
    <Tabs defaultValue={pillars[0].id} className="w-full">
      <TabsList className="h-auto w-full flex-wrap justify-start gap-2.5 rounded-none bg-transparent p-0">
        {pillars.map((p) => (
          <TabsTrigger
            key={p.id}
            value={p.id}
            className={cn(
              "h-auto rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3 text-left text-primary-foreground/60 shadow-none transition-all duration-300",
              "hover:bg-primary-foreground/10 hover:text-primary-foreground/80 hover:border-primary-foreground/25",
              "data-[state=active]:border-transparent data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-glow-gold data-[state=active]:scale-[1.02]"
            )}
          >
            <span className="flex flex-col items-start gap-0.5">
              <span className="text-xl font-black leading-none">{letterOf(p.category)}</span>
              <span className="text-[11px] font-medium leading-none">{labelOf(p.category)}</span>
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {pillars.map((p) => (
        <TabsContent key={p.id} value={p.id} className="mt-8 animate-fade-in">
          <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-7 backdrop-blur-sm sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <ContentStatusBadge status={p.contentStatus} className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground" />
            </div>
            <h3 className="mt-4 font-serif text-2xl font-semibold text-primary-foreground sm:text-3xl lg:text-4xl">{p.name}</h3>
            {p.proposedApproach && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-primary-foreground/75">{p.proposedApproach}</p>}
            {p.objectives && (
              <p className="mt-5 max-w-2xl rounded-xl border border-accent/20 bg-accent/5 p-4 text-sm text-primary-foreground/70">
                <span className="font-semibold text-accent">Objective —</span> {p.objectives}
              </p>
            )}
            <Link
              href={`/policies/${p.slug}`}
              className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              Read the full policy pillar <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
