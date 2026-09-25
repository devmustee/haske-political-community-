"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ABOUT_ITEMS = [
  { href: "/biography", label: "Biography" },
  { href: "/mission", label: "Mission" },
  { href: "/vision", label: "Vision" },
];

const NAV = [
  { href: "/achievements", label: "Achievements" },
  { href: "/programs", label: "Programs" },
  { href: "/manifesto", label: "Manifesto" },
  { href: "/events", label: "Events" },
  { href: "/media", label: "Media" },
  { href: "/speak-to-haske", label: "Speak to Haske" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const aboutActive = ABOUT_ITEMS.some((item) => pathname.startsWith(item.href));

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl backdrop-saturate-150">
      {/* Top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <Image
            src="/brand/haske-logo.png"
            alt="Abdulrahman Bashir Haske"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full shadow-sm ring-2 ring-primary/10 transition-all duration-200 group-hover:ring-primary/25 group-hover:shadow-md"
            priority
          />
          <span className="hidden whitespace-nowrap font-serif text-lg font-semibold tracking-tight sm:inline">
            Haske Community
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-0.5 xl:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-foreground",
                  aboutActive && "bg-primary/8 text-foreground"
                )}
              >
                About <ChevronDown className="size-3.5 transition-transform duration-200" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[160px]">
              {ABOUT_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-foreground",
                pathname.startsWith(item.href) && "bg-primary/8 text-foreground"
              )}
            >
              {item.label}
              {pathname.startsWith(item.href) && (
                <span className="absolute inset-x-3 -bottom-[11px] h-[2px] rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          {session?.user ? (
            <Button asChild>
              <Link href="/community">Go to Community</Link>
            </Button>
          ) : (
            <>
              <Link href="/login" className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-primary/5">
                Sign in
              </Link>
              <Button asChild>
                <Link href="/register">Join</Link>
              </Button>
            </>
          )}
        </div>

        <button className="shrink-0 rounded-lg p-2 transition-colors hover:bg-muted xl:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-lg px-4 pb-5 pt-3 xl:hidden animate-slide-up">
          <nav className="flex flex-col gap-0.5">
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">About</p>
            {ABOUT_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-primary/5",
                  pathname.startsWith(item.href) && "bg-primary/8 text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {session?.user ? (
              <Button asChild>
                <Link href="/community">Go to Community</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild>
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
