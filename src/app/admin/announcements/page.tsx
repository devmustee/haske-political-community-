import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPagePermission } from "@/lib/session";
import { AnnouncementComposer } from "@/components/admin/announcement-composer";
import { DeleteAnnouncementButton } from "@/components/admin/delete-announcement-button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Announcements" };
export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  await requireAdminPagePermission("notifications.broadcast");
  const [recipientCount, sent] = await Promise.all([
    prisma.user.count({ where: { status: "ACTIVE", NOT: { notificationPref: { is: { adminAnnouncements: false } } } } }),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { createdBy: { select: { name: true } } } }),
  ]);

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-h1">Announcements</h1>
      <p className="mt-1 text-sm text-muted-foreground">Send a notification to everyone in Haske Community.</p>

      <div className="mt-6">
        <AnnouncementComposer recipientCount={recipientCount} />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Sent</h2>
      <div className="mt-3 flex flex-col gap-2">
        {sent.map((a) => (
          <div key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-background p-4">
            <div className="min-w-0">
              <p className="font-medium">{a.title}</p>
              <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{a.body}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(a.createdAt)} &middot; {a.recipientCount.toLocaleString()} recipients
                {a.createdBy && <> &middot; by {a.createdBy.name}</>}
                {a.link && <> &middot; links to {a.link}</>}
              </p>
            </div>
            <DeleteAnnouncementButton id={a.id} title={a.title} />
          </div>
        ))}
        {sent.length === 0 && <p className="text-sm text-muted-foreground">Nothing sent yet.</p>}
      </div>
    </div>
  );
}
