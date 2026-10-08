import type { Metadata } from "next";
import { getSiteSetting, type MissionSettings } from "@/lib/queries/settings";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/motion/reveal";
import { CheckCircle2, Target, Compass, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Mission & Development Priorities — Haske Community",
  description: "The core mission statement and actionable development priorities of Abdulrahman Bashir Haske for Adamawa State.",
};
export const revalidate = 60;

export default async function MissionPage() {
  const mission = await getSiteSetting<MissionSettings>("mission");

  return (
    <div>
      <PageHero
        eyebrow="Mission & Purpose"
        title={mission?.heading ?? "Our Mission"}
        description="A decisive commitment to institutional excellence, human capital development, and widespread economic opportunity in Adamawa State."
        watermark="Mission"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <Compass className="size-3.5 text-accent" /> Strategic Mandate
          </span>
        }
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Main Mission Statement Card */}
        <Reveal variant="scale">
          <SpotlightCard
            spotlightColor="gold"
            className="p-8 sm:p-12 shadow-elevated border-accent/30"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target className="size-6 text-primary" />
              </div>
              <ContentStatusBadge status="PROPOSED" />
            </div>

            <h2 className="font-serif text-2xl font-bold sm:text-3xl lg:text-4xl leading-snug text-foreground">
              {mission?.statement}
            </h2>

            {mission?.note && (
              <p className="mt-6 border-l-2 border-accent pl-4 text-sm italic text-muted-foreground leading-relaxed">
                {mission.note}
              </p>
            )}
          </SpotlightCard>
        </Reveal>

        {/* Development Priorities Grid */}
        {mission?.priorities && (
          <div className="mt-16">
            <Reveal className="mb-8">
              <span className="section-eyebrow">Action Commitments</span>
              <h3 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Priority Development Sectors
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Targeted focus areas designed for tangible, measurable progress in our communities.
              </p>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {mission.priorities.map((p, i) => (
                <Reveal key={p} delay={Math.min(i, 6) * 60}>
                  <SpotlightCard
                    spotlightColor={i % 2 === 0 ? "gold" : "primary"}
                    className="p-5 flex items-center gap-4 h-full"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CheckCircle2 className="size-5 text-accent" />
                    </div>
                    <span className="text-sm font-semibold text-foreground leading-snug">
                      {p}
                    </span>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
