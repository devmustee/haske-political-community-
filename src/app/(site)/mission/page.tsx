import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSiteSetting, type MissionSettings } from "@/lib/queries/settings";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionDivider } from "@/components/ui/section-divider";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { Button } from "@/components/ui/button";
import { getImageById } from "@/lib/images/library";
import {
  Target,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Wheat,
  Building2,
  Heart,
  Sparkles,
  Scale,
  TrendingUp,
  Handshake,
  ArrowRight,
  BookOpen,
  MapPin,
  Users,
  Award,
  Zap,
  Activity,
  FileCheck2,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mission & Strategic Priorities — Abdulrahman Bashir Haske",
  description:
    "The institutional mission statement, governance commitments, and 7 strategic development priorities of Abdulrahman Bashir Haske for the transformation of Adamawa State.",
  openGraph: {
    title: "Mission & Development Priorities — Abdulrahman Bashir Haske",
    description:
      "A decisive commitment to institutional excellence, agricultural industrialization, human capital development, and fiduciary governance across all 21 LGAs.",
  },
};

export const revalidate = 60;

interface PriorityDetail {
  id: string;
  number: string;
  title: string;
  category: string;
  icon: typeof Wheat;
  lead: string;
  targets: string[];
  metrics: string;
}

const ACTION_PRIORITIES: PriorityDetail[] = [
  {
    id: "agriculture",
    number: "01",
    title: "Agro-Industrialization & Food Sovereignty",
    category: "Economic Foundation",
    icon: Wheat,
    lead: "Scaling industrial milling infrastructure and farmgate off-take guarantees across agrarian belts to turn Adamawa into West Africa's leading grain and livestock super-hub.",
    targets: [
      "Establishment of three modern agro-industrial milling and storage clusters in Demsa, Ganye, and Mubi.",
      "Direct fertilizer and certified high-yield seed subsidies eliminating exploitative middlemen.",
      "Guaranteed minimum off-take pricing and solar-powered cold chain storage for 150,000+ smallholder farmers.",
    ],
    metrics: "₦300B Target Export-Grade Agro Output",
  },
  {
    id: "infrastructure",
    number: "02",
    title: "All-Weather Connectivity & Regional Infrastructure",
    category: "Physical Capital",
    icon: Building2,
    lead: "Modernizing rural-urban transit corridors, farm-to-market arterial roads, and clean energy grids so no community is isolated from commerce.",
    targets: [
      "Paving 1,200km of critical rural agrarian feeder roads linking farmgates to national highways.",
      "Deployment of decentralized solar mini-grids powering agro-processing plants and cottage enterprises.",
      "Modernization of urban drainage, flood mitigation defenses along the River Benue basin, and clean municipal water systems.",
    ],
    metrics: "1,200km Farm-to-Market Feeder Roads",
  },
  {
    id: "healthcare",
    number: "03",
    title: "Universal Primary Health & Social Protection",
    category: "Human Capital",
    icon: Heart,
    lead: "Revitalizing grassroots healthcare delivery so that every family in all 226 wards has access to dignified, affordable, 24/7 basic emergency care.",
    targets: [
      "Full rehabilitation, solar electrification, and medicine stock guarantees for all 226 primary healthcare centers.",
      "Adamawa Maternal & Infant Care Shield: 100% subsidized antenatal care and safe delivery kits.",
      "Solar-powered clean drinking water boreholes deployed to every ward facing waterborne disease vulnerability.",
    ],
    metrics: "226 Fully Revitalized Ward Health Centers",
  },
  {
    id: "youth-education",
    number: "04",
    title: "Meaningful Youth Inclusion, STEM & Technical Skills",
    category: "Future Workforce",
    icon: Sparkles,
    lead: "Equipping Adamawa's vibrant youth demographic with digital software engineering, precision industrial crafts, and competitive entrepreneurial capital.",
    targets: [
      "Haske Innovation & Technology Hubs in Yola, Mubi, and Numan offering world-class coding and vocational certification.",
      "₦5 Billion Youth Enterprise Seed Fund providing non-collateralized revolving credit for young founders.",
      "Re-equipment of technical colleges and teacher professional development incentives across all 21 LGAs.",
    ],
    metrics: "100,000 Certified Youth by 2030",
  },
  {
    id: "governance",
    number: "05",
    title: "Fiduciary Governance, Transparency & Civil Service Dignity",
    category: "Institutional Integrity",
    icon: Scale,
    lead: "Applying Institute of Directors (IoD) boardroom fiduciary standards to public finances, eliminating leakages, and honoring civil servants.",
    targets: [
      "100% open contracting and digitized public procurement portal accessible to all citizens.",
      "Prompt, dignified wage payments on the 24th of every month, indexed promotions, and digitized pension payouts.",
      "Independent state auditor office empowerment and zero tolerance for opaque public expenditures.",
    ],
    metrics: "100% Public Contracting Auditability",
  },
  {
    id: "wealth-creation",
    number: "06",
    title: "Wealth Creation, Market Women & Cooperative Capital",
    category: "Grassroots Economy",
    icon: TrendingUp,
    lead: "Stimulating indigenous micro-enterprises, trade unions, and women-led cooperative societies through direct capitalization.",
    targets: [
      "Zero-interest micro-finance credit lines for 75,000 market women and artisanal cooperative societies.",
      "AfCFTA cross-border commerce facilitation corridors linking Adamawa traders to neighboring Cameroon and Chad.",
      "Harmonization and reduction of regressive informal levies to protect small traders from extortion.",
    ],
    metrics: "75,000+ Cooperative Micro-Businesses Funded",
  },
  {
    id: "security",
    number: "07",
    title: "Community Peace Architecture & Integrated Security",
    category: "Peace & Stability",
    icon: ShieldCheck,
    lead: "Securing farmlands, towns, and borderlines through technology-enabled intelligence, logistics backing, and deep traditional council mediation.",
    targets: [
      "Establishment of the Adamawa Security Trust Fund providing tactical logistics and communication gear to security formations.",
      "Traditional ruler and inter-faith peace councils with statutory mediation authority for farmer-herder conflict resolution.",
      "Trained, vetted community vigilante support units equipped with radio communications and medical insurance.",
    ],
    metrics: "21 LGAs Integrated Security Response",
  },
];

