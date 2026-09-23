import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await prisma.policyPillar.findUnique({ where: { slug } });
  if (!pillar) return {};
  return { title: pillar.name };
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-muted-foreground">{label}</h2>
      <p className="mt-1 text-[15px] leading-relaxed">{value}</p>
    </div>
  );
}

export default async function PolicyPillarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = await prisma.policyPillar.findUnique({ where: { slug } });
  if (!pillar) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Link href="/manifesto" className="text-sm text-primary hover:underline">&larr; Our Agenda</Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{pillar.category}</Badge>
        <ContentStatusBadge status={pillar.contentStatus} />
      </div>
      <h1 className="mt-4 font-serif text-3xl font-semibold">{pillar.name}</h1>

      <Field label="The problem" value={pillar.problem} />
      <Field label="Current situation" value={pillar.currentSituation} />
      <Field label="Proposed approach" value={pillar.proposedApproach} />
      <Field label="Objectives" value={pillar.objectives} />
      <Field label="Proposed actions" value={pillar.proposedActions} />
      <Field label="Expected outcomes" value={pillar.expectedOutcomes} />
    </article>
  );
}
