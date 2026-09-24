import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { YouTubeEmbed } from "@/components/cms/youtube-embed";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const YOUTUBE_HOSTS = ["youtube.com", "youtu.be", "www.youtube.com"];
function isYouTubeUrl(url: string) {
  try {
    return YOUTUBE_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.mediaCenterItem.findUnique({ where: { slug } });
  if (!item) return {};
  return { title: item.title, description: item.content.slice(0, 160) };
}

export default async function MediaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await prisma.mediaCenterItem.findUnique({ where: { slug } });
  if (!item || item.contentStatus === "DRAFT") notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{item.category.replaceAll("_", " ")}</Badge>
        <ContentStatusBadge status={item.contentStatus} />
      </div>
      <h1 className="mt-4 font-serif text-3xl font-semibold">{item.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatDate(item.date)}
        {item.author ? ` · ${item.author}` : ""}
      </p>

      {item.category === "VIDEO" && item.sourceUrl && isYouTubeUrl(item.sourceUrl) ? (
        <div className="mt-6">
          <YouTubeEmbed url={item.sourceUrl} title={item.title} />
        </div>
      ) : (
        item.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.featuredImage} alt="" className="mt-6 w-full rounded-2xl border border-border object-cover" />
        )
      )}

      <p className="mt-6 whitespace-pre-wrap text-lg leading-relaxed">{item.content}</p>

      {item.sourceUrl && (
        <p className="mt-8 border-t border-border pt-4 text-sm text-muted-foreground">
          Source: <a href={item.sourceUrl} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">{item.sourceUrl}</a>
        </p>
      )}
    </article>
  );
}
