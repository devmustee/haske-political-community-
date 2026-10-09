import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/cms/page-hero";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/cms/contact-form";
import {
  Mail,
  MapPin,
  Phone,
  Building2,
  MessageSquare,
  HelpCircle,
  FileCheck2,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Institutional Inquiries | Abdulrahman Bashir Haske",
  description:
    "Direct contact channels for executive engagements, the AB Haske Foundation desk, media accreditation, and the Haske 2027 campaign secretariat.",
  openGraph: {
    title: "Contact & Inquiries | Abdulrahman Bashir Haske",
    description:
      "Institutional contact desks in Yola and Abuja for enterprise, philanthropic, and civic engagement.",
  },
};

const SECRETARIAT_OFFICES = [
  {
    city: "Yola Executive Secretariat",
    address: "Haske Community Directorate, Lamido Zubairu Way, Jimeta-Yola, Adamawa State, Nigeria",
    role: "State Operations, Community Relations & AB Haske Foundation Headquarters",
    email: "secretariat@haske.community",
    phone: "+234 (0) 700 00 HASKE",
  },
  {
    city: "Abuja Liaison Office",
    address: "Central Business District / Maitama Diplomatic Enclave, Abuja FCT, Nigeria",
    role: "Inter-State Partnerships, Investor Relations & Policy Directorate",
    email: "liaison@haske.community",
    phone: "+234 (0) 700 00 HASKE",
  },
];

const INQUIRY_DESKS = [
  {
    icon: Building2,
    title: "Enterprise & Agro-Industrial Desk",
    email: "enterprise@haske.community",
    detail: "For H&W Rice Company inquiries, grain off-take partnerships, and agritech collaborations.",
  },
  {
    icon: HelpCircle,
    title: "AB Haske Foundation Desk",
    email: "foundation@haske.community",
    detail: "For community water borehole requests, emergency healthcare sponsorships, and indigent relief verification.",
  },
  {
    icon: FileCheck2,
    title: "Press & Media Accreditation",
    email: "media@haske.community",
    detail: "Official media interviews, documentary filming requests, and executive speech transcripts.",
  },
  {
    icon: MessageSquare,
    title: "Civic & Grassroots Dialogue",
    email: "grassroots@haske.community",
    detail: "Direct citizen submissions for the 2027 Manifesto steering committee and volunteer mobilization.",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        badge="Official Secretariats"
        title="Contact & Executive Inquiries"
        description="Connect with the executive office of Abdulrahman Bashir Haske, the AB Haske Foundation, or the Haske 2027 Campaign Secretariat. We welcome institutional partnerships, civic proposals, and community dialogues."
        primaryAction={{
          label: "Speak to Haske Portal",
          href: "/speak-to-haske",
        }}
        secondaryAction={{
          label: "Media Center",
          href: "/media",
        }}
      />

      {/* Contact Desks Grid */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Dedicated Desks
            </span>
            <h2 className="mt-3 font-serif text-fluid-h2 font-bold tracking-tight text-foreground">
              Direct Institutional Channels
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Direct your communication to the appropriate desk to ensure rapid, professional review.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-20">
            {INQUIRY_DESKS.map((desk, i) => {
              const Icon = desk.icon;
              return (
                <Reveal key={desk.title} variant="up" staggerIndex={i}>
                  <SpotlightCard className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 ring-1 ring-primary/20">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-serif text-base font-bold text-foreground mb-2">
                        {desk.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground mb-4">
                        {desk.detail}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-border/60">
                      <a
                        href={`mailto:${desk.email}`}
                        className="text-xs font-bold text-primary hover:text-primary-hover flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="size-3.5 text-accent" />
                        {desk.email}
                      </a>
                    </div>
                  </SpotlightCard>
                </Reveal>
              );
            })}
          </div>

          {/* Offices & Direct Message Form */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
            <div className="min-w-0 lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent block">
                Official Secretariats
              </span>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                Executive & Regional Offices
              </h3>

              {SECRETARIAT_OFFICES.map((office, idx) => (
                <SpotlightCard key={office.city} className="p-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-1">
                    {office.role}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-foreground mb-3">
                    {office.city}
                  </h4>
                  <div className="space-y-2.5 text-xs text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <MapPin className="size-4 text-accent shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="size-4 text-accent shrink-0" />
                      <span className="min-w-0 break-all">{office.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="size-4 text-accent shrink-0" />
                      <span>Monday – Friday: 8:30 AM – 5:30 PM WAT</span>
                    </p>
                  </div>
                </SpotlightCard>
              ))}
            </div>

            <div className="min-w-0 lg:col-span-7">
              <SpotlightCard className="p-5 sm:p-10 border-primary/20">
                <span className="text-xs font-bold uppercase tracking-wider text-accent block mb-1">
                  Send a Direct Message
                </span>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                  Executive Correspondence Portal
                </h3>

                <ContactForm />
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>

      {/* Community Callout */}
      <section className="border-t border-border/80 bg-secondary/30 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 ring-1 ring-primary/20">
                <ShieldCheck className="size-6 text-accent" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-foreground">
                  Looking to raise a localized community issue?
                </h4>
                <p className="text-xs text-muted-foreground">
                  Use our specialized Speak to Haske portal for mapped civic tracking across Adamawa LGAs.
                </p>
              </div>
            </div>
            <Button asChild variant="default" size="sm">
              <Link href="/speak-to-haske">
                Go to Speak to Haske Portal
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
