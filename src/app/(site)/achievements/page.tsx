import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { CardImage } from "@/components/cms/card-image";
import { ArrowRight, Award, ShieldCheck, MapPin, Calendar } from "lucide-react";
import type { Prisma } from "@prisma/client";

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

type AchievementWithImage = Prisma.AchievementGetPayload<{ include: { images: true } }>;

/**
 * One achievement. "wide" puts the image beside the text from the lg
 * breakpoint (used for the spotlight and for a lone remaining card, so it
 * doesn't sit at half width next to empty space); "stacked" is the grid card.
 */
function AchievementCard({ achievement: a, layout, featured = false }: { achievement: AchievementWithImage; layout: "wide" | "stacked"; featured?: boolean }) {
  const image = a.images[0];
  const wide = layout === "wide";

  return (
    <Link
      href={`/achievements/${a.slug}`}
      className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <SpotlightCard
        spotlightColor={featured ? "gold" : "primary"}
        className={cn("h-full", featured && "shadow-elevated")}
        contentClassName={cn("flex flex-col", wide && "lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]")}
      >
        {image ? (
          <CardImage
            src={image.url}
            alt={image.caption ?? a.title}
            className={cn("aspect-video w-full shrink-0", wide && "lg:aspect-auto lg:h-full lg:min-h-[22rem]")}
          />
        ) : (
          wide && <div className="hidden bg-gradient-to-br from-primary/10 to-accent/10 lg:block" />
        )}

        <div className={cn("flex flex-1 flex-col", wide ? "justify-center p-6 sm:p-10" : "p-6 sm:p-7")}>
          <div className="flex flex-wrap items-center gap-2">
            {featured && <Badge variant="gold" className="font-bold">Featured Spotlight</Badge>}
            <Badge variant="secondary">{CATEGORY_LABELS[a.category] ?? a.category}</Badge>
            <ContentStatusBadge status={a.contentStatus} />
          </div>

          <h2 className={cn("mt-4 font-serif font-bold text-balance text-foreground", wide ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl")}>
            {a.title}
          </h2>

          {(a.year || a.location) && (
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wider text-accent">
              {a.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden />
                  {a.location}
                </span>
              )}
              {a.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" aria-hidden />
                  {a.year}
                </span>
              )}
            </p>
          )}

          <p className={cn("mt-4 leading-relaxed text-muted-foreground text-pretty", wide ? "text-[15px] sm:text-base" : "flex-1 text-sm sm:text-[15px]")}>
            {a.summary}
          </p>

          <span className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary">
            {featured ? "Read the full documented case" : "Examine the documented evidence"}
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </span>
        </div>
      </SpotlightCard>
    </Link>
  );
}

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    where: { contentStatus: { notIn: ["DRAFT"] } },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
  });

  const spotlight = achievements[0]?.featured ? achievements[0] : undefined;
  const rest = spotlight ? achievements.slice(1) : achievements;

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

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        {achievements.length === 0 ? (
          <div className="py-20 text-center">
            <Award className="mx-auto mb-4 size-14 text-muted-foreground/30" />
            <p className="text-lg text-muted-foreground">No achievements published yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 sm:gap-10">
            {spotlight && (
              <Reveal variant="scale">
                <AchievementCard achievement={spotlight} layout="wide" featured />
              </Reveal>
            )}

            {rest.length > 0 && (
              <section aria-labelledby="more-achievements" className="flex flex-col gap-5">
                {spotlight && (
                  <h2 id="more-achievements" className="font-serif text-xl font-semibold text-foreground sm:text-2xl">
                    More documented work
                  </h2>
                )}
                {rest.length === 1 ? (
                  <Reveal variant="scale">
                    <AchievementCard achievement={rest[0]} layout="wide" />
                  </Reveal>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {rest.map((a, i) => (
                      <Reveal key={a.id} variant="scale" delay={Math.min(i, 5) * 80} className="h-full">
                        <AchievementCard achievement={a} layout="stacked" />
                      </Reveal>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
