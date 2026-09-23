import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteSetting, type BiographySettings, type ExperienceSettings } from "@/lib/queries/settings";
import { PageHero } from "@/components/cms/page-hero";
import { Timeline } from "@/components/cms/timeline";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Biography",
  description: "The biography, education and career of Abdulrahman Bashir Haske.",
};
export const revalidate = 60;

export default async function BiographyPage() {
  const [bio, experience, timeline] = await Promise.all([
    getSiteSetting<BiographySettings>("biography"),
    getSiteSetting<ExperienceSettings>("experience"),
    prisma.timelineEvent.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <PageHero
        eyebrow="Learn"
        title="Biography"
        description="Who is Abdulrahman Bashir Haske? Publicly documented background, education and career."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="mb-3">
          <ContentStatusBadge status="DOCUMENTED" />
        </div>
        <div className="flex flex-col gap-4 text-[17px] leading-relaxed text-foreground/90">
          {bio?.paragraphs.map((p, i) => <p key={i}>{p}</p>) ?? <p>Biography content is being prepared.</p>}
        </div>
      </div>

      {experience && (
        <div className="border-t border-border bg-secondary/20">
          <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
            <h2 className="font-serif text-2xl font-semibold">{experience.heading}</h2>
            <div className="mt-6 flex flex-col gap-4">
              {experience.entries.map((e, i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <p className="font-semibold">{e.organization}</p>
                    <p className="text-sm text-primary">{e.role}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="font-serif text-2xl font-semibold">His Journey</h2>
          <p className="mt-2 text-muted-foreground">An interactive timeline from early life to the 2027 governorship candidacy.</p>
          <div className="mt-8">
            <Timeline items={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
