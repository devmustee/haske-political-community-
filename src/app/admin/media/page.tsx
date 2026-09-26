import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPagePermission } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { MediaFormDialog } from "@/components/admin/media-form-dialog";
import { MediaRowActions } from "@/components/admin/media-row-actions";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Media" };
export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await requireAdminPagePermission("cms.media");
  const items = await prisma.mediaCenterItem.findMany({ orderBy: { date: "desc" } });

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">Media Center</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} items.</p>
        </div>
        <MediaFormDialog />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="admin-row flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{item.category.replaceAll("_", " ")}</Badge>
                <ContentStatusBadge status={item.contentStatus} />
                <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
              </div>
              <p className="mt-1 truncate font-medium">{item.title}</p>
            </div>
            <MediaRowActions item={item} />
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">No media items yet.</p>}
      </div>
    </div>
  );
}
