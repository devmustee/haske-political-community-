import type { Metadata } from "next";
import Image from "next/image";
import { WifiOff } from "lucide-react";
import { RetryButton } from "./retry-button";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

/** Served by the service worker (public/sw.js) when a page can't load. Must stay fully static. */
export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-primary px-6 text-center text-primary-foreground">
      {/* unoptimized: serve the plain /brand URL, which the service worker precaches. */}
      <Image
        src="/brand/haske-logo.png"
        alt="Haske Community"
        width={72}
        height={72}
        unoptimized
        className="size-18 rounded-full bg-white object-contain p-1 ring-2 ring-accent/50"
      />
      <WifiOff className="mt-8 size-8 text-accent" />
      <h1 className="mt-3 font-serif text-2xl font-bold">You&apos;re offline</h1>
      <p className="mt-2 max-w-xs text-sm text-primary-foreground/80">
        Check your connection, then try again. Haske Community needs the internet to load new pages.
      </p>
      <RetryButton />
    </main>
  );
}