const GUIDING_CREDOS = [
  {
    icon: FileCheck2,
    title: "Private-Sector Rigor",
    description: "Every public naira must yield measurable economic value. We replace bureaucratic excuses with corporate key performance indicators (KPIs) and milestone delivery schedules.",
  },
  {
    icon: Users,
    title: "Grassroots-First Equity",
    description: "State capital must not evaporate in the capital city. Resource allocation follows audited deprivation metrics across all 21 local government councils without political favoritism.",
  },
  {
    icon: Handshake,
    title: "Unbreakable Social Covenant",
    description: "Adamawa's multi-ethnic and inter-religious heritage is our supreme strength. We govern with absolute neutrality, justice, and respect for every citizen's heritage.",
  },
];

export default async function MissionPage() {
  const mission = await getSiteSetting<MissionSettings>("mission");
  const documentaryImg = getImageById("leadership-grassroots-consultation") ?? getImageById("haske-leadership-portrait");

  const coreStatement =
    mission?.statement ??
    "To mobilize ethical leadership, private-sector industrial capacity, and disciplined institutional governance to build a secure, prosperous, and self-reliant Adamawa State where every youth, farmer, entrepreneur, and family has the dignity of opportunity and the assurance of peace.";

  return (
    <div className="flex flex-col">
      {/* ─── Hero Section ─── */}
      <PageHero
        eyebrow="Mission & Strategic Purpose"
        title="Transforming Adamawa's Great Potential into Measurable Prosperity"
        description="A decisive commitment to institutional excellence, agricultural industrialization, human capital development, and transparent public stewardship across all 21 Local Government Areas."
        watermark="Mission"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Compass className="size-3.5 text-accent" /> Strategic Mandate &middot; APM 2027
          </span>
        }
        primaryAction={{
          label: "Explore 2027 Manifesto",
          href: "/manifesto",
        }}
        secondaryAction={{
          label: "View Leadership Covenant",
          href: "/leadership",
        }}
      />

      {/* ─── Mission Civic Metrics Ribbon ─── */}
      <section className="relative z-10 -mt-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SpotlightCard
          spotlightColor="gold"
          className="border-border/80 shadow-elevated surface-glass-card rounded-3xl"
          contentClassName="p-4 sm:p-8"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
            <div className="text-center border-r border-border/60 last:border-r-0">
              <p className="font-serif text-2xl sm:text-4xl font-extrabold text-primary">
                <AnimatedCounter value={21} />
              </p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                LGAs Prioritized
              </p>
            </div>
            <div className="text-center sm:border-r border-border/60">
              <p className="font-serif text-2xl sm:text-4xl font-extrabold text-accent">
                <AnimatedCounter value={7} />
              </p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Action Pillars
              </p>
            </div>
            <div className="text-center border-r border-border/60 last:border-r-0">
              <p className="font-serif text-2xl sm:text-4xl font-extrabold text-primary">
                <AnimatedCounter value={226} />
              </p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Wards in Scope
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl sm:text-4xl font-extrabold text-accent">
                100%
              </p>
              <p className="mt-1 text-[11px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Audited Fiduciary
              </p>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* ─── Core Mission Statement & Governance Credo ─── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="section-eyebrow">The Foundational Covenant</span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Our Solemn Mission to the People of Adamawa State
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <SpotlightCard
                spotlightColor="gold"
                className="mt-6 p-6 sm:p-8 border-accent/40 shadow-soft bg-gradient-to-br from-card via-card to-accent/5"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Target className="size-5 text-accent" />
                  </div>
                  <ContentStatusBadge status="PROPOSED" />
                </div>

                <blockquote className="font-serif text-xl sm:text-2xl font-bold leading-relaxed text-foreground">
                  &ldquo;{coreStatement}&rdquo;
                </blockquote>

                {mission?.note && (
                  <p className="mt-4 border-l-2 border-accent pl-3 text-xs italic text-muted-foreground leading-relaxed">
                    {mission.note}
                  </p>
                )}

                <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <span className="font-semibold text-primary">Abdulrahman Bashir Haske</span>
                  <span>&middot;</span>
                  <span>Gubernatorial Candidate, Allied Peoples Movement (APM)</span>
                </div>
              </SpotlightCard>
            </Reveal>

            {/* Guiding Credos */}
            <div className="mt-8 space-y-4">
              {GUIDING_CREDOS.map((credo, idx) => {
                const Icon = credo.icon;
                return (
                  <Reveal key={credo.title} delay={idx * 80}>
                    <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-soft">
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 ring-1 ring-primary/20">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{credo.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          {credo.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Right Column: Documentary Imagery & Seals */}
          <div className="lg:col-span-5">
            <Reveal variant="scale">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-accent/20 blur-2xl animate-pulse-glow" />

                {documentaryImg ? (
                  <div className="overflow-hidden rounded-3xl border-2 border-accent/40 bg-card shadow-float ring-1 ring-white/10">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={documentaryImg.src}
                        alt={documentaryImg.alt}
                        fill
                        sizes="(min-width: 1024px) 450px, 100vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-xs font-bold">{documentaryImg.caption}</p>
                        <p className="mt-1 text-[11px] text-white/70">
                          {documentaryImg.location ?? "Adamawa State"} &middot; {documentaryImg.credit}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 bg-card">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-primary inline-flex items-center gap-1.5">
                          <CheckCircle2 className="size-4 text-emerald-600" /> Verified Archival Record
                        </span>
                        <Link href="/gallery" className="text-accent hover:underline font-semibold">
                          View Gallery &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <SpotlightCard className="p-8 text-center border-accent/30">
                    <Award className="mx-auto size-12 text-accent mb-3" />
                    <h3 className="font-serif text-xl font-bold">The Haske Civic Covenant</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                      Rigorous private-sector capacity channeled toward sustainable, community-first governance in Adamawa State.
                    </p>
                  </SpotlightCard>
                )}

                {/* State Seal Accolade Badge */}
                <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-border/80 bg-secondary/60 p-3 backdrop-blur-md">
                  <Image
                    src="/brand/adamawa-state-seal.png"
                    alt="Adamawa State Seal"
                    width={36}
                    height={36}
                    className="size-9 rounded-full bg-white object-contain p-0.5 shadow-sm"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-foreground">Adamawa State 2027</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Allied Peoples Movement Mandate
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Section Divider ─── */}
      <SectionDivider tone="accent" opacity={30} />

      {/* ─── The 7 Action Priorities Grid ─── */}
      <section className="bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="max-w-3xl mb-14">
            <span className="section-eyebrow">The A.D.A.M.A.W.A Engine</span>
            <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
              Seven Action Priorities for Comprehensive Renewal
            </h2>
            <p className="mt-3 text-lead text-muted-foreground">
              Every priority is engineered with clear operational objectives, transparent execution schedules, and accountable impact metrics.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ACTION_PRIORITIES.map((priority, index) => {
              const Icon = priority.icon;
              return (
                <Reveal key={priority.id} delay={index * 60}>
                  <SpotlightCard
                    spotlightColor={index % 2 === 0 ? "gold" : "primary"}
                    className="p-6 sm:p-7 h-full flex flex-col justify-between rounded-2xl border-border/80 shadow-soft"
                  >
                    <div>
                      {/* Priority Header */}
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <span className="font-mono text-xs font-extrabold text-accent">
                          {priority.number}
                        </span>
                        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {priority.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 ring-1 ring-primary/20">
                          <Icon className="size-5" />
                        </div>
                        <h3 className="font-serif text-lg font-bold text-foreground leading-snug">
                          {priority.title}
                        </h3>
                      </div>

                      <p className="text-xs leading-relaxed text-muted-foreground mb-4">
                        {priority.lead}
                      </p>

                      {/* Action Targets */}
                      <div className="space-y-2 border-t border-border/60 pt-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                          Core Commitments:
                        </p>
                        <ul className="space-y-1.5">
                          {priority.targets.map((tgt, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed">
                              <span className="size-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                              <span>{tgt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Metric Target Badge */}
                    <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-2.5 text-center">
                      <span className="text-[11px] font-bold text-primary">
                        {priority.metrics}
                      </span>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 100-Day Delivery Protocol & Accountability ─── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SpotlightCard
          spotlightColor="gold"
          className="p-8 sm:p-12 border-primary/30 rounded-3xl bg-gradient-to-br from-card via-card to-primary/5"
        >
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary mb-4">
                <Activity className="size-3.5 text-primary" /> Delivery Framework
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                The 100-Day Acceleration & Transparency Protocol
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                A political mission without an operational delivery mechanism is merely rhetoric. Under the Haske-Glah administration, the first 100 days establish the digital foundation for four years of verified transformation:
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3.5">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Open Budget Dashboard</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Real-time citizen tracking of state revenue allocations and project disbursements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3.5">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Civil Service Audit & Prompt Payroll</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Elimination of ghost workers, harmonization of salaries, and digitized pension systems.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3.5">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Fertilizer Buffer Stocks</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Immediate procurement and distribution of subsidized farm inputs ahead of planting season.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3.5">
                  <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-foreground">Bi-Annual Citizen Town Halls</h5>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Direct executive question-and-answer accountability sessions broadcast live across all 21 LGAs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Button asChild size="lg" variant="gold-shimmer" className="w-full shadow-glow-gold">
                <Link href="/manifesto">
                  <BookOpen className="size-4" />
                  Read Full 2027 Manifesto
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/speak-to-haske">
                  <Compass className="size-4" />
                  Speak to Haske Portal
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="w-full">
                <Link href="/vision">
                  Explore 20-Year Vision &rarr;
                </Link>
              </Button>
            </div>
          </div>
        </SpotlightCard>
      </section>
    </div>
  );
}
