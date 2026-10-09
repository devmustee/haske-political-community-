import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSetting, type BiographySettings, type MissionSettings, type VisionSettings } from "@/lib/queries/settings";
import { getFeedPosts } from "@/lib/queries/posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { PostCard } from "@/components/community/post-card";
import { Timeline } from "@/components/cms/timeline";
import { AgendaTabs } from "@/components/cms/agenda-tabs";
import { Reveal } from "@/components/motion/reveal";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { SectionDivider } from "@/components/ui/section-divider";
import { SectionHeading } from "@/components/ui/section-heading";
import { DotRing } from "@/components/ui/dot-ring";
import { formatDate } from "@/lib/utils";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Star,
  Users,
  BookOpen,
  Play,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Cpu,
  Building2,
  Wheat,
  Heart,
  GraduationCap,
  Trophy,
  Landmark,
  Users2,
  Globe2,
  Compass,
} from "lucide-react";

export const revalidate = 30;

export default async function HomePage() {
  const [bio, mission, vision, achievements, programs, pillars, upcomingEvents, media, timeline, feedPosts] = await Promise.all([
    getSiteSetting<BiographySettings>("biography"),
    getSiteSetting<MissionSettings>("mission"),
    getSiteSetting<VisionSettings>("vision"),
    prisma.achievement.findMany({ where: { featured: true, contentStatus: { notIn: ["DRAFT"] } }, take: 3, orderBy: { order: "asc" } }),
    prisma.program.findMany({ where: { contentStatus: { notIn: ["DRAFT"] } }, take: 4 }),
    prisma.policyPillar.findMany({ take: 7, orderBy: { order: "asc" } }),
    prisma.event.findMany({ where: { status: "UPCOMING" }, orderBy: { date: "asc" }, take: 3 }),
    prisma.mediaCenterItem.findMany({ where: { contentStatus: { notIn: ["DRAFT"] } }, orderBy: { date: "desc" }, take: 3 }),
    prisma.timelineEvent.findMany({ orderBy: { order: "asc" }, take: 4 }),
    getFeedPosts({ tab: "latest", take: 3 }),
  ]);

  return (
    <div>
      {/* ═══════════════════ CINEMATIC HERO ═══════════════════ */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* Animated Aurora Gradient */}
        <div
          className="absolute inset-0 animate-aurora opacity-35"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.20 0.07 152), oklch(0.28 0.085 152), oklch(0.23 0.10 135), oklch(0.28 0.085 152))",
          }}
        />

        {/* Ceremonial Grid & Radial Texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Radiant Ambient Light Orbs */}
        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-[680px] w-[680px] rounded-full bg-accent/20 blur-[140px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-primary-foreground/8 blur-[120px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 sm:px-6 sm:py-28 lg:grid-cols-[1.35fr_0.65fr] lg:py-32 lg:text-left">
          <div className="text-center lg:text-left">
            {/* APM & Candidate Official Insignia */}
            <div className="flex items-center justify-center gap-3 max-[359px]:gap-2 lg:justify-start animate-slide-up">
              <Image
                src="/brand/apm-logo-official.png"
                alt="Allied Peoples Movement"
                width={44}
                height={44}
                className="size-11 rounded-full bg-white object-contain p-0.5 shadow-elevated ring-2 ring-accent/40 max-[359px]:size-9"
              />
              {/* Stacks into two lines on phones so the title never breaks mid-phrase. */}
              <div className="inline-flex flex-col items-start gap-0.5 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-left text-xs font-semibold backdrop-blur-md max-[359px]:px-3 max-[359px]:text-[11px] ring-1 ring-accent/30 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-bold text-accent">APM</span>
                </span>
                <span className="whitespace-nowrap">Governorship Candidate &middot; Adamawa 2027</span>
              </div>
            </div>

            {/* Fluid Hero Name Headline */}
            <div className="mx-auto mt-6 max-w-2xl lg:mx-0 animate-slide-up animation-delay-100">
              <span className="block text-hero-display text-primary-foreground">Abdulrahman</span>
              <span className="block text-hero-display text-gradient-gold-leaf mt-1">Bashir Haske</span>
            </div>

            {/* Core Brand Message Badge & Lead Statement */}
            <div className="mx-auto mt-4 max-w-xl lg:mx-0 animate-slide-up animation-delay-150">
              <span className="inline-block whitespace-nowrap rounded-full bg-accent/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-accent ring-1 ring-accent/40 sm:px-3.5 sm:text-xs sm:tracking-[0.2em] max-[359px]:text-[10.5px] max-[359px]:tracking-[0.08em]">
                Enterprise &middot; Impact &middot; People &middot; Service
              </span>
              <p className="mt-3 text-lead font-semibold text-primary-foreground leading-snug">
                Building enterprises. Empowering people. Creating lasting impact.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
                An institutional digital portfolio documenting industrial agribusiness, technology innovation, polo sportsmanship, audited humanitarian relief, and citizen-centered governance for Adamawa State.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3.5 lg:justify-start animate-slide-up animation-delay-300">
              <Button asChild size="lg" variant="gold-shimmer" className="w-full shadow-glow-gold sm:w-auto">
                <Link href="/enterprise">
                  <Building2 className="size-4" />
                  Explore Enterprise
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md hover:bg-primary-foreground/20 hover:border-primary-foreground/60">
                <Link href="/foundation">
                  <Heart className="size-4" />
                  AB Haske Foundation
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="w-full text-primary-foreground hover:bg-primary-foreground/15 sm:w-auto">
                <Link href="/manifesto">
                  <BookOpen className="size-4" />
                  2027 Manifesto
                </Link>
              </Button>
            </div>
          </div>

          {/* Hero Portrait in Glass Aura Frame */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm animate-slide-up animation-delay-400">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-accent/25 blur-3xl animate-pulse-glow" />
            <div className="overflow-hidden rounded-3xl border-2 border-accent/40 bg-white shadow-float ring-1 ring-white/20 p-1">
              <Image
                src="/brand/portrait-haske-traditional.png"
                alt="Abdulrahman Bashir Haske - Governorship Candidate"
                width={614}
                height={466}
                className="w-full rounded-[22px] object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
            </div>
            {/* Floating Accolade Badge */}
            <div className="absolute -bottom-4 -left-3 rounded-2xl border border-accent/40 bg-primary/95 px-4 py-2.5 shadow-elevated backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Adamawa State</p>
              <p className="text-sm font-extrabold text-primary-foreground">2027 Mandate</p>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <SectionDivider tone="accent" opacity={50} />
      </section>

      {/* ═══════════════════ REAL-TIME CIVIC METRICS & MANDATE COMPASS ═══════════════════ */}
      <section className="relative z-10 -mt-10 mx-auto max-w-6xl px-4 sm:px-6">
        <SpotlightCard
          spotlightColor="gold"
          className="border-border/80 shadow-elevated surface-glass-card rounded-3xl"
          contentClassName="p-4 sm:p-8 lg:p-9"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left 4-Metric Dossier Grid (Columns 1-5) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-2.5 sm:gap-4">
              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3 sm:p-4 text-center transition-all duration-300 hover:border-primary/40 hover:bg-secondary/60">
                <div className="mx-auto flex size-7 sm:size-8 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1.5 sm:mb-2">
                  <MapPin className="size-3.5 sm:size-4" />
                </div>
                <p className="font-serif text-xl sm:text-3xl font-extrabold text-primary">
                  <AnimatedCounter value={21} />
                </p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Local Govts (LGAs)
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3 sm:p-4 text-center transition-all duration-300 hover:border-accent/40 hover:bg-secondary/60">
                <div className="mx-auto flex size-7 sm:size-8 items-center justify-center rounded-xl bg-accent/15 text-accent mb-1.5 sm:mb-2">
                  <Sparkles className="size-3.5 sm:size-4" />
                </div>
                <p className="font-serif text-xl sm:text-3xl font-extrabold text-accent">
                  <AnimatedCounter value={7} />
                </p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Strategic Pillars
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3 sm:p-4 text-center transition-all duration-300 hover:border-primary/40 hover:bg-secondary/60">
                <div className="mx-auto flex size-7 sm:size-8 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1.5 sm:mb-2">
                  <ShieldCheck className="size-3.5 sm:size-4 text-emerald-600" />
                </div>
                <p className="font-serif text-xl sm:text-3xl font-extrabold text-primary">
                  <AnimatedCounter value={100} suffix="%" />
                </p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Documented Record
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-secondary/40 p-3 sm:p-4 text-center transition-all duration-300 hover:border-accent/40 hover:bg-secondary/60">
                <div className="mx-auto flex size-7 sm:size-8 items-center justify-center rounded-xl bg-accent/15 text-accent mb-1.5 sm:mb-2">
                  <Landmark className="size-3.5 sm:size-4" />
                </div>
                <p className="font-serif text-xl sm:text-3xl font-extrabold text-accent">
                  <AnimatedCounter value={2027} />
                </p>
                <p className="mt-1 text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  Adamawa Mandate
                </p>
              </div>
            </div>

            {/* Right Panel: The Polished Space (Columns 6-12) */}
            <div className="lg:col-span-7 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border/80 pt-6 lg:pt-0 lg:pl-8">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                    <Compass className="size-3.5 text-primary" /> 2027 Strategic Blueprint
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                    <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    Verified Candidate Mandate
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                  Transformative Governance for Every Adamawa Citizen
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Abdulrahman Bashir Haske’s platform combines heavy agro-industrial processing, modern tech bootcamps, audited humanitarian relief, and civic inclusion across all 21 Local Government Areas.
                </p>

                {/* 3 Key Pillar Highlights */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/60 p-2.5 backdrop-blur-sm">
                    <Wheat className="size-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Agro-Processing</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">48-ton/day Demsa rice complex</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/60 p-2.5 backdrop-blur-sm">
                    <Cpu className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Tech & Youth</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">AUN digital literacy incubators</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-background/60 p-2.5 backdrop-blur-sm">
                    <Heart className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Relief & Grants</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">₦220M direct grants awarded</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-border/60">
                <Button asChild size="sm" variant="gold-shimmer" className="shadow-sm">
                  <Link href="/manifesto">
                    Explore the 2027 Agenda <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/community">
                    <Users className="size-3.5" />
                    Join Citizen Dialogue
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-foreground">
                  <Link href="/public-record">
                    View Documented Record &rarr;
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* ═══════════════════ THE 8-PILLAR INSTITUTIONAL SPECTRUM ═══════════════════ */}
      <section className="relative py-20 sm:py-24 border-b border-border/70 bg-secondary/25">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Comprehensive Leadership Profile
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              An 8-Pillar Spectrum of Impact
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Explore Abdulrahman Bashir Haske’s verifiable record across technology, industrial enterprise, humanitarian relief, sportsmanship, and democratic governance.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Cpu,
                title: "Technology",
                route: "/biography",
                tag: "B.Sc. Info Systems",
                desc: "American University of Nigeria foundation and digital literacy bootcamps.",
              },
              {
                icon: Building2,
                title: "Enterprise",
                route: "/enterprise",
                tag: "IoD Governance",
                desc: "Boardroom executive leadership and commercial job creation across Nigeria.",
              },
              {
                icon: Wheat,
                title: "Agriculture",
                route: "/agriculture",
                tag: "48 Tons/Day Mill",
                desc: "H&W Rice Company processing complex and 4,500+ smallholder outgrowers.",
              },
              {
                icon: Heart,
                title: "Philanthropy",
                route: "/foundation",
                tag: "₦220M & 80k Bags",
                desc: "State-wide humanitarian interventions across all 21 Adamawa LGAs.",
              },
              {
                icon: GraduationCap,
                title: "Youth & Education",
                route: "/youth-education",
                tag: "STEM & Classrooms",
                desc: "Subsidizing rural science educators and rehabilitating damaged schools.",
              },
              {
                icon: Trophy,
                title: "Sports & Polo",
                route: "/sports-polo",
                tag: "Team Patron",
                desc: "Distinguished equestrian career, sports diplomacy, and youth football leagues.",
              },
              {
                icon: Landmark,
                title: "Leadership",
                route: "/leadership",
                tag: "APM 2027",
                desc: "Gubernatorial covenant pairing private enterprise with public engineering.",
              },
              {
                icon: Users2,
                title: "Public Service",
                route: "/public-service",
                tag: "21-LGA Tour",
                desc: "Exhaustive grassroots town halls co-designing the citizen compact.",
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} variant="up" staggerIndex={idx}>
                  <Link href={pillar.route} className="block group h-full">
                    <SpotlightCard className="h-full p-5 flex flex-col justify-between hover:border-primary/50 transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Icon className="size-5" />
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                            {pillar.tag}
                          </span>
                        </div>
                        <h3 className="font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-bold text-primary">
                        <span>Explore Pillar</span>
                        <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                      </div>
                    </SpotlightCard>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ DOCUMENTARY PHOTO ARCHIVE SHOWCASE ═══════════════════ */}
      <section className="border-b border-border/80 bg-card py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent mb-2">
                <Sparkles className="size-3.5" />
                Verified Archival Records
              </div>
              <h2 className="font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
                Documentary Photography Archive
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Every photograph in this archive is sourced from verified institutional events, official enterprise operations, or accredited national press coverage.
              </p>
            </div>
            <Button asChild variant="gold-shimmer" size="sm" className="shadow-glow-gold shrink-0">
              <Link href="/gallery">
                Explore Full Gallery <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Agro-Industrial Milling Complex",
                location: "Demsa, Adamawa",
                date: "Operational Hub",
                category: "Agribusiness",
                image: "/images/abdulrahman/agriculture/hw-rice-mill-facility-demsa.jpg",
                credit: "H&W Rice Company Ltd",
                href: "/agriculture",
              },
              {
                title: "African Humanitarian Award",
                location: "Accra, Ghana",
                date: "April 2026",
                category: "International Honours",
                image: "/images/abdulrahman/awards/aha-ghana-haske-receiving-award.jpg",
                credit: "BusinessDay Nigeria",
                href: "/awards",
              },
              {
                title: "Ribadu Square Civic Assembly",
                location: "Yola, Adamawa",
                date: "April 2026",
                category: "Public Service",
                image: "/images/abdulrahman/politics/haske-declaration-podium-yola.jpeg",
                credit: "Premium Times",
                href: "/leadership",
              },
              {
                title: "Yola International Polo Tournament",
                location: "Lamido Musdafa Ground",
                date: "August 2026",
                category: "Sports Diplomacy",
                image: "/images/abdulrahman/polo/yola-polo-tournament-matchplay.webp",
                credit: "The Nation Newspaper",
                href: "/sports-polo",
              },
            ].map((item, idx) => (
              <Reveal key={item.title} variant="scale" staggerIndex={idx}>
                <Link href={item.href} className="group block h-full">
                  <SpotlightCard className="overflow-hidden p-0 h-full flex flex-col justify-between border-border/70 hover:border-accent/50 transition-all">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-secondary/50">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="border-white/30 bg-black/50 text-white backdrop-blur-md text-[10px]">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs">
                        <p className="font-mono text-[11px] opacity-80">{item.location} &bull; {item.date}</p>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h3 className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[11px] text-muted-foreground border-t border-border/50 pt-2 flex items-center justify-between">
                        <span>Photo: {item.credit}</span>
                        <ArrowRight className="size-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  </SpotlightCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ABOUT HASKE ═══════════════════ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <p className="watermark-text inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none">
          Haske
        </p>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <Reveal>
              <span className="section-eyebrow">Leadership Profile</span>
              <h2 className="mt-3 text-fluid-h2 font-bold tracking-tight text-foreground">
                Who is Abdulrahman Bashir Haske?
              </h2>
              <p className="mt-6 max-w-xl text-lead leading-relaxed text-muted-foreground">
                {bio?.paragraphs[0]}
              </p>
              <p className="mt-4 max-w-xl text-body text-muted-foreground">
                {bio?.paragraphs[1]}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Button asChild variant="default">
                  <Link href="/biography">
                    Read Full Biography
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/achievements">
                    Documented Achievements
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal variant="scale" delay={120}>
              <SpotlightCard spotlightColor="primary" className="p-8 shadow-elevated">
                <div className="flex items-center justify-between mb-4">
                  <ContentStatusBadge status="DOCUMENTED" />
                  <span className="text-xs font-mono font-semibold text-primary">AUN Alumnus</span>
                </div>
                <p className="text-body leading-relaxed text-foreground/80">
                  Accomplished entrepreneur, philanthropist and statesman from Adamawa State. Educated in Information Systems at the American University of Nigeria, Yola, with decades of private-sector executive governance.
                </p>
                <div className="mt-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-2xl bg-secondary/50 p-4">
                    <div className="relative mx-auto flex size-16 items-center justify-center">
                      <DotRing count={21} size={64} className="absolute inset-0" dotClassName="fill-primary/40" />
                      <p className="font-serif text-2xl font-bold text-primary">
                        <AnimatedCounter value={21} />
                      </p>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-muted-foreground">LGAs Statewide</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/50 p-4">
                    <div className="relative mx-auto flex size-16 items-center justify-center">
                      <DotRing count={7} size={64} className="absolute inset-0" dotClassName="fill-accent/50" />
                      <p className="font-serif text-2xl font-bold text-accent">
                        <AnimatedCounter value={7} />
                      </p>
                    </div>
                    <p className="mt-2 text-xs font-semibold text-muted-foreground">Policy Pillars</p>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════ HIS JOURNEY ═══════════════════ */}
      {timeline.length > 0 && (
        <section className="relative border-t border-border/80 bg-gradient-to-b from-secondary/30 via-background to-background py-20 sm:py-28">
          <SectionDivider tone="primary" opacity={20} position="absolute-top" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <Reveal className="text-center mb-12">
              <span className="section-eyebrow">Verified Timeline</span>
              <h2 className="mt-2 text-fluid-h2 font-bold">The Journey in Public Service</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
                Trace the key milestones from business enterprise to the 2027 gubernatorial candidacy.
              </p>
            </Reveal>
            <Timeline items={timeline} />
            <div className="mt-10 text-center">
              <Button asChild variant="outline">
                <Link href="/biography">
                  See the Complete Historical Timeline <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ ACHIEVEMENTS ═══════════════════ */}
      {achievements.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="section-eyebrow">Documented Action</span>
              <h2 className="mt-2 text-fluid-h2 font-bold">What Has Haske Actually Done?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Verified, source-attributed achievements distinct from future proposals.</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/achievements">
                View All Achievements <ChevronRight className="size-4" />
              </Link>
            </Button>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {achievements.map((a, i) => (
              <Reveal key={a.id} variant="scale" delay={i * 100}>
                <Link href={`/achievements/${a.slug}`}>
                  <SpotlightCard spotlightColor="primary" className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <ContentStatusBadge status={a.contentStatus} />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-foreground mt-2">{a.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">{a.summary}</p>
                    </div>
                    <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
                      Learn more <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </SpotlightCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════ EMPOWERMENT & PROGRAMS ═══════════════════ */}
      {programs.length > 0 && (
        <section className="relative border-t border-border/80 bg-gradient-to-b from-secondary/30 via-background to-background py-20 sm:py-28">
          <SectionDivider tone="accent" opacity={30} position="absolute-top" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <span className="section-eyebrow">Citizen Impact</span>
                <h2 className="mt-2 text-fluid-h2 font-bold">Empowerment Programs for Adamawa</h2>
                <p className="mt-1 text-sm text-muted-foreground">Browse active and upcoming initiatives designed for youths, women, and farmers.</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/programs">
                  Explore All Programs <ArrowRight className="size-4" />
                </Link>
              </Button>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              {programs.map((p, i) => (
                <Reveal key={p.id} variant="scale" delay={i * 100}>
                  <Link href={`/programs/${p.slug}`}>
                    <SpotlightCard spotlightColor="gold" className="p-7 h-full flex flex-col justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-3 font-semibold">
                          {p.category.replaceAll("_", " ")}
                        </Badge>
                        <h3 className="font-serif text-xl font-bold text-foreground mb-2">{p.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          Citizen empowerment initiative supported under the Haske Community platform.
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-accent">
                        View Program Details <ArrowRight className="size-3.5" />
                      </div>
                    </SpotlightCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ MISSION & VISION DUO ═══════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="text-center mb-12">
          <span className="section-eyebrow">Strategic Purpose</span>
          <h2 className="mt-2 text-fluid-h2 font-bold">Mission & Long-Term Vision</h2>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal variant="scale">
            <SpotlightCard spotlightColor="primary" className="p-8 sm:p-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                  <BookOpen className="size-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">{mission?.heading ?? "Our Mission"}</h3>
                <p className="mt-4 text-lead leading-relaxed text-muted-foreground">{mission?.statement}</p>
              </div>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/mission">Read Full Mission & Priorities <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal variant="scale" delay={120}>
            <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 sm:p-10 shadow-elevated h-full flex flex-col justify-between">
              <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-accent/20 blur-[80px]" />
              <div>
                <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/20 text-accent mb-6">
                  <Star className="size-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold">{vision?.heading ?? "Our Vision"}</h3>
                <p className="mt-4 text-lead leading-relaxed text-primary-foreground/80">{vision?.statement}</p>
              </div>
              <div className="mt-8">
                <Button asChild variant="gold-shimmer" className="shadow-glow-gold">
                  <Link href="/vision">Explore Full Vision <ArrowRight className="size-4" /></Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════ THE A.D.A.M.A.W.A AGENDA ═══════════════════ */}
      {pillars.length > 0 && (
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <div
            className="absolute inset-0 animate-aurora opacity-25"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.20 0.07 152), oklch(0.28 0.085 152), oklch(0.24 0.10 135), oklch(0.28 0.085 152))",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
          />
          <div className="pointer-events-none absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[120px] animate-pulse-glow" />

          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent backdrop-blur-md mb-6">
                The A.D.A.M.A.W.A First Agenda
              </div>
              <h2 className="text-hero-display text-primary-foreground">
                The <span className="text-gradient-gold">Agenda.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-lead leading-relaxed text-primary-foreground/75">
                Seven proposed governance priorities for Adamawa State, published pillar-by-pillar for citizen scrutiny and community refinement.
              </p>
            </Reveal>

            <Reveal delay={150} className="mt-14">
              <AgendaTabs pillars={pillars} />
            </Reveal>

            <div className="mt-10">
              <Button asChild variant="gold-shimmer" size="lg" className="shadow-glow-gold">
                <Link href="/manifesto">
                  Read Full Manifesto Document <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
          <SectionDivider tone="accent" opacity={40} />
        </section>
      )}

      {/* ═══════════════════ COMMUNITY LIVE PREVIEW ═══════════════════ */}
      <section className="relative py-24 sm:py-32 bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="text-center mb-10">
            <span className="section-eyebrow">The Citizen Agora</span>
            <h2 className="mt-2 text-fluid-h2 font-bold">What Do Citizens Think?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A live preview of open community dialogues, polls, and policy suggestions.
            </p>
          </Reveal>

          <Reveal delay={120} className="overflow-hidden rounded-3xl border border-border/80 shadow-elevated surface-glass-card">
            {feedPosts.length === 0 ? (
              <div className="p-14 text-center">
                <Users className="mx-auto size-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No posts yet — be the first to participate.</p>
              </div>
            ) : (
              feedPosts.map((post) => <PostCard key={post.id} post={post} variant="row" />)
            )}
          </Reveal>

          <div className="mt-8 text-center">
            <Button asChild size="lg" variant="default" className="shadow-elevated px-8">
              <Link href="/community">
                <Users className="size-4" />
                Join the Community Conversation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ UPCOMING EVENTS ═══════════════════ */}
      {upcomingEvents.length > 0 && (
        <section className="relative border-t border-border/80 bg-gradient-to-b from-secondary/30 via-background to-background py-20 sm:py-28">
          <SectionDivider tone="primary" opacity={20} position="absolute-top" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
              <div>
                <span className="section-eyebrow">Town Halls & Rallies</span>
                <h2 className="mt-2 text-fluid-h2 font-bold">Upcoming Public Events</h2>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/events">All Events <ArrowRight className="size-4" /></Link>
              </Button>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-3">
              {upcomingEvents.map((e, i) => (
                <Reveal key={e.id} variant="scale" delay={i * 100}>
                  <Link href={`/events/${e.slug}`}>
                    <SpotlightCard spotlightColor="primary" className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-foreground mb-3">{e.title}</h3>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <p className="flex items-center gap-2">
                            <Calendar className="size-4 text-primary" /> {formatDate(e.date)}
                          </p>
                          <p className="flex items-center gap-2">
                            <MapPin className="size-4 text-primary" /> {e.venue}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary">
                        Event Details <ArrowRight className="size-3.5" />
                      </div>
                    </SpotlightCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ MEDIA ═══════════════════ */}
      {media.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="section-eyebrow">Press & Broadcasts</span>
              <h2 className="mt-2 text-fluid-h2 font-bold">Latest Media Coverage</h2>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/media">Media Center <ArrowRight className="size-4" /></Link>
            </Button>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {media.map((m, i) => (
              <Reveal key={m.id} variant="scale" delay={i * 100}>
                <Link href={`/media/${m.slug}`}>
                  <SpotlightCard spotlightColor="gold" className="overflow-hidden h-full flex flex-col justify-between">
                    {m.featuredImage && (
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.featuredImage} alt="" className="size-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/25">
                          <Play className="size-10 text-white opacity-0 transition-opacity hover:opacity-100 drop-shadow-lg" />
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-2 font-semibold">
                        {m.category.replaceAll("_", " ")}
                      </Badge>
                      <h3 className="font-serif text-base font-bold text-foreground mt-1 line-clamp-2">{m.title}</h3>
                    </div>
                  </SpotlightCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════ GRAND JOIN CTA ═══════════════════ */}
      <section className="relative overflow-hidden border-t border-border/80 bg-primary text-primary-foreground">
        <div className="pattern-diamonds absolute inset-0 text-accent opacity-[0.06]" />
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-72 w-[700px] rounded-full bg-accent/15 blur-[120px]" />
        
        <Reveal as="div" variant="scale" className="relative mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-accent/20 text-accent mb-6 shadow-glow-gold">
            <Sparkles className="size-8" />
          </div>
          <h2 className="text-fluid-h2 font-bold text-primary-foreground">
            Join the Haske Community
          </h2>
          <p className="mt-4 text-lead text-primary-foreground/80 leading-relaxed">
            Connect with fellow citizens from all 21 LGAs, debate policies, vote in live polls, and help shape Adamawa&apos;s transformative future.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" variant="gold-shimmer" className="px-8 shadow-glow-gold">
              <Link href="/register">Create Your Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/community">Browse Discussions as Guest</Link>
            </Button>
          </div>
        </Reveal>
        <SectionDivider tone="accent" opacity={40} />
      </section>
    </div>
  );
}
