import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  });

  return (
    <div>
      <PageHero
        eyebrow="Apply"
        title="Empowerment & Programs"
        description="How can people access empowerment programs? Browse youth, women, agriculture, education and humanitarian programs."
      />

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        {programs.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No programs published yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {programs.map((p) => (
              <Link key={p.id} href={`/programs/${p.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{CATEGORY_LABELS[p.category] ?? p.category}</Badge>
                      <Badge variant="outline">{STATUS_LABELS[p.status] ?? p.status}</Badge>
                      <ContentStatusBadge status={p.contentStatus} />
                    </div>
                    <h2 className="mt-3 font-serif text-lg font-semibold">{p.name}</h2>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
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
