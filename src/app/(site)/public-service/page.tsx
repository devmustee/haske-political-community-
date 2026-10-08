import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import {
  Users2,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  FileText,
  Building,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Public-Service Journey | Abdulrahman Bashir Haske",
  description:
    "Chronicling Abdulrahman Bashir Haske's grassroots public-service journey, the 21-LGA listening tour across Adamawa State, and his citizen-first commitment to civic accountability.",
  openGraph: {
    title: "Public-Service Journey | Abdulrahman Bashir Haske",
    description:
      "Grassroots engagement, community listening tours, civic advocacy, and public accountability across Adamawa State.",
  },
};

const TOUR_STATS = [
  { value: "21 / 21", label: "LGAs Visited", detail: "Direct grassroots stakeholder town halls held" },
  { value: "140+", label: "Communities Engaged", detail: "Wards, farming settlements & youth forums" },
  { value: "5,000+", label: "Citizen Inputs", detail: "Documented priorities shaping the 2027 Manifesto" },
  { value: "100%", label: "Public Transparency", detail: "Audited commitments archived on the public record" },
];

const ENGAGEMENT_CHAPTERS = [
  {
    phase: "Phase 1: Grassroots Listening & Diagnosis",
    title: "The 21 Local Government Listening Tour",
    description:
      "Rather than drafting political agendas from distant boardrooms in Abuja or Lagos, Haske embarked on an exhaustive grassroots listening tour across all 21 Local Government Areas of Adamawa State. From Madagali in the north to Mayo-Belwa, Ganye, and Jada in the south, he sat with traditional rulers, farmers, market women, youth, and educators to understand real frontline hardships.",
    takeaways: [
      "Identified critical rural feeder road bottlenecks affecting grain transport",
      "Documented severe teacher shortages across rural public schools",
      "Listened to pastoralist and farming communities to foster peaceful co-existence",
    ],
  },
  {
    phase: "Phase 2: Civic Advocacy & Relief Action",
    title: "Translating Listening into Immediate Relief",
    description:
      "Public service does not begin upon swearing into office; it begins when a leader steps forward to alleviate community suffering. Haske followed his listening tour with immediate interventions: providing clean water boreholes in arid wards, dispatching relief grain convoys, and clearing unpaid hospital bills for indigent families.",
    takeaways: [
      "Over 65 solar boreholes commissioned in water-stressed communities",
      "80,000+ grain bags distributed to prevent seasonal food shortages",
      "Medical debt relief funds deployed to regional general hospitals",
    ],
  },
  {
    phase: "Phase 3: The 2027 Citizen Compact",
    title: "Co-Designing the Future of Adamawa State",
    description:
      "The insights gathered during years of civic engagement were codified directly into the Haske 2027 Manifesto. Every policy proposal—from mechanized agro-processing hubs to civil service reform—is a direct response to authentic citizen demands.",
    takeaways: [
      "Binding covenants for timely civil servant salary and pension payments",
      "Decentralized healthcare and subsidized agricultural input supply chains",
      "Youth digital literacy and technology vocational incubation centres",
    ],
  },
];

export default function PublicServicePage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Grassroots Civic Engagement"
        title="The Public-Service Journey"
        description="True public service begins on the ground, listening to the hopes and struggles of everyday people. Abdulrahman Bashir Haske’s civic journey is anchored in personal grassroots engagement across all 21 LGAs of Adamawa State."
        primaryAction={{
          label: "View Leadership Vision",
          href: "/leadership",
        }}
        secondaryAction={{
          label: "Read the Manifesto",
          href: "/manifesto",
        }}
      />

      {/* Tour Metrics Ribbon */}
      <section className="border-y border-border/80 bg-secondary/35 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {TOUR_STATS.map((stat, i) => (
              <Reveal key={stat.label} variant="scale" staggerIndex={i}>
                <div className="flex flex-col items-center text-center p-3">
                  <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-sm font-bold text-foreground">
                    {stat.label}
                  </span>
                  <span className="mt-0.5 text-xs text-muted-foreground">
                    {stat.detail}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative & Tour Phases */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Walking with the People
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              A Record of Continuous Civic Presence
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Public service is not an election-year event; it is a continuous commitment to shared humanity and institutional progress.
            </p>
          </div>

          <div className="space-y-12">
            {ENGAGEMENT_CHAPTERS.map((chapter, i) => (
              <Reveal key={chapter.title} variant="up" staggerIndex={i}>
                <SpotlightCard className="p-8 sm:p-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-2">
                    {chapter.phase}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                    {chapter.title}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
                    {chapter.description}
                  </p>
                  <div className="pt-6 border-t border-border/60">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                      Key Outcomes & Commitments
                    </h4>
                    <ul className="space-y-2">
                      {chapter.takeaways.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                          <CheckCircle2 className="size-4 text-accent shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="border-t border-border/80 bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Engage Directly in the Civic Process
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Submit your community’s priorities, propose local solutions, or review the immutable public record archive.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/speak-to-haske">
                Submit a Civic Issue
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/public-record">Transparency Archive</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
