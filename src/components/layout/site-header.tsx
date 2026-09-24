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
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image src="/brand/haske-logo.png" alt="Abdulrahman Bashir Haske" width={40} height={40} className="size-10 shrink-0 rounded-full" priority />
          <span className="hidden whitespace-nowrap font-serif text-lg font-semibold sm:inline">Haske Community</span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-0.5 xl:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  aboutActive && "bg-muted text-foreground"
                )}
              >
                About <ChevronDown className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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
                "whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname.startsWith(item.href) && "bg-muted text-foreground"
              )}
            >
              {item.label}
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
              <Link href="/login" className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Button asChild>
                <Link href="/register">Join</Link>
              </Button>
            </>
          )}
        </div>

        <button className="shrink-0 p-2 xl:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-2 xl:hidden">
          <nav className="flex flex-col gap-1">
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">About</p>
            {ABOUT_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="my-1 border-t border-border" />
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
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
