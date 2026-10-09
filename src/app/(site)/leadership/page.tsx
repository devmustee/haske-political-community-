import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getImageById } from "@/lib/images/library";
import {
  Landmark,
  Users,
  Compass,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Handshake,
  Award,
  Vote,
  Camera,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Leadership & Public Service | Abdulrahman Bashir Haske",
  description:
    "Explore Abdulrahman Bashir Haske's vision for transformative public leadership in Adamawa State, grassroots listening tours across all 21 LGAs, and the APM 2027 governance ticket with Engr. Safriel Judson Glah.",
  openGraph: {
    title: "Leadership & Public Service | Abdulrahman Bashir Haske",
    description:
      "A covenant of competence, transparency, and grassroots empowerment for Adamawa State 2027.",
  },
};

const LEADERSHIP_TENETS = [
  {
    icon: ShieldCheck,
    title: "Fiscal Transparency & Zero-Waste Governance",
    description:
      "Applying boardroom fiduciary standards (IoD Nigeria) to public finances. Ensuring that state revenues and allocations directly finance critical infrastructure and human capital rather than disappearing into opaque bureaucratic overheads.",
  },
  {
    icon: Handshake,
    title: "Uncompromising Inclusivity & Inter-Ethnic Harmony",
    description:
      "Adamawa's rich ethnic and religious diversity is our greatest asset, not a source of division. Leadership that ensures equitable capital distribution, fair appointments, and religious freedom across Northern, Central, and Southern senatorial districts.",
  },
  {
    icon: Compass,
    title: "Data-Driven Policymaking",
    description:
      "Utilizing modern geographic information systems (GIS), demographic analytics, and technology platforms to locate public boreholes, deploy medical supplies, and optimize agrarian road networks where need is greatest.",
  },
  {
    icon: Users,
    title: "Civil Service Dignity & Prompt Welfare",
    description:
      "Civil servants are the indispensable machinery of government. Guaranteeing prompt, dignified wage payments, transparent promotions, digitized pension disbursements, and continuous capacity-building programs.",
  },
];

const TICKET_HIGHLIGHTS = [
  {
    role: "Gubernatorial Candidate",
    name: "Abdulrahman Bashir Haske",
    background: "Tech Entrepreneur, Industrial Agribusiness Pioneer, Philanthropist",
    focus: "Economic Diversification, Agro-Industrial Parks, Technology Infrastructure & Youth Livelihoods",
  },
  {
    role: "Deputy Gubernatorial Candidate",
    name: "Engr. Safriel Judson Glah",
    background: "Veteran Senior Engineer, Retired NNPC Executive, Public Administrator",
    focus: "Public Sector Engineering, Institutional Governance, Infrastructure Delivery & Resource Audits",
  },
];

