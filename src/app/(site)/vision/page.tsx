import type { Metadata } from "next";
import Image from "next/image";
import { getSiteSetting, type VisionSettings } from "@/lib/queries/settings";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = { title: "Vision", description: "The stated vision of the Haske campaign for Adamawa State." };
export const revalidate = 60;

export default async function VisionPage() {
  const vision = await getSiteSetting<VisionSettings>("vision");

  return (
    <div>
      {/* Cinematic vision hero */}
      <div className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 animate-gradient opacity-25"
          style={{
            background: "linear-gradient(135deg, oklch(0.20 0.06 155), oklch(0.30 0.08 155), oklch(0.25 0.10 130), oklch(0.30 0.08 155))",
            backgroundSize: "400% 400%",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        {/* Glow orbs */}
        <div className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-primary-foreground/5 blur-[80px]" />

        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32">
          <Image
            src="/brand/adamawa-state-seal.png"
            alt="Adamawa State"
            width={80}
            height={80}
            className="mx-auto mb-6 size-20 rounded-full bg-white/95 object-contain p-2 shadow-lg ring-2 ring-accent/20 animate-slide-up"
          />
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-accent animate-slide-up animation-delay-100">Our Vision</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-serif text-3xl font-semibold leading-tight sm:text-5xl lg:text-6xl animate-slide-up animation-delay-200">
            {vision?.statement}
          </h1>
          {vision?.note && (
            <p className="mx-auto mt-6 max-w-xl text-lg text-primary-foreground/75 animate-slide-up animation-delay-300">{vision.note}</p>
          )}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </div>

      {/* Vision themes */}
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Sparkles className="size-5" />
          </div>
          <ContentStatusBadge status="PROPOSED" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {vision?.themes.map((t, i) => (
            <Card key={t.title} className="group overflow-hidden hover:shadow-elevated transition-all duration-300">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity group-hover:opacity-100" />
              <CardContent className="p-7">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <span className="text-lg font-bold">{i + 1}</span>
                </div>
                <h2 className="font-serif text-xl font-semibold text-primary">{t.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{t.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
