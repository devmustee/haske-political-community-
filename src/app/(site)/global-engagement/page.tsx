import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getImageById } from "@/lib/images/library";
import {
  Globe2,
  TrendingUp,
  Landmark,
  Plane,
  Compass,
  Building2,
  ArrowRight,
  Handshake,
  Award,
  Camera,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Global & African Engagement | Abdulrahman Bashir Haske",
  description:
    "Documenting Abdulrahman Bashir Haske's international executive education (Manchester Business School), cross-border trade leadership, AfCFTA integration, and global investment diplomacy.",
  openGraph: {
    title: "Global & African Engagement | Abdulrahman Bashir Haske",
    description:
      "International trade diplomacy, Manchester Business School education, cross-border agro-logistics, and global partnerships.",
  },
};

const GLOBAL_PILLARS = [
  {
    icon: Landmark,
    title: "Executive Education & Global Acumen",
    region: "United Kingdom & International",
    description:
      "A solid foundation in international corporate strategy and advanced executive leadership from the prestigious Manchester Business School (UK), complemented by executive training at Lagos Business School and a B.Sc. in Information Systems from the American University of Nigeria.",
    outcomes: [
      "Application of global supply-chain optimization models to domestic Nigerian agriculture",
      "Rigorous training in international financial reporting, enterprise risk, and governance",
      "Network of global executives across technology, finance, and industrial engineering",
    ],
  },
  {
    icon: TrendingUp,
    title: "Intra-African Trade & AfCFTA Corridors",
    region: "West & Central Africa (Cameroon, Chad)",
    description:
      "Adamawa State occupies a strategic geographic gateway bordering the Republic of Cameroon and serving as a historical transit route into the Lake Chad basin. Haske advocates leveraging the African Continental Free Trade Area (AfCFTA) to transform Adamawa into a regional export hub for agro-allied commodities.",
    outcomes: [
      "Cross-border grain and livestock value-chain integration with northern Cameroon",
      "Advocacy for modernized border customs facilities and digital trade transit tracking",
      "Promotion of value-added processed food exports over raw commodity flight",
    ],
  },
  {
    icon: Building2,
    title: "Foreign Direct Investment Diplomacy",
    region: "Gulf States, Europe & North America",
    description:
      "Engaging international impact investors, sovereign development funds, and private equity partners at global forums to highlight commercial opportunities in northern Nigeria’s agribusiness, renewable mini-grids, and digital infrastructure.",
    outcomes: [
      "Attracting modern milling technology partnerships from leading Asian manufacturers",
      "Cultivating diaspora investment pools for clean solar mini-grid installations",
      "Positioning Adamawa as a stable, investor-friendly destination with transparent governance",
    ],
  },
  {
    icon: Handshake,
    title: "Diaspora Mobilization & Knowledge Transfer",
    region: "Global African Diaspora",
    description:
      "Actively engaging northern Nigerian professionals and academics in the United Kingdom, North America, and the Middle East to facilitate technological know-how transfer, medical missions, and educational mentorship back home.",
    outcomes: [
      "Facilitating volunteer medical and surgical outreach missions by diaspora physicians",
      "Connecting local university students with remote internships and global mentors",
      "Creating formal investment vehicles for diaspora participation in Adamawa's green economy",
    ],
  },
];

const GLOBAL_MILESTONES = [
  {
    year: "Manchester",
    title: "Manchester Business School, UK",
    detail: "Executive immersion in corporate strategy, organizational transformation, and global enterprise leadership.",
  },
  {
    year: "AfCFTA",
    title: "Regional Trade Dialogue",
    detail: "Championing cross-border trade infrastructure connecting Yola to Garoua (Cameroon) and regional economic zones.",
  },
  {
    year: "Tech Forums",
    title: "International Industrial Summits",
    detail: "Showcasing Nigerian agricultural processing innovations at international agro-industrial and technology forums.",
  },
  {
    year: "Sports",
    title: "International Sports Diplomacy",
    detail: "Representing Nigerian equestrian heritage in international exhibition polo chukkers and sporting diplomatic networks.",
  },
];

