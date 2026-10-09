import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getImageById } from "@/lib/images/library";
import {
  Heart,
  Users,
  Coins,
  PackageCheck,
  Droplets,
  Stethoscope,
  GraduationCap,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  HandHeart,
  Camera,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AB Haske Foundation | Humanitarian & Philanthropic Interventions",
  description:
    "The institutional philanthropic vehicle of Abdulrahman Bashir Haske. Documenting the distribution of 80,000+ grain bags, ₦220M in direct cash relief, clean water, and healthcare sponsorships across Adamawa State.",
  openGraph: {
    title: "AB Haske Foundation | Philanthropy & Grassroots Relief",
    description:
      "Direct humanitarian relief, widows' empowerment, solar boreholes, and medical interventions across all 21 LGAs of Adamawa State.",
  },
};

const FOUNDATION_METRICS = [
  { value: "80,000+", label: "Food Grain Bags", detail: "Distributed across all 21 LGAs during state-wide relief" },
  { value: "₦220M+", label: "Direct Cash Disbursed", detail: "Targeted support for widows, vulnerable elders & orphans" },
  { value: "21 / 21", label: "LGAs Reached", detail: "100% geographic coverage across Adamawa State" },
  { value: "65+", label: "Solar Water Boreholes", detail: "Clean potable water installed in rural communities" },
];

const RELIEF_INITIATIVES = [
  {
    icon: PackageCheck,
    title: "State-Wide Nutrition & Food Security Interventions",
    subtitle: "Emergency & Seasonal Relief",
    badge: "Food Security",
    description:
      "Recognizing the unprecedented inflation pressures on basic dietary staples, the AB Haske Foundation mobilized logistics to distribute over 80,000 bags of parboiled rice, maize, and essential provisions directly to families in need across every local council in Adamawa State.",
    impactStats: ["80,000+ households directly sustained", "100% of 21 LGAs reached with audited distribution registries"],
  },
  {
    icon: Coins,
    title: "₦220M Grassroots Micro-Relief & Widow Support",
    subtitle: "Dignified Economic Survival Grants",
    badge: "Direct Grants",
    description:
      "A non-repayable unconditional cash grant program delivering over ₦220 Million into the hands of vulnerable women, elderly caretakers, and small traders. Each grant provides immediate liquidity to restock trading tables or settle emergency family liabilities without debt traps.",
    impactStats: ["₦220,000,000 injected into local grassroots markets", "Prioritized female breadwinners and elderly households"],
  },
  {
    icon: Droplets,
    title: "Rural Water Access & Clean Sanitation Project",
    subtitle: "Solar-Powered Community Infrastructure",
    badge: "Infrastructure",
    description:
      "To eradicate water-borne diseases and relieve rural children of miles-long treks for water, the Foundation has drilled and commissioned over 65 solar-powered high-yield boreholes with multi-tap distribution bays across rural hamlets.",
    impactStats: ["Over 120,000 rural residents served daily", "Zero-maintenance solar pumping architecture"],
  },
  {
    icon: Stethoscope,
    title: "Medical Debt Relief & Emergency Health Interventions",
    subtitle: "Saving Lives at Primary Healthcare Facilities",
    badge: "Healthcare",
    description:
      "Periodic interventions settling outstanding medical bills for indigent patients detained in hospital wards across Yola and Mubi, while donating surgical packs, maternal safe-delivery kits, and essential drugs to primary healthcare centers.",
    impactStats: ["Hundreds of detained indigent patients discharged", "Maternal delivery kits supplied to remote PHCs"],
  },
  {
    icon: HandHeart,
    title: "Mobility & Livelihood Equipment Endowments",
    subtitle: "Tools for Self-Sustaining Independence",
    badge: "Livelihood",
    description:
      "Empowering youth and women artisans with productive assets: commercial motorcycles, motorized tricycles, multi-grain grinding machines, and industrial sewing machines distributed without political discrimination.",
    impactStats: ["Productive equipment endowed to 1,500+ artisans", "Immediate income generation for dependent households"],
  },
  {
    icon: GraduationCap,
    title: "Indigent Student Tuition & Examination Sponsorships",
    subtitle: "Removing Academic Barriers",
    badge: "Education",
    description:
      "Covering WAEC, NECO, and JAMB registration fees for high-performing secondary students from disadvantaged backgrounds, coupled with tertiary bursary awards for Adamawa youth across federal and state universities.",
    impactStats: ["1,200+ secondary exam fees settled", "Undergraduate tuition grants across 12 institutions"],
  },
];

const GUIDING_PRINCIPLES = [
  {
    title: "Radical Transparency",
    description: "Every relief convoy is verified by traditional leaders, faith elders, and community monitors to prevent diversion.",
  },
  {
    title: "Non-Partisan Delivery",
    description: "Assistance is rendered purely on humanitarian need, irrespective of political affiliation, ethnicity, or creed.",
  },
  {
    title: "Preservation of Human Dignity",
    description: "Relief is disbursed orderly with utmost respect, avoiding dehumanizing crowds through localized ward distribution centers.",
  },
  {
    title: "Sustainable Self-Reliance",
    description: "We couple immediate humanitarian relief with tools of economic production to help recipients graduate from aid dependency.",
  },
];

