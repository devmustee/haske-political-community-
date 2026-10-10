import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, MessageSquare, MessageCircle, Image as ImageIcon, Heart } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { getSession } from "@/lib/session";
import { getUserProfile } from "@/lib/queries/users";
import { getUserPosts, getUserLikedPosts } from "@/lib/queries/posts";
import { getUserReplies } from "@/lib/queries/replies";
import { PostCard } from "@/components/community/post-card";
import { ReplyCard } from "@/components/community/reply-card";
import { FollowButton } from "@/components/community/follow-button";
import { ProfileActions } from "@/components/community/profile-actions";
import { VerifiedBadge } from "@/components/community/verified-badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDate, formatCount, initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserProfile(username);
  if (!user) return {};
  return { title: `${user.name} (@${user.username})`, description: user.bio ?? undefined };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const session = await getSession();
  const user = await getUserProfile(username, session?.user?.id);
  if (!user) notFound();

  const isOwner = session?.user?.id === user.id;

  const [posts, replies, likes] = await Promise.all([
    getUserPosts(user.id, session?.user?.id),
    getUserReplies(user.id),
    getUserLikedPosts(user.id, session?.user?.id),
  ]);
  const media = posts.filter((p) => p.media.length > 0);

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link href="/community" className="rounded-full p-2 hover:bg-muted max-sm:p-3">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="flex items-center gap-1 font-serif text-lg font-semibold leading-tight">
            {user.name} <VerifiedBadge status={user.verification} />
          </h1>
          <p className="text-xs text-muted-foreground">{formatCount(user._count.posts)} posts</p>
        </div>
      </div>

      <div className="h-40 w-full bg-gradient-to-br from-primary to-primary/70">
        {user.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.coverImageUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      <div className="px-4">
        <div className="flex items-end justify-between">
          <Avatar className="-mt-10 size-24 border-4 border-background">
            <AvatarImage src={user.avatarUrl ?? undefined} />
            <AvatarFallback className="text-2xl">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="pt-3">
            {isOwner ? <ProfileActions user={user} /> : <FollowButton userId={user.id} initialFollowing={user.isFollowing} />}
          </div>
        </div>

        <div className="mt-3">
          <h2 className="flex items-center gap-1 text-xl font-semibold">
            {user.name} <VerifiedBadge status={user.verification} />
          </h2>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        {user.bio && <p className="mt-3 text-[15px]">{user.bio}</p>}

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin className="size-4" /> {user.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="size-4" /> Joined {formatDate(user.createdAt, { month: "long", year: "numeric" })}
          </span>
        </div>

        <div className="mt-3 flex gap-4 text-sm">
          <span>
            <span className="font-semibold">{formatCount(user._count.following)}</span>{" "}
            <span className="text-muted-foreground">Following</span>
          </span>
          <span>
            <span className="font-semibold">{formatCount(user._count.followers)}</span>{" "}
            <span className="text-muted-foreground">Followers</span>
          </span>
        </div>
      </div>

      <Tabs defaultValue="posts" className="mt-4 w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
          <TabsTrigger value="posts" className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Posts
          </TabsTrigger>
          <TabsTrigger value="replies" className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Replies
          </TabsTrigger>
          <TabsTrigger value="media" className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Media
          </TabsTrigger>
          <TabsTrigger value="likes" className="rounded-none data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
            Likes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {posts.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No posts yet" />
          ) : (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </TabsContent>
        <TabsContent value="replies" className="mt-0">
          {replies.length === 0 ? (
            <EmptyState icon={MessageCircle} title="No replies yet" />
          ) : (
            replies.map((r) => <ReplyCard key={r.id} reply={r} />)
          )}
        </TabsContent>
        <TabsContent value="media" className="mt-0">
          {media.length === 0 ? (
            <EmptyState icon={ImageIcon} title="No media yet" />
          ) : (
            media.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </TabsContent>
        <TabsContent value="likes" className="mt-0">
          {likes.length === 0 ? (
            <EmptyState icon={Heart} title="No likes yet" />
          ) : (
            likes.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
