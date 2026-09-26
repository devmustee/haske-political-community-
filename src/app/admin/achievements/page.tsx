import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPagePermission } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { AchievementFormDialog } from "@/components/admin/achievement-form-dialog";
import { AchievementRowActions } from "@/components/admin/achievement-row-actions";

export const metadata: Metadata = { title: "Admin · Achievements" };
export const dynamic = "force-dynamic";

export default async function AdminAchievementsPage() {
  await requireAdminPagePermission("cms.achievements");
  const achievements = await prisma.achievement.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">Achievements</h1>
          <p className="mt-1 text-sm text-muted-foreground">{achievements.length} entries.</p>
        </div>
        <AchievementFormDialog />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {achievements.map((a) => (
          <div key={a.id} className="admin-row flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{a.category.replaceAll("_", " ")}</Badge>
                <ContentStatusBadge status={a.contentStatus} />
                {a.featured && <Badge variant="gold">Featured</Badge>}
              </div>
              <p className="mt-1 truncate font-medium">{a.title}</p>
            </div>
            <AchievementRowActions achievement={a} />
          </div>
        ))}
        {achievements.length === 0 && <p className="text-sm text-muted-foreground">No achievements yet.</p>}
      </div>
    </div>
  );
}
