import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { formatDate } from "@/lib/utils";
import { PlayCircle, Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = { title: "Media Center" };
export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  NEWS: "News",
  PRESS_RELEASE: "Press Release",
  SPEECH: "Speech",
  VIDEO: "Video",
  PHOTO: "Photo",
  INTERVIEW: "Interview",
  DOCUMENT: "Document",
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
        eyebrow="Follow"
        title="Media Center"
        description="News, press releases, speeches, videos and announcements."
        watermark="Media"
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link href="/media">
            <Badge variant={!category ? "solid" : "outline"} className="transition-all duration-200 hover:shadow-sm cursor-pointer">All</Badge>
          </Link>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link key={key} href={`/media?category=${key}`}>
              <Badge variant={category === key ? "solid" : "outline"} className="transition-all duration-200 hover:shadow-sm cursor-pointer">{label}</Badge>
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center">
            <ImageIcon className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">No media items published yet.</p>
          </div>
        ) : (
          <>
            {latest && (
              <Reveal variant="scale" className="mb-10">
                <Link href={`/media/${latest.slug}`}>
                  <Card className="group overflow-hidden card-link lg:grid lg:grid-cols-2">
                    {latest.featuredImage ? (
                      <div className="relative aspect-video w-full overflow-hidden bg-muted lg:aspect-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={latest.featuredImage} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        {latest.category === "VIDEO" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/25">
                            <PlayCircle className="size-14 text-white drop-shadow-lg opacity-80 transition-all group-hover:opacity-100 group-hover:scale-110" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="hidden bg-gradient-to-br from-secondary/50 to-secondary/20 lg:block" />
                    )}
                    <CardContent className="flex flex-col justify-center p-8">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="gold">Latest</Badge>
                        <Badge variant="secondary">{CATEGORY_LABELS[latest.category]}</Badge>
                        <ContentStatusBadge status={latest.contentStatus} />
                      </div>
                      <h2 className="mt-4 font-serif text-2xl font-semibold group-hover:text-primary transition-colors">{latest.title}</h2>
                      <p className="mt-1.5 text-sm text-primary/60 font-medium">{formatDate(latest.date)}</p>
                      <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground">{latest.content}</p>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            )}

            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item, i) => (
                  <Reveal key={item.id} variant="scale" delay={Math.min(i, 5) * 80}>
                    <Link href={`/media/${item.slug}`}>
                      <Card className="group h-full overflow-hidden card-link">
                        {item.featuredImage && (
                          <div className="relative aspect-video w-full overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.featuredImage} alt="" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                            {item.category === "VIDEO" && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/25">
                                <PlayCircle className="size-14 text-white drop-shadow-lg opacity-80 transition-all group-hover:opacity-100 group-hover:scale-110" />
                              </div>
                            )}
                          </div>
                        )}
                        <CardContent className="flex h-full flex-col p-6">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{CATEGORY_LABELS[item.category]}</Badge>
                            <ContentStatusBadge status={item.contentStatus} />
                          </div>
                          <h2 className="mt-3 font-serif text-lg font-semibold group-hover:text-primary transition-colors">{item.title}</h2>
                          <p className="mt-1.5 text-sm text-primary/60 font-medium">{formatDate(item.date)}</p>
                          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.content}</p>
                        </CardContent>
                      </Card>
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
