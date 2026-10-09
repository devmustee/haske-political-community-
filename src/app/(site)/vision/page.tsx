import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getSiteSetting, type VisionSettings } from "@/lib/queries/settings";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionDivider } from "@/components/ui/section-divider";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { Button } from "@/components/ui/button";
import { getImageById } from "@/lib/images/library";
import {
  Sparkles,
  Compass,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Wheat,
  Globe2,
  Users,
  Award,
  ArrowRight,
  BookOpen,
  MapPin,
  Layers,
  Zap,
  Landmark,
  Scale,
  Handshake,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Vision for Adamawa — A Prosperous, Inclusive & Secure State | Abdulrahman Bashir Haske",
  description:
    "The 20-year strategic horizon, senatorial district blueprints, and foundational transformation pillars of Abdulrahman Bashir Haske for Adamawa State.",
  openGraph: {
    title: "Vision for Adamawa — Abdulrahman Bashir Haske",
    description:
      "A generational covenant to build a self-reliant, inclusive, and industrially transformed Adamawa State.",
  },
};

export const revalidate = 60;

interface HorizonItem {
  phase: string;
  timeline: string;
  title: string;
  focus: string;
  deliverables: string[];
}

const STRATEGIC_HORIZONS: HorizonItem[] = [
  {
    phase: "Horizon 1",
    timeline: "Years 1–2 (2027–2029)",
    title: "Stabilization, Human Dignity & Rapid Relief",
    focus: "Restoring core public services, securing communal farmlands, and eliminating bureaucratic leakage.",
    deliverables: [
      "Immediate rehabilitation of 226 ward primary healthcare clinics with guaranteed medicines.",
      "Buffer stock fertilizer and certified seed procurement distributed directly to registered farmers.",
      "Civil service payroll dignity: guaranteed wage disbursement on the 24th of each month.",
      "Commissioning of 65+ solar clean water boreholes in acute water-stressed rural wards.",
      "Launch of the Adamawa Security Trust Fund supporting law enforcement logistics.",
    ],
  },
  {
    phase: "Horizon 2",
    timeline: "Years 3–4 (2029–2031)",
    title: "Industrial Acceleration & Economic Infrastructure",
    focus: "Scaling private-sector agro-processing clusters and modernizing regional transport links.",
    deliverables: [
      "Operationalization of 3 Senatorial Agro-Industrial Milling & Packaging Parks (Demsa, Ganye, Mubi).",
      "Paving 1,200km of agrarian feeder roads linking farmgate clusters to national distribution corridors.",
      "Decentralized solar mini-grids powering irrigation pumps, cold-storage, and cottage processing mills.",
      "Haske Innovation Hubs graduating 50,000 certified youth software engineers and vocational artisans.",
      "Digitization of state revenue systems to quadruple Internally Generated Revenue (IGR).",
    ],
  },
  {
    phase: "Horizon 3",
    timeline: "Generational (2031–2040+)",
    title: "Regional Gateway & Knowledge-Driven Self-Reliance",
    focus: "Establishing Adamawa as West and Central Africa's premier trans-border economic gateway.",
    deliverables: [
      "Multimodal Benue River and land logistics dry port optimizing AfCFTA cross-border commerce with Cameroon and Chad.",
      "Energy export capability from commercial solar farms and hydro-infrastructure.",
      "Premier agro-technological research universities attracting students and researchers across Africa.",
      "Full fiscal sovereignty where internally generated wealth finances world-class social development.",
    ],
  },
];

