import type { Metadata } from "next";
import { getSiteSetting, type MissionSettings } from "@/lib/queries/settings";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = { title: "Mission", description: "The stated mission and development priorities of the Haske campaign." };
export const revalidate = 60;

export default async function MissionPage() {
  const mission = await getSiteSetting<MissionSettings>("mission");

  return (
    <div>
      <PageHero eyebrow="Understand" title={mission?.heading ?? "Mission"} />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <ContentStatusBadge status="PROPOSED" />
        <p className="mt-4 text-lg leading-relaxed">{mission?.statement}</p>
        {mission?.note && <p className="mt-3 text-sm italic text-muted-foreground">{mission.note}</p>}

        {mission?.priorities && (
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {mission.priorities.map((p) => (
              <div key={p} className="flex items-center gap-2.5 rounded-xl border border-border p-3.5">
                <CheckCircle className="size-4 shrink-0 text-primary" />
                <span className="text-sm font-medium">{p}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
