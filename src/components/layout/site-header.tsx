"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ChevronDown, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/sign-out";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ABOUT_ITEMS = [
  { href: "/biography", label: "Biography & Career" },
  { href: "/timeline", label: "Career & Leadership Timeline" },
  { href: "/awards", label: "Awards & Honors" },
  { href: "/mission", label: "Mission & Priorities" },
  { href: "/vision", label: "Vision for Adamawa" },
];

const ENTERPRISE_ITEMS = [
  { href: "/enterprise", label: "Commercial Ventures" },
  { href: "/agriculture", label: "Agribusiness & H&W Rice Mill" },
  { href: "/global-engagement", label: "Global Trade & AfCFTA" },
];

const IMPACT_ITEMS = [
  { href: "/foundation", label: "AB Haske Foundation" },
  { href: "/youth-education", label: "Youth & Education" },
  { href: "/sports-polo", label: "Sports & Polo Leadership" },
  { href: "/achievements", label: "Verified Impact & Metrics" },
  { href: "/programs", label: "Public Programs" },
];

const LEADERSHIP_ITEMS = [
  { href: "/leadership", label: "Leadership Covenant" },
  { href: "/public-service", label: "Public-Service Journey" },
  { href: "/manifesto", label: "2027 Manifesto" },
  { href: "/public-record", label: "Transparency Archive" },
];

const MEDIA_ITEMS = [
  { href: "/media", label: "Media Center & Speeches" },
  { href: "/gallery", label: "Documentary Photo Gallery" },
  { href: "/events", label: "Events & Town Halls" },
];

interface NavSection {
  id: string;
  title: string;
  items: { href: string; label: string; featured?: boolean }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: "about",
    title: "About & Profile",
    items: ABOUT_ITEMS,
  },
  {
    id: "enterprise",
    title: "Enterprise & Trade",
    items: ENTERPRISE_ITEMS,
  },
  {
    id: "impact",
    title: "Impact & Foundation",
    items: IMPACT_ITEMS,
  },
  {
    id: "leadership",
    title: "Leadership & Covenant",
    items: LEADERSHIP_ITEMS,
  },
  {
    id: "media",
    title: "Media & Dialogue",
    items: [
      ...MEDIA_ITEMS,
      { href: "/speak-to-haske", label: "Speak to Haske", featured: true },
      { href: "/contact", label: "Contact & Secretariats" },
    ],
  },
];

