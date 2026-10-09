import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getImageById } from "@/lib/images/library";
import {
  Wheat,
  Factory,
  Users,
  TrendingUp,
  Sprout,
  ShieldCheck,
  Truck,
  ArrowRight,
  Sun,
  Award,
  Camera,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Agribusiness & Food Security | Abdulrahman Bashir Haske",
  description:
    "Explore Abdulrahman Bashir Haske's agro-industrial footprint, from the 48-ton/day H&W Rice Company mill to outgrower empowerment networks across Adamawa State.",
  openGraph: {
    title: "Agribusiness & Food Security | Abdulrahman Bashir Haske",
    description:
      "Modern mechanized agriculture, regional food sovereignty, and smallholder empowerment anchored by H&W Rice Company.",
  },
};

const AGRI_METRICS = [
  { label: "Milling Capacity", value: "48 Tons/Day", detail: "State-of-the-art parboiled & polished rice processing" },
  { label: "Outgrower Farmers", value: "4,500+", detail: "Smallholders engaged across Benue & Gongola basins" },
  { label: "Processing Complex", value: "Adamawa Hub", detail: "Multi-acre integrated agro-industrial facility" },
  { label: "Seed Yield Increase", value: "+38%", detail: "Average output boost through certified FARO varieties" },
];

const INDUSTRIAL_PILLARS = [
  {
    icon: Factory,
    title: "H&W Rice Company Processing Facility",
    subtitle: "Modern Industrial Agro-processing",
    description:
      "A flagship agro-industrial venture operating a 48 metric tons per day milling complex in Adamawa State. Engineered with Japanese-standard destoners, optical color sorters, and automated packaging lines that produce premium domestic parboiled rice meeting global quality benchmarks.",
    highlights: [
      "48 tons daily milling throughput capacity",
      "Multi-stage optical color sorting & automated bagging",
      "Byproduct valorization: rice husks utilized for thermal energy",
    ],
  },
  {
    icon: Sprout,
    title: "Outgrower Empowerment & Guaranteed Offtake",
    subtitle: "Protecting Smallholder Livelihoods",
    description:
      "Haske's agricultural vision bridges the gap between raw cultivation and market access. Through structured contract farming, more than 4,500 smallholders receive quality inputs on credit and guaranteed offtake at competitive, transparent floor prices, insulating them from volatile intermediaries.",
    highlights: [
      "Pre-planting guaranteed minimum floor pricing",
      "Direct offloading centers across Fufore, Numan, Demsa & Girei",
      "Prompt cashless payments protecting farm gate revenue",
    ],
  },
  {
    icon: Sun,
    title: "Agritech, Soil Science & Extension Services",
    subtitle: "Modernizing Traditional Farming",
    description:
      "Deploying agronomists and field extension officers across agrarian clusters to conduct regular workshops on fertilizer micro-dosing, climate-resilient water management along the Benue River basin, and high-yield certified seed adoption.",
    highlights: [
      "Widespread distribution of high-yield FARO 44 and 52 seeds",
      "Field extension support across 12 agricultural local government areas",
      "Soil salinity testing and micro-nutrient enrichment programs",
    ],
  },
  {
    icon: Truck,
    title: "Cold Chain, Storage & Regional Logistics",
    subtitle: "Slashing Post-Harvest Losses",
    description:
      "Tackling one of northern Nigeria's greatest agrarian challenges: post-harvest grain decay. Haske's facilities maintain aerated, pest-monitored silos capable of holding strategic grain reserves, stabilizing market supply throughout the dry season.",
    highlights: [
      "High-capacity hermetic silo storage facilities",
      "Inter-state distribution network connecting northern farms to national markets",
      "Post-harvest crop loss reduction from 22% to under 4%",
    ],
  },
];

const LOCAL_COMMUNITIES = [
  { lga: "Fufore LGA", focus: "Riverine paddy cultivation & seed multiplication", impact: "1,200+ outgrowers supported" },
  { lga: "Numan LGA", focus: "Gongola basin flood-recession and dry season irrigation", impact: "950+ registered families" },
  { lga: "Demsa LGA", focus: "Mechanized plowing cooperatives & grain aggregation", impact: "800+ farming households" },
  { lga: "Girei LGA", focus: "Central milling processing hub & agro-logistics depot", impact: "350+ direct factory jobs" },
  { lga: "Yola South", focus: "Packaged retail distribution & wholesale trading hub", impact: "24 distribution partners" },
  { lga: "Mayo-Belwa", focus: "Grain storage, sorting & cooperative seed banks", impact: "620+ agrarian producers" },
];

