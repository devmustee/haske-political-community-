import Link from "next/link";
import { Heart, MessageCircle, Repeat2, UserPlus, BarChart3, Calendar, Sparkles, Megaphone, MessageSquareWarning, ClipboardCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/community/verified-badge";
import { formatRelativeTime, initials, cn } from "@/lib/utils";
import { NOTIFICATION_VERB as VERB, notificationHref } from "@/lib/notification-text";

const ICONS: Record<string, { icon: React.ElementType; className: string }> = {
  LIKE: { icon: Heart, className: "text-rose-600" },
  COMMENT: { icon: MessageCircle, className: "text-primary" },
  REPLY: { icon: MessageCircle, className: "text-primary" },
  REPOST: { icon: Repeat2, className: "text-emerald-600" },
  QUOTE_REPOST: { icon: Repeat2, className: "text-emerald-600" },
  FOLLOW: { icon: UserPlus, className: "text-primary" },
  POLL_RESULT: { icon: BarChart3, className: "text-accent-foreground" },
  EVENT_REMINDER: { icon: Calendar, className: "text-primary" },
  PROGRAM_UPDATE: { icon: Sparkles, className: "text-accent-foreground" },
  ADMIN_ANNOUNCEMENT: { icon: Megaphone, className: "text-primary" },
  FEEDBACK_STATUS: { icon: MessageSquareWarning, className: "text-primary" },
  APPLICATION_STATUS: { icon: ClipboardCheck, className: "text-primary" },
};


interface NotificationData {
  id: string;
  type: string;
  read: boolean;
  postId: string | null;
  message: string | null;
  createdAt: Date;
  actor: { name: string; username: string; avatarUrl: string | null; verification: string } | null;
  announcement?: { title: string; body: string; link: string | null } | null;
}

export function NotificationItem({ notification }: { notification: NotificationData }) {
  const config = ICONS[notification.type] ?? { icon: Megaphone, className: "text-primary" };
  const Icon = config.icon;
  const href = notificationHref({
    type: notification.type,
    postId: notification.postId,
    actorUsername: notification.actor?.username,
    link: notification.announcement?.link,
  });

  return (
    <Link
      href={href}
      className={cn("flex gap-3 border-b border-border px-4 py-3.5 hover:bg-muted/30", !notification.read && "bg-primary/5")}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", config.className)} />
      <div className="min-w-0 flex-1">
        {notification.actor ? (
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={notification.actor.avatarUrl ?? undefined} />
              <AvatarFallback className="text-xs">{initials(notification.actor.name)}</AvatarFallback>
            </Avatar>
            <p className="text-sm">
              <span className="font-semibold">{notification.actor.name}</span>
              <VerifiedBadge status={notification.actor.verification} className="mx-1 inline" />
              {VERB[notification.type] ?? notification.message}
            </p>
          </div>
        ) : notification.announcement ? (
          <div className="text-sm">
            <p className="font-semibold">{notification.announcement.title}</p>
            <p className="mt-0.5 whitespace-pre-line text-muted-foreground">{notification.announcement.body}</p>
          </div>
        ) : (
          <p className="text-sm">{notification.message ?? "New update"}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(notification.createdAt)}</p>
      </div>
    </Link>
  );
}
