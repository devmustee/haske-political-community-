import "server-only";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { after } from "next/server";
import { sendPushToUser } from "@/lib/push";
import { notificationHref, notificationPushText } from "@/lib/notification-text";

const PREF_FIELD: Partial<Record<NotificationType, string>> = {
  LIKE: "likes",
  COMMENT: "comments",
  REPLY: "comments",
  FOLLOW: "follows",
  REPOST: "reposts",
  QUOTE_REPOST: "reposts",
  POLL_RESULT: "pollResults",
  EVENT_REMINDER: "eventReminders",
  PROGRAM_UPDATE: "programUpdates",
  ADMIN_ANNOUNCEMENT: "adminAnnouncements",
  FEEDBACK_STATUS: "feedbackUpdates",
};

interface NotifyInput {
  userId: string;
  actorId?: string;
  type: NotificationType;
  postId?: string;
  commentId?: string;
  message?: string;
}

/** Fire-and-forget notification creation, respecting per-user preferences. */
export async function notify(input: NotifyInput) {
  if (input.actorId && input.actorId === input.userId) return; // don't notify yourself

  const prefField = PREF_FIELD[input.type];
  if (prefField) {
    const pref = await prisma.notificationPreference.findUnique({ where: { userId: input.userId } });
    if (pref && prefField in pref && !(pref as unknown as Record<string, boolean>)[prefField]) {
      return; // user opted out
    }
  }

  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      actorId: input.actorId,
      type: input.type,
      postId: input.postId,
      commentId: input.commentId,
      message: input.message,
    },
    include: { actor: { select: { name: true, username: true } } },
  });

  // Push to the user's devices after the response is sent, so it never slows
  // down the action that triggered it.
  after(() =>
    sendPushToUser(input.userId, {
      ...notificationPushText({ type: input.type, actorName: notification.actor?.name, message: input.message }),
      url: notificationHref({ postId: input.postId, actorUsername: notification.actor?.username }),
      tag: `${input.type}:${input.postId ?? notification.actor?.username ?? notification.id}`,
    })
  );
}
