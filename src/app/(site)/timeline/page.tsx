import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getImageById } from "@/lib/images/library";
import {
  Calendar,
  GraduationCap,
  Briefcase,
  Factory,
  Trophy,
  Heart,
  Vote,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Award,
  Camera,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Career & Leadership Timeline | Abdulrahman Bashir Haske",
  description:
    "An interactive chronological timeline documenting Abdulrahman Bashir Haske's academic foundation, enterprise ventures, agro-industrial breakthroughs, polo patronage, philanthropy, and public-service journey.",
  openGraph: {
    title: "Career & Leadership Timeline | Abdulrahman Bashir Haske",
    description:
      "A complete chronological record of education, enterprise, agribusiness, philanthropy, and public leadership.",
  },
};

interface TimelineMilestone {
  era: string;
  year: string;
  title: string;
  category: string;
  icon: any;
  summary: string;
  keyFacts: string[];
  imageId?: string;
}

const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    era: "Academic Horizons",
    year: "Academic Foundation",
    title: "Information Systems & Executive Management",
    category: "Education & Credentials",
    icon: GraduationCap,
    imageId: "abdulrahman-haske-formal-traditional",
    summary:
      "Earned a Bachelor of Science degree in Information Systems from the American University of Nigeria (AUN) in Yola, followed by executive management and corporate strategy training at the world-renowned Manchester Business School (UK) and Lagos Business School.",
    keyFacts: [
      "B.Sc. in Information Systems, American University of Nigeria",
      "Executive education in Business Strategy, Manchester Business School (UK)",
      "Executive leadership programs at Lagos Business School",
    ],
  },
  {
    era: "Corporate Governance",
    year: "Boardroom Induction",
    title: "Member, Institute of Directors (IoD Nigeria)",
    category: "Corporate Governance",
    icon: Building2,
    summary:
      "Inducted into Nigeria's apex professional body for boardroom ethics and corporate governance, committing to highest standards of fiduciary responsibility, audit transparency, and institutional leadership.",
    keyFacts: [
      "Certified member of the Institute of Directors Nigeria",
      "Advanced modules in enterprise risk management and board fiduciary duties",
      "Champion of corporate transparency across private and public sectors",
    ],
  },
  {
    era: "Agro-Industrial Milestone",
    year: "Industrial Pioneer",
    title: "Commissioning of H&W Rice Company Complex",
    category: "Agribusiness & Industry",
    icon: Factory,
    imageId: "hw-rice-mill-facility-demsa",
    summary:
      "Engineered and commissioned a flagship 48 metric tons per day parboiled and polished rice processing mill in Adamawa State, creating an integrated agro-industrial value chain linking thousands of smallholder farmers directly to modern national markets.",
    keyFacts: [
      "48 tons/day processing capacity with optical color sorters",
      "4,500+ smallholder outgrowers supported along Benue and Gongola basins",
      "Massive reduction in post-harvest grain losses and regional import dependency",
    ],
  },
  {
    era: "Sporting Excellence",
    year: "Polo & Horsemanship",
    title: "Competitive Polo Player & Team Patron",
    category: "Sports & Culture",
    icon: Trophy,
    imageId: "yola-polo-tournament-matchplay",
    summary:
      "Elected President of Yola Polo Club and led Team Haske onto premier equestrian fields across Nigeria (Lagos Polo Club, Fifth Chukker Kaduna, Abuja Guards Polo Club, Kano Polo Club), winning high and medium goal honors while promoting northern Nigeria's historic horsemanship heritage.",
    keyFacts: [
      "President of Yola Polo Club (Lamido Musdafa Ground)",
      "Patron and active player on premier national polo circuits",
      "Preservation of traditional northern equestrian breeding and cavalry culture",
    ],
  },
  {
    era: "Pan-African Distinction",
    year: "Accra, Ghana (2023)",
    title: "African Humanitarian Award (AHA)",
    category: "International Distinction",
    icon: Award,
    imageId: "aha-ghana-haske-receiving-award",
    summary:
      "Conferred with the African Humanitarian Award at the prestigious African Heritage Awards ceremony in Accra, Ghana, alongside former African heads of state and continental business titans.",
    keyFacts: [
      "Recognized for grassroots humanitarian interventions and food security models",
      "Attended by former African presidents, diplomats, and international media",
      "Highlighted the catalytic role of youth leadership in African socio-economic transformation",
    ],
  },
  {
    era: "Humanitarian Impact",
    year: "Institutional Philanthropy",
    title: "Historic 80,000-Bag Grain Relief & ₦220M Cash Grants",
    category: "Philanthropy & Relief",
    icon: Heart,
    imageId: "ab-haske-foundation-ramadan-relief",
    summary:
      "Through the AB Haske Foundation, mobilized state-wide humanitarian logistics to disburse over 80,000 bags of food grain provisions and ₦220 Million in direct, unconditional cash sustenance to widows, elderly heads of households, and indigent families across all 21 LGAs.",
    keyFacts: [
      "80,000+ grain bags distributed across all 21 Local Government Areas",
      "₦220,000,000 directly disbursed to vulnerable households without middlemen",
      "Commissioning of 65+ solar water boreholes in arid rural communities",
    ],
  },
  {
    era: "Civic Leadership",
    year: "Grassroots Tour",
    title: "The 21-LGA Citizen Listening Tour",
    category: "Public Service",
    icon: Briefcase,
    imageId: "haske-grassroots-townhall-engagement",
    summary:
      "Undertook an exhaustive grassroots town hall tour through all 21 Local Government Areas of Adamawa State, meeting with traditional rulers, farmers, youth, educators, and market traders to build a grassroots-first governance covenant.",
    keyFacts: [
      "Personal visits to 140+ communities and all 21 local government councils",
      "Collection of thousands of citizen priority submissions",
      "Direct engagement fostering inter-ethnic harmony and religious peace",
    ],
  },
  {
    era: "The 2027 Mandate",
    year: "Electoral Covenant",
    title: "APM Gubernatorial Candidacy with Engr. Safriel Judson Glah",
    category: "Democratic Leadership",
    icon: Vote,
    imageId: "haske-declaration-podium-yola",
    summary:
      "Formally unveiled as the Allied Peoples Movement (APM) Gubernatorial Candidate for the 2027 Adamawa State election, pairing with veteran public engineer and retired NNPC senior executive Engr. Safriel Judson Glah on a platform of Competence, Integrity, and Shared Prosperity.",
    keyFacts: [
      "Unveiling of the 5-Pillar Haske 2027 Manifesto at Mahmud Ribadu Square",
      "Unified ticket bridging private sector dynamism with senior institutional governance",
      "Decentralized healthcare, agricultural industrialization, and civil service dignity",
    ],
  },
];

