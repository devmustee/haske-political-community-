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
import { formatDate } from "@/lib/utils";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

export const revalidate = 30;

export default async function HomePage() {
  const [bio, mission, vision, achievements, programs, pillars, upcomingEvents, media, timeline, feedPosts] = await Promise.all([
    getSiteSetting<BiographySettings>("biography"),
    getSiteSetting<MissionSettings>("mission"),
    getSiteSetting<VisionSettings>("vision"),
    prisma.achievement.findMany({ where: { featured: true, contentStatus: { notIn: ["DRAFT"] } }, take: 3, orderBy: { order: "asc" } }),
    prisma.program.findMany({ where: { contentStatus: { notIn: ["DRAFT"] } }, take: 4 }),
    prisma.policyPillar.findMany({ take: 6, orderBy: { order: "asc" } }),
    prisma.event.findMany({ where: { status: "UPCOMING" }, orderBy: { date: "asc" }, take: 3 }),
    prisma.mediaCenterItem.findMany({ where: { contentStatus: { notIn: ["DRAFT"] } }, orderBy: { date: "desc" }, take: 3 }),
    prisma.timelineEvent.findMany({ orderBy: { order: "asc" }, take: 4 }),
    getFeedPosts({ tab: "latest", take: 3 }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
        />
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:text-left">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center gap-2.5 lg:justify-start">
              <Image
                src="/brand/apm-logo-official.png"
                alt="Allied Peoples Movement"
                width={36}
                height={36}
                className="size-9 rounded-full bg-white/90 p-0.5"
              />
              <Badge className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground">
                APM Governorship Candidate &middot; Adamawa 2027
              </Badge>
            </div>
            <h1 className="mx-auto mt-5 max-w-xl font-serif text-4xl font-semibold leading-tight sm:text-6xl lg:mx-0">
              Abdulrahman Haske
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-primary-foreground/85 lg:mx-0">
              Building a more prosperous, inclusive and secure Adamawa.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Button asChild size="lg" variant="gold">
                <Link href="/vision">Explore the Vision</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/community">Join Haske Community</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/manifesto">Read the Agenda</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute inset-0 -z-10 rounded-full bg-accent/20 blur-3xl" />
            <Image
              src="/brand/portrait.png"
              alt="Abdulrahman Bashir Haske"
              width={614}
              height={466}
              className="mx-auto w-full max-w-xs drop-shadow-2xl sm:max-w-sm"
              priority
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="section-eyebrow">About Haske</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">Who is Abdulrahman Bashir Haske?</h2>
            <p className="mt-4 text-muted-foreground">{bio?.paragraphs[0]}</p>
            <p className="mt-3 text-muted-foreground">{bio?.paragraphs[1]}</p>
            <Link href="/biography" className="mt-4 inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
              Read the full biography <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-border bg-secondary/30 p-6">
            <ContentStatusBadge status="DOCUMENTED" />
            <p className="mt-3 text-sm text-muted-foreground">
              Businessman, entrepreneur, philanthropist and politician from Adamawa State. Studied Information Systems at
              the American University of Nigeria, Yola.
            </p>
          </div>
        </div>
      </section>

      {/* Journey */}
      {timeline.length > 0 && (
        <section className="border-t border-border bg-secondary/20">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <p className="section-eyebrow">His Journey</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">An interactive timeline</h2>
            <div className="mt-8">
              <Timeline items={timeline} />
            </div>
            <Link href="/biography" className="mt-6 inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
              See the full timeline <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="section-eyebrow">Achievements</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">What has he actually done?</h2>
            </div>
            <Link href="/achievements" className="hidden text-sm font-medium text-primary hover:underline sm:block">
              View all
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {achievements.map((a) => (
              <Link key={a.id} href={`/achievements/${a.slug}`}>
                <Card className="h-full card-link">
                  <CardContent className="p-5">
                    <ContentStatusBadge status={a.contentStatus} />
                    <h3 className="mt-3 font-serif font-semibold">{a.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{a.summary}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empowerment */}
      {programs.length > 0 && (
        <section className="border-t border-border bg-secondary/20">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <p className="section-eyebrow">Empowerment</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">Programs for Adamawa citizens</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {programs.map((p) => (
                <Link key={p.id} href={`/programs/${p.slug}`}>
                  <Card className="h-full card-link">
                    <CardContent className="p-5">
                      <Badge variant="secondary">{p.category.replaceAll("_", " ")}</Badge>
                      <h3 className="mt-2 font-medium">{p.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <Link href="/programs" className="mt-6 inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
              Explore all programs <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="section-eyebrow">Mission &amp; Vision</p>
        <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">Development priorities</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif text-lg font-semibold">{mission?.heading}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{mission?.statement}</p>
              <Link href="/mission" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                Read the mission <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-serif text-lg font-semibold">{vision?.heading}</h3>
              <p className="mt-2 text-sm text-primary-foreground/80">{vision?.statement}</p>
              <Link href="/vision" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium hover:underline">
                Explore the vision <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Policy agenda */}
      {pillars.length > 0 && (
        <section className="border-t border-border bg-secondary/20">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <p className="section-eyebrow">Policy Agenda</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">What does he propose?</h2>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {pillars.map((pillar) => (
                <Link key={pillar.id} href={`/policies/${pillar.slug}`}>
                  <Badge variant="outline" className="px-3.5 py-2 text-sm">
                    {pillar.name}
                  </Badge>
                </Link>
              ))}
            </div>
            <Link href="/manifesto" className="mt-6 inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
              Read the full agenda <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Community preview */}
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="section-eyebrow">Community</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">What do citizens think?</h2>
          <p className="mt-2 text-muted-foreground">A live look at the public conversation in Haske Community.</p>
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          {feedPosts.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No posts yet — be the first to join the conversation.</p>
          ) : (
            feedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
        <div className="mt-6 text-center">
          <Button asChild size="lg">
            <Link href="/community">Join the conversation</Link>
          </Button>
        </div>
      </section>

      {/* Events */}
      {upcomingEvents.length > 0 && (
        <section className="border-t border-border bg-secondary/20">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <p className="section-eyebrow">Follow</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">Upcoming events</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {upcomingEvents.map((e) => (
                <Link key={e.id} href={`/events/${e.slug}`}>
                  <Card className="h-full card-link">
                    <CardContent className="p-5">
                      <p className="font-medium">{e.title}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="size-3.5" /> {formatDate(e.date)}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" /> {e.venue}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Media */}
      {media.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <p className="section-eyebrow">Latest Media</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">News, videos and speeches</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {media.map((m) => (
              <Link key={m.id} href={`/media/${m.slug}`}>
                <Card className="h-full card-link">
                  <CardContent className="p-5">
                    <Badge variant="secondary">{m.category.replaceAll("_", " ")}</Badge>
                    <p className="mt-2 font-medium">{m.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Join CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Join the Community</h2>
          <p className="mt-3 text-primary-foreground/85">
            Connect with fellow citizens, follow updates, vote in polls and make your voice heard.
          </p>
          <Button asChild size="lg" variant="gold" className="mt-6">
            <Link href="/register">Create your free account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
