import { getSession } from "@/lib/session";
import { getUnreadNotificationCount } from "@/lib/queries/notifications";
import { CommunityShell } from "@/components/community/community-shell";
import { RightSidebar } from "@/components/community/right-sidebar";
import { VerifyEmailBanner } from "@/components/community/verify-email-banner";

export default async function CommunityLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const unreadCount = session?.user ? await getUnreadNotificationCount(session.user.id) : 0;

  return (
    <CommunityShell rightSidebar={<RightSidebar />} unreadCount={unreadCount}>
      {session?.user && !session.user.isEmailVerified && <VerifyEmailBanner />}
      {children}
    </CommunityShell>
  );
}
