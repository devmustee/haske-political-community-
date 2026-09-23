import "server-only";
import { auth } from "@/auth";
import { AdminRoleName } from "@prisma/client";
import { hasPermission, type Permission } from "@/lib/permissions";

export class AuthError extends Error {}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/** Throws if not signed in. Use inside server actions that require auth. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("You must be signed in to do that.");
  if (user.status === "BANNED") throw new AuthError("Your account has been banned.");
  if (user.status === "SUSPENDED") throw new AuthError("Your account is currently suspended.");
  return user;
}

/** Throws unless the current user holds `permission` via one of their admin roles. */
export async function requirePermission(permission: Permission) {
  const user = await requireUser();
  const roles = (user.adminRoles ?? []) as AdminRoleName[];
  if (!hasPermission(roles, permission)) {
    throw new AuthError("You do not have permission to do that.");
  }
  return user;
}
