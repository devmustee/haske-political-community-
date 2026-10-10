import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUS_INFO, APPLY_BLOCK_MESSAGE, applyBlockReason } from "@/lib/applications";
import { isPayoutConfigured } from "@/lib/crypto/payout";
import { getBankList } from "@/lib/payout/provider";
import { Button } from "@/components/ui/button";
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

  const blocked = applyBlockReason(program);
  const session = await getSession();
  const myApplication = session?.user
    ? await prisma.programApplication.findUnique({
        where: { programId_userId: { programId: program.id, userId: session.user.id } },
        select: { status: true },
      })
    : null;
  const collectPayout = program.requiresPayoutDetails && program.payoutDetailsStage === "AT_APPLICATION" && isPayoutConfigured();
  const banks = collectPayout && !blocked && !myApplication ? await getBankList() : [];

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
          {myApplication ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">
                You applied to this program. Status:{" "}
                <span className="font-semibold">{APPLICATION_STATUS_INFO[myApplication.status].label}</span>
              </p>
              <Button asChild variant="outline">
                <Link href="/applications">Track my application</Link>
              </Button>
            </div>
          ) : !blocked ? (
            <ProgramApplyDialog
              programId={program.id}
              programName={program.name}
              programSlug={program.slug}
              collectPayout={collectPayout}
              banks={banks}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {program.status === "UPCOMING" ? "Applications for this program open soon." : APPLY_BLOCK_MESSAGE[blocked]}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
