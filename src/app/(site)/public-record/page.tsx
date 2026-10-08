import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { formatDate } from "@/lib/utils";
import { FileText, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Public Record & Transparency Archive — Haske Community",
  description: "A permanent transparency archive of official statements, policy documents, and published commitments with cryptographic audit trails.",
};
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
        eyebrow="Immutable Record"
        title="Public Record & Transparency Archive"
        description="A permanent record of public commitments and statements. Information is never silently removed or altered — all updates are versioned and timestamped."
        watermark="Record"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5 text-emerald-600" /> Version-Audited Archive
          </span>
        }
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        {items.length === 0 ? (
          <SpotlightCard spotlightColor="gold" className="p-12 text-center border-dashed">
            <ShieldCheck className="mx-auto size-12 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No public record entries archived yet.</p>
          </SpotlightCard>
        ) : (
          <div className="flex flex-col gap-5">
            {items.map((item, i) => (
              <Reveal key={item.id} delay={Math.min(i, 5) * 80}>
                <SpotlightCard
                  spotlightColor={i % 2 === 0 ? "gold" : "primary"}
                  className="p-6 sm:p-7 shadow-ambient"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="secondary" className="font-semibold">{TYPE_LABELS[item.type] ?? item.type}</Badge>
                    {item.version && <Badge variant="outline" className="font-mono text-xs">v{item.version}</Badge>}
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">{item.title}</h2>
                  <p className="mt-1.5 text-xs text-muted-foreground font-medium">
                    Published {formatDate(item.publishedDate)} &middot; Updated {formatDate(item.updatedDate)}
                    {item.source ? ` · Source: ${item.source}` : ""}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-foreground/85 whitespace-pre-wrap">{item.content}</p>
                  {item.documentUrl && (
                    <a
                      href={item.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline underline-offset-4"
                    >
                      <FileText className="size-4" /> View Primary Document Source <ExternalLink className="size-3" />
                    </a>
                  )}
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
