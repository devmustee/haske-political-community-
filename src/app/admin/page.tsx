import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/stat-card";
import {
  Users,
  UserPlus,
  Activity,
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

function dayRange(daysAgo: number) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysAgo);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

async function dailyCounts(counter: (start: Date, end: Date) => Promise<number>): Promise<number[]> {
  const ranges = Array.from({ length: 7 }, (_, i) => dayRange(6 - i));
  return Promise.all(ranges.map(({ start, end }) => counter(start, end)));
}

function trendPct(current: number, previous: number): number | undefined {
  if (previous === 0) return current > 0 ? 100 : undefined;
  return ((current - previous) / previous) * 100;
}

async function getMetrics() {
  const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const startOfPrevWeek = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const { start: startOfToday } = dayRange(0);

  const [
    totalUsers,
    newUsersWeek,
    newUsersPrevWeek,
    activeUsersWeek,
    totalPosts,
    postsToday,
    postsWeek,
    postsPrevWeek,
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
    usersPerDay,
    postsPerDay,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfPrevWeek, lt: startOfWeek } } }),
    prisma.user.count({ where: { lastLoginAt: { gte: startOfWeek } } }),
    prisma.post.count({ where: { deletedAt: null } }),
    prisma.post.count({ where: { deletedAt: null, createdAt: { gte: startOfToday } } }),
    prisma.post.count({ where: { deletedAt: null, createdAt: { gte: startOfWeek } } }),
    prisma.post.count({ where: { deletedAt: null, createdAt: { gte: startOfPrevWeek, lt: startOfWeek } } }),
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
    dailyCounts((start, end) => prisma.user.count({ where: { createdAt: { gte: start, lt: end } } })),
    dailyCounts((start, end) => prisma.post.count({ where: { deletedAt: null, createdAt: { gte: start, lt: end } } })),
  ]);

  return {
    totalUsers,
    newUsersWeek,
    newUsersTrend: trendPct(newUsersWeek, newUsersPrevWeek),
    activeUsersWeek,
    totalPosts,
    postsToday,
    postsTrend: trendPct(postsWeek, postsPrevWeek),
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
    usersPerDay,
    postsPerDay,
  };
}

export default async function AdminDashboardPage() {
  const m = await getMetrics();

  const groups: { title: string; cards: React.ComponentProps<typeof StatCard>[] }[] = [
    {
      title: "Community",
      cards: [
        { label: "Total users", value: m.totalUsers, icon: Users },
        { label: "New users (7d)", value: m.newUsersWeek, icon: UserPlus, trend: m.newUsersTrend, sparkline: m.usersPerDay },
        { label: "Active users (7d)", value: m.activeUsersWeek, icon: Activity },
      ],
    },
    {
      title: "Content & Engagement",
      cards: [
        { label: "Total posts", value: m.totalPosts, icon: FileText, trend: m.postsTrend, sparkline: m.postsPerDay },
        { label: "Posts today", value: m.postsToday, icon: FileText },
        { label: "Comments", value: m.totalComments, icon: MessageCircle },
        { label: "Likes", value: m.totalLikes, icon: Heart },
        { label: "Reposts", value: m.totalReposts, icon: Repeat2 },
        { label: "Polls", value: m.totalPolls, icon: BarChart3 },
        { label: "Poll votes", value: m.pollVotes, icon: BarChart3 },
      ],
    },
    {
      title: "Programs & Civic",
      cards: [
        { label: "Program applications", value: m.programApplications, icon: ClipboardList },
        { label: "Citizen feedback", value: m.feedbackTotal, icon: MessageSquare },
        { label: "Open community issues", value: m.openIssues, icon: AlertTriangle },
        { label: "Upcoming events", value: m.upcomingEvents, icon: Calendar },
      ],
    },
    {
      title: "Moderation",
      cards: [
        { label: "Pending reports", value: m.pendingReports, icon: Flag },
        { label: "Pending moderation", value: m.pendingModeration, icon: ShieldAlert },
      ],
    },
  ];

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-h1">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">An overview of Haske Community activity.</p>

      <div className="mt-8 flex flex-col gap-8">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.title}</h2>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {group.cards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
