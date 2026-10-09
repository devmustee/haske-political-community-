import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { getImageById } from "@/lib/images/library";
import {
  GraduationCap,
  Laptop,
  BookOpen,
  Wrench,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  School,
  BrainCircuit,
  Compass,
  Camera,
  MapPin,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Youth Empowerment & Education Initiatives | Abdulrahman Bashir Haske",
  description:
    "Documenting Abdulrahman Bashir Haske's strategic investments in educational infrastructure, STEM educator stipends, tech skills bootcamps, and generational youth empowerment.",
  openGraph: {
    title: "Youth Empowerment & Education | Abdulrahman Bashir Haske",
    description:
      "STEM education, classroom rehabilitation, digital literacy hubs, and youth incubation across Adamawa State.",
  },
};

const EDUCATION_METRICS = [
  { value: "3,200+", label: "Youth Trained in Tech", detail: "Digital skills, solar engineering & vocational trades" },
  { value: "45+", label: "Classrooms Rehabilitated", detail: "Restored roofs, painted facilities & new dual-desks" },
  { value: "1,200+", label: "Exam Sponsorships", detail: "WAEC, NECO & JAMB registrations fully settled" },
  { value: "120+", label: "STEM Teachers Supported", detail: "Volunteer stipends in underserved rural schools" },
];

const YOUTH_PILLARS = [
  {
    icon: BrainCircuit,
    title: "STEM Teacher Recruitment & Rural Stipends",
    category: "Academic Quality",
    description:
      "Recognizing the severe deficit of mathematics, physics, biology, and chemistry instructors across northern secondary schools, Haske established a dedicated stipend subsidy to recruit, deploy, and retain qualified science teachers in rural secondary schools.",
    outcomes: [
      "120+ specialized STEM educators placed in underserved secondary schools",
      "Significant pass rate improvements in SSCE physics and mathematics",
      "Monthly incentive allowances preventing brain-drain to urban centers",
    ],
  },
  {
    icon: School,
    title: "Classroom Rehabilitation & Desks Initiative",
    category: "Infrastructure",
    description:
      "Ending the unacceptable situation of children learning on bare classroom floors or under leaking roofs. The initiative has renovated over 45 dilapidated classrooms, replacing corrugated roofings, installing chalkboards, and providing high-durability ergonomic dual-desks.",
    outcomes: [
      "Over 45 complete classroom blocks comprehensively overhauled",
      "2,500+ customized hardwood-and-metal dual-desks distributed",
      "Improved pupil attendance and protection from harsh weather conditions",
    ],
  },
  {
    icon: Laptop,
    title: "Digital Economy & Coding Bootcamps",
    category: "Technology",
    description:
      "Leveraging his academic foundation in Information Systems, Haske champions computer literacy for northeastern youth. Intensive coding cohorts, web design bootcamps, and cybersecurity introductions prepare young minds for remote freelancing and global tech careers.",
    outcomes: [
      "Hands-on coding bootcamps hosted across Yola and Mubi hubs",
      "Donation of desktop computers and high-speed satellite connectivity",
      "Graduates now earning remote income in software and content design",
    ],
  },
  {
    icon: Wrench,
    title: "Vocational Incubation & Clean Energy Trades",
    category: "Livelihoods",
    description:
      "Equipping school leavers and non-academic youth with practical skills in high-demand green economy sectors: solar PV system design, inverter maintenance, smart mobile repair, modern welding, and agro-processing equipment servicing.",
    outcomes: [
      "Over 1,400 youth certified in solar installation and electronics",
      "Starter toolkits gifted to top graduates upon program completion",
      "Apprenticeship pathways connected directly to agro-industrial workshops",
    ],
  },
  {
    icon: GraduationCap,
    title: "Indigent Tertiary Scholarships & Bursaries",
    category: "Higher Education",
    description:
      "Merit-based financial relief for indigent university and polytechnic students studying engineering, agriculture, computer science, and healthcare across federal and state institutions in Nigeria.",
    outcomes: [
      "Bursaries awarded across American University of Nigeria, Modibbo Adama University, and Adamawa State University",
      "Full academic tuition coverage for top-tier candidates facing dropout",
      "Mentorship access to enterprise and governance leaders",
    ],
  },
  {
    icon: Compass,
    title: "Youth Leadership & Civic Mentorship Series",
    category: "Civic Leadership",
    description:
      "Structured seminars instilling ethics, public sector integrity, financial literacy, and communal responsibility in young community builders, counteracting political thuggery and youth exploitation.",
    outcomes: [
      "Annual Youth Civic Summits gathering 1,000+ delegates per session",
      "Direct dialogue sessions connecting youth leaders with policymakers",
      "Promotion of peaceful communal cohesion and civic vigilance",
    ],
  },
];

