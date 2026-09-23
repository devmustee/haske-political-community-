import type { Metadata } from "next";
import { getSiteSetting, type VisionSettings } from "@/lib/queries/settings";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Vision", description: "The stated vision of the Haske campaign for Adamawa State." };
export const revalidate = 60;

export default async function VisionPage() {
  const vision = await getSiteSetting<VisionSettings>("vision");

  return (
    <div>
      <div className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/70">Our Vision</p>
          <h1 className="mx-auto mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight sm:text-5xl">
            {vision?.statement}
          </h1>
          {vision?.note && <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">{vision.note}</p>}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mb-6">
          <ContentStatusBadge status="PROPOSED" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {vision?.themes.map((t) => (
            <Card key={t.title}>
              <CardContent className="p-6">
                <h2 className="font-serif text-xl font-semibold text-primary">{t.title}</h2>
                <p className="mt-2 text-muted-foreground">{t.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
