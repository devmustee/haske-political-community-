"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <Image
            src="/brand/haske-logo.png"
            alt="Abdulrahman Bashir Haske"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full bg-white object-contain shadow-soft ring-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-elevated"
            priority
          />
          <div className="hidden sm:block xl:hidden 2xl:block">
            <span className="block font-serif text-base font-bold tracking-tight text-foreground leading-tight">
              Abdulrahman Bashir Haske
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-accent leading-none">
              Enterprise • Impact • Leadership
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex 2xl:gap-1">
          {/* About Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs 2xl:gap-1.5 2xl:px-3 font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
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
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs 2xl:gap-1.5 2xl:px-3 font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
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
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs 2xl:gap-1.5 2xl:px-3 font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
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
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs 2xl:gap-1.5 2xl:px-3 font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
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
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-1.5 text-xs 2xl:gap-1.5 2xl:px-3 font-semibold text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
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
              "whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold 2xl:px-3 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
              pathname.startsWith("/speak-to-haske") && "bg-primary/10 text-primary font-bold"
            )}
          >
            Speak to Haske
          </Link>

          {/* Direct Link: Contact */}
          <Link
            href="/contact"
            className={cn(
              "whitespace-nowrap rounded-full px-2 py-1.5 text-xs font-semibold 2xl:px-3 text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
              pathname.startsWith("/contact") && "bg-primary/10 text-primary font-bold"
            )}
          >
            Contact
          </Link>
        </nav>

        {/* Header Right Actions */}
        <div className="hidden shrink-0 items-center gap-2 xl:flex 2xl:gap-3">
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
          className="shrink-0 rounded-xl p-2 transition-colors hover:bg-secondary xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="size-6 text-foreground" /> : <Menu className="size-6 text-foreground" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {open && (
        <div className="max-h-[85vh] overflow-y-auto border-t border-border/80 bg-background/95 backdrop-blur-2xl px-5 pb-8 pt-4 xl:hidden animate-slide-up shadow-float">
          <nav className="flex flex-col gap-1">
            <p className="px-3 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              About & Profile
            </p>
            {ABOUT_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <p className="px-3 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Enterprise & Agriculture
            </p>
            {ENTERPRISE_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <p className="px-3 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Impact, Foundation & Sports
            </p>
            {IMPACT_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <p className="px-3 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Leadership & Manifesto
            </p>
            {LEADERSHIP_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <p className="px-3 pt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Media, Gallery & Secretariats
            </p>
            {MEDIA_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/speak-to-haske"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary text-primary font-bold"
            >
              Speak to Haske
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              Contact & Inquiries
            </Link>
          </nav>

          <div className="mt-5 flex flex-col gap-2.5 pt-4 border-t border-border/60">
            {session?.user ? (
              <Button asChild size="lg" className="w-full">
                <Link href="/community">Go to Community</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="gold-shimmer" size="lg" className="w-full shadow-glow-gold">
                  <Link href="/register">Join Haske Community</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
