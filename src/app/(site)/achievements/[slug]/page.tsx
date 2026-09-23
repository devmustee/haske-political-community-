import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Badge } from "@/components/ui/badge";
import { FileText, ExternalLink } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  AGRICULTURE: "Agriculture",
  BUSINESS: "Business",
  TECHNOLOGY: "Technology",
  YOUTH_EMPOWERMENT: "Youth Empowerment",
  EDUCATION: "Education",
  HUMANITARIAN_SUPPORT: "Humanitarian Support",
  COMMUNITY_DEVELOPMENT: "Community Development",
  ENTREPRENEURSHIP: "Entrepreneurship",
  SPORTS: "Sports",
  PHILANTHROPY: "Philanthropy",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = await prisma.achievement.findUnique({ where: { slug } });
  if (!a) return {};
  return { title: a.title, description: a.summary };
}

export default async function AchievementDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const achievement = await prisma.achievement.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } }, documents: true, relatedProgram: true },
  });
  if (!achievement || achievement.contentStatus === "DRAFT") notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{CATEGORY_LABELS[achievement.category] ?? achievement.category}</Badge>
        <ContentStatusBadge status={achievement.contentStatus} />
      </div>
      <h1 className="mt-4 font-serif text-3xl font-semibold">{achievement.title}</h1>
      {(achievement.year || achievement.location) && (
        <p className="mt-2 text-muted-foreground">{[achievement.year, achievement.location].filter(Boolean).join(" · ")}</p>
      )}

      {achievement.images.length > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={achievement.images[0].url} alt={achievement.images[0].caption ?? ""} className="mt-6 w-full rounded-2xl border border-border object-cover" />
      )}

      <p className="mt-6 text-lg leading-relaxed">{achievement.description}</p>

      {achievement.impact && (
        <div className="mt-6 rounded-xl border border-border bg-secondary/30 p-5">
          <h2 className="text-sm font-semibold text-muted-foreground">Impact</h2>
          <p className="mt-1 text-[15px]">{achievement.impact}</p>
        </div>
      )}

      {achievement.relatedProgram && (
        <div className="mt-6">
          <Link href={`/programs/${achievement.relatedProgram.slug}`} className="text-sm font-medium text-primary hover:underline">
            Related program: {achievement.relatedProgram.name} &rarr;
          </Link>
        </div>
      )}

      {achievement.documents.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-muted-foreground">Documents</h2>
          <ul className="mt-2 flex flex-col gap-1.5">
            {achievement.documents.map((d) => (
              <li key={d.id}>
                <a href={d.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <FileText className="size-4" /> {d.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(achievement.source || achievement.sourceUrl) && (
        <p className="mt-8 border-t border-border pt-4 text-sm text-muted-foreground">
          Source: {achievement.sourceUrl ? (
            <a href={achievement.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
              {achievement.source ?? achievement.sourceUrl} <ExternalLink className="size-3" />
            </a>
          ) : (
            achievement.source
          )}
        </p>
      )}
    </article>
  );
}
