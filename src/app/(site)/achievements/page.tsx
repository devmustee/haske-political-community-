import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
          <div className="grid gap-6 sm:grid-cols-2">
            {achievements.map((a) => (
              <Link key={a.id} href={`/achievements/${a.slug}`}>
                <Card className="group h-full card-link overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity group-hover:opacity-100" />
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
