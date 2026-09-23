import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/community/verified-badge";
import { formatCount, formatDate, initials } from "@/lib/utils";
import { Calendar, Hash } from "lucide-react";

export async function RightSidebar() {
  const [trending, events, officials] = await Promise.all([
    prisma.hashtag.findMany({ orderBy: { postsCount: "desc" }, take: 5 }),
    prisma.event.findMany({
      where: { status: "UPCOMING", date: { gte: new Date() } },
      orderBy: { date: "asc" },
      take: 3,
    }),
    prisma.user.findMany({
      where: { verification: { in: ["OFFICIAL", "ORGANIZATION"] } },
      orderBy: { createdAt: "asc" },
      take: 4,
    }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      {officials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Official accounts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            {officials.map((u) => (
              <Link key={u.id} href={`/community/user/${u.username}`} className="flex items-center gap-2.5">
                <Avatar className="size-9">
                  <AvatarImage src={u.avatarUrl ?? undefined} />
                  <AvatarFallback>{initials(u.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="flex items-center gap-1 truncate text-sm font-medium">
                    {u.name} <VerifiedBadge status={u.verification} />
                  </p>
                  <p className="truncate text-xs text-muted-foreground">@{u.username}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {trending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trending topics</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            {trending.map((tag) => (
              <Link key={tag.id} href={`/community/explore?q=%23${tag.tag}`} className="flex items-center gap-2.5 group">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Hash className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium group-hover:underline">#{tag.tag}</p>
                  <p className="text-xs text-muted-foreground">{formatCount(tag.postsCount)} posts</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming events</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pt-0">
            {events.map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="flex items-start gap-2.5 group">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Calendar className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium group-hover:underline">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(event.date)} &middot; {event.venue}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <p className="px-2 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Haske Community &middot;{" "}
        <Link href="/privacy" className="hover:underline">Privacy</Link> &middot;{" "}
        <Link href="/terms" className="hover:underline">Terms</Link> &middot;{" "}
        <Link href="/community-guidelines" className="hover:underline">Guidelines</Link>
      </p>
    </div>
  );
}
