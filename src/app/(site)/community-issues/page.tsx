import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { CommunityIssueForm } from "@/components/cms/community-issue-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Community Issues", description: "Public directory of community-reported issues by LGA and category." };
export const dynamic = "force-dynamic";

export default async function CommunityIssuesPage() {
  const session = await getSession();
  const issues = await prisma.communityIssue.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { reportedBy: { select: { name: true, username: true } } },
  });

  return (
    <div>
      <PageHero eyebrow="Participate" title="Community Issues" description="A public directory of issues reported by citizens across Adamawa's LGAs." />

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-3">
            {issues.length === 0 ? (
              <p className="text-muted-foreground">No issues reported yet.</p>
            ) : (
              issues.map((issue, i) => (
                <Reveal key={issue.id} delay={Math.min(i, 5) * 60}>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{issue.category.replaceAll("_", " ")}</Badge>
                        <Badge variant="outline">{issue.lga}</Badge>
                        <Badge>{issue.status.replace("_", " ")}</Badge>
                      </div>
                      <p className="mt-2 font-medium">{issue.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{issue.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Reported by {issue.reportedBy.name} &middot; {formatRelativeTime(issue.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))
            )}
          </div>

          <div>
            {session?.user ? (
              <CommunityIssueForm />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">Sign in to report an issue in your area.</p>
                <Button asChild size="sm">
                  <Link href="/login?callbackUrl=/community-issues">Sign in</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
