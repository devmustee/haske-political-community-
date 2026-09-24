import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { FeedbackStatusControl } from "@/components/admin/feedback-status-control";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Citizen Feedback" };
export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "outline" | "secondary" | "default" | "success"> = {
  RECEIVED: "outline",
  UNDER_REVIEW: "secondary",
  ASSIGNED: "secondary",
  IN_PROGRESS: "default",
  RESOLVED: "success",
  CLOSED: "outline",
};

export default async function AdminFeedbackPage() {
  const submissions = await prisma.feedbackSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 100,
  });

  const issues = await prisma.communityIssue.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const byLga = new Map<string, number>();
  for (const issue of issues) byLga.set(issue.lga, (byLga.get(issue.lga) ?? 0) + 1);

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-serif text-2xl font-semibold">Citizen Feedback</h1>
      <p className="mt-1 text-sm text-muted-foreground">{submissions.length} submissions via Speak to Haske.</p>

      <div className="mt-6 flex flex-col gap-2">
        {submissions.map((f) => (
          <div key={f.id} className="rounded-xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-semibold">{f.trackingId}</span>
                <Badge variant="secondary">{f.type.replaceAll("_", " ")}</Badge>
                <Badge variant={STATUS_VARIANT[f.status]}>{f.status.replace("_", " ")}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">{formatRelativeTime(f.createdAt)}</span>
            </div>
            <p className="mt-2 font-medium">{f.subject}</p>
            <p className="text-sm text-muted-foreground">{f.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              From {f.user.name} (@{f.user.username}){f.lga ? ` · ${f.lga}` : ""}
            </p>
            <div className="mt-3">
              <FeedbackStatusControl feedbackId={f.id} status={f.status} />
            </div>
          </div>
        ))}
        {submissions.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
      </div>

      {issues.length > 0 && (
        <div className="mt-10">
          <h2 className="text-sm font-semibold text-muted-foreground">Community issues by LGA</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...byLga.entries()].map(([lga, count]) => (
              <Badge key={lga} variant="outline">
                {lga}: {count}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
