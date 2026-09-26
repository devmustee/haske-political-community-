import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSetting, type BiographySettings, type ExperienceSettings } from "@/lib/queries/settings";
import { PageHero } from "@/components/cms/page-hero";
import { Timeline } from "@/components/cms/timeline";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { SectionDivider } from "@/components/ui/section-divider";
import { Briefcase } from "lucide-react";

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
        watermark="Haske"
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="float-right ml-8 mb-6 w-44 shrink-0 sm:w-56">
          <div className="overflow-hidden rounded-2xl border border-border shadow-elevated">
            <Image
              src="/brand/portrait.png"
              alt="Abdulrahman Bashir Haske"
              width={614}
              height={466}
              className="w-full"
            />
          </div>
        </div>
        <Reveal>
          <div className="mb-4">
            <ContentStatusBadge status="DOCUMENTED" />
          </div>
          <div className="flex flex-col gap-5 text-[17px] leading-[1.8] text-foreground/90">
            {bio?.paragraphs.map((p, i) => <p key={i}>{p}</p>) ?? <p>Biography content is being prepared.</p>}
          </div>
        </Reveal>
      </div>

      {experience && (
        <div className="relative border-t border-border bg-gradient-to-b from-secondary/30 to-background">
          <SectionDivider tone="primary" opacity={15} position="absolute-top" />
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
            <Reveal className="flex items-center gap-3 mb-8">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Briefcase className="size-5" />
              </div>
              <h2 className="font-serif text-2xl font-semibold sm:text-3xl">{experience.heading}</h2>
            </Reveal>
            <div className="flex flex-col gap-4">
              {experience.entries.map((e, i) => (
                <Reveal key={i} delay={Math.min(i, 5) * 80}>
                  <Card className="group overflow-hidden hover:shadow-elevated transition-all duration-300">
                    <CardContent className="p-6">
                      <p className="text-lg font-semibold group-hover:text-primary transition-colors">{e.organization}</p>
                      <p className="mt-1 text-sm font-medium text-primary">{e.role}</p>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{e.description}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <Reveal>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">His Journey</h2>
            <p className="mt-3 text-lg text-muted-foreground">An interactive timeline from early life to the 2027 governorship candidacy.</p>
          </Reveal>
          <div className="mt-10">
            <Timeline items={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
