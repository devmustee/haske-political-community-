import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdminPagePermission } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin · Audit Log" };
export const dynamic = "force-dynamic";

export default async function AdminAuditLogPage() {
  await requireAdminPagePermission("admin.manage_roles");
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { admin: true },
  });

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-h1">Audit Log</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every administrative action is recorded here.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
        <table className="admin-table w-full min-w-[600px] text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">When</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{log.admin.name}</p>
                  <p className="text-xs text-muted-foreground">@{log.admin.username}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{log.action}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {log.entityType}
                  {log.entityId ? ` #${log.entityId.slice(0, 8)}` : ""}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatRelativeTime(log.createdAt)}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No audit log entries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
