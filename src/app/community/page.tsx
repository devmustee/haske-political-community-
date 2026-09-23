import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { getFeedPosts } from "@/lib/queries/posts";
import { PostCard } from "@/components/community/post-card";
import { FeedTabs } from "@/components/community/feed-tabs";
import { ComposerPrompt } from "@/components/community/composer-prompt";
import { Info } from "lucide-react";

export const metadata: Metadata = { title: "Community" };
export const dynamic = "force-dynamic";

const TABS = ["for-you", "latest", "following", "official", "trending"] as const;
type Tab = (typeof TABS)[number];

export default async function CommunityFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabParam } = await searchParams;
  const tab: Tab = TABS.includes(tabParam as Tab) ? (tabParam as Tab) : "for-you";

  const session = await auth();
  const posts = await getFeedPosts({ viewerId: session?.user?.id, tab });

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <h1 className="px-4 pt-3 font-serif text-xl font-semibold">Home</h1>
        <FeedTabs active={tab} />
      </div>

      <ComposerPrompt />

      {tab === "following" && !session?.user && (
        <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          <Info className="size-4 shrink-0" />
          Sign in to see posts from people you follow.
        </div>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-20 text-center">
          <p className="font-medium">Nothing here yet</p>
          <p className="text-sm text-muted-foreground">
            {tab === "following"
              ? "Follow people to see their posts here."
              : "Be the first to post in Haske Community."}
          </p>
          {tab === "following" && (
            <Link href="/community/explore" className="text-sm font-medium text-primary hover:underline">
              Discover people to follow
            </Link>
          )}
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
