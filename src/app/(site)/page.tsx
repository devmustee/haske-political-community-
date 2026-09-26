import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSiteSetting, type BiographySettings, type MissionSettings, type VisionSettings } from "@/lib/queries/settings";
import { getFeedPosts } from "@/lib/queries/posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { PostCard } from "@/components/community/post-card";
import { Timeline } from "@/components/cms/timeline";
import { AgendaTabs } from "@/components/cms/agenda-tabs";
import { formatDate } from "@/lib/utils";
import { ArrowRight, Calendar, MapPin, Star, Users, BookOpen, Play, ChevronRight } from "lucide-react";

export const revalidate = 30;

export default async function HomePage() {
  const [bio, mission, vision, achievements, programs, pillars, upcomingEvents, media, timeline, feedPosts] = await Promise.all([
    getSiteSetting<BiographySettings>("biography"),
    getSiteSetting<MissionSettings>("mission"),
    getSiteSetting<VisionSettings>("vision"),
    prisma.achievement.findMany({ where: { featured: true, contentStatus: { notIn: ["DRAFT"] } }, take: 3, orderBy: { order: "asc" } }),
    prisma.program.findMany({ where: { contentStatus: { notIn: ["DRAFT"] } }, take: 4 }),
    prisma.policyPillar.findMany({ take: 7, orderBy: { order: "asc" } }),
    prisma.event.findMany({ where: { status: "UPCOMING" }, orderBy: { date: "asc" }, take: 3 }),
    prisma.mediaCenterItem.findMany({ where: { contentStatus: { notIn: ["DRAFT"] } }, orderBy: { date: "desc" }, take: 3 }),
    prisma.timelineEvent.findMany({ orderBy: { order: "asc" }, take: 4 }),
    getFeedPosts({ tab: "latest", take: 3 }),
  ]);

  return (
    <div>
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 animate-gradient opacity-30"
          style={{
            background: "linear-gradient(135deg, oklch(0.20 0.06 155), oklch(0.30 0.08 155), oklch(0.25 0.10 130), oklch(0.30 0.08 155))",
            backgroundSize: "400% 400%",
          }}
        />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        {/* Radial glow behind portrait */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.4fr_0.6fr] lg:py-32 lg:text-left">
          <div className="text-center lg:text-left">
            {/* APM badge */}
            <div className="flex items-center justify-center gap-2.5 lg:justify-start animate-slide-up">
              <Image
                src="/brand/apm-logo-official.png"
                alt="Allied Peoples Movement"
                width={40}
                height={40}
                className="size-10 rounded-full bg-white/90 object-contain p-0.5 shadow-lg"
              />
              <Badge className="min-w-0 whitespace-normal text-center border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm sm:whitespace-nowrap">
                APM Governorship Candidate &middot; Adamawa 2027
              </Badge>
            </div>

            {/* Name headline */}
            <h1 className="mx-auto mt-8 max-w-2xl lg:mx-0 animate-slide-up animation-delay-100">
              <span className="block text-mega text-primary-foreground">Abdulrahman</span>
              <span className="block text-mega text-gradient-gold mt-1">Haske</span>
            </h1>

            {/* Tagline */}
            <p className="mx-auto mt-8 max-w-xl text-xl leading-relaxed text-primary-foreground/80 lg:mx-0 animate-slide-up animation-delay-200">
              Building a more prosperous, inclusive and secure Adamawa.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start animate-slide-up animation-delay-300">
              <Button asChild size="lg" variant="gold" className="shadow-glow-gold">
                <Link href="/vision">
                  <Star className="size-4" />
                  Explore the Vision
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-primary-foreground/5 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/15 hover:border-primary-foreground/50">
                <Link href="/community">
                  <Users className="size-4" />
                  Join Haske Community
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/manifesto">
                  <BookOpen className="size-4" />
                  Read the Agenda
                </Link>
              </Button>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm animate-slide-up animation-delay-400">
            <div className="absolute -inset-4 -z-10 rounded-full bg-accent/20 blur-3xl animate-pulse-glow" />
            <div className="overflow-hidden rounded-3xl border-2 border-accent/30 bg-white shadow-float ring-1 ring-white/10">
              <Image
                src="/brand/portrait.png"
                alt="Abdulrahman Bashir Haske"
                width={614}
                height={466}
                className="w-full"
                priority
              />
            </div>
            {/* Decorative floating badge */}
            <div className="absolute -bottom-3 -left-3 rounded-2xl border border-accent/30 bg-primary/90 px-4 py-2.5 shadow-elevated backdrop-blur-sm">
              <p className="text-xs font-medium text-accent">Adamawa State</p>
              <p className="text-sm font-bold text-primary-foreground">2027 Candidate</p>
            </div>
          </div>
        </div>

        {/* Bottom gradient border */}
        <div className="h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
        <p className="watermark-text inset-x-0 top-0 text-center">Haske</p>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="eyebrow-bar">About Haske</p>
              <h2 className="mt-5 font-serif text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Who is Abdulrahman Bashir Haske?
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{bio?.paragraphs[0]}</p>
              <p className="mt-4 max-w-xl text-muted-foreground">{bio?.paragraphs[1]}</p>
              <Link href="/biography" className="group mt-6 inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80 transition-colors">
                Read the full biography
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/50 to-secondary/20 p-7 shadow-soft backdrop-blur-sm">
              <ContentStatusBadge status="DOCUMENTED" />
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                Businessman, entrepreneur, philanthropist and politician from Adamawa State. Studied Information Systems at
                the American University of Nigeria, Yola.
              </p>
              <div className="mt-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <div className="mt-5 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">21</p>
                  <p className="text-xs text-muted-foreground">LGAs statewide</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">7</p>
                  <p className="text-xs text-muted-foreground">Policy Pillars</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ JOURNEY ═══════════════════ */}
      {timeline.length > 0 && (
        <section className="relative border-t border-border bg-gradient-to-b from-secondary/30 to-background">
          {/* Decorative top gradient line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-24">
            <p className="section-eyebrow">His Journey</p>
            <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl lg:text-4xl">An interactive timeline</h2>
            <div className="mt-10">
              <Timeline items={timeline} />
            </div>
            <Link href="/biography" className="group mt-8 inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80 transition-colors">
              See the full timeline <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}

      {/* ═══════════════════ ACHIEVEMENTS ═══════════════════ */}
      {achievements.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="flex items-end justify-between">
            <div>
              <p className="section-eyebrow">Achievements</p>
              <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl lg:text-4xl">What has he actually done?</h2>
            </div>
            <Link href="/achievements" className="group hidden items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors sm:flex">
              View all <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {achievements.map((a, i) => (
              <Link key={a.id} href={`/achievements/${a.slug}`} className={`animate-slide-up animation-delay-${(i + 1) * 100}`}>
                <Card className="group h-full card-link overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardContent className="p-6">
                    <ContentStatusBadge status={a.contentStatus} />
                    <h3 className="mt-4 font-serif text-lg font-semibold">{a.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Learn more <ArrowRight className="size-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════ EMPOWERMENT ═══════════════════ */}
      {programs.length > 0 && (
        <section className="relative border-t border-border bg-gradient-to-b from-secondary/30 to-background">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <p className="section-eyebrow">Empowerment</p>
            <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl lg:text-4xl">Programs for Adamawa citizens</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {programs.map((p) => (
                <Link key={p.id} href={`/programs/${p.slug}`}>
                  <Card className="group h-full card-link overflow-hidden">
                    <CardContent className="p-6">
                      <Badge variant="secondary">{p.category.replaceAll("_", " ")}</Badge>
                      <h3 className="mt-3 text-lg font-medium group-hover:text-primary transition-colors">{p.name}</h3>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Explore <ArrowRight className="size-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <Link href="/programs" className="group mt-8 inline-flex items-center gap-2 font-medium text-primary hover:text-primary/80 transition-colors">
              Explore all programs <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}

      {/* ═══════════════════ MISSION & VISION ═══════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <p className="section-eyebrow">Mission &amp; Vision</p>
        <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl lg:text-4xl">Development priorities</h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="group overflow-hidden border-border/60 transition-all duration-300 hover:shadow-elevated">
            <CardContent className="p-8">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                <BookOpen className="size-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold">{mission?.heading}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{mission?.statement}</p>
              <Link href="/mission" className="group/link mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Read the mission <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
          <Card className="group relative overflow-hidden bg-primary text-primary-foreground border-primary/80 transition-all duration-300 hover:shadow-glow-primary">
            {/* Subtle shimmer overlay */}
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
            <CardContent className="relative p-8">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-accent/20 text-accent mb-5">
                <Star className="size-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold">{vision?.heading}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-primary-foreground/75">{vision?.statement}</p>
              <Link href="/vision" className="group/link mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors">
                Explore the vision <ArrowRight className="size-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══════════════════ POLICY AGENDA ═══════════════════ */}
      {pillars.length > 0 && (
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          {/* Animated background */}
          <div
            className="absolute inset-0 animate-gradient opacity-20"
            style={{
              background: "linear-gradient(135deg, oklch(0.20 0.06 155), oklch(0.30 0.08 155), oklch(0.25 0.10 130), oklch(0.30 0.08 155))",
              backgroundSize: "400% 400%",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />

          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
            <p className="eyebrow-bar border-accent text-accent">The A.D.A.M.A.W.A First Agenda</p>
            <h2 className="mt-5 text-mega">
              The <span className="text-gradient-gold">Agenda.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-primary-foreground/70">
              Seven proposed priorities for Adamawa State, first announced publicly as the A.D.A.M.A.W.A First Agenda —
              not yet delivered, and clearly marked as proposed.
            </p>
            <div className="mt-12">
              <AgendaTabs pillars={pillars} />
            </div>
            <Link href="/manifesto" className="group mt-10 inline-flex items-center gap-2 font-medium text-accent hover:text-accent/80 transition-colors">
              Read the full manifesto <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          {/* Bottom gradient line */}
          <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        </section>
      )}

      {/* ═══════════════════ COMMUNITY PREVIEW ═══════════════════ */}
      <section className="relative py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center">
            <p className="section-eyebrow mx-auto">Community</p>
            <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl lg:text-4xl">What do citizens think?</h2>
            <p className="mt-3 text-lg text-muted-foreground">A live look at the public conversation in Haske Community.</p>
          </div>
          <div className="mt-10 overflow-hidden rounded-2xl border border-border shadow-soft">
            {feedPosts.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto size-10 text-muted-foreground/40" />
                <p className="mt-4 text-sm text-muted-foreground">No posts yet — be the first to join the conversation.</p>
              </div>
            ) : (
              feedPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
          <div className="mt-8 text-center">
            <Button asChild size="lg" className="shadow-glow-primary">
              <Link href="/community">
                <Users className="size-4" />
                Join the conversation
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ EVENTS ═══════════════════ */}
      {upcomingEvents.length > 0 && (
        <section className="relative border-t border-border bg-gradient-to-b from-secondary/30 to-background">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <p className="section-eyebrow">Follow</p>
            <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl lg:text-4xl">Upcoming events</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {upcomingEvents.map((e) => (
                <Link key={e.id} href={`/events/${e.slug}`}>
                  <Card className="group h-full card-link overflow-hidden">
                    <CardContent className="p-6">
                      <p className="text-lg font-medium group-hover:text-primary transition-colors">{e.title}</p>
                      <div className="mt-4 space-y-2">
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="size-4 text-primary/60" /> {formatDate(e.date)}
                        </p>
                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4 text-primary/60" /> {e.venue}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════ MEDIA ═══════════════════ */}
      {media.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <p className="section-eyebrow">Latest Media</p>
          <h2 className="mt-3 font-serif text-2xl font-semibold sm:text-3xl lg:text-4xl">News, videos and speeches</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {media.map((m) => (
              <Link key={m.id} href={`/media/${m.slug}`}>
                <Card className="group h-full overflow-hidden card-link">
                  {m.featuredImage && (
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.featuredImage} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      {/* Play button overlay for videos */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
                        <Play className="size-10 text-white opacity-0 transition-opacity group-hover:opacity-80 drop-shadow-lg" />
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <Badge variant="secondary">{m.category.replaceAll("_", " ")}</Badge>
                    <p className="mt-3 font-medium group-hover:text-primary transition-colors">{m.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════ JOIN CTA ═══════════════════ */}
      <section className="relative overflow-hidden border-t border-border bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-64 w-[600px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="relative mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Join the Community</h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Connect with fellow citizens, follow updates, vote in polls and make your voice heard.
          </p>
          <Button asChild size="lg" variant="gold" className="mt-8 shadow-glow-gold">
            <Link href="/register">Create your free account</Link>
          </Button>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      </section>
    </div>
  );
}
