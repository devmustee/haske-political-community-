/** Shared wording for notifications, used by the in-app list and push messages. */
export const NOTIFICATION_VERB: Record<string, string> = {
  LIKE: "liked your post",
  COMMENT: "commented on your post",
  REPLY: "replied to your comment",
  REPOST: "reposted your post",
  QUOTE_REPOST: "quoted your post",
  FOLLOW: "followed you",
  POLL_RESULT: "voted in your poll",
};

/** Where a notification should take the user (in-app list and push). */
export function notificationHref(n: { type?: string; postId?: string | null; actorUsername?: string | null; link?: string | null }) {
  if (n.type === "APPLICATION_STATUS") return "/applications";
  if (n.type === "ADMIN_ANNOUNCEMENT" && n.link) return n.link;
  if (n.postId) return `/community/post/${n.postId}`;
  if (n.actorUsername) return `/community/user/${n.actorUsername}`;
  return "/community/notifications";
}

/** Push notification title/body for a notification. */
export function notificationPushText(n: { type: string; actorName?: string | null; message?: string | null }) {
  const verb = NOTIFICATION_VERB[n.type];
  if (n.actorName && verb) return { title: "Haske Community", body: `${n.actorName} ${verb}` };
  return { title: "Haske Community", body: n.message ?? "You have a new notification." };
}
