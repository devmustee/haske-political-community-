"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, Sparkles, Calendar, Bell, Bookmark, User, LogOut, Shield, PenSquare, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { initials, cn } from "@/lib/utils";
import { VerifiedBadge } from "@/components/community/verified-badge";
import { UnreadBadge } from "@/components/community/unread-badge";
import { signOutUser } from "@/lib/sign-out";

const NAV = [
  { href: "/community", label: "Home", icon: Home },
  { href: "/community/explore", label: "Explore", icon: Search },
  { href: "/programs", label: "Programs", icon: Sparkles },
  { href: "/events", label: "Events", icon: Calendar },
];

export function LeftSidebar({ onCompose, unreadCount = 0 }: { onCompose?: () => void; unreadCount?: number }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex h-full flex-col gap-1 py-4">
      <Link href="/" className="mb-2 flex items-center gap-2 px-3">
        <Image src="/brand/haske-logo.png" alt="Abdulrahman Bashir Haske" width={32} height={32} className="size-8 rounded-full bg-white object-contain" />
        <span className="hidden font-serif text-lg font-semibold xl:inline">Haske Community</span>
      </Link>

      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3.5 rounded-full px-3 py-2.5 text-lg font-medium transition-colors hover:bg-muted xl:text-base",
              active && "bg-primary/10 font-semibold text-primary hover:bg-primary/15"
            )}
          >
            <item.icon className="size-6 xl:size-5" strokeWidth={active ? 2.5 : 2} />
            <span className="hidden xl:inline">{item.label}</span>
          </Link>
        );
      })}

      {user && (
        <>
          <Link
            href="/community/notifications"
            className={cn(
              "flex items-center gap-3.5 rounded-full px-3 py-2.5 text-lg font-medium transition-colors hover:bg-muted xl:text-base",
              pathname === "/community/notifications" && "bg-primary/10 font-semibold text-primary hover:bg-primary/15"
            )}
          >
            <span className="relative">
              <Bell className="size-6 xl:size-5" strokeWidth={pathname === "/community/notifications" ? 2.5 : 2} />
              <UnreadBadge count={unreadCount} />
            </span>
            <span className="hidden xl:inline">Notifications</span>
          </Link>
          <Link
            href="/community/bookmarks"
            className={cn(
              "flex items-center gap-3.5 rounded-full px-3 py-2.5 text-lg font-medium transition-colors hover:bg-muted xl:text-base",
              pathname === "/community/bookmarks" && "bg-primary/10 font-semibold text-primary hover:bg-primary/15"
            )}
          >
            <Bookmark className="size-6 xl:size-5" />
            <span className="hidden xl:inline">Bookmarks</span>
          </Link>
          <Link
            href={`/community/user/${user.username}`}
            className={cn(
              "flex items-center gap-3.5 rounded-full px-3 py-2.5 text-lg font-medium transition-colors hover:bg-muted xl:text-base",
              pathname === `/community/user/${user.username}` && "bg-primary/10 font-semibold text-primary hover:bg-primary/15"
            )}
          >
            <User className="size-6 xl:size-5" />
            <span className="hidden xl:inline">Profile</span>
          </Link>
          {user.adminRoles?.length > 0 && (
            <Link
              href="/admin"
              className="flex items-center gap-3.5 rounded-full px-3 py-2.5 text-lg font-medium transition-colors hover:bg-muted xl:text-base"
            >
              <Shield className="size-6 xl:size-5" />
              <span className="hidden xl:inline">Admin</span>
            </Link>
          )}
        </>
      )}

      {user ? (
        <>
          <Button onClick={onCompose} size="lg" className="mt-3 hidden xl:flex">
            Post
          </Button>
          <Button onClick={onCompose} size="icon" className="mt-3 flex size-12 self-start rounded-full xl:hidden">
            <PenSquare className="size-5" />
          </Button>

          <div className="mt-auto flex flex-col items-center gap-1 rounded-full p-2 xl:flex-row xl:gap-2 xl:hover:bg-muted">
            <Avatar className="size-9">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
              <AvatarFallback>{initials(user.name ?? user.username)}</AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 flex-1 xl:block">
              <p className="truncate text-sm font-medium leading-tight">
                {user.name} <VerifiedBadge status={user.verification} className="inline size-3.5" />
              </p>
              <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
            </div>
            <button
              onClick={signOutUser}
              className="flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary xl:size-auto xl:p-2"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="mt-auto flex flex-col gap-2 px-1">
          <Button asChild size="lg" className="hidden xl:flex">
            <Link href="/register">Join Haske Community</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="hidden xl:flex">
            <Link href="/login">Sign in</Link>
          </Button>
          {/* Collapsed (icon-only) sidebar below xl */}
          <Button asChild size="icon" className="size-12 self-center rounded-full xl:hidden">
            <Link href="/register" aria-label="Join Haske Community" title="Join Haske Community">
              <UserPlus className="size-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="size-12 self-center rounded-full xl:hidden">
            <Link href="/login" aria-label="Sign in" title="Sign in">
              <LogIn className="size-5" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