export default function FoundationPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Institutional Philanthropy"
        title="AB Haske Foundation"
        description="Transforming compassion into structured, institutional social impact. Through audited food reserves, clean rural water, maternal health interventions, and over ₦220M in unconditional grassroots relief, the Foundation serves as a beacon of hope for Adamawa State's most vulnerable."
        primaryAction={{
          label: "View Impact Metrics",
          href: "/achievements",
        }}
        secondaryAction={{
          label: "Youth & Education",
          href: "/youth-education",
        }}
      />

      {/* Metrics Ribbon */}
      <section className="border-y border-border/80 bg-secondary/35 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {FOUNDATION_METRICS.map((metric, i) => (
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

      {/* Institutional Philosophy Section */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal variant="left">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  <Heart className="size-3.5" />
                  Philanthropic Covenant
                </span>
                <h2 className="mt-4 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
                  A Moral Duty to Stand With the People in Their Hour of Greatest Need
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    The AB Haske Foundation was born from a fundamental conviction: that wealth and enterprise carry an inescapable moral covenant to protect human dignity. Philanthropy is not an afterthought or an occasional photo opportunity; it is an organized, continuous institutional duty.
                  </p>
                  <p>
                    When economic headwinds and severe currency devaluation struck Nigeria, escalating food prices beyond the reach of ordinary families, Abdulrahman Bashir Haske did not look away. He deployed his enterprise logistics to purchase, transport, and distribute grain provisions on an unprecedented scale across every single ward and LGA in Adamawa State.
                  </p>
                  <p>
                    Today, the Foundation operates across four structured intervention pillars: <strong className="text-foreground">Humanitarian Nutrition</strong>, <strong className="text-foreground">Direct Financial Grants</strong>, <strong className="text-foreground">Clean Water & Public Health</strong>, and <strong className="text-foreground">Educational Access</strong>.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal variant="right">
                <SpotlightCard className="p-8 border-primary/20 bg-gradient-to-b from-card via-card/95 to-primary/5">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20">
                    <Sparkles className="size-7" />
                  </div>
                  <blockquote className="font-serif text-lg italic text-foreground leading-relaxed">
                    “Leadership is judged not by the titles we accumulate, but by the tears we wipe away. When a mother can feed her children tonight because we intervened with food and medicine, our purpose is fulfilled.”
                  </blockquote>
                  <div className="mt-6 pt-6 border-t border-border/80">
                    <p className="text-sm font-bold text-foreground">Abdulrahman Bashir Haske</p>
                    <p className="text-xs text-muted-foreground">Founder & Trustee, AB Haske Foundation</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Program Portfolio */}
      <section className="border-t border-border/80 bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Structured Interventions
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              Documented Programs of the AB Haske Foundation
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Direct, audited humanitarian actions addressing chronic structural vulnerabilities in northern Nigeria.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {RELIEF_INITIATIVES.map((initiative, i) => {
              const Icon = initiative.icon;
              return (
                <Reveal key={initiative.title} variant="up" staggerIndex={i}>
                  <SpotlightCard className="h-full p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                          <Icon className="size-6" />
                        </div>
                        <span className="text-xs sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent">
                          {initiative.badge}
                        </span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {initiative.subtitle}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-foreground mt-1 mb-3">
                        {initiative.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {initiative.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-border/60">
                      <h4 className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-foreground mb-2">
                        Audited Impact
                      </h4>
                      <ul className="space-y-1.5">
                        {initiative.impactStats.map((stat, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-accent shrink-0" />
                            {stat}
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

      {/* ─── Verified Photographic Archive: Foundation Relief Missions ─── */}
      <section className="relative border-t border-border/80 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="section-eyebrow flex items-center gap-2">
                <Camera className="size-3.5 text-accent" />
                Verified Field Operations
              </span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Documented Humanitarian Interventions in Adamawa
              </h2>
              <p className="mt-2 text-lead text-muted-foreground max-w-2xl">
                Authentic photographic documentation of direct relief operations, grain logistics convoys, solar borehole water infrastructure, and widow grant distributions conducted by the AB Haske Foundation.
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
                id: "ab-haske-foundation-ramadan-relief",
                title: "Statewide 80,000-Bag Grain Relief Distribution",
                subtitle: "Emergency Humanitarian Relief",
                metric: "80,000+ Sacks Distributed",
                detail: "Official grain relief distribution program by the AB Haske Foundation with verified banners, rice sacks, and community recipients across all 21 LGAs.",
              },
              {
                id: "foundation-widows-grant-outreach",
                title: "₦220M Grassroots Cash Grants & Widow Support",
                subtitle: "Direct Micro-Relief",
                metric: "₦220 Million Cash Disbursed",
                detail: "Unconditional emergency liquidity grants handed directly to vulnerable mothers, petty traders, and elderly caretakers.",
              },
              {
                id: "community-water-borehole-project",
                title: "Solar Potable Water Infrastructure Projects",
                subtitle: "Clean Water Access",
                metric: "65+ Solar Boreholes Installed",
                detail: "Commissioning high-capacity motorized solar water boreholes providing free potable drinking water to rural agrarian communities.",
              },
              {
                id: "ab-haske-foundation-medical-relief",
                title: "Free Healthcare & Patient Discharge Missions",
                subtitle: "Primary Health & Medical Debt Relief",
                metric: "Hundreds of Hospital Bills Settled",
                detail: "Healthcare outreach settling hospital bills for detained indigent patients and donating maternal health supplies across state clinics.",
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
                              {photo.metric}
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

      {/* Operational Principles */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Governance & Integrity
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              How the Foundation Operates
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDING_PRINCIPLES.map((principle, i) => (
              <Reveal key={principle.title} variant="up" staggerIndex={i}>
                <div className="rounded-2xl border border-border/80 bg-card p-6 h-full flex flex-col justify-start">
                  <div className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mb-4">
                    {`0${i + 1}`}
                  </div>
                  <h3 className="font-serif text-base font-bold text-foreground mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {principle.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <section className="border-t border-border/80 bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Discover Our Youth & Education Interventions
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Learn how the Foundation partners with educators, community leaders, and students to build long-term generational capacity.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/youth-education">
                Youth & Education Programs
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/achievements">Explore All Verified Impact</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
