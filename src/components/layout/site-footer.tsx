import Link from "next/link";
import Image from "next/image";
import { SectionDivider } from "@/components/ui/section-divider";
import { getSiteSetting, type ContactSettings } from "@/lib/queries/settings";
import { ShieldCheck, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Profile & Career",
    links: [
      { href: "/biography", label: "Biography & Journey" },
      { href: "/timeline", label: "Interactive Timeline" },
      { href: "/awards", label: "Awards & Honors" },
      { href: "/mission", label: "Mission & Priorities" },
      { href: "/vision", label: "Vision for Adamawa" },
    ],
  },
  {
    title: "Enterprise & Trade",
    links: [
      { href: "/enterprise", label: "Commercial Ventures" },
      { href: "/agriculture", label: "Agribusiness & Rice Mill" },
      { href: "/global-engagement", label: "Global & African Trade" },
      { href: "/gallery", label: "Documentary Gallery" },
      { href: "/image-credits", label: "Image Credits" },
    ],
  },
  {
    title: "Impact & Foundation",
    links: [
      { href: "/foundation", label: "AB Haske Foundation" },
      { href: "/youth-education", label: "Youth & Education" },
      { href: "/sports-polo", label: "Sports & Polo Leadership" },
      { href: "/achievements", label: "Verified Impact Metrics" },
      { href: "/programs", label: "Public Programs" },
    ],
  },
  {
    title: "Leadership & Civic",
    links: [
      { href: "/leadership", label: "Leadership Covenant" },
      { href: "/public-service", label: "Public-Service Journey" },
      { href: "/manifesto", label: "2027 Manifesto" },
      { href: "/public-record", label: "Transparency Archive" },
      { href: "/speak-to-haske", label: "Speak to Haske Portal" },
      { href: "/contact", label: "Contact & Secretariats" },
    ],
  },
];

export async function SiteFooter() {
  const contact = await getSiteSetting<ContactSettings>("contact").catch(() => null);

  return (
    <footer className="relative border-t border-border/80 bg-gradient-to-b from-secondary/40 via-background to-secondary/20">
      {/* Top Accent Divider */}
      <SectionDivider tone="accent" opacity={20} position="absolute-top" />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-start justify-between gap-12">
          {/* Brand & Seals */}
          <div className="flex flex-col gap-5 max-w-sm">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/haske-logo.png"
                alt="Abdulrahman Bashir Haske"
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-full bg-white object-contain shadow-soft ring-2 ring-primary/20"
              />
              <Image
                src="/brand/apm-logo-official.png"
                alt="Allied Peoples Movement"
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-full bg-white object-contain shadow-soft ring-1 ring-border"
              />
              <div className="h-8 w-px bg-border" />
              <Image
                src="/brand/adamawa-state-seal.png"
                alt="Adamawa State Seal"
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-full bg-white object-contain shadow-soft ring-1 ring-border"
              />
            </div>

            <div>
              <p className="font-serif text-lg font-bold text-foreground">
                Haske Political Community
              </p>
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mt-0.5">
                Allied Peoples Movement &middot; Adamawa 2027
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                The official public transparency, policy consultation, and civic engagement platform of Abdulrahman Bashir Haske.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-[11px] font-semibold text-muted-foreground w-fit">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>Verified Civic Platform</span>
            </div>
          </div>

          {/* Link Columns */}
          <div className="grid grow grid-cols-2 gap-8 sm:grow-0 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">
                  {col.title}
                </h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact & Secretariat info */}
        {contact && (
          <div className="mt-14 grid gap-8 border-t border-border/80 pt-10 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Official Inquiries</h3>
              <ul className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground">
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Mail className="size-3.5 text-primary" /> {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Phone className="size-3.5 text-primary" /> {contact.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Campaign Secretariat</h3>
              <ul className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground">
                {contact.offices?.map((o) => (
                  <li key={o.name} className="flex items-start gap-2">
                    <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground/90">{o.name}</span>
                      <p className="text-[11px] text-muted-foreground">{o.address}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">Follow Haske</h3>
              <ul className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                {contact.socials?.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-background/50 px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      {s.label} <ArrowUpRight className="size-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Rights Bar */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80 pt-8 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Haske Community Platform &middot; Abdulrahman Bashir Haske. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/80 text-center sm:text-right">
            Content is labeled by type: Documented Record, Proposed Agenda, or Community Dialogue.
          </p>
        </div>
      </div>
    </footer>
  );
}
