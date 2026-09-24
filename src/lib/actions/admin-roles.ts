"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import { AdminRoleName } from "@prisma/client";
import type { ActionResult } from "@/lib/actions/auth";

export async function grantAdminRole(userId: string, role: AdminRoleName): Promise<ActionResult> {
  const admin = await requirePermission("admin.manage_roles");

  await prisma.adminRole.upsert({
    where: { userId_role: { userId, role } },
    update: {},
    create: { userId, role, grantedById: admin.id },
  });
  await logAudit(admin.id, "admin.grant_role", "User", userId, { role });
  revalidatePath("/admin/users");
  return { ok: true, data: undefined };
}

export async function revokeAdminRole(userId: string, role: AdminRoleName): Promise<ActionResult> {
  const admin = await requirePermission("admin.manage_roles");

  await prisma.adminRole.deleteMany({ where: { userId, role } });
  await logAudit(admin.id, "admin.revoke_role", "User", userId, { role });
  revalidatePath("/admin/users");
  return { ok: true, data: undefined };
}