export default function GlobalEngagementPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="International Horizons & Trade"
        title="Global & African Engagement"
        description="Bridging local grassroots reality with global business acumen. Abdulrahman Bashir Haske leverages international executive education, cross-border trade diplomacy under AfCFTA, and foreign direct investment networks to unlock Adamawa’s immense economic potential."
        primaryAction={{
          label: "Enterprise Footprint",
          href: "/enterprise",
        }}
        secondaryAction={{
          label: "Polo & Sports Leadership",
          href: "/sports-polo",
        }}
      />

      {/* Global Mindset Section */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal variant="left">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  <Globe2 className="size-3.5" />
                  International Perspective
                </span>
                <h2 className="mt-4 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
                  Local Roots, Global Competence: Thinking Beyond Borders
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    In an increasingly interconnected world, sub-national states cannot thrive with parochial, inward-looking leadership. Economic development requires leaders who can effortlessly navigate the boardrooms of London and Dubai, understand the regulatory dynamics of the African Continental Free Trade Area (AfCFTA), and negotiate high-stakes technology transfers with global manufacturers.
                  </p>
                  <p>
                    Abdulrahman Bashir Haske brings this vital international outlook. Having trained at <strong className="text-foreground">Manchester Business School</strong> and worked across complex commercial supply chains, he sees Adamawa not as an isolated landlocked territory, but as the gateway of Nigeria to Central Africa.
                  </p>
                  <p>
                    By connecting local grain farmers directly to regional export markets and attracting clean energy capital from overseas partners, Haske is redefining what regional governance and enterprise can achieve.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal variant="right">
                <SpotlightCard className="p-8 border-primary/20 bg-gradient-to-b from-card via-card/95 to-primary/5">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20">
                    <Compass className="size-7" />
                  </div>
                  <blockquote className="font-serif text-lg italic text-foreground leading-relaxed">
                    “The world will not come to us simply because we have potential; capital goes where it is welcomed, respected, and protected by transparent rule of law. We must build institutions that command global confidence.”
                  </blockquote>
                  <div className="mt-6 pt-6 border-t border-border/80">
                    <p className="text-sm font-bold text-foreground">Abdulrahman Bashir Haske</p>
                    <p className="text-xs text-muted-foreground">Executive Strategist & Global Investor</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Global Pillars */}
      <section className="border-t border-border/80 bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Diplomacy & Enterprise
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              Strategic International Engagement Verticals
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Connecting northern Nigeria&apos;s resources to international capital, trade pathways, and diaspora talent.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {GLOBAL_PILLARS.map((pillar, i) => {
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
                            {pillar.region}
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
                        Strategic Impacts
                      </h4>
                      <ul className="space-y-2">
                        {pillar.outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-accent shrink-0" />
                            {outcome}
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

      {/* International Milestones */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Global Milestones
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              International Highlights
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GLOBAL_MILESTONES.map((m, i) => (
              <Reveal key={m.title} variant="up" staggerIndex={i}>
                <div className="rounded-2xl border border-border/80 bg-card p-6 h-full flex flex-col justify-start hover:border-primary/40 transition-colors">
                  <span className="text-xs font-bold font-mono text-accent mb-2">{m.year}</span>
                  <h3 className="font-serif text-base font-bold text-foreground mb-2">{m.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{m.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Verified Photographic Archive: Global & African Engagement ─── */}
      <section className="relative border-t border-border/80 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="section-eyebrow flex items-center gap-2">
                <Camera className="size-3.5 text-accent" />
                Verified International Record
              </span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Documented International Horizons & Trade Diplomacy
              </h2>
              <p className="mt-2 text-lead text-muted-foreground max-w-2xl">
                Authentic photographic documentation capturing pan-African honors in Accra, cross-border economic dialogues, and global investment diplomacy.
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

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                id: "aha-ghana-honorees-group",
                title: "Pan-African Summit & Honors in Accra",
                subtitle: "African Heritage Awards (Ghana)",
                badge: "Accra, Ghana",
                detail: "Distinguished honorees and African leaders gathered in Accra, Ghana, celebrating continental humanitarian and economic excellence.",
              },
              {
                id: "international-diplomatic-dialogue",
                title: "Global Investment & Strategic Diplomacy",
                subtitle: "Multilateral Engagement",
                badge: "Investment Forum",
                detail: "Executive consultation with international investors and diplomats exploring industrial agro-processing and green energy opportunities in Nigeria.",
              },
              {
                id: "cross-border-trade-consultation",
                title: "Regional Cross-Border Economic Dialogue",
                subtitle: "AfCFTA Corridor Partnership",
                badge: "Trade Corridor",
                detail: "Advocating for integrated border value-chains, transit infrastructure, and agricultural commodity flows connecting Adamawa to Central Africa.",
              },
            ].map((photo, i) => {
              const imgData = getImageById(photo.id);
              return (
                <Reveal key={photo.id} variant="scale" delay={i * 90}>
                  <SpotlightCard spotlightColor="gold" className="overflow-hidden h-full flex flex-col justify-between border-border/80 shadow-elevated">
                    <div>
                      {imgData ? (
                        <div className="relative aspect-[16/11] w-full overflow-hidden bg-muted group">
                          <Image
                            src={imgData.src}
                            alt={imgData.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
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
                              <Globe2 className="size-3 text-accent" />
                              {imgData.location || "International"}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      <div className="p-6">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent">
                          {photo.subtitle}
                        </span>
                        <h3 className="mt-1 font-serif text-lg font-bold text-foreground">
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
            Explore the Documentary Media & Photo Archive
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            View high-resolution photography and press documentation capturing enterprise operations, polo chukkers, and grassroots town halls.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/gallery">
                Documentary Gallery
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/timeline">Interactive Career Timeline</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
