import { auth } from "@/auth";
import { getUnreadNotificationCount } from "@/lib/queries/notifications";
import { CommunityShell } from "@/components/community/community-shell";
import { RightSidebar } from "@/components/community/right-sidebar";

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const unreadCount = session?.user ? await getUnreadNotificationCount(session.user.id) : 0;

  return (
    <CommunityShell rightSidebar={<RightSidebar />} unreadCount={unreadCount}>
      {children}
    </CommunityShell>
  );
}
