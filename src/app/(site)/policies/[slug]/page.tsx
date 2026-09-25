import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { DetailHeader } from "@/components/cms/detail-header";
import { DetailField, Callout } from "@/components/cms/callout";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await prisma.policyPillar.findUnique({ where: { slug } });
  if (!pillar) return {};
  return { title: pillar.name };
}

export default async function PolicyPillarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = await prisma.policyPillar.findUnique({ where: { slug } });
  if (!pillar) notFound();

  return (
    <article>
      <DetailHeader
        backHref="/manifesto"
        backLabel="Our Agenda"
        badges={
          <>
            <Badge variant="secondary">{pillar.category}</Badge>
            <ContentStatusBadge status={pillar.contentStatus} />
          </>
        }
        title={pillar.name}
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {pillar.problem && <DetailField label="The problem">{pillar.problem}</DetailField>}
        {pillar.currentSituation && <DetailField label="Current situation">{pillar.currentSituation}</DetailField>}
        {pillar.proposedApproach && <DetailField label="Proposed approach">{pillar.proposedApproach}</DetailField>}

        {pillar.objectives && (
          <Callout icon={Target} label="Objectives" className="mt-8">
            {pillar.objectives}
          </Callout>
        )}

        {pillar.proposedActions && <DetailField label="Proposed actions">{pillar.proposedActions}</DetailField>}
        {pillar.expectedOutcomes && <DetailField label="Expected outcomes">{pillar.expectedOutcomes}</DetailField>}
      </div>
    </article>
  );
}