export default function TimelinePage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Chronological Record"
        title="Career & Leadership Timeline"
        description="A journey forged through academic rigor, private enterprise, agro-industrial investment, sporting discipline, institutional philanthropy, and an unwavering covenant of public service."
        primaryAction={{
          label: "View Biography",
          href: "/biography",
        }}
        secondaryAction={{
          label: "Leadership Vision",
          href: "/leadership",
        }}
      />

      {/* Timeline Section */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative border-l-2 border-primary/20 pl-6 sm:pl-10 space-y-16">
            {TIMELINE_MILESTONES.map((milestone, i) => {
              const Icon = milestone.icon;
              return (
                <div key={milestone.title} className="relative group">
                  {/* Glowing Node Dot */}
                  <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 size-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-primary group-hover:border-accent group-hover:scale-110 transition-all shadow-soft">
                    <div className="size-2.5 rounded-full bg-accent" />
                  </div>

                  <Reveal variant="left" staggerIndex={i}>
                    <SpotlightCard className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent">
                          {milestone.era}
                        </span>
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-mono font-bold text-foreground">
                          {milestone.year}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 ring-1 ring-primary/20">
                          <Icon className="size-5" />
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                          {milestone.title}
                        </h3>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                        {milestone.summary}
                      </p>

                      {milestone.imageId && (() => {
                        const imgData = getImageById(milestone.imageId);
                        if (!imgData) return null;
                        return (
                          <div className="my-5 overflow-hidden rounded-xl border border-border/80 bg-muted group">
                            <div className="relative aspect-[16/9] w-full overflow-hidden">
                              <Image
                                src={imgData.src}
                                alt={imgData.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, 650px"
                                placeholder={imgData.blurDataURL ? "blur" : undefined}
                                blurDataURL={imgData.blurDataURL}
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70" />
                              <div className="absolute top-2.5 left-2.5">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-accent shadow-sm border border-accent/20">
                                  <Camera className="size-3 text-accent" />
                                  Documentary Archive
                                </span>
                              </div>
                              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px]">
                                {imgData.location && (
                                  <span className="flex items-center gap-1 text-white/90 font-medium">
                                    <MapPin className="size-3 text-accent" />
                                    {imgData.location}
                                  </span>
                                )}
                                <Link
                                  href="/image-credits"
                                  className="text-accent hover:underline font-semibold ml-auto"
                                >
                                  {imgData.credit} &rarr;
                                </Link>
                              </div>
                            </div>
                            {imgData.caption && (
                              <div className="p-3 bg-secondary/40 text-[11px] text-muted-foreground leading-relaxed border-t border-border/60">
                                {imgData.caption}
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      <div className="pt-4 border-t border-border/60">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
                          Key Highlights
                        </h4>
                        <ul className="space-y-1.5">
                          {milestone.keyFacts.map((fact, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="size-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                              <span>{fact}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </SpotlightCard>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="border-t border-border/80 bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Connect with the Haske Movement
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Become an active partner in the transformation of Adamawa State. Join local volunteer networks or contact executive representatives.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/contact">
                Contact & Inquiries
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/register">Join Haske 2027 Community</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
