import "server-only";
import { prisma } from "@/lib/prisma";
import { publicUserSelect } from "@/lib/queries/public-user";

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { actor: { select: publicUserSelect }, announcement: { select: { title: true, body: true, link: true } } },
  });
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notification.count({ where: { userId, read: false } });
}
