import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { PageHero } from "@/components/cms/page-hero";
import { FeedbackForm } from "@/components/cms/feedback-form";
import { FeedbackTracker } from "@/components/cms/feedback-tracker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Reveal } from "@/components/motion/reveal";
import {
  MessageSquare,
  LogIn,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  Lightbulb,
  AlertTriangle,
  GraduationCap,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Speak to Haske — Direct Civic Consultation",
  description: "Share an idea, report a community problem, ask a question, or give feedback on policy directly to Abdulrahman Bashir Haske.",
};

const CONSULTATION_CHANNELS = [
  {
    icon: Lightbulb,
    title: "Propose an Idea",
    description: "Policy concepts, job creation ideas, and civic innovations for Adamawa State.",
    badge: "Policy",
  },
  {
    icon: AlertTriangle,
    title: "Report an Urgent Need",
    description: "Roads, water access, primary healthcare, or power challenges in your ward.",
    badge: "Community",
  },
  {
    icon: GraduationCap,
    title: "Empowerment & Programs",
    description: "Feedback on agriculture inputs, youth scholarships, and skills initiatives.",
    badge: "Programs",
  },
  {
    icon: HelpCircle,
    title: "Direct Question",
    description: "Ask a direct question regarding Haske's agenda and campaign commitments.",
    badge: "Accountability",
  },
];

export default async function SpeakToHaskePage() {
  const session = await auth();

  return (
    <div>
      <PageHero
        eyebrow="Civic Consultation"
        title="Speak to Haske"
        description="A direct line between citizens and leadership. Propose solutions, highlight local challenges, or ask questions. Every submission receives a verifiable tracking ID."
        watermark="Engage"
        badge={
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
              <Zap className="size-3.5 text-accent" /> Instant ID
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-0.5 text-xs font-semibold text-accent-foreground">
              <Clock className="size-3.5 text-accent" /> 48h SLA Review
            </span>
          </div>
        }
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        {/* ─── 4 Pillars of Civic Input ─── */}
        <Reveal variant="blur" className="mb-12">
          <div className="text-center mb-8">
            <span className="section-eyebrow">Engagement Pathways</span>
            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              What would you like to bring to the table?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
              Your submissions are reviewed directly by the campaign policy and constituent engagement committees.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CONSULTATION_CHANNELS.map((channel, i) => {
              const Icon = channel.icon;
              return (
                <SpotlightCard
                  key={channel.title}
                  spotlightColor={i % 2 === 0 ? "gold" : "primary"}
                  className="p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-xs sm:text-[11px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-md">
                        {channel.badge}
                      </span>
                    </div>
                    <h3 className="font-serif font-semibold text-base text-foreground mb-1.5">
                      {channel.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {channel.description}
                    </p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </Reveal>

        {/* ─── Form & Tracker Section ─── */}
        <Reveal variant="scale" delay={150}>
          {session?.user ? (
            <div className="surface-glass-card rounded-3xl p-6 sm:p-10 shadow-elevated">
              <Tabs defaultValue="submit">
                <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-6">
                  <div>
                    <h3 className="font-serif text-xl font-bold">Civic Desk</h3>
                    <p className="text-xs text-muted-foreground">Logged in as {session.user.name ?? session.user.email}</p>
                  </div>
                  <TabsList className="bg-secondary/70 p-1 rounded-full">
                    <TabsTrigger value="submit" className="rounded-full px-5 py-1.5 text-xs font-semibold">
                      Submit Feedback
                    </TabsTrigger>
                    <TabsTrigger value="track" className="rounded-full px-5 py-1.5 text-xs font-semibold">
                      Track Status
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="submit" className="mt-0">
                  <FeedbackForm />
                </TabsContent>
                <TabsContent value="track" className="mt-0">
                  <FeedbackTracker isSignedIn />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <SpotlightCard
              spotlightColor="gold"
              className="p-8 sm:p-14 text-center border-accent/30 shadow-card-gold"
            >
              <div className="mx-auto flex size-18 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 via-accent/20 to-primary/10 text-primary ring-1 ring-accent/30 shadow-soft">
                <MessageSquare className="size-8 text-primary" />
              </div>

              <div className="mt-6 max-w-md mx-auto">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-foreground mb-3">
                  <ShieldCheck className="size-3.5 text-accent" /> Secure Citizen Access
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Sign in to Consult with Haske
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  To ensure transparency, prevent spam, and provide a verifiable tracking ID for every issue raised, citizens sign in before submitting.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" variant="gold-shimmer" className="px-8 shadow-glow-gold">
                  <Link href="/login?callbackUrl=/speak-to-haske">
                    <LogIn className="size-4" />
                    Sign In to Speak to Haske
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/manifesto">Explore Policy Agenda First</Link>
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-border/80 pt-6 text-xs text-muted-foreground">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Privacy Protected</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Sparkles className="size-4 text-accent" />
                  <span>Direct Escalation</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Clock className="size-4 text-primary" />
                  <span>Transparent Tracking</span>
                </div>
              </div>
            </SpotlightCard>
          )}
        </Reveal>
      </div>
    </div>
  );
}
