import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

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

  return (
    <div>
      <PageHero eyebrow="Follow" title="Media Center" description="News, press releases, speeches, videos and announcements." />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href="/media">
            <Badge variant={!category ? "default" : "outline"}>All</Badge>
          </Link>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <Link key={key} href={`/media?category=${key}`}>
              <Badge variant={category === key ? "default" : "outline"}>{label}</Badge>
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No media items published yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {items.map((item) => (
              <Link key={item.id} href={`/media/${item.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{CATEGORY_LABELS[item.category]}</Badge>
                      <ContentStatusBadge status={item.contentStatus} />
                    </div>
                    <h2 className="mt-3 font-serif text-lg font-semibold">{item.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{formatDate(item.date)}</p>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{item.content}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