const SENATORIAL_BLUEPRINTS = [
  {
    district: "Northern Senatorial District",
    lgas: "Mubi North, Mubi South, Michika, Madagali, Maiha",
    title: "The Agro-Commerce & Cross-Border Gateway",
    lead: "Post-conflict industrial reconstruction, commercial border trade expansion, and high-altitude agricultural value chains.",
    icon: Globe2,
    highlights: [
      "Revitalization of the historic Mubi International Cattle and Grain Market into a modern digital logistics exchange.",
      "Cross-border export corridors connecting Adamawa farmers to the 28-million consumer market in Cameroon and Chad.",
      "Veterinary hospitals, feedlot parks, and mechanized dry-season farming along the seasonal riverbanks.",
    ],
  },
  {
    district: "Central Senatorial District",
    lgas: "Yola North, Yola South, Girei, Fufore, Song, Gombi, Hong",
    title: "The Knowledge, Technology & Administrative Metropolis",
    lead: "Urban infrastructure renewal, higher education incubation, software engineering, and river transport logistics.",
    icon: Building2,
    highlights: [
      "Greater Yola Metropolitan Masterplan: modern drainage, bus transit corridors, and green public parks.",
      "Haske Technology Campus partnering with American University of Nigeria (AUN) and Modibbo Adama University (MAU).",
      "Inland waterway terminal modernization along the River Benue for passenger and cargo transit.",
    ],
  },
  {
    district: "Southern Senatorial District",
    lgas: "Numan, Demsa, Mayo-Belwa, Ganye, Toungo, Guyuk, Lamurde, Shelleng, Jada",
    title: "The Food Basket, Agro-Hydro & Mineral Super-Hub",
    lead: "Massive scale industrial paddy cultivation, sugarcane complexes, solid mineral development, and ecotourism.",
    icon: Wheat,
    highlights: [
      "Expansion of the Demsa-Numan rice milling industrial corridor into a 500-ton/day integrated processing ecosystem.",
      "Ganye and Toungo yam, cocoa, and ginger export processing zones with cold-chain storage.",
      "Environmentally sustainable solid mineral exploration (limestone, gypsum, feldspar) for local manufacturing.",
    ],
  },
];

