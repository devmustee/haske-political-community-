import { AdminRoleName } from "@prisma/client";

// Fine-grained permission keys used across the admin dashboard and server
// actions. Each admin role maps to a fixed set of these.
export type Permission =
  | "cms.biography"
  | "cms.achievements"
  | "cms.programs"
  | "cms.manifesto"
  | "cms.policy"
  | "cms.media"
  | "cms.homepage"
  | "cms.settings"
  | "community.moderate"
  | "community.manage_users"
  | "programs.manage_applications"
  | "events.manage"
  | "feedback.manage"
  | "analytics.view"
  | "moderation.review"
  | "admin.manage_roles";

const ROLE_PERMISSIONS: Record<AdminRoleName, Permission[]> = {
  SUPER_ADMIN: [
    "cms.biography",
    "cms.achievements",
    "cms.programs",
    "cms.manifesto",
    "cms.policy",
    "cms.media",
    "cms.homepage",
    "cms.settings",
    "community.moderate",
    "community.manage_users",
    "programs.manage_applications",
    "events.manage",
    "feedback.manage",
    "analytics.view",
    "moderation.review",
    "admin.manage_roles",
  ],
  CONTENT_ADMIN: [
    "cms.biography",
    "cms.achievements",
    "cms.programs",
    "cms.manifesto",
    "cms.policy",
    "cms.media",
    "cms.homepage",
  ],
  COMMUNITY_MANAGER: [
    "community.moderate",
    "community.manage_users",
    "moderation.review",
  ],
  PROGRAM_MANAGER: ["cms.programs", "programs.manage_applications"],
  EVENT_MANAGER: ["events.manage"],
  ANALYST: ["analytics.view"],
  MODERATOR: ["moderation.review", "community.moderate"],
  ELECTION_ADMIN: ["analytics.view", "feedback.manage"],
  ELECTION_SUPERVISOR: ["analytics.view"],
  ELECTION_COLLECTOR: ["analytics.view"],
};

export function permissionsForRoles(roles: AdminRoleName[]): Set<Permission> {
  const perms = new Set<Permission>();
  for (const role of roles) {
    for (const p of ROLE_PERMISSIONS[role] ?? []) perms.add(p);
  }
  return perms;
}

export function hasPermission(
  roles: AdminRoleName[],
  permission: Permission
): boolean {
  return permissionsForRoles(roles).has(permission);
}

export const ADMIN_ROLE_LABELS: Record<AdminRoleName, string> = {
  SUPER_ADMIN: "Super Admin",
  CONTENT_ADMIN: "Content Admin",
  COMMUNITY_MANAGER: "Community Manager",
  PROGRAM_MANAGER: "Program Manager",
  EVENT_MANAGER: "Event Manager",
  ANALYST: "Analyst",
  MODERATOR: "Moderator",
  ELECTION_ADMIN: "Election Admin",
  ELECTION_SUPERVISOR: "Election Supervisor",
  ELECTION_COLLECTOR: "Election Collector",
};
