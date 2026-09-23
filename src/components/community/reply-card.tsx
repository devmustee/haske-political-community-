import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/community/verified-badge";
import { formatRelativeTime, initials } from "@/lib/utils";

export function ReplyCard({
  reply,
}: {
  reply: {
    id: string;
    content: string;
    createdAt: Date;
    author: { name: string; username: string; avatarUrl: string | null; verification: string };
    post: { id: string; content: string | null; author: { username: string; name: string } };
  };
}) {
  return (
    <Link href={`/community/post/${reply.post.id}`} className="block border-b border-border px-4 py-3 hover:bg-muted/30">
      <p className="text-xs text-muted-foreground">
        Replying to <span className="text-primary">@{reply.post.author.username}</span>
      </p>
      <div className="mt-1 flex gap-3">
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={reply.author.avatarUrl ?? undefined} />
          <AvatarFallback>{initials(reply.author.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 text-sm">
            <span className="font-semibold">{reply.author.name}</span>
            <VerifiedBadge status={reply.author.verification} />
            <span className="text-muted-foreground">@{reply.author.username}</span>
            <span className="text-muted-foreground">&middot;</span>
            <span className="text-muted-foreground">{formatRelativeTime(reply.createdAt)}</span>
          </div>
          <p className="mt-0.5 text-[15px]">{reply.content}</p>
        </div>
      </div>
    </Link>
  );
}
