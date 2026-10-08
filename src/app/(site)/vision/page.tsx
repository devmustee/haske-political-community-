import type { Metadata } from "next";
import Image from "next/image";
import { getSiteSetting, type VisionSettings } from "@/lib/queries/settings";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionDivider } from "@/components/ui/section-divider";
import { Sparkles, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Vision — A Prosperous, Inclusive & Secure Adamawa",
  description: "The stated long-term vision and strategic pillars of Abdulrahman Bashir Haske for the transformation of Adamawa State.",
};
export const revalidate = 60;

export default async function VisionPage() {
  const vision = await getSiteSetting<VisionSettings>("vision");

  return (
    <div>
      {/* Cinematic Vision Hero */}
      <div className="relative overflow-hidden border-b border-border/80 bg-primary text-primary-foreground">
        {/* Animated Aurora */}
        <div
          className="absolute inset-0 animate-aurora opacity-30"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.20 0.07 152), oklch(0.28 0.085 152), oklch(0.24 0.10 135), oklch(0.28 0.085 152))",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />

        {/* Glow Orbs */}
        <div className="pointer-events-none absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/20 blur-[130px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -right-32 -bottom-32 h-[400px] w-[400px] rounded-full bg-primary-foreground/10 blur-[90px]" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <Image
            src="/brand/adamawa-state-seal.png"
            alt="Adamawa State Seal"
            width={88}
            height={88}
            className="mx-auto mb-6 size-22 rounded-full bg-white/95 object-contain p-2 shadow-float ring-2 ring-accent/30 animate-slide-up"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-accent backdrop-blur-md mb-6 animate-slide-up animation-delay-100">
            <Compass className="size-3.5 text-accent" /> Strategic Mandate 2027
          </div>
          <h1 className="mx-auto max-w-3xl text-fluid-h1 font-bold leading-tight sm:text-5xl lg:text-6xl animate-slide-up animation-delay-200">
            {vision?.statement}
          </h1>
          {vision?.note && (
            <p className="mx-auto mt-6 max-w-xl text-lead leading-relaxed text-primary-foreground/80 animate-slide-up animation-delay-300">
              {vision.note}
            </p>
          )}
        </div>
        <SectionDivider tone="accent" opacity={50} />
      </div>

      {/* Vision Themes Grid */}
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="flex items-center justify-between gap-4 mb-12">
          <div>
            <span className="section-eyebrow">Strategic Themes</span>
            <h2 className="mt-2 text-fluid-h2 font-bold text-foreground">
              Core Pillars of the 2027 Vision
            </h2>
          </div>
          <ContentStatusBadge status="PROPOSED" />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2">
          {vision?.themes.map((t, i) => (
            <Reveal key={t.title} variant="scale" delay={Math.min(i, 5) * 80}>
              <SpotlightCard
                spotlightColor={i % 2 === 0 ? "gold" : "primary"}
                className="p-8 h-full flex flex-col justify-between shadow-elevated"
              >
                <div>
                  <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <span className="font-serif text-xl font-bold">{i + 1}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-body leading-relaxed text-muted-foreground">
                    {t.description}
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
