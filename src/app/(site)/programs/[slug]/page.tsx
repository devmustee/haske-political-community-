import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { ProgramApplyDialog } from "@/components/cms/program-apply-dialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { MapPin, Users, Calendar } from "lucide-react";

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
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{CATEGORY_LABELS[program.category] ?? program.category}</Badge>
        <ContentStatusBadge status={program.contentStatus} />
      </div>
      <h1 className="mt-4 font-serif text-3xl font-semibold">{program.name}</h1>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
        {program.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" /> {program.location}
          </span>
        )}
        {program.targetBeneficiaries && (
          <span className="flex items-center gap-1.5">
            <Users className="size-4" /> {program.targetBeneficiaries}
          </span>
        )}
        {program.applicationDeadline && (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" /> Applications close {formatDate(program.applicationDeadline)}
          </span>
        )}
      </div>

      <p className="mt-6 text-lg leading-relaxed">{program.description}</p>

      {program.eligibility && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-muted-foreground">Eligibility</h2>
          <p className="mt-1 text-[15px]">{program.eligibility}</p>
        </div>
      )}

      {program.resultsImpact && (
        <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-5">
          <h2 className="text-sm font-semibold text-muted-foreground">Results & impact</h2>
          <p className="mt-1 text-[15px]">{program.resultsImpact}</p>
        </div>
      )}

      <div className="mt-8 border-t border-border pt-6">
        {canApply ? (
          <ProgramApplyDialog programId={program.id} programName={program.name} />
        ) : (
          <p className="text-sm text-muted-foreground">Applications are not currently open for this program.</p>
        )}
      </div>
    </article>
  );
}
