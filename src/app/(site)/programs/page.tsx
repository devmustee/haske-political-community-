import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight, HandHeart, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Citizen Empowerment & Programs — Haske Community",
  description: "Browse youth, women, agriculture, education and humanitarian empowerment programs in Adamawa State.",
};
export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  YOUTH_EMPOWERMENT: "Youth Empowerment",
  WOMEN_EMPOWERMENT: "Women Empowerment",
  AGRICULTURE: "Agriculture",
  EDUCATION: "Education",
  HUMANITARIAN: "Humanitarian",
};

const STATUS_LABELS: Record<string, string> = {
  UPCOMING: "Upcoming",
  OPEN: "Applications Open",
  ONGOING: "Active Initiative",
  CLOSED: "Cohort Closed",
  COMPLETED: "Completed",
};

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    where: { contentStatus: { notIn: ["DRAFT"] } },
    orderBy: { createdAt: "asc" },
    include: { images: { take: 1 } },
  });

  return (
    <div>
      <PageHero
        eyebrow="Direct Citizen Impact"
        title="Empowerment & Programs"
        description="Transparent pathways to skills acquisition, agricultural inputs, business grants, and humanitarian support across all 21 Local Government Areas."
        watermark="Empower"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent-foreground">
            <Sparkles className="size-3.5 text-accent" /> Active Cohorts & Grants
          </span>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {programs.length === 0 ? (
          <div className="py-20 text-center">
            <HandHeart className="mx-auto size-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No programs published yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {programs.map((p, i) => (
              <Reveal key={p.id} variant="scale" delay={Math.min(i, 5) * 80}>
                <Link href={`/programs/${p.slug}`}>
                  <SpotlightCard
                    spotlightColor="gold"
                    className="overflow-hidden h-full flex flex-col justify-between shadow-elevated"
                  >
                    {p.images[0] && (
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images[0].url}
                          alt={p.images[0].caption ?? ""}
                          className="size-full object-cover transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="font-semibold">{CATEGORY_LABELS[p.category] ?? p.category}</Badge>
                        <Badge variant={p.status === "OPEN" ? "gold" : "outline"} className="font-bold">
                          {STATUS_LABELS[p.status] ?? p.status}
                        </Badge>
                        <ContentStatusBadge status={p.contentStatus} />
                      </div>
                      <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">
                        {p.name}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-accent">
                        View eligibility & apply <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </SpotlightCard>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
