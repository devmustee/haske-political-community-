import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPagePermission } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { ProgramFormDialog } from "@/components/admin/program-form-dialog";
import { ProgramRowActions } from "@/components/admin/program-row-actions";
import { ApplicationStatusSelect } from "@/components/admin/application-status-select";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Programs" };
export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  await requireAdminPagePermission("cms.programs");
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
    include: { applications: { include: { user: true }, orderBy: { createdAt: "desc" } } },
  });

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">Programs</h1>
          <p className="mt-1 text-sm text-muted-foreground">{programs.length} programs.</p>
        </div>
        <ProgramFormDialog />
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {programs.map((p) => (
          <div key={p.id} className="admin-row rounded-xl border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{p.category.replaceAll("_", " ")}</Badge>
                  <Badge variant="outline">{p.status}</Badge>
                  <ContentStatusBadge status={p.contentStatus} />
                </div>
                <p className="mt-1 font-medium">{p.name}</p>
              </div>
              <ProgramRowActions program={p} />
            </div>

            {p.applications.length > 0 && (
              <div className="mt-3 border-t border-border pt-3">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">
                  {p.applications.length} application{p.applications.length === 1 ? "" : "s"}
                </p>
                <div className="flex flex-col gap-1.5">
                  {p.applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <span className="font-medium">{app.fullName}</span>{" "}
                        <span className="text-muted-foreground">&middot; {app.phone} &middot; {formatDate(app.createdAt)}</span>
                      </div>
                      <ApplicationStatusSelect applicationId={app.id} status={app.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {programs.length === 0 && <p className="text-sm text-muted-foreground">No programs yet.</p>}
      </div>
    </div>
  );
}
