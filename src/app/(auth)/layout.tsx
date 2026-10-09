import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Users, MessageSquare } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr] bg-background">
      {/* ─── Left Panel: Interactive Auth Sanctuary ─── */}
      <div className="relative flex flex-col justify-between p-4 sm:p-10 lg:p-14">
        {/* Subtle Ambient Background Light */}
        <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-primary/5 blur-[90px]" />

        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/brand/haske-logo.png"
              alt="Abdulrahman Bashir Haske"
              width={44}
              height={44}
              className="size-11 rounded-full bg-white object-contain shadow-soft ring-2 ring-primary/10 transition-all duration-300 group-hover:ring-primary/30 group-hover:shadow-elevated"
              priority
            />
            <div>
              <span className="font-serif text-lg font-semibold tracking-tight text-foreground block">
                Haske Community
              </span>
              <span className="text-xs sm:text-[11px] font-bold uppercase tracking-[0.14em] text-primary block">
                Adamawa 2027
              </span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Official Platform
          </div>
        </div>

        {/* Form Container */}
        <div className="relative mx-auto w-full max-w-md py-6 sm:py-14">
          {children}
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Haske Community. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors max-sm:inline-flex max-sm:items-center max-sm:min-h-11 max-sm:px-1.5">Privacy</Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-foreground transition-colors max-sm:inline-flex max-sm:items-center max-sm:min-h-11 max-sm:px-1.5">Terms</Link>
            <span>&middot;</span>
            <Link href="/community-guidelines" className="hover:text-foreground transition-colors max-sm:inline-flex max-sm:items-center max-sm:min-h-11 max-sm:px-1.5">Guidelines</Link>
          </div>
        </div>
      </div>

      {/* ─── Right Panel: Cinematic Civic Showcase ─── */}
      <div className="relative hidden overflow-hidden bg-primary lg:flex flex-col justify-between p-12 lg:p-16 text-primary-foreground">
        {/* Animated Aurora & Depth Layers */}
        <div
          className="absolute inset-0 animate-aurora opacity-35"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.20 0.07 152), oklch(0.28 0.085 152), oklch(0.24 0.10 135), oklch(0.28 0.085 152))",
          }}
        />

        {/* Ceremonial Background Texture */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Radiant Ambient Orbs */}
        <div className="pointer-events-none absolute -right-20 top-20 h-96 w-96 rounded-full bg-accent/20 blur-[130px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -left-20 bottom-1/4 h-80 w-80 rounded-full bg-primary-foreground/10 blur-[100px]" />

        {/* Top Badges */}
        <div className="relative flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
            <Image
              src="/brand/apm-logo-official.png"
              alt="APM"
              width={20}
              height={20}
              className="size-5 rounded-full bg-white object-contain p-0.5"
            />
            <span>Allied Peoples Movement (APM)</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono tracking-wider text-accent font-semibold uppercase">
              Adamawa 2027 Vision
            </span>
          </div>
        </div>

        {/* Center: Hero Portrait in Glass Frame */}
        <div className="relative my-auto flex flex-col items-center">
          <div className="relative">
            {/* Glowing Backdrop Aura */}
            <div className="absolute -inset-4 rounded-3xl bg-accent/25 blur-3xl animate-pulse-glow" />
            <div className="relative overflow-hidden rounded-3xl border-2 border-accent/40 bg-white shadow-float ring-1 ring-white/20 p-1">
              <Image
                src="/brand/portrait-haske-traditional.png"
                alt="Abdulrahman Bashir Haske - Governorship Candidate"
                width={614}
                height={466}
                className="w-72 sm:w-80 rounded-[22px] object-cover"
                priority
              />
            </div>

            {/* Floating Accolade Badge */}
            <div className="absolute -bottom-4 -left-3 rounded-2xl border border-accent/40 bg-primary/95 px-4 py-2.5 shadow-elevated backdrop-blur-md">
              <p className="text-xs sm:text-[11px] font-bold uppercase tracking-widest text-accent">Adamawa State</p>
              <p className="text-sm font-extrabold text-primary-foreground">2027 Mandate</p>
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="mt-10 text-center max-w-md">
            <p className="font-serif text-2xl font-semibold leading-snug text-primary-foreground">
              &ldquo;Building a prosperous, inclusive and secure Adamawa.&rdquo;
            </p>
            <p className="mt-3 text-sm text-primary-foreground/75 leading-relaxed">
              Join thousands of citizens actively shaping policy, proposing ideas, and building our collective future.
            </p>
          </div>
        </div>

        {/* Bottom Civic Features Ticker */}
        <div className="relative grid grid-cols-3 gap-3 border-t border-primary-foreground/15 pt-6 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <ShieldCheck className="size-5 text-accent" />
            <span className="text-xs sm:text-[11px] font-semibold text-primary-foreground/90">Verified Civic Voice</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <MessageSquare className="size-5 text-accent" />
            <span className="text-xs sm:text-[11px] font-semibold text-primary-foreground/90">Direct Dialogue</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Users className="size-5 text-accent" />
            <span className="text-xs sm:text-[11px] font-semibold text-primary-foreground/90">21 LGAs Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
