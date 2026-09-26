import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPagePermission } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { EventFormDialog } from "@/components/admin/event-form-dialog";
import { EventRowActions } from "@/components/admin/event-row-actions";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Events" };
export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdminPagePermission("events.manage");
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: { _count: { select: { registrations: true, questions: true } } },
  });

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">{events.length} events.</p>
        </div>
        <EventFormDialog />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {events.map((e) => (
          <div key={e.id} className="admin-row flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{e.status}</Badge>
                <span className="text-xs text-muted-foreground">{formatDate(e.date)}</span>
              </div>
              <p className="mt-1 truncate font-medium">{e.title}</p>
              <p className="text-xs text-muted-foreground">{e._count.registrations} registered &middot; {e._count.questions} questions</p>
            </div>
            <EventRowActions event={e} />
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
      </div>
    </div>
  );
}
