"use client";

import { useState } from "react";
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
  Menu,
  X,
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

function NavLinks({ items, onNavigate }: { items: typeof NAV; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            pathname === item.href && "bg-muted text-foreground"
          )}
        >
          <item.icon className="size-4" />
          {item.label}
        </Link>
      ))}
    </>
  );
}

export function AdminSidebar({ roles, permissions }: { roles: AdminRoleName[]; permissions: Permission[] }) {
  const [open, setOpen] = useState(false);
  const permSet = new Set(permissions);
  const items = NAV.filter((item) => !item.permission || permSet.has(item.permission));
  const roleLabel = roles.map((r) => ADMIN_ROLE_LABELS[r]).join(", ");

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-border bg-background p-4 sm:hidden">
        <div>
          <p className="font-serif text-lg font-semibold leading-tight">Admin</p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded-lg p-2 hover:bg-muted" aria-label="Open admin menu">
          <Menu className="size-5" />
        </button>
      </div>

      {/* Mobile overlay drawer */}
      {open && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-1 overflow-y-auto bg-background p-4 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <Link href="/community" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" /> Back to site
              </Link>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-muted" aria-label="Close admin menu">
                <X className="size-4" />
              </button>
            </div>
            <p className="mb-1 px-2 font-serif text-lg font-semibold">Admin</p>
            <p className="mb-3 px-2 text-xs text-muted-foreground">{roleLabel}</p>
            <NavLinks items={items} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden h-full flex-col gap-1 p-4 sm:flex">
        <Link href="/community" className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to site
        </Link>
        <p className="mb-2 px-2 font-serif text-lg font-semibold">Admin</p>
        <p className="mb-4 px-2 text-xs text-muted-foreground">{roleLabel}</p>
        <NavLinks items={items} />
      </div>
    </>
  );
}
