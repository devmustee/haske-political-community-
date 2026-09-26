import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { hasPermission } from "@/lib/permissions";
import { requireAdminPagePermission } from "@/lib/session";
import { initials, formatDate } from "@/lib/utils";
import { AdminRoleName } from "@prisma/client";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "secondary",
  SUSPENDED: "outline",
  BANNED: "destructive",
};

export default async function AdminUsersPage() {
  await requireAdminPagePermission("community.manage_users");
  const session = await auth();
  const canManageRoles = hasPermission((session?.user.adminRoles ?? []) as AdminRoleName[], "admin.manage_roles");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { adminRoles: true, _count: { select: { posts: true, followers: true } } },
  });

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-h1">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">{users.length} accounts.</p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
        <table className="admin-table w-full min-w-[720px] text-sm">
          <thead className="border-b border-border bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Roles</th>
              <th className="px-4 py-3">Posts</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8">
                      <AvatarImage src={u.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-xs">{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">@{u.username}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[u.status]}>{u.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  {u.verification !== "NONE" ? <Badge>{u.verification}</Badge> : <span className="text-muted-foreground">&mdash;</span>}
                </td>
                <td className="px-4 py-3">
                  {u.adminRoles.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {u.adminRoles.map((r) => (
                        <Badge key={r.id} variant="outline">
                          {r.role.replaceAll("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">&mdash;</span>
                  )}
                </td>
                <td className="px-4 py-3">{u._count.posts}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(u.createdAt, { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-4 py-3">
                  <UserRowActions
                    userId={u.id}
                    status={u.status}
                    verification={u.verification}
                    currentRoles={u.adminRoles.map((r) => r.role)}
                    canManageRoles={canManageRoles}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
