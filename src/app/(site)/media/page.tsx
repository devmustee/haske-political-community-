import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { formatDate } from "@/lib/utils";
import { PlayCircle, Image as ImageIcon, Newspaper, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Media Center — Press Releases, Speeches & Broadcasts",
  description: "Official news, press statements, campaign speeches, videos and photographic archive of Abdulrahman Bashir Haske.",
};
export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  NEWS: "News",
  PRESS_RELEASE: "Press Release",
  SPEECH: "Speech",
  VIDEO: "Video Broadcast",
  PHOTO: "Photo Archive",
  INTERVIEW: "Interview",
  DOCUMENT: "Policy Document",
  ANNOUNCEMENT: "Announcement",
};

export default async function MediaCenterPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const items = await prisma.mediaCenterItem.findMany({
    where: { contentStatus: { notIn: ["DRAFT"] }, ...(category ? { category: category as never } : {}) },
    orderBy: { date: "desc" },
  });
  const [latest, ...rest] = items;

  return (
    <div>
      <PageHero
        eyebrow="Communications & Press"
        title="Media Center"
        description="Official press releases, major policy addresses, broadcast videos, and documented photographic archives."
        watermark="Media"
        badge={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
            <Newspaper className="size-3.5 text-accent" /> Official Press Desk
          </span>
        }
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Category Filters */}
        <div className="mb-10 flex flex-wrap gap-2">
          <Link href="/media">
            <Badge
              variant={!category ? "solid" : "outline"}
              className="px-4 py-1.5 text-xs font-semibold transition-all hover:shadow-soft cursor-pointer"
            >
              All Releases
            </Badge>
          </Link>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link key={key} href={`/media?category=${key}`}>
              <Badge
                variant={category === key ? "solid" : "outline"}
                className="px-4 py-1.5 text-xs font-semibold transition-all hover:shadow-soft cursor-pointer"
              >
                {label}
              </Badge>
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <ImageIcon className="mx-auto size-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No media items found for this category.</p>
          </div>
        ) : (
          <>
            {latest && (
              <Reveal variant="scale" className="mb-12">
                <Link href={`/media/${latest.slug}`}>
                  <SpotlightCard
                    spotlightColor="gold"
                    className="overflow-hidden lg:grid lg:grid-cols-2 shadow-elevated"
                  >
                    {latest.featuredImage ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-muted lg:aspect-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={latest.featuredImage}
                          alt=""
                          className="size-full object-cover transition-transform duration-700 hover:scale-105"
                          loading="lazy"
                        />
                        {latest.category === "VIDEO" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                            <PlayCircle className="size-16 text-white drop-shadow-2xl opacity-90 transition-transform hover:scale-110" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="hidden bg-gradient-to-br from-primary/10 to-accent/10 lg:block" />
                    )}
                    <div className="flex flex-col justify-center p-8 sm:p-10">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="gold" className="font-bold">Latest Release</Badge>
                        <Badge variant="secondary">{CATEGORY_LABELS[latest.category] ?? latest.category}</Badge>
                        <ContentStatusBadge status={latest.contentStatus} />
                      </div>
                      <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-foreground">
                        {latest.title}
                      </h2>
                      <p className="mt-2 text-xs font-semibold text-accent uppercase tracking-wider">
                        {formatDate(latest.date)}
                      </p>
                      <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">
                        {latest.content}
                      </p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                        Read full statement <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </SpotlightCard>
                </Link>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item, i) => (
                  <Reveal key={item.id} variant="scale" delay={Math.min(i, 5) * 80}>
                    <Link href={`/media/${item.slug}`}>
                      <SpotlightCard
                        spotlightColor="primary"
                        className="overflow-hidden h-full flex flex-col justify-between"
                      >
                        {item.featuredImage && (
                          <div className="relative aspect-video w-full overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.featuredImage}
                              alt=""
                              className="size-full object-cover transition-transform duration-700 hover:scale-105"
                              loading="lazy"
                            />
                            {item.category === "VIDEO" && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                                <PlayCircle className="size-12 text-white drop-shadow-lg opacity-85 transition-transform hover:scale-110" />
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-6 sm:p-7">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{CATEGORY_LABELS[item.category] ?? item.category}</Badge>
                            <ContentStatusBadge status={item.contentStatus} />
                          </div>
                          <h3 className="mt-3 font-serif text-lg font-bold text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
                            {formatDate(item.date)}
                          </p>
                          <p className="mt-3 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
                            {item.content}
                          </p>
                          <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                            Read article <ArrowRight className="size-3.5" />
                          </span>
                        </div>
                      </SpotlightCard>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