export default function AgriculturePage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Enterprise & Food Sovereignty"
        title="Industrial Agribusiness & Rural Prosperity"
        description="Pioneering modern agricultural industrialization in northeastern Nigeria. Through H&W Rice Company and an extensive outgrower network, Abdulrahman Bashir Haske is building resilient food systems that enrich local farming families and secure national grain reserves."
        primaryAction={{
          label: "Enterprise Overview",
          href: "/enterprise",
        }}
        secondaryAction={{
          label: "Foundation Outreach",
          href: "/foundation",
        }}
      />

      {/* Metrics Ribbon */}
      <section className="border-y border-border/80 bg-secondary/35 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {AGRI_METRICS.map((metric, i) => (
              <Reveal key={metric.label} variant="scale" staggerIndex={i}>
                <div className="flex flex-col items-center text-center p-3">
                  <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                    {metric.value}
                  </span>
                  <span className="mt-1 text-sm font-bold text-foreground">
                    {metric.label}
                  </span>
                  <span className="mt-0.5 text-xs text-muted-foreground">
                    {metric.detail}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Narrative / Philosophy */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal variant="left">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  <Wheat className="size-3.5" />
                  Agro-Industrial Vision
                </span>
                <h2 className="mt-4 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
                  Transforming Adamawa from Subsistence Farming into an Industrial Grain Powerhouse
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Northern Nigeria possesses some of the most fertile arable land on the African continent, blessed by the natural irrigation networks of the Benue and Gongola river valleys. Yet for decades, local producers remained trapped in subsistence cycles due to lack of industrial milling capacity, price volatility, and high post-harvest losses.
                  </p>
                  <p>
                    Abdulrahman Bashir Haske addressed this structural bottleneck by investing directly in domestic processing infrastructure. The establishment of <strong className="text-foreground">H&W Rice Company</strong> in Adamawa State brought world-class processing directly to the doorsteps of local farmers.
                  </p>
                  <p>
                    Instead of transporting raw paddy thousands of miles away at depressed prices, farmers now deliver directly to an ultra-modern facility that cleans, de-husks, polishes, and packages grain locally, retaining industrial value, employment, and capital within the state economy.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <ShieldCheck className="size-4 text-accent" />
                    Guaranteed Smallholder Offtake
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <ShieldCheck className="size-4 text-accent" />
                    Zero Chemical Bleaching
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <ShieldCheck className="size-4 text-accent" />
                    Eco-Conscious Husk Energy
                  </div>
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
                    “True sovereignty begins with the food on our tables. When an Adamawa farmer receives guaranteed fair pricing for his harvest, his children attend school, his community thrives, and our nation builds enduring economic independence.”
                  </blockquote>
                  <div className="mt-6 pt-6 border-t border-border/80">
                    <p className="text-sm font-bold text-foreground">Abdulrahman Bashir Haske</p>
                    <p className="text-xs text-muted-foreground">Founder, H&W Rice Company & AB Haske Foundation</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Pillars Grid */}
      <section className="border-t border-border/80 bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Core Agro-Industrial Verticals
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              End-to-End Agricultural Value Chain
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              A comprehensive system uniting primary cultivation, modern processing, agronomic extension, and nationwide distribution.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {INDUSTRIAL_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} variant="up" staggerIndex={i}>
                  <SpotlightCard className="h-full p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-accent">
                            {pillar.subtitle}
                          </span>
                          <h3 className="font-serif text-xl font-bold text-foreground">
                            {pillar.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/60">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                        Operational Benchmarks
                      </h4>
                      <ul className="space-y-2">
                        {pillar.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-accent shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Verified Photographic Archive: H&W Rice Complex ─── */}
      <section className="relative border-t border-border/80 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="section-eyebrow flex items-center gap-2">
                <Camera className="size-3.5 text-accent" />
                Verified Documentary Archive
              </span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Inside H&W Rice Company: Demsa Milling Complex
              </h2>
              <p className="mt-2 text-lead text-muted-foreground max-w-2xl">
                Official photographs from the 48 metric ton per day agro-industrial processing complex, showcasing automated milling machinery, optical sorters, and packaged inventory in Adamawa State.
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "hw-rice-mill-facility-demsa",
                title: "Processing Complex Exterior",
                subtitle: "Demsa, Adamawa State",
                spec: "48 MT / Day Capacity",
                desc: "Integrated milling, parboiling, and drying infrastructure established to anchor the regional rice value chain.",
              },
              {
                id: "hw-rice-destoning-sorting-line",
                title: "Optical Destoning & Sorting Line",
                subtitle: "High-Precision Sorting",
                spec: "Japanese Standard Quality",
                desc: "Multi-stage automated optical sensors eliminating impurities and stones prior to bagging.",
              },
              {
                id: "hw-rice-milling-machinery",
                title: "Automated Milling Line",
                subtitle: "Industrial Mechanization",
                spec: "Continuous High-Throughput",
                desc: "Heavy industrial polishing and dehulling machinery operating continuously during peak harvest seasons.",
              },
              {
                id: "hw-rice-packaged-parboiled",
                title: "Finished Premium Rice Sacks",
                subtitle: "Packaged & Ready for Market",
                spec: "Export Grade Parboiled",
                desc: "Cleanly packaged parboiled domestic rice ready for wholesale distribution across Nigerian markets.",
              },
              {
                id: "hw-rice-processing-storage",
                title: "Warehouse & Grain Logistics Depot",
                subtitle: "Cold Chain & Silo Aggregation",
                spec: "Strategic Buffer Reserves",
                desc: "Spacious storage floor preserving harvested paddy from outgrowers across Fufore, Numan, and Demsa LGAs.",
              },
              {
                id: "hw-processing-plant-interior",
                title: "Facility Floor & Control Hub",
                subtitle: "Engineering Infrastructure",
                spec: "Automated Control",
                desc: "Supervised production line monitoring quality parameters, moisture levels, and clean throughput.",
              },
            ].map((photo, i) => {
              const imgData = getImageById(photo.id);
              return (
                <Reveal key={photo.id} variant="scale" delay={i * 70}>
                  <SpotlightCard spotlightColor="gold" className="overflow-hidden h-full flex flex-col justify-between border-border/80 shadow-elevated">
                    <div>
                      {imgData ? (
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted group">
                          <Image
                            src={imgData.src}
                            alt={imgData.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            placeholder={imgData.blurDataURL ? "blur" : undefined}
                            blurDataURL={imgData.blurDataURL}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur-md px-2.5 py-0.5 text-xs sm:text-[11px] font-bold text-accent shadow-sm border border-accent/20">
                              <ShieldCheck className="size-3 text-accent" />
                              {photo.spec}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                              <MapPin className="size-3 text-accent" />
                              {imgData.location || "Demsa, Adamawa State"}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      <div className="p-5">
                        <span className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-accent">
                          {photo.subtitle}
                        </span>
                        <h3 className="mt-1 font-serif text-lg font-bold text-foreground">
                          {photo.title}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          {photo.desc}
                        </p>
                      </div>
                    </div>
                    {imgData && (
                      <div className="px-5 pb-5 pt-2 border-t border-border/60 flex items-center justify-between text-xs sm:text-[11px] text-muted-foreground">
                        <span>{imgData.credit}</span>
                        <Link href="/image-credits" className="text-accent hover:underline font-semibold">
                          Attribution &rarr;
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

      {/* Regional Grassroots Presence */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Geographic Coverage
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              Deep Agricultural Footprint Across Adamawa
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Cultivating prosperity across river valleys and agrarian heartlands through localized cooperative structures.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LOCAL_COMMUNITIES.map((loc, i) => (
              <Reveal key={loc.lga} variant="up" staggerIndex={i}>
                <div className="rounded-2xl border border-border/80 bg-card p-5 hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-lg font-bold text-foreground">{loc.lga}</span>
                    <span className="text-xs sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{loc.focus}</p>
                  <div className="text-xs font-bold text-primary flex items-center gap-1.5 pt-2 border-t border-border/60">
                    <Users className="size-3.5" />
                    {loc.impact}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="border-t border-border/80 bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Explore the Haske Economic & Community Ecosystem
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Discover how industrial enterprise translates into humanitarian relief and grassroots community development across Nigeria.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/foundation">
                AB Haske Foundation
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/enterprise">Commercial Enterprise</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
