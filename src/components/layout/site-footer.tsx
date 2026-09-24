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
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="flex items-center gap-3">
            <Image src="/brand/haske-logo.png" alt="Abdulrahman Bashir Haske" width={44} height={44} className="size-11 rounded-full" />
            <Image src="/brand/apm-logo-official.png" alt="Allied Peoples Movement" width={40} height={40} className="size-10 rounded-full" />
            <div className="mx-1 h-8 w-px bg-border" />
            <Image src="/brand/adamawa-state-seal.png" alt="Adamawa State" width={40} height={40} className="size-10 opacity-80" />
          </div>
          <div className="grid grow grid-cols-2 gap-8 sm:grow-0 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Haske Community. Connect. Participate. Build Adamawa.
          </p>
          <p className="text-xs text-muted-foreground">
            Content is labeled by type — documented record, proposed agenda, or community content — throughout this site.
          </p>
        </div>
      </div>
    </footer>
  );
}
