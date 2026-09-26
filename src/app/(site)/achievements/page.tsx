import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight, Award } from "lucide-react";

export const metadata: Metadata = { title: "Achievements", description: "Documented achievements of Abdulrahman Bashir Haske." };
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

  // Only spotlight the first item when it's genuinely marked featured —
  // never fabricate a "Featured" label for whatever happens to sort first.
  const isSpotlight = achievements[0]?.featured === true;
  const spotlight = isSpotlight ? achievements[0] : undefined;
  const rest = isSpotlight ? achievements.slice(1) : achievements;

  return (
    <div>
      <PageHero
        eyebrow="Verify"
        title="Achievements"
        description="What has Abdulrahman Haske actually done? Documented, source-attributed achievements — distinct from proposed plans."
        watermark="Record"
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {achievements.length === 0 ? (
          <div className="py-20 text-center">
            <Award className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">No achievements published yet.</p>
          </div>
        ) : (
          <>
            {spotlight && (
              <Reveal variant="scale" className="mb-10">
                <Link href={`/achievements/${spotlight.slug}`}>
                  <Card className="group overflow-hidden card-link lg:grid lg:grid-cols-2">
                    {spotlight.images[0] ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-muted lg:aspect-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={spotlight.images[0].url}
                          alt={spotlight.images[0].caption ?? ""}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="hidden bg-gradient-to-br from-secondary/50 to-secondary/20 lg:block" />
                    )}
                    <CardContent className="flex flex-col justify-center p-8">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="gold">Featured</Badge>
                        <Badge variant="secondary">{CATEGORY_LABELS[spotlight.category] ?? spotlight.category}</Badge>
                        <ContentStatusBadge status={spotlight.contentStatus} />
                      </div>
                      <h2 className="mt-4 font-serif text-2xl font-semibold group-hover:text-primary transition-colors">{spotlight.title}</h2>
                      {(spotlight.year || spotlight.location) && (
                        <p className="mt-1.5 text-sm text-primary/70 font-medium">
                          {[spotlight.year, spotlight.location].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{spotlight.summary}</p>
                      <span className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        View details <ArrowRight className="size-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2">
                {rest.map((a, i) => (
                  <Reveal key={a.id} variant="scale" delay={Math.min(i, 5) * 80}>
                    <Link href={`/achievements/${a.slug}`}>
                      <Card className="group h-full card-link overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                        {a.images[0] && (
                          <div className="relative aspect-video w-full overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={a.images[0].url}
                              alt={a.images[0].caption ?? ""}
                              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <CardContent className="flex h-full flex-col p-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary">{CATEGORY_LABELS[a.category] ?? a.category}</Badge>
                            <ContentStatusBadge status={a.contentStatus} />
                          </div>
                          <h2 className="mt-4 font-serif text-lg font-semibold group-hover:text-primary transition-colors">{a.title}</h2>
                          {(a.year || a.location) && (
                            <p className="mt-1.5 text-sm text-primary/70 font-medium">
                              {[a.year, a.location].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
                          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            View details <ArrowRight className="size-3.5" />
                          </span>
                        </CardContent>
                      </Card>
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
