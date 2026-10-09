"use client";

import { useState } from "react";
import { LeftSidebar } from "@/components/community/left-sidebar";
import { MobileNav } from "@/components/community/mobile-nav";
import { PostComposer } from "@/components/community/post-composer";
import { useGuestGate } from "@/components/community/guest-gate";

export function CommunityShell({
  children,
  rightSidebar,
  unreadCount,
}: {
  children: React.ReactNode;
  rightSidebar: React.ReactNode;
  unreadCount: number;
}) {
  const [composerOpen, setComposerOpen] = useState(false);
  const { guard, GateDialog } = useGuestGate();

  const openComposer = guard(() => setComposerOpen(true));

  return (
    <div className="mx-auto flex w-full max-w-[1280px]">
      <aside className="sticky top-0 h-screen w-[72px] shrink-0 border-r border-border px-1 xl:w-[280px] xl:px-3 hidden sm:block">
        <LeftSidebar onCompose={openComposer} unreadCount={unreadCount} />
      </aside>

      <main className="min-h-screen w-full max-w-[600px] flex-1 border-r border-border pb-16 lg:pb-0">{children}</main>

      <aside className="sticky top-0 hidden h-screen w-[350px] shrink-0 overflow-y-auto px-4 py-4 lg:block">
        {rightSidebar}
      </aside>

      <MobileNav onCompose={openComposer} unreadCount={unreadCount} />
      {GateDialog}
      <PostComposer open={composerOpen} onOpenChange={setComposerOpen} />
    </div>
  );
}
