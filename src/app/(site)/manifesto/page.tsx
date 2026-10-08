import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { AgendaTabs } from "@/components/cms/agenda-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionDivider } from "@/components/ui/section-divider";
import { formatDate } from "@/lib/utils";
import { FileText, Archive, Download, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import type { PolicyPillar } from "@prisma/client";

export const metadata: Metadata = {
  title: "Our Agenda — The A.D.A.M.A.W.A Policy Platform",
  description: "The official policy platform, development pillars, and governance commitments of Abdulrahman Bashir Haske for Adamawa State.",
};
export const revalidate = 60;

export default async function ManifestoPage() {
  const [current, historical, allPillars] = await Promise.all([
    prisma.manifesto.findFirst({
      where: { isCurrent: true },
      include: { pillars: { include: { pillar: true }, orderBy: { order: "asc" } }, documents: true },
    }),
    prisma.manifesto.findMany({ where: { isCurrent: false }, orderBy: { publicationDate: "desc" } }),
    prisma.policyPillar.findMany({ orderBy: { order: "asc" } }),
  ]);

  const agendaPillars: PolicyPillar[] = current ? current.pillars.map((p) => p.pillar) : allPillars;

  return (
    <div>
      <PageHero
        eyebrow="Policy Platform"
        title="The A.D.A.M.A.W.A Agenda"
        description="A comprehensive, measurable blueprint for security, shared prosperity, and rapid socioeconomic modernization across all 21 Local Government Areas."
        watermark="Agenda"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <CheckCircle2 className="size-3.5 text-emerald-600" /> APM 2027 Policy Framework
          </span>
        }
      />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          {current ? (
            <ManifestoIntro manifesto={current} />
          ) : (
            <SpotlightCard spotlightColor="gold" className="p-10 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                <FileText className="size-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold">Policy Framework in Review</h3>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                The updated Allied Peoples Movement manifesto for the 2027 gubernatorial mandate is being ratified.
                Explore the active policy pillars below and archived editions further down.
              </p>
            </SpotlightCard>
          )}
        </Reveal>
      </div>

      {agendaPillars.length > 0 && (
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          {/* Animated Atmospheric Background */}
          <div
            className="absolute inset-0 animate-aurora opacity-25"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.07 152), oklch(0.28 0.085 152), oklch(0.24 0.10 135), oklch(0.28 0.085 152))",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[130px] animate-pulse-glow" />

          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent backdrop-blur-md mb-6">
                <span>Core Framework</span> &middot; 7 Strategic Pillars
              </div>
              <h2 className="text-hero-display text-primary-foreground">
                Policy <span className="text-gradient-gold">Pillars.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lead leading-relaxed text-primary-foreground/80">
                A structured, sector-by-sector roadmap addressing the foundational needs of Adamawa State.
                Select each pillar below to examine objectives and proposed legislative actions.
              </p>
            </Reveal>

            <Reveal delay={150} className="mt-14">
              <AgendaTabs pillars={agendaPillars} />
            </Reveal>
          </div>
          <SectionDivider tone="accent" opacity={40} />
        </section>
      )}

      {historical.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="flex items-center gap-3.5 mb-8">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Archive className="size-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold sm:text-3xl">Historical Agenda Archive</h2>
              <p className="text-sm text-muted-foreground">
                Documented policy iterations preserved permanently for public accountability.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {historical.map((m, i) => (
              <Reveal key={m.id} delay={Math.min(i, 4) * 80}>
                <Card interactive className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                        v{m.version}
                      </span>
                      <ContentStatusBadge status="ARCHIVED" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-foreground mb-2">{m.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Published on {formatDate(m.publicationDate)}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <BookOpen className="size-3.5" /> Archived Reference Record
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ManifestoIntro({
  manifesto,
}: {
  manifesto: {
    title: string;
    version: string;
    publicationDate: Date;
    lastUpdatedDate: Date;
    introduction: string;
    pdfUrl: string | null;
    documents: { id: string; url: string; title: string }[];
  };
}) {
  return (
    <SpotlightCard spotlightColor="gold" className="p-8 sm:p-12 shadow-elevated">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6 mb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
            Official Version {manifesto.version}
          </span>
          <span>&middot;</span>
          <span>Published {formatDate(manifesto.publicationDate)}</span>
          <span>&middot;</span>
          <span>Last Updated {formatDate(manifesto.lastUpdatedDate)}</span>
        </div>

        {manifesto.pdfUrl && (
          <a
            href={manifesto.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent-foreground transition-all hover:bg-accent hover:text-accent-foreground shadow-soft"
          >
            <Download className="size-3.5 text-accent" /> Download Full Document (PDF)
          </a>
        )}
      </div>

      <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {manifesto.title}
      </h2>

      <p className="mt-5 text-lead leading-relaxed text-foreground/85">
        {manifesto.introduction}
      </p>

      {manifesto.documents.length > 0 && (
        <div className="mt-8 border-t border-border/80 pt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Attached Policy Documents
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {manifesto.documents.map((d) => (
              <a
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl border border-border bg-secondary/40 p-3.5 text-sm font-semibold transition-all hover:border-primary/40 hover:bg-card hover:shadow-soft"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="size-4 text-primary" />
                  <span className="truncate">{d.title}</span>
                </div>
                <ExternalLink className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
