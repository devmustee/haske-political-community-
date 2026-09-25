import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ReportActions } from "@/components/admin/report-actions";
import { BlockedWordsManager } from "@/components/admin/blocked-words-manager";
import { formatRelativeTime, initials } from "@/lib/utils";

export const metadata: Metadata = { title: "Moderation" };
export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  const [reports, blockedWords, recentActions] = await Promise.all([
    prisma.report.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        reporter: true,
        post: { include: { author: true } },
        comment: { include: { author: true } },
        reportedUser: true,
      },
      take: 30,
    }),
    prisma.blockedWord.findMany({ orderBy: { word: "asc" } }),
    prisma.moderationAction.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { moderator: true, targetUser: true },
    }),
  ]);

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-h1">Moderation Queue</h1>
      <p className="mt-1 text-sm text-muted-foreground">{reports.length} pending report{reports.length === 1 ? "" : "s"}.</p>

      <div className="mt-6 flex flex-col gap-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">No pending reports. The queue is clear.</CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="destructive">{report.targetType}</Badge>
                  <Badge variant="outline">{report.reason}</Badge>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(report.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm">
                  Reported by <span className="font-medium">{report.reporter.name}</span> (@{report.reporter.username})
                </p>
                {report.details && <p className="mt-1 text-sm text-muted-foreground">&ldquo;{report.details}&rdquo;</p>}

                {report.post && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-border p-3">
                    <Avatar className="size-7">
                      <AvatarImage src={report.post.author.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-xs">{initials(report.post.author.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">@{report.post.author.username}</p>
                      <p className="text-sm">{report.post.content}</p>
                    </div>
                  </div>
                )}
                {report.comment && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-border p-3">
                    <Avatar className="size-7">
                      <AvatarImage src={report.comment.author.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-xs">{initials(report.comment.author.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">@{report.comment.author.username}</p>
                      <p className="text-sm">{report.comment.content}</p>
                    </div>
                  </div>
                )}

                <div className="mt-3">
                  <ReportActions reportId={report.id} postId={report.postId} commentId={report.commentId} />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Blocked words</CardTitle>
          </CardHeader>
          <CardContent>
            <BlockedWordsManager words={blockedWords.map((w) => w.word)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent moderation actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5">
            {recentActions.length === 0 && <p className="text-sm text-muted-foreground">No moderation actions yet.</p>}
            {recentActions.map((a) => (
              <div key={a.id} className="text-sm">
                <span className="font-medium">{a.moderator.name}</span> {a.actionType.replaceAll("_", " ").toLowerCase()}
                {a.targetUser ? ` on ${a.targetUser.name}` : ""} &middot;{" "}
                <span className="text-muted-foreground">{formatRelativeTime(a.createdAt)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
