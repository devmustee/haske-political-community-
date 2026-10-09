import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getImageById } from "@/lib/images/library";
import {
  Trophy,
  Shield,
  HeartHandshake,
  Users,
  Compass,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Camera,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sports & Polo Leadership | Abdulrahman Bashir Haske",
  description:
    "Documenting Abdulrahman Bashir Haske's distinguished career as an acclaimed polo player, team patron, equestrian custodian, and champion of grassroots youth sports development.",
  openGraph: {
    title: "Sports & Polo Leadership | Abdulrahman Bashir Haske",
    description:
      "Equestrian heritage, competitive polo tournaments, sports diplomacy, and grassroots youth athletic academies.",
  },
};

const POLO_METRICS = [
  { value: "15+ Years", label: "Polo Career", detail: "Active player & patron on elite Nigerian circuits" },
  { value: "4 Major Clubs", label: "Affiliations", detail: "Lagos, Abuja Guards, Kaduna & Kano polo clubs" },
  { value: "24+ Trophies", label: "Podium Honours", detail: "High & medium goal cups and sporting accolades" },
  { value: "12+ Tournaments", label: "Youth Cups Sponsored", detail: "Grassroots football & athletics across Adamawa" },
];

const POLO_FACETS = [
  {
    icon: Trophy,
    title: "Competitive Polo & Team Patronage",
    category: "The Sport of Kings",
    description:
      "Abdulrahman Bashir Haske has made an indelible mark on Nigerian and international polo. As a passionate patron and agile player, he has led Team Haske onto the hallowed pitches of the Lagos Polo Club, Fifth Chukker Kaduna, Abuja Guards Polo Club, and Kano, competing in prestigious cups with discipline, tactical poise, and teamwork.",
    attributes: [
      "Regular campaigner in high-goal and medium-goal Nigerian polo tournaments",
      "Sponsorship of world-class Argentine and Nigerian equine professionals",
      "Celebrated for gentlemanly conduct, team strategy, and field tenacity",
    ],
  },
  {
    icon: Shield,
    title: "Custodian of Northern Equestrian Heritage",
    category: "Cultural Legacy",
    description:
      "In northern Nigeria, horsemanship is far more than a recreational pastime—it is a profound cultural legacy dating back centuries, intertwined with the nobility of the Durbar and historic cavalry traditions. Haske's investment in equine breeding, stables, and veterinary care preserves this cherished heritage for future generations.",
    attributes: [
      "Support for traditional equestrian artisans, saddle-makers, and grooms",
      "High-standard equine welfare, bloodline preservation, and veterinary training",
      "Active participant and patron of northern cultural equestrian festivals",
    ],
  },
  {
    icon: HeartHandshake,
    title: "Sports Diplomacy & Strategic Networks",
    category: "Global Bridge-Building",
    description:
      "Polo is internationally recognized as a powerful nexus for high-level relationship building. Haske uses the equestrian arena as a diplomatic bridge, convening African executives, global investors, diplomats, and policymakers to cultivate partnerships that generate philanthropic and economic investment back into Adamawa.",
    attributes: [
      "Hosting corporate charity exhibition chukkers for educational relief",
      "Bridging the private sector, diplomatic corps, and philanthropic foundations",
      "Promoting Nigeria's positive image on the international equestrian stage",
    ],
  },
  {
    icon: Flame,
    title: "Grassroots Youth Athletics & Football Cups",
    category: "Community Sports",
    description:
      "Believing that sports instill vital virtues of resilience, fair play, and collective unity, Haske sponsors localized youth soccer tournaments, boxing exhibitions, and inter-secondary athletic meets across Adamawa's senatorial districts, steering thousands of youths away from antisocial behaviors.",
    attributes: [
      "Annual Haske Unity Football Cup engaging 40+ grassroots clubs",
      "Distribution of branded football kits, boots, and training equipment",
      "Talent scouting pathways linking grassroots footballers to professional leagues",
    ],
  },
];

const CLUBS_AND_CIRCUITS = [
  {
    name: "Yola Polo Club (Lamido Musdafa Ground)",
    role: "Club President & Patron",
    note: "Elected Club President; host of the premier annual Yola International Polo Tournament attracting teams from across West Africa.",
  },
  {
    name: "Lagos Polo Club (Ikoyi)",
    role: "Patron & Player",
    note: "Prestigious International Polo Tournament regular competitor in historic cups.",
  },
  {
    name: "Abuja Guards Polo Club",
    role: "Patron & Executive Benefactor",
    note: "High-level tournaments celebrating national unity and corporate charity exhibitions.",
  },
  {
    name: "Fifth Chukker Polo & Country Club (Kaduna)",
    role: "Regular Campaigner",
    note: "UNICEF Charity Polo Tournament participant championing children's welfare.",
  },
  {
    name: "Kano Polo Club",
    role: "Patron & Equestrian Partner",
    note: "Historic tournament play honoring royal cavalry traditions and northern sportsmanship.",
  },
];

