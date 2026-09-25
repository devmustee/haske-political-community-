import Link from "next/link";
import Image from "next/image";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "About",
    links: [
      { href: "/biography", label: "Biography" },
      { href: "/achievements", label: "Achievements" },
      { href: "/mission", label: "Mission" },
      { href: "/vision", label: "Vision" },
    ],
  },
  {
    title: "Agenda",
    links: [
      { href: "/manifesto", label: "Manifesto" },
      { href: "/programs", label: "Programs" },
      { href: "/public-record", label: "Public Record" },
    ],
  },
  {
    title: "Engage",
    links: [
      { href: "/community", label: "Haske Community" },
      { href: "/events", label: "Events" },
      { href: "/media", label: "Media Center" },
      { href: "/speak-to-haske", label: "Speak to Haske" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/community-guidelines", label: "Community Guidelines" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-gradient-to-b from-secondary/40 to-secondary/20">
      {/* Top accent gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-start justify-between gap-10">
          {/* Logos */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/haske-logo.png"
                alt="Abdulrahman Bashir Haske"
                width={48}
                height={48}
                className="size-12 rounded-full shadow-sm ring-2 ring-primary/10"
              />
              <Image
                src="/brand/apm-logo-official.png"
                alt="Allied Peoples Movement"
                width={44}
                height={44}
                className="size-11 rounded-full shadow-sm"
              />
              <div className="mx-1 h-10 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
              <Image
                src="/brand/adamawa-state-seal.png"
                alt="Adamawa State"
                width={44}
                height={44}
                className="size-11 opacity-70"
              />
            </div>
            <p className="max-w-[220px] text-xs text-muted-foreground leading-relaxed">
              The official public platform for Adamawa&apos;s future.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grow grid-cols-2 gap-8 sm:grow-0 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold tracking-tight">{col.title}</h3>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary"
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

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Haske Community. Connect. Participate. Build Adamawa.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Content is labeled by type — documented record, proposed agenda, or community content — throughout this site.
          </p>
        </div>
      </div>
    </footer>
  );
}
