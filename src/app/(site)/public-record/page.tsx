import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";

export const metadata: Metadata = { title: "Public Record", description: "Transparency archive of statements, documents and published commitments." };
export const revalidate = 60;

const TYPE_LABELS: Record<string, string> = {
  OFFICIAL_STATEMENT: "Official Statement",
  MANIFESTO_VERSION: "Manifesto Version",
  POLICY_DOCUMENT: "Policy Document",
  PROGRAM_REPORT: "Program Report",
  PROJECT_UPDATE: "Project Update",
  EVENT_RECORD: "Event Record",
  PUBLISHED_COMMITMENT: "Published Commitment",
  PRESS_RELEASE: "Press Release",
};

export default async function PublicRecordPage() {
  const items = await prisma.publicRecordItem.findMany({ orderBy: { publishedDate: "desc" } });

  return (
    <div>
      <PageHero
        eyebrow="Verify"
        title="Public Record"
        description="A transparency archive. Old information is never silently replaced — every item shows its publication and update history."
        watermark="Record"
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        {items.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No public record items published yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i, 5) * 80}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{TYPE_LABELS[item.type] ?? item.type}</Badge>
                      {item.version && <Badge variant="outline">v{item.version}</Badge>}
                    </div>
                    <h2 className="mt-2 font-serif text-lg font-semibold">{item.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Published {formatDate(item.publishedDate)} &middot; Updated {formatDate(item.updatedDate)}
                      {item.source ? ` · Source: ${item.source}` : ""}
                    </p>
                    <p className="mt-3 text-[15px] text-foreground/90">{item.content}</p>
                    {item.documentUrl && (
                      <a href={item.documentUrl} className="mt-3 flex w-fit items-center gap-1.5 text-sm text-primary hover:underline">
                        <FileText className="size-4" /> View document
                      </a>
                    )}
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
