"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Search, Bell, User, PenSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav({ onCompose }: { onCompose: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const items = [
    { href: "/community", label: "Home", icon: Home },
    { href: "/community/explore", label: "Explore", icon: Search },
    { href: "/community/notifications", label: "Alerts", icon: Bell },
    { href: user ? `/community/user/${user.username}` : "/login", label: "Profile", icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-background/95 py-2 backdrop-blur lg:hidden">
      {items.slice(0, 2).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn("flex flex-col items-center gap-0.5 p-2 text-muted-foreground", pathname === item.href && "text-foreground")}
        >
          <item.icon className="size-6" />
        </Link>
      ))}

      <button
        onClick={onCompose}
        className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <PenSquare className="size-5" />
      </button>

      {items.slice(2).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn("flex flex-col items-center gap-0.5 p-2 text-muted-foreground", pathname === item.href && "text-foreground")}
        >
          <item.icon className="size-6" />
        </Link>
      ))}
    </nav>
  );
}
