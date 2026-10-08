import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight, Award, ShieldCheck, MapPin, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Documented Achievements — Abdulrahman Bashir Haske",
  description: "Publicly documented and verified achievements of Abdulrahman Bashir Haske across agriculture, youth development, and philanthropy.",
};
export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  AGRICULTURE: "Agriculture",
  BUSINESS: "Business",
  TECHNOLOGY: "Technology",
  YOUTH_EMPOWERMENT: "Youth Empowerment",
  EDUCATION: "Education",
  HUMANITARIAN_SUPPORT: "Humanitarian Support",
  COMMUNITY_DEVELOPMENT: "Community Development",
  ENTREPRENEURSHIP: "Entrepreneurship",
  SPORTS: "Sports",
  PHILANTHROPY: "Philanthropy",
};

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    where: { contentStatus: { notIn: ["DRAFT"] } },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { images: { take: 1 } },
  });

  const isSpotlight = achievements[0]?.featured === true;
  const spotlight = isSpotlight ? achievements[0] : undefined;
  const rest = isSpotlight ? achievements.slice(1) : achievements;

  return (
    <div>
      <PageHero
        eyebrow="Evidence & Transparency"
        title="Documented Achievements"
        description="What has Abdulrahman Haske actually done? Verifiable, source-attributed achievements — distinct from proposed plans and future commitments."
        watermark="Record"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5 text-emerald-600" /> Source-Attributed Evidence
          </span>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {achievements.length === 0 ? (
          <div className="py-20 text-center">
            <Award className="mx-auto size-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No achievements published yet.</p>
          </div>
        ) : (
          <>
            {spotlight && (
              <Reveal variant="scale" className="mb-12">
                <Link href={`/achievements/${spotlight.slug}`}>
                  <SpotlightCard
                    spotlightColor="gold"
                    className="overflow-hidden lg:grid lg:grid-cols-2 shadow-elevated"
                  >
                    {spotlight.images[0] ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-muted lg:aspect-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={spotlight.images[0].url}
                          alt={spotlight.images[0].caption ?? ""}
                          className="size-full object-cover transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="hidden bg-gradient-to-br from-primary/10 to-accent/10 lg:block" />
                    )}
                    <div className="flex flex-col justify-center p-8 sm:p-10">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="gold" className="font-bold">Featured Spotlight</Badge>
                        <Badge variant="secondary">{CATEGORY_LABELS[spotlight.category] ?? spotlight.category}</Badge>
                        <ContentStatusBadge status={spotlight.contentStatus} />
                      </div>
                      <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-foreground">
                        {spotlight.title}
                      </h2>
                      {(spotlight.year || spotlight.location) && (
                        <p className="mt-2 text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-2">
                          {spotlight.location && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{spotlight.location}</span>}
                          {spotlight.year && <span className="flex items-center gap-1"><Calendar className="size-3.5" />{spotlight.year}</span>}
                        </p>
                      )}
                      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                        {spotlight.summary}
                      </p>
                      <span className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary">
                        Read full documented case <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </SpotlightCard>
                </Link>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.map((a, i) => (
                  <Reveal key={a.id} variant="scale" delay={Math.min(i, 5) * 80}>
                    <Link href={`/achievements/${a.slug}`}>
                      <SpotlightCard
                        spotlightColor="primary"
                        className="overflow-hidden h-full flex flex-col justify-between"
                      >
                        {a.images[0] && (
                          <div className="relative aspect-video w-full overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={a.images[0].url}
                              alt={a.images[0].caption ?? ""}
                              className="size-full object-cover transition-transform duration-700 hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-6 sm:p-7">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{CATEGORY_LABELS[a.category] ?? a.category}</Badge>
                            <ContentStatusBadge status={a.contentStatus} />
                          </div>
                          <h2 className="mt-4 font-serif text-xl font-bold text-foreground">
                            {a.title}
                          </h2>
                          {(a.year || a.location) && (
                            <p className="mt-1.5 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                              {a.location && <span>{a.location}</span>}
                              {a.year && <span>&middot; {a.year}</span>}
                            </p>
                          )}
                          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                            {a.summary}
                          </p>
                          <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                            Examine documented evidence <ArrowRight className="size-3.5" />
                          </span>
                        </div>
                      </SpotlightCard>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
