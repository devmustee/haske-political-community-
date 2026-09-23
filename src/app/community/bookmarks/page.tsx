import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserBookmarkedPosts } from "@/lib/queries/posts";
import { PostCard } from "@/components/community/post-card";

export const metadata: Metadata = { title: "Bookmarks" };
export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/community/bookmarks");

  const posts = await getUserBookmarkedPosts(session.user.id);

  return (
    <div>
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="font-serif text-xl font-semibold">Bookmarks</h1>
      </div>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">Posts you bookmark will show up here.</p>
      ) : (
        posts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </div>
  );
}
