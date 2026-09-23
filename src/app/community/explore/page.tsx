import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { globalSearch, getTrendingHashtags } from "@/lib/queries/search";
import { SearchBox } from "@/components/community/search-box";
import { PostCard } from "@/components/community/post-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/community/verified-badge";
import { FollowButton } from "@/components/community/follow-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initials, formatCount, formatDate } from "@/lib/utils";
import { Hash } from "lucide-react";
import { getFeedPosts } from "@/lib/queries/posts";

export const metadata: Metadata = { title: "Explore" };
export const dynamic = "force-dynamic";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const session = await auth();
  const query = (q ?? "").replace(/^#/, "");

  if (!query) {
    const [trending, recent] = await Promise.all([
      getTrendingHashtags(10),
      getFeedPosts({ viewerId: session?.user?.id, tab: "trending", take: 10 }),
    ]);

    return (
      <div>
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 p-4 backdrop-blur">
          <SearchBox />
        </div>

        <div className="p-4">
          <h2 className="mb-3 font-serif text-lg font-semibold">Trending in Adamawa</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {trending.map((tag, i) => (
              <Link key={tag.id} href={`/community/explore?q=%23${tag.tag}`}>
                <Card className="transition-colors hover:bg-muted/40">
                  <CardContent className="flex items-center gap-3 p-4">
                    <span className="text-sm font-medium text-muted-foreground">{i + 1}</span>
                    <div className="flex-1">
                      <p className="flex items-center gap-1 font-medium">
                        <Hash className="size-3.5" />
                        {tag.tag}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatCount(tag.postsCount)} posts</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {trending.length === 0 && <p className="text-sm text-muted-foreground">No trending topics yet.</p>}
          </div>
        </div>

        <h2 className="px-4 pb-2 font-serif text-lg font-semibold">Popular posts</h2>
        {recent.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  const results = await globalSearch(query, session?.user?.id);
  const totalResults =
    results.people.length + results.posts.length + results.programs.length + results.achievements.length + results.events.length + results.media.length;

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 p-4 backdrop-blur">
        <SearchBox initialQuery={query} />
      </div>

      {totalResults === 0 && <p className="py-16 text-center text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;.</p>}

      {results.people.length > 0 && (
        <section className="border-b border-border">
          <h2 className="px-4 pt-4 text-sm font-semibold text-muted-foreground">People</h2>
          {results.people.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3">
              <Link href={`/community/user/${u.username}`}>
                <Avatar className="size-11">
                  <AvatarImage src={u.avatarUrl ?? undefined} />
                  <AvatarFallback>{initials(u.name)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/community/user/${u.username}`} className="flex items-center gap-1 font-medium hover:underline">
                  {u.name} <VerifiedBadge status={u.verification} />
                </Link>
                <p className="truncate text-sm text-muted-foreground">@{u.username}</p>
              </div>
              <FollowButton userId={u.id} initialFollowing={false} />
            </div>
          ))}
        </section>
      )}

      {results.programs.length > 0 && (
        <section className="border-b border-border p-4">
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Programs</h2>
          <div className="flex flex-col gap-2">
            {results.programs.map((p) => (
              <Link key={p.id} href={`/programs/${p.slug}`}>
                <Card className="hover:bg-muted/40">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{p.category.replaceAll("_", " ")}</Badge>
                    </div>
                    <p className="mt-1.5 font-medium">{p.name}</p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.achievements.length > 0 && (
        <section className="border-b border-border p-4">
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Achievements</h2>
          <div className="flex flex-col gap-2">
            {results.achievements.map((a) => (
              <Link key={a.id} href={`/achievements/${a.slug}`}>
                <Card className="hover:bg-muted/40">
                  <CardContent className="p-4">
                    <Badge variant="secondary">{a.category.replaceAll("_", " ")}</Badge>
                    <p className="mt-1.5 font-medium">{a.title}</p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{a.summary}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.events.length > 0 && (
        <section className="border-b border-border p-4">
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Events</h2>
          <div className="flex flex-col gap-2">
            {results.events.map((e) => (
              <Link key={e.id} href={`/events/${e.slug}`}>
                <Card className="hover:bg-muted/40">
                  <CardContent className="p-4">
                    <p className="font-medium">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(e.date)} &middot; {e.venue}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.media.length > 0 && (
        <section className="border-b border-border p-4">
          <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Media</h2>
          <div className="flex flex-col gap-2">
            {results.media.map((m) => (
              <Link key={m.id} href={`/media/${m.slug}`}>
                <Card className="hover:bg-muted/40">
                  <CardContent className="p-4">
                    <Badge variant="secondary">{m.category.replaceAll("_", " ")}</Badge>
                    <p className="mt-1.5 font-medium">{m.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.posts.length > 0 && (
        <section>
          <h2 className="px-4 pt-4 text-sm font-semibold text-muted-foreground">Posts</h2>
          {results.posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </div>
  );
}
