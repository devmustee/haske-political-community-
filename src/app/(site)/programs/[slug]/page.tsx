import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { ProgramApplyDialog } from "@/components/cms/program-apply-dialog";
import { DetailHeader, DetailMetaItem } from "@/components/cms/detail-header";
import { Callout, DetailField } from "@/components/cms/callout";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { MapPin, Users, Calendar, TrendingUp } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  YOUTH_EMPOWERMENT: "Youth Empowerment",
  WOMEN_EMPOWERMENT: "Women Empowerment",
  AGRICULTURE: "Agriculture",
  EDUCATION: "Education",
  HUMANITARIAN: "Humanitarian",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.program.findUnique({ where: { slug } });
  if (!p) return {};
  return { title: p.name, description: p.description };
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = await prisma.program.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } }, reports: true },
  });
  if (!program || program.contentStatus === "DRAFT") notFound();

  const canApply = program.status === "OPEN" || program.status === "UPCOMING" || program.status === "ONGOING";

  return (
    <article>
      <DetailHeader
        backHref="/programs"
        backLabel="Programs"
        badges={
          <>
            <Badge variant="secondary">{CATEGORY_LABELS[program.category] ?? program.category}</Badge>
            <ContentStatusBadge status={program.contentStatus} />
          </>
        }
        title={program.name}
        meta={
          <>
            {program.location && <DetailMetaItem icon={MapPin}>{program.location}</DetailMetaItem>}
            {program.targetBeneficiaries && <DetailMetaItem icon={Users}>{program.targetBeneficiaries}</DetailMetaItem>}
            {program.applicationDeadline && (
              <DetailMetaItem icon={Calendar}>Applications close {formatDate(program.applicationDeadline)}</DetailMetaItem>
            )}
          </>
        }
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {program.images.length > 0 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={program.images[0].url}
            alt={program.images[0].caption ?? ""}
            className="w-full rounded-2xl border border-border object-cover shadow-soft"
          />
        )}

        <p className={program.images.length > 0 ? "mt-8 text-lg leading-relaxed" : "text-lg leading-relaxed"}>
          {program.description}
        </p>

        {program.eligibility && <DetailField label="Eligibility">{program.eligibility}</DetailField>}

        {program.resultsImpact && (
          <Callout icon={TrendingUp} label="Results & impact">
            {program.resultsImpact}
          </Callout>
        )}

        <div className="mt-8 border-t border-border pt-6">
          {canApply ? (
            <ProgramApplyDialog programId={program.id} programName={program.name} />
          ) : (
            <p className="text-sm text-muted-foreground">Applications are not currently open for this program.</p>
          )}
        </div>
      </div>
    </article>
  );
}
