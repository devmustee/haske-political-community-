"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/biography", label: "Biography" },
  { href: "/achievements", label: "Achievements" },
  { href: "/programs", label: "Programs" },
  { href: "/manifesto", label: "Agenda" },
  { href: "/events", label: "Events" },
  { href: "/media", label: "Media" },
  { href: "/speak-to-haske", label: "Speak to Haske" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/brand/haske-logo.png" alt="Abdulrahman Bashir Haske" width={40} height={40} className="size-10 rounded-full" priority />
          <span className="hidden font-serif text-lg font-semibold sm:inline">Haske Community</span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground xl:px-3.5",
                pathname.startsWith(item.href) && "bg-muted text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {session?.user ? (
            <Button asChild>
              <Link href="/community">Go to Community</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Join Haske Community</Link>
              </Button>
            </>
          )}
        </div>

        <button className="p-2 lg:hidden" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
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
