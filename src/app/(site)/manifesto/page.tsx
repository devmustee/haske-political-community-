import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { FileText } from "lucide-react";

export const metadata: Metadata = { title: "Our Agenda", description: "The policy agenda and manifesto of the Haske campaign." };
export const revalidate = 60;

export default async function ManifestoPage() {
  const [current, historical, allPillars] = await Promise.all([
    prisma.manifesto.findFirst({
      where: { isCurrent: true },
      include: { pillars: { include: { pillar: true }, orderBy: { order: "asc" } }, documents: true },
    }),
    prisma.manifesto.findMany({ where: { isCurrent: false }, orderBy: { publicationDate: "desc" } }),
    prisma.policyPillar.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <PageHero eyebrow="Understand" title="Our Agenda" description="The policy platform Haske is proposing for Adamawa State." />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        {current ? (
          <ManifestoBlock manifesto={current} />
        ) : (
          <>
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">
                A current manifesto for the Allied Peoples Movement candidacy has not yet been published. Check back soon, or
                see the historical agenda below.
              </CardContent>
            </Card>

            {allPillars.length > 0 && (
              <div className="mt-10">
                <h3 className="font-serif text-lg font-semibold">Policy Pillars</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Category framework the campaign has indicated it will address. Full policy detail is published pillar by
                  pillar as it becomes available.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {allPillars.map((pillar) => (
                    <Link key={pillar.id} href={`/policies/${pillar.slug}`}>
                      <Card className="h-full card-link">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-muted-foreground">{pillar.category}</p>
                            <ContentStatusBadge status={pillar.contentStatus} showIcon={false} />
                          </div>
                          <p className="mt-1 font-medium">{pillar.name}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {historical.length > 0 && (
          <div className="mt-14 border-t border-border pt-10">
            <h2 className="font-serif text-xl font-semibold">Historical agenda versions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Publicly announced agenda material retained for transparency.</p>
            <div className="mt-5 flex flex-col gap-3">
              {historical.map((m) => (
                <Card key={m.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-medium">{m.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Version {m.version} &middot; Published {formatDate(m.publicationDate)}
                      </p>
                    </div>
                    <ContentStatusBadge status="ARCHIVED" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ManifestoBlock({
  manifesto,
}: {
  manifesto: {
    title: string;
    version: string;
    publicationDate: Date;
    lastUpdatedDate: Date;
    introduction: string;
    pdfUrl: string | null;
    pillars: { pillar: { id: string; name: string; slug: string; category: string; contentStatus: string } }[];
    documents: { id: string; url: string; title: string }[];
  };
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>Version {manifesto.version}</span>
        <span>&middot;</span>
        <span>Published {formatDate(manifesto.publicationDate)}</span>
        <span>&middot;</span>
        <span>Last updated {formatDate(manifesto.lastUpdatedDate)}</span>
      </div>
      <h2 className="mt-2 font-serif text-2xl font-semibold">{manifesto.title}</h2>
      <p className="mt-4 text-lg leading-relaxed">{manifesto.introduction}</p>

      {manifesto.documents.length > 0 && (
        <div className="mt-4 flex flex-col gap-1.5">
          {manifesto.documents.map((d) => (
            <a key={d.id} href={d.url} className="flex w-fit items-center gap-1.5 text-sm text-primary hover:underline">
              <FileText className="size-4" /> {d.title} (PDF)
            </a>
          ))}
        </div>
      )}

      <h3 className="mt-10 font-serif text-lg font-semibold">Policy Pillars</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {manifesto.pillars.map(({ pillar }) => (
          <Link key={pillar.id} href={`/policies/${pillar.slug}`}>
            <Card className="h-full card-link">
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">{pillar.category}</p>
                <p className="mt-1 font-medium">{pillar.name}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
