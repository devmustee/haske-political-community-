import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getNotifications } from "@/lib/queries/notifications";
import { NotificationItem } from "@/components/community/notification-item";
import { MarkAllReadButton } from "@/components/community/mark-all-read-button";

export const metadata: Metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/community/notifications");

  const notifications = await getNotifications(session.user.id);

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="font-serif text-xl font-semibold">Notifications</h1>
        {notifications.some((n) => !n.read) && <MarkAllReadButton />}
      </div>

      {notifications.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
      ) : (
        notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
      )}
    </div>
  );
}
