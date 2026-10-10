import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getNotifications } from "@/lib/queries/notifications";
import { NotificationItem } from "@/components/community/notification-item";
import { MarkAllReadButton } from "@/components/community/mark-all-read-button";
import { PushToggle } from "@/components/community/push-toggle";
import { EmptyState } from "@/components/ui/empty-state";
import { Bell } from "lucide-react";

export const metadata: Metadata = { title: "Notifications" };
export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/community/notifications");

  const notifications = await getNotifications(session.user.id);

  return (
    <div>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <h1 className="font-serif text-xl font-semibold">Notifications</h1>
        {notifications.some((n) => !n.read) && <MarkAllReadButton />}
      </div>

      <PushToggle />

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="New notifications will show up here." />
      ) : (
        notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
      )}
    </div>
  );
}
