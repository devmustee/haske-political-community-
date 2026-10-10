import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminRoleName } from "@prisma/client";
import { hasPermission, type Permission } from "@/lib/permissions";

export class AuthError extends Error {}

/**
 * The current session, resolved at most once per request. Each auth() call
 * runs the JWT callback (which may query the database), and a single page
 * render can call it from the layout, the page and several components.
 */
export const getSession = cache(() => auth());

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/** Throws if not signed in. Use inside server actions that require auth. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new AuthError("You must be signed in to do that.");
  if (user.status === "BANNED") throw new AuthError("Your account has been banned.");
  if (user.status === "SUSPENDED") throw new AuthError("Your account is currently suspended.");
  if (!user.isEmailVerified) throw new AuthError("Please verify your email address to do that — check your inbox for the verification link.");
  return user;
}

/**
 * For user-facing server actions: the signed-in user, or the reason they
 * can't act. Returning the reason (instead of throwing) matters because
 * Next.js hides thrown error messages in production, so the user would see
 * nothing, e.g. never learn they need to verify their email.
 */
export async function requireUserResult(): Promise<
  { ok: true; user: Awaited<ReturnType<typeof requireUser>> } | { ok: false; error: string }
> {
  try {
    return { ok: true, user: await requireUser() };
  } catch (err) {
    if (err instanceof AuthError) return { ok: false, error: err.message };
    throw err;
  }
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

/**
 * For admin Server Component pages: redirects to /admin (rather than
 * throwing, which server actions use instead) if the signed-in user lacks
 * `permission`. The shared /admin layout already redirects non-admins away
 * entirely; this additionally scopes each page to its own permission so an
 * admin with only a narrow role (e.g. EVENT_MANAGER) can't read other
 * domains' data by navigating directly to their page URL.
 */
export async function requireAdminPagePermission(permission: Permission) {
  const user = await getCurrentUser();
  const roles = (user?.adminRoles ?? []) as AdminRoleName[];
  if (!user || !hasPermission(roles, permission)) redirect("/admin");
  return user;
}
