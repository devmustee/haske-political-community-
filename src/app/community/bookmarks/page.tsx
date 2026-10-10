import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getUserBookmarkedPosts } from "@/lib/queries/posts";
import { PostCard } from "@/components/community/post-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = { title: "Bookmarks" };
export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/community/bookmarks");

  const posts = await getUserBookmarkedPosts(session.user.id);

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="font-serif text-xl font-semibold">Bookmarks</h1>
      </div>

      {posts.length === 0 ? (
        <EmptyState icon={Bookmark} title="No bookmarks yet" description="Posts you bookmark will show up here." />
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
