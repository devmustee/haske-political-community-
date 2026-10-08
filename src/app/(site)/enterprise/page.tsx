import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { AnimatedCounter } from "@/components/motion/animated-counter";
import { SectionDivider } from "@/components/ui/section-divider";
import { getImageById } from "@/lib/images/library";
import {
  Building2,
  TrendingUp,
  Briefcase,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Factory,
  Globe2,
  CheckCircle2,
  Wheat,
  Camera,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Enterprise & Business Career — Abdulrahman Bashir Haske",
  description:
    "Explore the diversified corporate portfolio, technology ventures, and industrial projects built by Abdulrahman Bashir Haske.",
};

const VENTURES = [
  {
    title: "Agribusiness & Agro-Processing",
    category: "Industrial Manufacturing",
    description:
      "Spearheaded industrial agro-processing in Northeast Nigeria, establishing integrated milling infrastructure, expanding smallholder farmer outgrower schemes, and strengthening food security value chains.",
    highlight: "48-Ton/Day Milling Capacity",
    icon: Wheat,
    link: "/agriculture",
    badge: "Flagship Agribusiness",
  },
  {
    title: "Energy & Oilfield Services",
    category: "Energy Sector",
    description:
      "Pioneered indigenous technical capacity in Northern Nigeria's oilfield services and supply logistics, delivering mission-critical engineering solutions and supporting national energy infrastructure.",
    highlight: "Indigenous Technical Capacity",
    icon: Factory,
    badge: "Energy Infrastructure",
  },
  {
    title: "Information Technology & Systems",
    category: "Digital Transformation",
    description:
      "Grounded in Information Systems training at the American University of Nigeria, led investments in enterprise software solutions, digital connectivity systems, and technical infrastructure.",
    highlight: "Systems Architecture",
    icon: Cpu,
    badge: "Technology",
  },
  {
    title: "Civil Construction & Commercial Real Estate",
    category: "Infrastructure",
    description:
      "Delivered commercial and civil infrastructure projects designed for enduring community resilience, high engineering standards, and local supply chain job creation.",
    highlight: "Capital Infrastructure",
    icon: Building2,
    badge: "Construction",
  },
];

const PRINCIPLES = [
  {
    title: "Doing Good While Doing Business",
    description:
      "Enterprise is never solely about profit. Every commercial venture is engineered to generate local employment, develop domestic talent, and solve real societal bottlenecks.",
  },
  {
    title: "Corporate Governance & Ethical Standards",
    description:
      "As a committed member of the Institute of Directors (IoD) Nigeria, corporate transparency, statutory compliance, and fiduciary responsibility are central pillars of executive leadership.",
  },
  {
    title: "Strategic Knowledge & Global Rigor",
    description:
      "Executive formation refined through postgraduate studies in Business Strategy at Manchester Business School and Lagos Business School, applying global management science to African markets.",
  },
  {
    title: "Local Value Addition & Job Multiplication",
    description:
      "Replacing raw export extraction with domestic processing, creating an ecosystem where one primary enterprise fuels dozens of auxiliary suppliers and service providers.",
  },
];

