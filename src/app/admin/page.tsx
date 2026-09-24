import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCount } from "@/lib/utils";
import {
  Users,
  FileText,
  MessageCircle,
  Heart,
  Repeat2,
  BarChart3,
  ClipboardList,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Flag,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

async function getMetrics() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersWeek,
    activeUsersWeek,
    totalPosts,
    postsToday,
    totalComments,
    totalLikes,
    totalReposts,
    totalPolls,
    pollVotes,
    programApplications,
    feedbackTotal,
    openIssues,
    upcomingEvents,
    pendingReports,
    pendingModeration,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.user.count({ where: { lastLoginAt: { gte: startOfWeek } } }),
    prisma.post.count({ where: { deletedAt: null } }),
    prisma.post.count({ where: { deletedAt: null, createdAt: { gte: startOfToday } } }),
    prisma.comment.count({ where: { deletedAt: null } }),
    prisma.postLike.count(),
    prisma.repost.count(),
    prisma.poll.count(),
    prisma.pollVote.count(),
    prisma.programApplication.count(),
    prisma.feedbackSubmission.count(),
    prisma.communityIssue.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
    prisma.event.count({ where: { status: "UPCOMING" } }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.report.count({ where: { status: "PENDING" } }),
  ]);

  return {
    totalUsers,
    newUsersWeek,
    activeUsersWeek,
    totalPosts,
    postsToday,
    totalComments,
    totalLikes,
    totalReposts,
    totalPolls,
    pollVotes,
    programApplications,
    feedbackTotal,
    openIssues,
    upcomingEvents,
    pendingReports,
    pendingModeration,
  };
}

export default async function AdminDashboardPage() {
  const m = await getMetrics();

  const cards = [
    { label: "Total users", value: m.totalUsers, icon: Users },
    { label: "New users (7d)", value: m.newUsersWeek, icon: Users },
    { label: "Active users (7d)", value: m.activeUsersWeek, icon: Users },
    { label: "Total posts", value: m.totalPosts, icon: FileText },
    { label: "Posts today", value: m.postsToday, icon: FileText },
    { label: "Comments", value: m.totalComments, icon: MessageCircle },
    { label: "Likes", value: m.totalLikes, icon: Heart },
    { label: "Reposts", value: m.totalReposts, icon: Repeat2 },
    { label: "Polls", value: m.totalPolls, icon: BarChart3 },
    { label: "Poll votes", value: m.pollVotes, icon: BarChart3 },
    { label: "Program applications", value: m.programApplications, icon: ClipboardList },
    { label: "Citizen feedback", value: m.feedbackTotal, icon: MessageSquare },
    { label: "Open community issues", value: m.openIssues, icon: AlertTriangle },
    { label: "Upcoming events", value: m.upcomingEvents, icon: Calendar },
    { label: "Pending reports", value: m.pendingReports, icon: Flag },
    { label: "Pending moderation", value: m.pendingModeration, icon: ShieldAlert },
  ];

  return (
    <div className="p-6 sm:p-8">
      <h1 className="font-serif text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">An overview of Haske Community activity.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{c.label}</CardTitle>
              <c.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{formatCount(c.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
