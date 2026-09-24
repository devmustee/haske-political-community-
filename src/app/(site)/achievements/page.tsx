import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        {achievements.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No achievements published yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {achievements.map((a) => (
              <Link key={a.id} href={`/achievements/${a.slug}`}>
                <Card className="h-full card-link">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{CATEGORY_LABELS[a.category] ?? a.category}</Badge>
                      <ContentStatusBadge status={a.contentStatus} />
                    </div>
                    <h2 className="mt-3 font-serif text-lg font-semibold">{a.title}</h2>
                    {(a.year || a.location) && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {[a.year, a.location].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.summary}</p>
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