function sectionForPath(pathname: string): string | null {
  const matched = NAV_SECTIONS.find((s) =>
    s.items.some((item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)))
  );
  return matched?.id ?? null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(() => sectionForPath(pathname));

  // On navigation: expand the section containing the new page and close the
  // drawer. Done during render (not in an effect) to avoid a cascading render.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    const matched = sectionForPath(pathname);
    if (matched) setExpandedSection(matched);
    setOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isGroupActive = (items: { href: string }[]) =>
    items.some((item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-border/80 bg-background/85 backdrop-blur-2xl shadow-ambient"
          : "border-b border-border/50 bg-background/70 backdrop-blur-xl"
      )}
    >
      {/* Top Luminous Accent Line */}
      <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary opacity-90" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="group flex min-w-0 shrink items-center gap-3 max-[359px]:gap-2">
          <Image
            src="/brand/haske-logo.png"
            alt="Abdulrahman Bashir Haske"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full bg-white object-contain shadow-soft ring-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-elevated"
            priority
          />
          {/* The tagline shows only from sm to xl: phones lack the width, and
              from xl the full desktop nav shares this row (capped at
              max-w-7xl, 1280px, at every larger width too), so the name also
              drops a size there. */}
          <div className="min-w-0">
            <span className="block truncate font-serif text-sm font-bold tracking-tight text-foreground leading-tight max-[359px]:text-[13px] sm:text-base xl:text-sm">
              Abdulrahman Bashir Haske
            </span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-accent leading-none sm:block xl:hidden">
              Enterprise • Impact • Leadership
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex">
          {/* About Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
                  isGroupActive(ABOUT_ITEMS) && "bg-primary/10 text-primary font-bold"
                )}
              >
                About <ChevronDown className="size-3 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[210px] rounded-2xl p-1.5 shadow-elevated">
              {ABOUT_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="rounded-xl px-3 py-2 text-xs font-semibold">
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enterprise Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
                  isGroupActive(ENTERPRISE_ITEMS) && "bg-primary/10 text-primary font-bold"
                )}
              >
                Enterprise <ChevronDown className="size-3 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[230px] rounded-2xl p-1.5 shadow-elevated">
              {ENTERPRISE_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="rounded-xl px-3 py-2 text-xs font-semibold">
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Impact Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
                  isGroupActive(IMPACT_ITEMS) && "bg-primary/10 text-primary font-bold"
                )}
              >
                Impact & Foundation <ChevronDown className="size-3 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[220px] rounded-2xl p-1.5 shadow-elevated">
              {IMPACT_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="rounded-xl px-3 py-2 text-xs font-semibold">
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Leadership Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
                  isGroupActive(LEADERSHIP_ITEMS) && "bg-primary/10 text-primary font-bold"
                )}
              >
                Leadership <ChevronDown className="size-3 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[210px] rounded-2xl p-1.5 shadow-elevated">
              {LEADERSHIP_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="rounded-xl px-3 py-2 text-xs font-semibold">
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Media & Gallery Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
                  isGroupActive(MEDIA_ITEMS) && "bg-primary/10 text-primary font-bold"
                )}
              >
                Media & Gallery <ChevronDown className="size-3 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[210px] rounded-2xl p-1.5 shadow-elevated">
              {MEDIA_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="rounded-xl px-3 py-2 text-xs font-semibold">
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Direct Link: Speak to Haske */}
          <Link
            href="/speak-to-haske"
            className={cn(
              "whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
              pathname.startsWith("/speak-to-haske") && "bg-primary/10 text-primary font-bold"
            )}
          >
            Speak to Haske
          </Link>

          {/* Direct Link: Contact */}
          <Link
            href="/contact"
            className={cn(
              "whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
              pathname.startsWith("/contact") && "bg-primary/10 text-primary font-bold"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Header Right Actions */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          {session?.user ? (
            <Button asChild size="sm" variant="default" className="shadow-soft">
              <Link href="/community">
                <Sparkles className="size-3.5 text-accent" />
                Community Hub
              </Link>
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              >
                Sign In
              </Link>
              <Button asChild size="sm" variant="gold-shimmer" className="shadow-glow-gold">
                <Link href="/register">Join Haske 2027</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-secondary xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="size-6 text-foreground" /> : <Menu className="size-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {open && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/50 backdrop-blur-xs xl:hidden animate-fade-in"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      {open && (
        <div className="relative z-40 max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-border/80 bg-background/98 backdrop-blur-2xl px-4 pb-safe pt-3 xl:hidden animate-slide-up shadow-float">
          {/* Quick Direct Link / Top strip */}
          <div className="mb-2 flex items-center justify-between px-2 pt-1">
            <span className="text-xs sm:text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Platform Navigation
            </span>
            <span className="text-xs sm:text-[10px] font-mono text-muted-foreground">
              Adamawa 2027
            </span>
          </div>

          {/* Accordion Categories */}
          <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
            {NAV_SECTIONS.map((section) => {
              const isExpanded = expandedSection === section.id;
              const hasActiveChild = section.items.some(
                (item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
              );

              return (
                <div
                  key={section.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-all duration-200",
                    isExpanded
                      ? "border-primary/30 bg-primary/[0.03] shadow-xs"
                      : "border-border/60 bg-secondary/30 hover:border-border"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    aria-expanded={isExpanded}
                    className="flex w-full min-h-[44px] items-center justify-between px-3.5 py-2.5 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {hasActiveChild && (
                        <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                      )}
                      <span
                        className={cn(
                          "text-xs font-bold tracking-tight",
                          hasActiveChild ? "text-primary" : "text-foreground"
                        )}
                      >
                        {section.title}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-180 text-primary"
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border/50 px-2 py-1.5 space-y-0.5 animate-fade-in">
                      {section.items.map((item) => {
                        const isActive =
                          pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex min-h-[40px] items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all active:scale-[0.99]",
                              isActive
                                ? "bg-primary text-primary-foreground font-semibold shadow-soft"
                                : item.featured
                                ? "text-accent font-semibold hover:bg-accent/10"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <span>{item.label}</span>
                            {isActive && (
                              <span className="text-xs sm:text-[10px] font-mono tracking-wider opacity-80 uppercase">
                                Current
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action CTA Buttons */}
          <div className="mt-4 flex flex-col gap-2.5 border-t border-border/60 pt-4">
            {session?.user ? (
              <>
                <Button asChild size="lg" className="w-full">
                  <Link href="/community" onClick={() => setOpen(false)}>
                    <Sparkles className="size-4 text-accent" />
                    Go to Community Hub
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={signOutUser}>
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild variant="gold-shimmer" size="lg" className="w-full shadow-glow-gold">
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Join Haske Community
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
