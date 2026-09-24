import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { permissionsForRoles } from "@/lib/permissions";
import { AdminRoleName } from "@prisma/client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/admin");

  const roles = (session.user.adminRoles ?? []) as AdminRoleName[];
  if (roles.length === 0) redirect("/community");

  const permissions = Array.from(permissionsForRoles(roles));

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-border sm:block">
        <AdminSidebar roles={roles} permissions={permissions} />
      </aside>
      <main className="flex-1 bg-secondary/20">{children}</main>
    </div>
  );
}
