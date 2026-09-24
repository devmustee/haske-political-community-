"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Award,
  Sparkles,
  Calendar,
  Newspaper,
  FileText,
  MessageSquare,
  Settings,
  ScrollText,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Permission } from "@/lib/permissions";
import { ADMIN_ROLE_LABELS } from "@/lib/permissions";
import type { AdminRoleName } from "@prisma/client";

const NAV: { href: string; label: string; icon: React.ElementType; permission?: Permission }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/moderation", label: "Moderation", icon: ShieldAlert, permission: "moderation.review" },
  { href: "/admin/users", label: "Users", icon: Users, permission: "community.manage_users" },
  { href: "/admin/achievements", label: "Achievements", icon: Award, permission: "cms.achievements" },
  { href: "/admin/programs", label: "Programs", icon: Sparkles, permission: "cms.programs" },
  { href: "/admin/events", label: "Events", icon: Calendar, permission: "events.manage" },
  { href: "/admin/media", label: "Media", icon: Newspaper, permission: "cms.media" },
  { href: "/admin/manifesto", label: "Manifesto & Policy", icon: FileText, permission: "cms.manifesto" },
  { href: "/admin/feedback", label: "Citizen Feedback", icon: MessageSquare, permission: "feedback.manage" },
  { href: "/admin/settings", label: "Site Settings", icon: Settings, permission: "cms.settings" },
  { href: "/admin/audit-log", label: "Audit Log", icon: ScrollText, permission: "admin.manage_roles" },
];

export function AdminSidebar({ roles, permissions }: { roles: AdminRoleName[]; permissions: Permission[] }) {
  const pathname = usePathname();
  const permSet = new Set(permissions);

  return (
    <div className="flex h-full flex-col gap-1 p-4">
      <Link href="/community" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to site
      </Link>
      <p className="mb-2 px-2 font-serif text-lg font-semibold">Admin</p>
      <p className="mb-4 px-2 text-xs text-muted-foreground">{roles.map((r) => ADMIN_ROLE_LABELS[r]).join(", ")}</p>

      {NAV.filter((item) => !item.permission || permSet.has(item.permission)).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            pathname === item.href && "bg-muted text-foreground"
          )}
        >
          <item.icon className="size-4" />
          {item.label}
        </Link>
      ))}
    </div>
  );
}