export default function LeadershipPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Civic Stewardship & Governance"
        title="Leadership for a Modern Adamawa"
        description="Public service is a sacred trust. Abdulrahman Bashir Haske brings a proven record of private-sector job creation, boardroom integrity, and deep humanitarian engagement to build a prosperous, peaceful, and technologically advanced Adamawa State."
        primaryAction={{
          label: "Read 2027 Manifesto",
          href: "/manifesto",
        }}
        secondaryAction={{
          label: "Public Record",
          href: "/public-record",
        }}
      />

      {/* Leadership Credo Ribbon */}
      <section className="border-y border-border/80 bg-secondary/35 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 ring-1 ring-primary/20">
                <Vote className="size-6 text-accent" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent">
                  The Allied Peoples Movement (APM) Ticket
                </span>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Haske & Glah 2027: Competence, Integrity, Progress
                </h3>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Button asChild variant="gold-shimmer" size="sm" className="w-full sm:w-auto">
                <Link href="/manifesto">Download Full Covenant</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link href="/speak-to-haske">Share Your Priority</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Governance Covenant */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal variant="left">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  <Landmark className="size-3.5" />
                  A New Paradigm of Public Service
                </span>
                <h2 className="mt-4 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
                  Government as an Enabler of Enterprise and Human Potential
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    For decades, the people of Adamawa State have witnessed political promises that fail to translate into sustainable economic reality. The traditional approach to governance has treated government as a dispenser of patronage rather than an efficient, transparent engine of public wealth and security.
                  </p>
                  <p>
                    Abdulrahman Bashir Haske approaches public administration from a fundamentally different perspective: the discipline of enterprise, the precision of technology, and the compassion of genuine humanitarian service. Having built industrial manufacturing plants and created thousands of private-sector jobs, he understands how real economies function.
                  </p>
                  <p>
                    Together with running mate <strong className="text-foreground">Engr. Safriel Judson Glah</strong>, a distinguished former NNPC senior executive, the ticket bridges private enterprise innovation with seasoned public-sector institutional competence.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal variant="right">
                <SpotlightCard className="p-8 border-primary/20 bg-gradient-to-b from-card via-card/95 to-primary/5">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20">
                    <Award className="size-7" />
                  </div>
                  <blockquote className="font-serif text-lg italic text-foreground leading-relaxed">
                    “Our people do not seek miracles; they seek honest stewards who will not steal their resources, who will build roads that outlast seasons, who will pay workers on time, and who will equip their children to succeed in the modern world.”
                  </blockquote>
                  <div className="mt-6 pt-6 border-t border-border/80">
                    <p className="text-sm font-bold text-foreground">Abdulrahman Bashir Haske</p>
                    <p className="text-xs text-muted-foreground">APM Gubernatorial Candidate, Adamawa State 2027</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Tenets Grid */}
      <section className="border-t border-border/80 bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Core Principles
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              Four Pillars of Our Leadership Covenant
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Institutional standards that will govern every policy, budget, and executive appointment in Adamawa State.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {LEADERSHIP_TENETS.map((tenet, i) => {
              const Icon = tenet.icon;
              return (
                <Reveal key={tenet.title} variant="up" staggerIndex={i}>
                  <SpotlightCard className="h-full p-8">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5 ring-1 ring-primary/20">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                      {tenet.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {tenet.description}
                    </p>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Candidate Ticket Profile */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Executive Competence
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              The Haske-Glah Leadership Ticket
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Combining private sector dynamism with senior institutional public engineering.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {TICKET_HIGHLIGHTS.map((ticket, i) => (
              <Reveal key={ticket.name} variant="up" staggerIndex={i}>
                <div className="rounded-2xl border border-border/80 bg-card p-8 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-1">
                      {ticket.role}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                      {ticket.name}
                    </h3>
                    <div className="p-3 rounded-xl bg-secondary/50 text-xs font-semibold text-muted-foreground mb-4">
                      {ticket.background}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">Core Governance Portfolio:</strong>{" "}
                      {ticket.focus}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Verified Photographic Archive: Public Leadership & Grassroots Mandate ─── */}
      <section className="relative border-t border-border/80 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="section-eyebrow flex items-center gap-2">
                <Camera className="size-3.5 text-accent" />
                Verified Civic Record
              </span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Documentary Record: Grassroots Consultation & Public Mandate
              </h2>
              <p className="mt-2 text-lead text-muted-foreground max-w-2xl">
                Authentic photographic documentation of the 2026 declaration gathering at Mahmud Ribadu Square, statewide consultative town halls, and traditional council homage across Adamawa State.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" size="sm">
                <Link href="/gallery" className="gap-2">
                  View Full Gallery <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                id: "haske-declaration-podium-yola",
                title: "Addressing the People at Mahmud Ribadu Square",
                subtitle: "Gubernatorial Declaration, Yola",
                badge: "Public Declaration",
                detail: "Abdulrahman Bashir Haske addressing thousands of citizens, delegates, and supporters during his declaration rally at Mahmud Ribadu Square, Jimeta-Yola.",
              },
              {
                id: "haske-declaration-ribadu-square-crowd",
                title: "Massive Citizen Assembly at Ribadu Square",
                subtitle: "Grassroots Movement in Yola",
                badge: "Citizen Turnout",
                detail: "Panoramic view of thousands of Adamawa citizens gathering across ethnic, religious, and generational lines in support of leadership renewal.",
              },
              {
                id: "haske-grassroots-townhall-engagement",
                title: "Statewide 21-LGA Citizen Listening Sessions",
                subtitle: "Grassroots Consultation Tour",
                badge: "21-LGA Tour",
                detail: "Direct town hall dialogues with community elders, youths, women groups, and farmers, listening to localized infrastructure and welfare priorities.",
              },
              {
                id: "haske-traditional-council-homage",
                title: "Consulting Paramount Traditional Custodians",
                subtitle: "Emirate & Chiefdom Councils",
                badge: "Traditional Homage",
                detail: "Paying respects and receiving royal blessings from paramount traditional rulers across the northern, central, and southern senatorial zones.",
              },
            ].map((photo, i) => {
              const imgData = getImageById(photo.id);
              return (
                <Reveal key={photo.id} variant="scale" delay={i * 90}>
                  <SpotlightCard spotlightColor="gold" className="overflow-hidden h-full flex flex-col justify-between border-border/80 shadow-elevated">
                    <div>
                      {imgData ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted group">
                          <Image
                            src={imgData.src}
                            alt={imgData.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            placeholder={imgData.blurDataURL ? "blur" : undefined}
                            blurDataURL={imgData.blurDataURL}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-md px-3 py-1 text-xs sm:text-[11px] font-bold text-accent shadow-sm border border-accent/20">
                              <ShieldCheck className="size-3 text-accent" />
                              {photo.badge}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                              <MapPin className="size-3 text-accent" />
                              {imgData.location || "Adamawa State, Nigeria"}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      <div className="p-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent">
                          {photo.subtitle}
                        </span>
                        <h3 className="mt-1 font-serif text-xl font-bold text-foreground">
                          {photo.title}
                        </h3>
                        <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          {photo.detail}
                        </p>
                      </div>
                    </div>
                    {imgData && (
                      <div className="px-6 pb-6 pt-2 border-t border-border/60 flex items-center justify-between text-xs sm:text-[11px] text-muted-foreground">
                        <span>{imgData.credit}</span>
                        <Link href="/image-credits" className="text-accent hover:underline font-semibold">
                          Verify source &rarr;
                        </Link>
                      </div>
                    )}
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="border-t border-border/80 bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Read the 5-Pillar Haske 2027 Manifesto
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Review detailed policy plans for Agricultural Industrialization, Education, Healthcare, Security, and Civil Service Modernization.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/manifesto">
                Explore Full Manifesto
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/global-engagement">Global & African Engagement</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