export default function SportsPoloPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Sportsmanship & Equestrian Heritage"
        title="Polo Career & Sports Leadership"
        description="Embodying the classic virtues of polo: courage, precision, teamwork, and sportsmanship. Abdulrahman Bashir Haske blends competitive equestrian mastery with sports diplomacy and grassroots youth athletics to foster regional unity and disciplined character."
        primaryAction={{
          label: "View Awards & Honours",
          href: "/awards",
        }}
        secondaryAction={{
          label: "Youth Initiatives",
          href: "/youth-education",
        }}
      />

      {/* Metrics Ribbon */}
      <section className="border-y border-border/80 bg-secondary/35 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {POLO_METRICS.map((metric, i) => (
              <Reveal key={metric.label} variant="scale" staggerIndex={i}>
                <div className="flex flex-col items-center text-center p-2 sm:p-3">
                  <span className="font-serif text-2xl min-[400px]:text-3xl sm:text-4xl font-bold tracking-tight text-primary">
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

      {/* The Spirit of Polo */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal variant="left">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  <Trophy className="size-3.5" />
                  Equestrian Excellence
                </span>
                <h2 className="mt-4 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
                  Where Discipline, Speed, and Honor Converge
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    Polo is widely regarded as one of the most physically and mentally demanding sports in the world. It requires a rare synthesis of personal grit, split-second tactical calculation, complete harmony with one’s mount, and seamless coordination with three teammates riding at 35 miles per hour.
                  </p>
                  <p>
                    For Abdulrahman Bashir Haske, polo is both an athletic passion and a rigorous masterclass in leadership. The qualities that win chukkers—anticipating moves before they happen, holding steady under intense pressure, maintaining absolute trust in your teammates, and treating opponents with consummate respect—are the identical principles that guide his business ventures and public service.
                  </p>
                  <p>
                    Beyond personal competition, Haske takes tremendous pride in employing dozens of young riders, grooms, stable-masters, and veterinarians, creating sustainable vocational livelihoods within the equestrian sector.
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
                    “On the polo field, pedigree and background mean nothing; only preparation, teamwork, courage, and honor matter. That is how I view life, business, and leadership: you prepare relentlessly, respect your teammates, and give everything for the objective.”
                  </blockquote>
                  <div className="mt-6 pt-6 border-t border-border/80">
                    <p className="text-sm font-bold text-foreground">Abdulrahman Bashir Haske</p>
                    <p className="text-xs text-muted-foreground">Polo Patron & Sportsman</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Core Facets Grid */}
      <section className="border-t border-border/80 bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Sporting Dimensions
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              The Multifaceted Impact of Sports Leadership
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              From high-stakes polo chukkers to local community soccer leagues that unite divided wards.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {POLO_FACETS.map((facet, i) => {
              const Icon = facet.icon;
              return (
                <Reveal key={facet.title} variant="up" staggerIndex={i}>
                  <SpotlightCard className="h-full p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-accent">
                            {facet.category}
                          </span>
                          <h3 className="font-serif text-xl font-bold text-foreground">
                            {facet.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {facet.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/60">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                        Key Tenets & Achievements
                      </h4>
                      <ul className="space-y-2">
                        {facet.attributes.map((attr, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-accent shrink-0" />
                            {attr}
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

      {/* ─── Verified Photographic Archive: Polo Tournaments & Club Leadership ─── */}
      <section className="relative border-t border-border/80 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="section-eyebrow flex items-center gap-2">
                <Camera className="size-3.5 text-accent" />
                Verified Equestrian Record
              </span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Polo Tournaments & Club Leadership in Action
              </h2>
              <p className="mt-2 text-lead text-muted-foreground max-w-2xl">
                Authentic photographic documentation from the Yola International Polo Tournament at Lamido Musdafa Ground, team patronage, and ceremonial trophy presentations across Nigerian circuits.
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
                id: "yola-polo-tournament-matchplay",
                title: "Yola International Polo Tournament Matchplay",
                subtitle: "Lamido Musdafa Ground, Yola",
                badge: "Live Tournament Action",
                detail: "High-intensity chukker action during the prestigious annual Yola International Polo Tournament, with top equine athletes and international players.",
              },
              {
                id: "yola-polo-club-patron-haske",
                title: "Yola Polo Club Presidential Leadership",
                subtitle: "Lamido Musdafa Polo Ground",
                badge: "Club President & Patron",
                detail: "Abdulrahman Bashir Haske as President of the Yola Polo Club, leading tournament delegations and consulting with traditional equestrian custodians.",
              },
              {
                id: "haske-williams-polo-team-celebration",
                title: "Haske & Williams Polo Team Victory",
                subtitle: "Chukker Champions",
                badge: "Podium Honours",
                detail: "Team celebration following a hard-fought cup victory on the pitch, reflecting athletic discipline, teamwork, and sportsmanship.",
              },
              {
                id: "equestrian-trophy-ceremony",
                title: "Prestigious Championship Cup Presentation",
                subtitle: "Tournament Finale",
                badge: "Championship Trophy",
                detail: "Ceremonial trophy presentation honoring tournament champions, patrons, and outstanding individual equine performers.",
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
                              {photo.badge}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="text-xs font-semibold text-white/90 flex items-center gap-1.5">
                              <MapPin className="size-3 text-accent" />
                              {imgData.location || "Yola, Adamawa State"}
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

      {/* Clubs & Circuits */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Tournaments & Club Affiliations
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              Major Circuits of Play
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CLUBS_AND_CIRCUITS.map((club, i) => (
              <Reveal key={club.name} variant="up" staggerIndex={i}>
                <div className="rounded-2xl border border-border/80 bg-card p-6 h-full flex flex-col justify-between hover:border-primary/40 transition-colors">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent block mb-2">
                      {club.role}
                    </span>
                    <h3 className="font-serif text-base font-bold text-foreground mb-2">
                      {club.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {club.note}
                    </p>
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
            Explore Awards & Recognitions
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            View the verified corporate, traditional, academic, and philanthropic honors conferred upon Abdulrahman Bashir Haske.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/awards">
                View Awards & Honors
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/biography">Full Biography</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