export default function YouthEducationPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Human Capital Development"
        title="Youth Empowerment & Education"
        description="Building northern Nigeria's greatest resource: its human potential. From subsidizing rural STEM educators and modernizing classroom blocks to providing cutting-edge tech bootcamps, Abdulrahman Bashir Haske is opening doors of opportunity for the next generation."
        primaryAction={{
          label: "AB Haske Foundation",
          href: "/foundation",
        }}
        secondaryAction={{
          label: "Sports & Polo Leadership",
          href: "/sports-polo",
        }}
      />

      {/* Metrics Ribbon */}
      <section className="border-y border-border/80 bg-secondary/35 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {EDUCATION_METRICS.map((metric, i) => (
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

      {/* Philosophy / Strategic Approach */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal variant="left">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                  <BookOpen className="size-3.5" />
                  Strategic Human Capital
                </span>
                <h2 className="mt-4 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
                  No Society Can Rise Above the Quality of Its Classrooms
                </h2>
                <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                  <p>
                    A region blessed with vast land and vibrant young minds cannot prosper if its youth are denied modern learning environments and marketable 21st-century skills. For Abdulrahman Bashir Haske, education is not an expenditure; it is the most potent investment in regional security, economic growth, and social stability.
                  </p>
                  <p>
                    Having studied Information Systems at the American University of Nigeria and strategic management at Manchester Business School, Haske witnessed firsthand how digital tools and technical mastery level the global playing field for young people everywhere.
                  </p>
                  <p>
                    His programs avoid cosmetic handouts. Instead, they directly address the core educational value chain: <strong className="text-foreground">qualified teachers</strong>, <strong className="text-foreground">dignified physical classrooms</strong>, <strong className="text-foreground">technology immersion</strong>, and <strong className="text-foreground">practical trade certifications</strong>.
                  </p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal variant="right">
                <SpotlightCard className="p-8 border-primary/20 bg-gradient-to-b from-card via-card/95 to-primary/5">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20">
                    <Laptop className="size-7" />
                  </div>
                  <blockquote className="font-serif text-lg italic text-foreground leading-relaxed">
                    “Give a young Nigerian a laptop, reliable electricity, and high-speed internet, and they will compete with the brightest minds in Silicon Valley, London, or Singapore. Our young people do not lack intellect; they only lack the platform.”
                  </blockquote>
                  <div className="mt-6 pt-6 border-t border-border/80">
                    <p className="text-sm font-bold text-foreground">Abdulrahman Bashir Haske</p>
                    <p className="text-xs text-muted-foreground">Tech Entrepreneur & Youth Advocate</p>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Program Grid */}
      <section className="border-t border-border/80 bg-secondary/30 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Core Action Areas
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              Programs Equipping the Next Generation
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Targeted initiatives removing barriers to formal schooling, vocational independence, and technological innovation.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {YOUTH_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <Reveal key={pillar.title} variant="up" staggerIndex={i}>
                  <SpotlightCard className="h-full p-6 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                          <Icon className="size-6" />
                        </div>
                        <span className="text-xs sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent">
                          {pillar.category}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-border/60">
                      <h4 className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-foreground mb-2">
                        Key Outcomes
                      </h4>
                      <ul className="space-y-1.5">
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

      {/* ─── Verified Photographic Archive: Youth Incubation & Education ─── */}
      <section className="relative border-t border-border/80 bg-background py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="section-eyebrow flex items-center gap-2">
                <Camera className="size-3.5 text-accent" />
                Verified Educational Impact
              </span>
              <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
                Documented Youth Training & Classroom Upgrades
              </h2>
              <p className="mt-2 text-lead text-muted-foreground max-w-2xl">
                Authentic photographic documentation of ICT digital computer labs, classroom infrastructure renovations, STEM student support, and youth civic summits across Adamawa State.
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
                id: "youth-ict-digital-training",
                title: "Digital Economy & ICT Skills Bootcamps",
                subtitle: "Tech Literacy & Youth Incubation",
                badge: "3,200+ Trained",
                detail: "Young students engaged in computer lab ICT and digital skills training session in Yola, learning programming, web design, and digital literacy.",
              },
              {
                id: "classroom-educational-rehabilitation",
                title: "Primary School Renovation & Dual-Desks",
                subtitle: "Infrastructure Overhaul",
                badge: "45+ Blocks Renovated",
                detail: "Comprehensive overhaul of dilapidated classroom blocks, replacing leaky roofs, installing blackboards, and providing durable student dual-desks.",
              },
              {
                id: "stem-education-support-adamawa",
                title: "Secondary STEM Laboratory & Teacher Subsidies",
                subtitle: "Science & Engineering Education",
                badge: "120+ STEM Teachers",
                detail: "Providing science lab equipment, textbooks, and monthly volunteer teacher stipends to advance mathematics and science education in rural schools.",
              },
              {
                id: "youth-leadership-mentorship-summit",
                title: "Youth Leadership & Civic Mentorship Series",
                subtitle: "Civic Empowerment & Ethics",
                badge: "Civic Leadership",
                detail: "Mentorship sessions gathering hundreds of student leaders, young entrepreneurs, and community organizers to promote civic integrity and enterprise.",
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
                              {photo.badge}
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

      {/* Call to Action Banner */}
      <section className="border-t border-border/80 bg-primary text-primary-foreground py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Discover His Sports & Equestrian Leadership
          </h2>
          <p className="mt-3 text-sm text-primary-foreground/80 max-w-xl mx-auto">
            Explore Abdulrahman Bashir Haske’s distinguished career as an acclaimed polo player, patron, and advocate for equestrian excellence in Nigeria.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="gold-shimmer" size="lg">
              <Link href="/sports-polo">
                Sports & Polo Career
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/programs">View All Public Programs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