export default async function VisionPage() {
  const vision = await getSiteSetting<VisionSettings>("vision");
  const rallyImg = getImageById("politics-declaration-stage-dignitaries") ?? getImageById("haske-leadership-portrait");

  const coreStatement =
    vision?.statement ??
    "Building an Adamawa that does not merely manage poverty, but systematically engineers wealth; a state where geographical location on the Benue River valley becomes our greatest trade gateway to Central Africa, and where every child born in Michika, Toungo, Mayo-Belwa, or Fufore inherits a future of limitless dignity.";

  return (
    <div className="flex flex-col">
      {/* ─── Cinematic Vision Hero ─── */}
      <section className="relative overflow-hidden border-b border-border/80 bg-primary text-primary-foreground">
        {/* Animated Aurora Drift */}
        <div
          className="absolute inset-0 animate-aurora opacity-35"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.20 0.07 152), oklch(0.28 0.085 152), oklch(0.24 0.10 135), oklch(0.28 0.085 152))",
          }}
        />
        {/* Ceremonial Grid Overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Ambient Radiant Glow Orbs */}
        <div className="pointer-events-none absolute -left-32 top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-accent/20 blur-[140px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-[500px] w-[500px] rounded-full bg-primary-foreground/10 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32">
          {/* Official Seals */}
          <div className="flex items-center justify-center gap-4 mb-6 animate-slide-up">
            <Image
              src="/brand/adamawa-state-seal.png"
              alt="Adamawa State Seal"
              width={72}
              height={72}
              className="size-16 sm:size-20 rounded-full bg-white object-contain p-2 shadow-float ring-2 ring-accent/40"
              priority
            />
            <Image
              src="/brand/apm-logo-official.png"
              alt="Allied Peoples Movement"
              width={72}
              height={72}
              className="size-16 sm:size-20 rounded-full bg-white object-contain p-2 shadow-float ring-2 ring-accent/40"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent backdrop-blur-md mb-6 animate-slide-up animation-delay-100">
            <Compass className="size-3.5 text-accent" />
            <span>Generational Blueprint &middot; 2027–2035 Horizon</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-fluid-h1 font-bold leading-tight animate-slide-up animation-delay-200">
            A Vision for Adamawa: <br />
            <span className="text-gradient-gold-leaf">The Beacon of Northern Prosperity</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lead leading-relaxed text-primary-foreground/80 animate-slide-up animation-delay-300">
            A sovereign, self-reliant, and united state where agricultural wealth, industrial innovation, and ethical governance guarantee every citizen the dignity of shared progress.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 animate-slide-up animation-delay-400">
            <Button asChild size="lg" variant="gold-shimmer" className="shadow-glow-gold">
              <Link href="/manifesto">
                <BookOpen className="size-4" />
                Read 2027 Policy Manifesto
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/20">
              <Link href="/mission">
                <CheckCircle2 className="size-4" />
                View 7 Action Priorities
              </Link>
            </Button>
          </div>
        </div>

        <SectionDivider tone="accent" opacity={50} />
      </section>

      {/* ─── Vision Metrics Ribbon ─── */}
      <section className="relative z-10 -mt-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SpotlightCard
          spotlightColor="gold"
          className="border-border/80 shadow-elevated surface-glass-card rounded-3xl"
          contentClassName="p-4 sm:p-8"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
            <div className="text-center border-r border-border/60 last:border-r-0">
              <p className="font-serif text-2xl sm:text-4xl font-extrabold text-primary">
                <AnimatedCounter value={300} prefix="₦" suffix="B" />
              </p>
              <p className="mt-1 text-xs sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Target Agro-Economy
              </p>
            </div>
            <div className="text-center sm:border-r border-border/60">
              <p className="font-serif text-2xl sm:text-4xl font-extrabold text-accent">
                <AnimatedCounter value={1000000} suffix="+" />
              </p>
              <p className="mt-1 text-xs sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Livelihoods Catalyzed
              </p>
            </div>
            <div className="text-center border-r border-border/60 last:border-r-0">
              <p className="font-serif text-2xl sm:text-4xl font-extrabold text-primary">
                <AnimatedCounter value={3} />
              </p>
              <p className="mt-1 text-xs sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Agro-Industrial Hubs
              </p>
            </div>
            <div className="text-center">
              <p className="font-serif text-2xl sm:text-4xl font-extrabold text-accent">
                <AnimatedCounter value={21} />
              </p>
              <p className="mt-1 text-xs sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                United LGAs
              </p>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* ─── The Visionary Declaration Card ─── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal>
          <SpotlightCard
            spotlightColor="gold"
            className="p-8 sm:p-12 border-accent/40 shadow-elevated rounded-3xl bg-gradient-to-br from-card via-card to-accent/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                  <Sparkles className="size-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                    The Generational Covenant
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    The Haske Vision for Economic Transformation
                  </p>
                </div>
              </div>
              <ContentStatusBadge status="PROPOSED" />
            </div>

            <blockquote className="font-serif text-xl sm:text-3xl font-bold leading-relaxed text-foreground">
              &ldquo;{coreStatement}&rdquo;
            </blockquote>

            {vision?.note && (
              <p className="mt-6 border-l-2 border-accent pl-4 text-xs sm:text-sm italic text-muted-foreground leading-relaxed">
                {vision.note}
              </p>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-3 border-t border-border/70 pt-6">
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                <ShieldCheck className="size-5 text-emerald-600 mb-2" />
                <h4 className="text-xs font-bold text-foreground">Economic Sovereignty</h4>
                <p className="mt-1 text-xs sm:text-[11px] text-muted-foreground leading-relaxed">
                  Ending complete dependency on federal FAAC disbursements by building self-sustaining agrarian industry.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                <Handshake className="size-5 text-accent mb-2" />
                <h4 className="text-xs font-bold text-foreground">Social Inclusivity</h4>
                <p className="mt-1 text-xs sm:text-[11px] text-muted-foreground leading-relaxed">
                  Empowering all 80+ ethnic groups with equitable appointments, capital distribution, and religious peace.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                <Scale className="size-5 text-primary mb-2" />
                <h4 className="text-xs font-bold text-foreground">Institutional Integrity</h4>
                <p className="mt-1 text-xs sm:text-[11px] text-muted-foreground leading-relaxed">
                  Strict boardroom fiduciary governance guaranteeing that state budgets build public wealth.
                </p>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>
      </section>

      {/* ─── Section Divider ─── */}
      <SectionDivider tone="accent" opacity={30} />

      {/* ─── Three Strategic Horizons (2027–2040) ─── */}
      <section className="bg-secondary/35 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="max-w-3xl mb-14">
            <span className="section-eyebrow">Transformation Roadmap</span>
            <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
              The Three Strategic Horizons
            </h2>
            <p className="mt-3 text-lead text-muted-foreground">
              A phased, disciplined implementation sequence turning visionary ambitions into milestone-based reality.
            </p>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {STRATEGIC_HORIZONS.map((horizon, hIdx) => (
              <Reveal key={horizon.phase} delay={hIdx * 100}>
                <SpotlightCard
                  spotlightColor={hIdx === 1 ? "gold" : "primary"}
                  className="p-6 sm:p-8 h-full flex flex-col justify-between rounded-2xl border-border/80 shadow-soft"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-accent">
                        {horizon.phase}
                      </span>
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs sm:text-[10px] font-bold text-muted-foreground">
                        {horizon.timeline}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                      {horizon.title}
                    </h3>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                      {horizon.focus}
                    </p>

                    <div className="border-t border-border/60 pt-4 space-y-2">
                      <p className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
                        Key Deliverables:
                      </p>
                      <ul className="space-y-1.5">
                        {horizon.deliverables.map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-xs sm:text-[11px] text-muted-foreground leading-relaxed">
                            <span className="size-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    <span className="text-xs sm:text-[11px] font-bold text-primary inline-flex items-center gap-1">
                      <CheckCircle2 className="size-3.5 text-emerald-600" /> Milestone Verified Strategy
                    </span>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Senatorial District Strategic Blueprints ─── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="max-w-3xl mb-14">
          <span className="section-eyebrow">Geographic Development Plan</span>
          <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
            Senatorial District Transformation Blueprints
          </h2>
          <p className="mt-3 text-lead text-muted-foreground">
            Adamawa&apos;s geographical diversity demands tailored industrial and social strategies for the Northern, Central, and Southern senatorial zones.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3">
          {SENATORIAL_BLUEPRINTS.map((district, bIdx) => {
            const Icon = district.icon;
            return (
              <Reveal key={district.district} delay={bIdx * 100}>
                <SpotlightCard
                  spotlightColor={bIdx === 0 ? "gold" : bIdx === 1 ? "primary" : "gold"}
                  className="p-6 sm:p-8 h-full flex flex-col justify-between rounded-2xl border-border/80 shadow-soft"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 ring-1 ring-primary/20">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-[10px] font-bold uppercase tracking-widest text-accent">
                          {district.district}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-foreground">
                          {district.title}
                        </h3>
                      </div>
                    </div>

                    <div className="mb-4 rounded-xl bg-secondary/50 p-2.5 text-xs sm:text-[11px] font-medium text-muted-foreground border border-border/60">
                      <span className="font-bold text-foreground">LGAs: </span>
                      {district.lgas}
                    </div>

                    <p className="text-xs leading-relaxed text-muted-foreground mb-4">
                      {district.lead}
                    </p>

                    <div className="space-y-2 border-t border-border/60 pt-4">
                      <p className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-foreground">
                        Flagship Initiatives:
                      </p>
                      <ul className="space-y-1.5">
                        {district.highlights.map((h, hIdx) => (
                          <li key={hIdx} className="flex items-start gap-2 text-xs sm:text-[11px] text-muted-foreground leading-relaxed">
                            <span className="size-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <MapPin className="size-3.5 text-accent" /> Tailored Regional Catalyst
                    </span>
                  </div>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ─── Archival Documentary Showcase & Next Steps ─── */}
      <section className="border-t border-border/80 bg-secondary/30 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Visual Frame */}
            <div className="lg:col-span-5">
              <Reveal variant="scale">
                <div className="relative mx-auto max-w-md">
                  <div className="absolute -inset-4 -z-10 rounded-3xl bg-accent/25 blur-2xl animate-pulse-glow" />

                  {rallyImg ? (
                    <div className="overflow-hidden rounded-3xl border-2 border-accent/40 bg-card shadow-float ring-1 ring-white/10">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={rallyImg.src}
                          alt={rallyImg.alt}
                          fill
                          sizes="(min-width: 1024px) 450px, 100vw"
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <p className="text-xs font-bold">{rallyImg.caption}</p>
                          <p className="mt-1 text-xs sm:text-[11px] text-white/70">
                            {rallyImg.location ?? "Adamawa State"} &middot; {rallyImg.credit}
                          </p>
                        </div>
                      </div>
                      <div className="p-4 bg-card text-center">
                        <p className="text-xs font-bold text-foreground">
                          Grassroots Mandate Declaration &middot; Adamawa 2027
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Reveal>
            </div>

            {/* Narrative & Callouts */}
            <div className="lg:col-span-7">
              <Reveal>
                <span className="section-eyebrow">The Leadership Philosophy</span>
                <h3 className="mt-2 text-fluid-h2 font-bold text-foreground">
                  Leadership as a Sacred Contract with the Next Generation
                </h3>
                <p className="mt-4 text-lead text-muted-foreground leading-relaxed">
                  &ldquo;A government that thinks only of the next election leaves its children in poverty. We are crafting a leadership covenant for the next generation—building industries, investing in classrooms, expanding hospital beds, and cementing lasting communal peace.&rdquo;
                </p>
                <p className="mt-2 text-xs font-bold text-primary uppercase tracking-wider">
                  — Abdulrahman Bashir Haske
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <Button asChild size="lg" variant="gold-shimmer" className="shadow-glow-gold">
                    <Link href="/manifesto">
                      <BookOpen className="size-4" />
                      Read the 2027 Manifesto
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/speak-to-haske">
                      <Compass className="size-4" />
                      Submit Citizen Feedback
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="ghost">
                    <Link href="/timeline">
                      Career Timeline &rarr;
                    </Link>
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
