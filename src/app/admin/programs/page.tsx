import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPagePermission } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { ContentStatusBadge } from "@/components/cms/content-status-badge";
import { ProgramFormDialog } from "@/components/admin/program-form-dialog";
import { ProgramRowActions } from "@/components/admin/program-row-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { APPLICATION_STATUS_INFO } from "@/lib/applications";
import { isPayoutConfigured } from "@/lib/crypto/payout";

export const metadata: Metadata = { title: "Admin · Programs" };
export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  await requireAdminPagePermission("cms.programs");
  const payoutConfigured = isPayoutConfigured();
  const programs = await prisma.program.findMany({
    orderBy: { createdAt: "desc" },
  });
  const grouped = await prisma.programApplication.groupBy({ by: ["programId", "status"], _count: true });
  const countsFor = (programId: string) => grouped.filter((g) => g.programId === programId);

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1">Programs</h1>
          <p className="mt-1 text-sm text-muted-foreground">{programs.length} programs.</p>
        </div>
        <ProgramFormDialog payoutConfigured={payoutConfigured} />
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
                  {p.requiresPayoutDetails && (
                    <Badge variant="outline">Bank details: {p.payoutDetailsStage === "AT_APPLICATION" ? "when applying" : "after acceptance"}</Badge>
                  )}
                </div>
                <p className="mt-1 font-medium">{p.name}</p>
              </div>
              <ProgramRowActions program={p} payoutConfigured={payoutConfigured} />
            </div>

            {(() => {
              const counts = countsFor(p.id);
              const total = counts.reduce((n, c) => n + c._count, 0);
              return (
                <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    {total === 0
                      ? "No applications yet"
                      : `${total} application${total === 1 ? "" : "s"}: ` +
                        counts.map((c) => `${c._count} ${APPLICATION_STATUS_INFO[c.status].label.toLowerCase()}`).join(", ")}
                  </p>
                  {total > 0 && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/programs/${p.id}/applications`}>Review applications</Link>
                    </Button>
                  )}
                </div>
              );
            })()}
          </div>
        ))}
        {programs.length === 0 && <p className="text-sm text-muted-foreground">No programs yet.</p>}
      </div>
    </div>
  );
}