export default async function EnterprisePage() {
  return (
    <div>
      <PageHero
        eyebrow="Business & Enterprise"
        title="Building Enterprises. Creating Value."
        description="A proven track record of institutional building across energy, agriculture, technology, and infrastructure. Grounded in corporate governance and economic transformation."
        watermark="Enterprise"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <Briefcase className="size-3.5 text-accent" /> Institutional Executive
          </span>
        }
      />

      {/* ─── Metric Ribbon ─── */}
      <section className="relative z-10 -mt-8 mx-auto max-w-5xl px-4 sm:px-6">
        <SpotlightCard
          spotlightColor="gold"
          className="grid grid-cols-2 gap-4 sm:grid-cols-4 p-6 sm:p-8 border-border/80 shadow-elevated surface-glass-card"
        >
          <div className="text-center border-r border-border/60 last:border-r-0">
            <p className="font-serif text-3xl sm:text-4xl font-extrabold text-primary">
              <AnimatedCounter value={15} suffix="+" />
            </p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Years in Enterprise
            </p>
          </div>
          <div className="text-center sm:border-r border-border/60">
            <p className="font-serif text-3xl sm:text-4xl font-extrabold text-accent">
              <AnimatedCounter value={4} />
            </p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Core Industries
            </p>
          </div>
          <div className="text-center border-r border-border/60 last:border-r-0">
            <p className="font-serif text-3xl sm:text-4xl font-extrabold text-primary">
              <AnimatedCounter value={1000} suffix="s" />
            </p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Jobs Created
            </p>
          </div>
          <div className="text-center">
            <p className="font-serif text-3xl sm:text-4xl font-extrabold text-accent">IoD</p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Governance Certified
            </p>
          </div>
        </SpotlightCard>
      </section>

      {/* ─── Executive Narrative ─── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="section-eyebrow">Executive Background</span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Entrepreneurial Grit Meets Strategic Institutional Rigor
              </h2>
              <p className="mt-6 text-lead leading-relaxed text-muted-foreground">
                Abdulrahman Bashir Haske began his entrepreneurial journey with a singular vision: to prove that world-class, multi-sector corporate enterprises can be built, scaled, and sustained from Northern Nigeria.
              </p>
              <p className="mt-4 text-body leading-relaxed text-muted-foreground">
                Starting from his roots in Yola, Adamawa State, and equipped with a degree in Information Systems from the American University of Nigeria, he methodically diversified into energy logistics, industrial agro-processing, technology architecture, and construction.
              </p>
              <p className="mt-4 text-body leading-relaxed text-muted-foreground">
                His leadership is distinguished by rigorous corporate discipline, honed through postgraduate studies in Business Strategy at Manchester Business School and executive programs at Lagos Business School. As a member of the Institute of Directors (IoD) Nigeria, he has consistently championed ethical corporate governance as the true bedrock of African prosperity.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild variant="gold-shimmer" className="shadow-glow-gold">
                  <Link href="/agriculture">
                    Explore Agribusiness Case Study <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/biography">Full Biography & Education</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal variant="scale">
              <SpotlightCard spotlightColor="gold" className="p-8 shadow-elevated border-accent/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <ShieldCheck className="size-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold">Institute of Directors</h3>
                    <p className="text-xs text-muted-foreground">IoD Nigeria Corporate Member</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-foreground/85 border-t border-border/80 pt-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Postgraduate Certification in Business Strategy &bull; Manchester Business School (UK)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Executive Leadership Programs &bull; Lagos Business School (Pan-Atlantic University)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Information Systems & Business &bull; American University of Nigeria, Yola</span>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-secondary/60 p-4 text-xs italic text-muted-foreground border border-border/60">
                  &ldquo;If we can build and scale multi-billion-dollar commercial enterprises that solve difficult technical challenges, we have the capacity and discipline to engineer lasting public transformation.&rdquo;
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Core Enterprise Sectors ─── */}
      <section className="border-t border-border/80 bg-gradient-to-b from-secondary/30 via-background to-background py-20 sm:py-28">
        <SectionDivider tone="primary" opacity={20} position="absolute-top" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal className="text-center mb-16">
            <span className="section-eyebrow">Diversified Portfolio</span>
            <h2 className="mt-2 text-fluid-h2 font-bold">Core Commercial Ventures</h2>
            <p className="mt-2 text-lead text-muted-foreground max-w-xl mx-auto">
              Strategic investments designed for long-term value creation, industrial capacity, and supply chain empowerment.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {VENTURES.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} variant="scale" delay={Math.min(i, 4) * 80}>
                  <SpotlightCard
                    spotlightColor={i % 2 === 0 ? "gold" : "primary"}
                    className="p-8 h-full flex flex-col justify-between shadow-elevated"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent-foreground uppercase tracking-wider">
                          {v.badge}
                        </span>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="size-5" />
                        </div>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                        {v.title}
                      </h3>
                      <p className="text-xs font-semibold text-accent mb-4">{v.category}</p>
                      <p className="text-body leading-relaxed text-muted-foreground">
                        {v.description}
                      </p>
                    </div>

                    <div className="mt-8 border-t border-border/80 pt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground/80">{v.highlight}</span>
                      {v.link ? (
                        <Link
                          href={v.link}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors"
                        >
                          Deep Dive <ArrowRight className="size-3.5" />
                        </Link>
                      ) : (
                        <span className="text-xs font-semibold text-muted-foreground">Active Investment</span>
                      )}
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Enterprise Photographic Archive ─── */}
      <section className="relative border-t border-border/80 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="section-eyebrow flex items-center gap-2">
                <Camera className="size-3.5 text-accent" />
                Verified Documentary Record
              </span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Industrial Footprint & Enterprise Infrastructure
              </h2>
              <p className="mt-2 text-lead text-muted-foreground max-w-2xl">
                Authentic photographic documentation of manufacturing infrastructure, processing facilities, and executive operations established across northeastern Nigeria.
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
                id: "hw-agro-industrial-complex",
                title: "Haske & Williams Agro-Industrial Complex",
                subtitle: "Demsa Processing Hub & Silos",
                detail: "Multi-acre integrated agro-industrial facility housing milling lines, grain drying, and regional storage silos in Adamawa State.",
                tag: "Agro-Industrial Infrastructure",
              },
              {
                id: "haske-executive-enterprise-leadership",
                title: "Executive Strategic Leadership",
                subtitle: "Corporate Boardroom & Strategy",
                detail: "Abdulrahman Bashir Haske presiding over strategic expansion sessions, applying corporate governance principles honed at IoD Nigeria.",
                tag: "Corporate Leadership",
              },
              {
                id: "hw-industrial-processing-plant",
                title: "Automated Industrial Operations",
                subtitle: "Value-Chain Industrialization",
                detail: "Commercial-scale processing equipment designed for continuous high-throughput grain handling and byproduct valorization.",
                tag: "Industrial Manufacturing",
              },
              {
                id: "hw-processing-plant-interior",
                title: "Modern Machinery & Quality Control",
                subtitle: "Engineering Excellence",
                detail: "Clean-room grade parboiling, polishing, and destoning systems meeting international food packaging and export standards.",
                tag: "Technical Architecture",
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
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-accent shadow-sm border border-accent/20">
                              <ShieldCheck className="size-3 text-accent" />
                              {photo.tag}
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
                      <div className="px-6 pb-6 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
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

      {/* ─── Business Philosophy & Governance ─── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="text-center mb-16">
          <span className="section-eyebrow">Guiding Philosophy</span>
          <h2 className="mt-2 text-fluid-h2 font-bold">The Haske Enterprise Principles</h2>
          <p className="mt-2 text-lead text-muted-foreground max-w-xl mx-auto">
            Sustainable wealth generation requires uncompromising ethics, community alignment, and institutional discipline.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={Math.min(i, 4) * 80}>
              <SpotlightCard spotlightColor="primary" className="p-7 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-serif text-2xl font-bold text-accent">0{i + 1}.</span>
                  <h3 className="font-serif text-xl font-bold text-foreground">{p.title}</h3>
                </div>
                <p className="text-body leading-relaxed text-muted-foreground">{p.description}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
