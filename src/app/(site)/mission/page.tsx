import type { Metadata } from "next";
import { getSiteSetting, type MissionSettings } from "@/lib/queries/settings";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { CheckCircle, Target } from "lucide-react";

export const metadata: Metadata = { title: "Mission", description: "The stated mission and development priorities of the Haske campaign." };
export const revalidate = 60;

export default async function MissionPage() {
  const mission = await getSiteSetting<MissionSettings>("mission");

  return (
    <div>
      <PageHero eyebrow="Understand" title={mission?.heading ?? "Mission"} watermark="Mission" />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Target className="size-5" />
          </div>
          <ContentStatusBadge status="PROPOSED" />
        </div>
        <p className="text-xl leading-relaxed">{mission?.statement}</p>
        {mission?.note && <p className="mt-4 text-sm italic text-muted-foreground">{mission.note}</p>}

        {mission?.priorities && (
          <div className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-6">Development Priorities</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {mission.priorities.map((p, i) => (
                <div
                  key={p}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5 hover:border-primary/20"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <CheckCircle className="size-4" />
                  </div>
                  <span className="text-sm font-medium">{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
