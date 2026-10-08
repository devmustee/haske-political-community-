import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSetting, type BiographySettings, type ExperienceSettings } from "@/lib/queries/settings";
import { PageHero } from "@/components/cms/page-hero";
import { Timeline } from "@/components/cms/timeline";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionDivider } from "@/components/ui/section-divider";
import { Briefcase, Award, GraduationCap, MapPin, ShieldCheck, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "Biography — Abdulrahman Bashir Haske",
  description: "The documented biography, education, business leadership, and public service record of Abdulrahman Bashir Haske.",
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
        eyebrow="Leadership Profile"
        title="Abdulrahman Bashir Haske"
        description="Publicly documented background, educational milestones, executive track record, and vision for the people of Adamawa State."
        watermark="Haske"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <ShieldCheck className="size-3.5 text-emerald-600" /> Documented & Verified Record
          </span>
        }
      />

      {/* ─── Editorial Magazine Layout ─── */}
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Sticky Left Dossier Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <Reveal variant="scale">
              <SpotlightCard
                spotlightColor="gold"
                className="overflow-hidden rounded-3xl border-border/80 p-6 sm:p-8 shadow-elevated"
              >
                <div className="relative mx-auto w-full max-w-xs">
                  {/* Glowing Portrait Frame */}
                  <div className="absolute -inset-2 rounded-2xl bg-accent/20 blur-xl animate-pulse-glow" />
                  <div className="relative overflow-hidden rounded-2xl border-2 border-accent/40 bg-card shadow-float">
                    <Image
                      src="/brand/portrait-haske-traditional.png"
                      alt="Abdulrahman Bashir Haske - Leadership Profile"
                      width={614}
                      height={466}
                      className="w-full object-cover transition-transform duration-500 hover:scale-105"
                      priority
                    />
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    Abdulrahman B. Haske
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mt-1">
                    APM Governorship Candidate 2027
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <MapPin className="size-3.5 text-primary" /> Adamawa State, Nigeria
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border/80 pt-5 text-center">
                  <div className="rounded-xl bg-secondary/50 p-3">
                    <span className="block font-serif text-lg font-bold text-primary">Adamawa</span>
                    <span className="text-[11px] font-medium text-muted-foreground">Home Heritage</span>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-3">
                    <span className="block font-serif text-lg font-bold text-accent">Private & Civic</span>
                    <span className="text-[11px] font-medium text-muted-foreground">Executive Experience</span>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          </div>

          {/* Right Reading Column */}
          <div className="lg:col-span-7">
            <Reveal variant="blur">
              <div className="mb-6 flex items-center gap-3">
                <ContentStatusBadge status="DOCUMENTED" />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Official Public Biography
                </span>
              </div>

              {/* Decorative Pull Quote */}
              <div className="relative my-6 rounded-2xl border-l-4 border-accent bg-accent/5 p-6 backdrop-blur-sm">
                <Quote className="absolute right-4 top-4 size-8 text-accent/20" />
                <p className="font-serif text-xl italic leading-relaxed text-foreground/90">
                  &ldquo;Leadership is not a title of privilege, but a sacred covenant of service to elevate our people, unlock our fertile lands, and secure the future of our children.&rdquo;
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-accent">— Abdulrahman Haske</p>
              </div>

              {/* Verified Documentary Archive Vignette */}
              <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <figure className="overflow-hidden rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-secondary/50">
                    <Image
                      src="/images/abdulrahman/portraits/abdulrahman-haske-formal-traditional.jpg"
                      alt="Abdulrahman Bashir Haske in traditional ceremonial attire"
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-2.5 text-xs">
                    <p className="font-semibold text-foreground">Formal Heritage Presentation</p>
                    <p className="text-[11px] text-muted-foreground">Photo: ElsieIReed &bull; CC BY 4.0</p>
                  </figcaption>
                </figure>

                <figure className="overflow-hidden rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-secondary/50">
                    <Image
                      src="/images/abdulrahman/politics/haske-declaration-podium-yola.jpeg"
                      alt="Abdulrahman Bashir Haske addressing citizens at Mahmud Ribadu Square, Yola"
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-2.5 text-xs">
                    <p className="font-semibold text-foreground">Ribadu Square Address (2026)</p>
                    <p className="text-[11px] text-muted-foreground">Photo: Premium Times</p>
                  </figcaption>
                </figure>
              </div>

              {/* Narrative Content */}
              <div className="mt-8 flex flex-col gap-6 text-[17px] leading-[1.85] text-foreground/90">
                {bio?.paragraphs.map((p, i) => (
                  <p key={i} className={i === 0 ? "text-lg font-normal leading-[1.8] text-foreground" : ""}>
                    {p}
                  </p>
                )) ?? <p>Biography content is being prepared.</p>}
              </div>
            </Reveal>

            {/* Custom Biography Deep-Dive Sections */}
            {bio?.sections && bio.sections.length > 0 && (
              <div className="mt-12 border-t border-border/80 pt-10">
                {bio.sectionsNote && (
                  <p className="mb-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {bio.sectionsNote}
                  </p>
                )}
                <div className="flex flex-col gap-5">
                  {bio.sections.map((s, i) => (
                    <Reveal key={s.title} delay={Math.min(i, 4) * 80}>
                      <SpotlightCard spotlightColor="primary" className="p-6">
                        <h4 className="font-serif text-xl font-bold text-foreground">{s.title}</h4>
                        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
                      </SpotlightCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Executive Experience & Service ─── */}
      {experience && (
        <section className="relative border-t border-border/80 bg-gradient-to-b from-secondary/40 via-background to-background py-20 sm:py-28">
          <SectionDivider tone="primary" opacity={20} position="absolute-top" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Reveal className="flex items-center gap-3.5 mb-10">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Briefcase className="size-6" />
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold sm:text-4xl">{experience.heading}</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Demonstrated operational leadership, entrepreneurship, and institutional building.
                </p>
              </div>
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2">
              {experience.entries.map((e, i) => (
                <Reveal key={i} delay={Math.min(i, 4) * 80}>
                  <SpotlightCard spotlightColor="gold" className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">
                          {e.role}
                        </span>
                        <Award className="size-4 text-accent" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mt-2">{e.organization}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{e.description}</p>
                    </div>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Journey Timeline ─── */}
      <section className="border-t border-border/80 py-20 sm:py-28 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <span className="section-eyebrow">Milestone Archive</span>
            <h2 className="mt-2 text-fluid-h2 font-bold">The Journey & Milestones</h2>
            <p className="mt-3 text-lead text-muted-foreground max-w-xl mx-auto">
              A chronological history of community interventions, professional leadership, and political public service.
            </p>
          </Reveal>
          <Timeline items={timeline} />
        </div>
      </section>
    </div>
  );
}
