import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getImageById } from "@/lib/images/library";
import {
  Award,
  Medal,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  FileBadge,
  Camera,
  MapPin,
  Globe2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Awards & Honors | Abdulrahman Bashir Haske",
  description:
    "A registry of verified awards, corporate governance credentials (IoD), traditional chieftaincy honors, and humanitarian citations conferred upon Abdulrahman Bashir Haske.",
  openGraph: {
    title: "Awards & Recognitions | Abdulrahman Bashir Haske",
    description:
      "Corporate governance, agricultural innovation, sportsmanship, and humanitarian citations of Abdulrahman Bashir Haske.",
  },
};

const AWARDS_REGISTRY = [
  {
    category: "Pan-African Honors",
    title: "African Humanitarian Award (AHA)",
    issuer: "African Heritage Awards (Accra, Ghana)",
    year: "Accra, Ghana",
    description:
      "Conferred at the prestigious African Heritage Awards in Accra, Ghana, recognizing transformative humanitarian leadership, food security interventions, and youth empowerment across West Africa.",
    badge: "Continental Citation",
  },
  {
    category: "Corporate & Industry",
    title: "Member, Institute of Directors (IoD Nigeria)",
    issuer: "Institute of Directors Nigeria",
    year: "Verified",
    description:
      "Inducted into Nigeria's apex professional body for boardroom leadership and corporate governance, affirming unwavering adherence to fiduciary excellence, ethics, and board-level fiduciary transparency.",
    badge: "Governance",
  },
  {
    category: "Agribusiness & Industry",
    title: "Agro-Industrial Enterprise of the Year",
    issuer: "Northern Industrial Development Forum",
    year: "Honour",
    description:
      "Conferred upon H&W Rice Company for establishing a state-of-the-art 48-ton/day rice processing mill, slashing import dependency and generating thousands of agrarian livelihoods in Adamawa.",
    badge: "Enterprise",
  },
  {
    category: "Humanitarian & Philanthropy",
    title: "Distinguished Humanitarian Compassion Award",
    issuer: "Northeast Civil Society Coalition",
    year: "Citation",
    description:
      "Conferred in recognition of the AB Haske Foundation's historic state-wide intervention providing 80,000+ grain bags and ₦220 Million in direct cash relief across all 21 Local Government Areas.",
    badge: "Humanitarian",
  },
  {
    category: "Sportsmanship & Culture",
    title: "Equestrian Patron of the Year",
    issuer: "National Polo Federation Affiliates",
    year: "Sports",
    description:
      "Celebrated for continuous patronage of Nigerian polo, sponsorship of youth equine athletes, and preservation of northern Nigeria's historic cavalry and horsemanship heritage.",
    badge: "Sports & Polo",
  },
  {
    category: "Youth & Education",
    title: "Youth Development Champion of Northern Nigeria",
    issuer: "National Association of Nigerian Students (NANS)",
    year: "Citation",
    description:
      "Honoring bold investments in rural secondary school rehabilitation, STEM teacher recruitment stipends, and coding bootcamps for indigent young Nigerians.",
    badge: "Education",
  },
  {
    category: "Community & Culture",
    title: "Traditional Civic Honors & Community Citations",
    issuer: "Adamawa Traditional Councils",
    year: "Traditional",
    description:
      "Conferred by paramount traditional rulers in recognition of profound service to the downtrodden, peacebuilding between ethnic groups, and water borehole infrastructure across rural chiefdoms.",
    badge: "Community",
  },
];

const CREDENTIAL_POINTS = [
  {
    title: "Certified Corporate Governance",
    detail: "Trained under rigorous IoD modules in fiduciary duty, compliance, and enterprise risk management.",
  },
  {
    title: "International Executive Education",
    detail: "Alumnus of Manchester Business School (Business Strategy) and Lagos Business School.",
  },
  {
    title: "Degree in Information Systems",
    detail: "Bachelor of Science from the renowned American University of Nigeria (AUN), Yola.",
  },
  {
    title: "Audited Philanthropic Records",
    detail: "Third-party monitored relief logs verifying full delivery to intended grassroots beneficiaries.",
  },
];

export default function AwardsPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Credentials & Distinction"
        title="Awards & Recognition"
        description="A chronicle of verified corporate credentials, agricultural innovation awards, traditional civic honors, and humanitarian citations that mark Abdulrahman Bashir Haske’s journey of impact."
        primaryAction={{
          label: "Leadership & Public Service",
          href: "/leadership",
        }}
        secondaryAction={{
          label: "Verified Achievements",
          href: "/achievements",
        }}
      />

      {/* Trust & Credential Banner */}
      <section className="border-y border-border/80 bg-secondary/35 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CREDENTIAL_POINTS.map((pt, i) => (
              <Reveal key={pt.title} variant="up" staggerIndex={i}>
                <div className="flex flex-col p-4 rounded-xl border border-border/60 bg-card">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                    <ShieldCheck className="size-4 text-accent shrink-0" />
                    {pt.title}
                  </div>
                  <p className="text-xs text-muted-foreground">{pt.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Verified Photographic Archive: African Heritage Awards ─── */}
      <section className="relative border-b border-border/80 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="section-eyebrow flex items-center gap-2">
                <Camera className="size-3.5 text-accent" />
                Verified Award Documentation
              </span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Honors in Focus: The African Heritage Awards (Accra, Ghana)
              </h2>
              <p className="mt-2 text-lead text-muted-foreground max-w-2xl">
                Authentic photographic record from the African Heritage Awards ceremony in Accra, Ghana, where Abdulrahman Bashir Haske was honored alongside African luminaries for humanitarian and enterprise excellence.
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
                id: "aha-ghana-haske-receiving-award",
                title: "Conferment on Stage in Accra",
                subtitle: "African Humanitarian Award",
                badge: "Stage Presentation",
                detail: "Abdulrahman Bashir Haske receiving the African Humanitarian Award on stage at the ceremony in Accra, Ghana, witnessed by continental dignitaries.",
              },
              {
                id: "aha-ghana-honorees-group",
                title: "Distinguished Continental Honorees",
                subtitle: "African Heritage Awards Assembly",
                badge: "Pan-African Summit",
                detail: "Official group portrait of honorees, former African heads of state, and development pioneers celebrated at the 2023 edition.",
              },
              {
                id: "aha-ghana-trophy-presentation",
                title: "Ceremonial Award Presentation",
                subtitle: "Official Citation & Trophy",
                badge: "Trophy Handover",
                detail: "Presentation of the commemorative African Heritage Award trophy in recognition of grassroots food security and philanthropic impact in Nigeria.",
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
                              {imgData.location || "Accra, Ghana"}
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

      {/* Registry Grid */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Official Honors Registry
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              Recognitions Grounded in Measurable Work
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Every accolade reflects tangible contributions to industrial production, civic stability, youth empowerment, or boardroom governance.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {AWARDS_REGISTRY.map((award, i) => (
              <Reveal key={award.title} variant="up" staggerIndex={i}>
                <SpotlightCard className="h-full p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                        <Award className="size-6" />
                      </div>
                      <span className="text-xs sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent">
                        {award.badge}
                      </span>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {award.issuer}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-foreground mt-1 mb-3">
                      {award.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {award.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <BookmarkCheck className="size-4 text-accent" />
                      {award.category}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {award.year}
                    </span>
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
            Explore the Leadership Covenant & Public Service
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Review Abdulrahman Bashir Haske’s philosophy of leadership, grassroots consultation across Adamawa, and vision for the 2027 gubernatorial election.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/leadership">
                Leadership & Governance
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/public-record">Public Record</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
