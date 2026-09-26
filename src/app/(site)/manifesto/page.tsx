import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { AgendaTabs } from "@/components/cms/agenda-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { SectionDivider } from "@/components/ui/section-divider";
import { formatDate } from "@/lib/utils";
import { FileText, Archive } from "lucide-react";
import type { PolicyPillar } from "@prisma/client";

export const metadata: Metadata = { title: "Our Agenda", description: "The policy agenda and manifesto of the Haske campaign." };
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
        eyebrow="Understand"
        title="Our Agenda"
        description="The policy platform Haske is proposing for Adamawa State."
        watermark="Agenda"
      />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          {current ? (
            <ManifestoIntro manifesto={current} />
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-3 p-10 text-center text-muted-foreground">
                <FileText className="size-10 text-muted-foreground/30" />
                <p>
                  A current manifesto for the Allied Peoples Movement candidacy has not yet been published. Check back soon, or
                  see the pillars below and the historical agenda further down.
                </p>
              </CardContent>
            </Card>
          )}
        </Reveal>
      </div>

      {agendaPillars.length > 0 && (
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div
            className="absolute inset-0 animate-gradient opacity-20"
            style={{
              background: "linear-gradient(135deg, oklch(0.20 0.06 155), oklch(0.30 0.08 155), oklch(0.25 0.10 130), oklch(0.30 0.08 155))",
              backgroundSize: "400% 400%",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <Reveal>
              <p className="eyebrow-bar border-accent text-accent">The A.D.A.M.A.W.A First Agenda</p>
              <h2 className="mt-5 text-mega">
                Policy <span className="text-gradient-gold">Pillars.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-primary-foreground/70">
                Category framework the campaign has indicated it will address — full policy detail, published pillar by
                pillar.
              </p>
            </Reveal>
            <Reveal delay={150} className="mt-12">
              <AgendaTabs pillars={agendaPillars} />
            </Reveal>
          </div>
          <SectionDivider tone="accent" opacity={40} />
        </section>
      )}

      {historical.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Archive className="size-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold sm:text-2xl">Historical agenda versions</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Publicly announced agenda material retained for transparency.</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {historical.map((m, i) => (
              <Reveal key={m.id} delay={Math.min(i, 5) * 80}>
                <Card className="group hover:shadow-elevated transition-all duration-300">
                  <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div>
                      <p className="text-lg font-medium group-hover:text-primary transition-colors">{m.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Version {m.version} &middot; Published {formatDate(m.publicationDate)}
                      </p>
                    </div>
                    <ContentStatusBadge status="ARCHIVED" />
                  </CardContent>
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
    <div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Version {manifesto.version}</span>
        <span>&middot;</span>
        <span>Published {formatDate(manifesto.publicationDate)}</span>
        <span>&middot;</span>
        <span>Last updated {formatDate(manifesto.lastUpdatedDate)}</span>
      </div>
      <h2 className="mt-4 font-serif text-2xl font-semibold sm:text-3xl">{manifesto.title}</h2>
      <p className="mt-5 text-lg leading-relaxed">{manifesto.introduction}</p>

      {manifesto.documents.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          {manifesto.documents.map((d) => (
            <a
              key={d.id}
              href={d.url}
              className="group flex w-fit items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-primary shadow-soft transition-all hover:shadow-elevated hover:-translate-y-0.5"
            >
              <FileText className="size-4" /> {d.title} (PDF)
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
