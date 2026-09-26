import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { ArrowRight, HandHeart } from "lucide-react";

export const metadata: Metadata = { title: "Programs", description: "Empowerment and support programs from the Haske campaign." };
export const revalidate = 60;

const CATEGORY_LABELS: Record<string, string> = {
  YOUTH_EMPOWERMENT: "Youth Empowerment",
  WOMEN_EMPOWERMENT: "Women Empowerment",
  AGRICULTURE: "Agriculture",
  EDUCATION: "Education",
  HUMANITARIAN: "Humanitarian",
};

const STATUS_LABELS: Record<string, string> = {
  UPCOMING: "Upcoming",
  OPEN: "Applications open",
  ONGOING: "Ongoing",
  CLOSED: "Closed",
  COMPLETED: "Completed",
};

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    where: { contentStatus: { notIn: ["DRAFT"] } },
    orderBy: { createdAt: "asc" },
    include: { images: { take: 1 } },
  });

  return (
    <div>
      <PageHero
        eyebrow="Apply"
        title="Empowerment & Programs"
        description="How can people access empowerment programs? Browse youth, women, agriculture, education and humanitarian programs."
        watermark="Empower"
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {programs.length === 0 ? (
          <div className="py-20 text-center">
            <HandHeart className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">No programs published yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {programs.map((p, i) => (
              <Reveal key={p.id} variant="scale" delay={Math.min(i, 5) * 80}>
                <Link href={`/programs/${p.slug}`}>
                  <Card className="group h-full card-link overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-primary to-accent opacity-0 transition-opacity group-hover:opacity-100" />
                    {p.images[0] && (
                      <div className="relative aspect-video w-full overflow-hidden bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images[0].url}
                          alt={p.images[0].caption ?? ""}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{CATEGORY_LABELS[p.category] ?? p.category}</Badge>
                        <Badge variant="outline">{STATUS_LABELS[p.status] ?? p.status}</Badge>
                        <ContentStatusBadge status={p.contentStatus} />
                      </div>
                      <h2 className="mt-4 font-serif text-lg font-semibold group-hover:text-primary transition-colors">{p.name}</h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Learn more <ArrowRight className="size-3.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
