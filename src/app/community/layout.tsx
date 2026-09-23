import { CommunityShell } from "@/components/community/community-shell";
import { RightSidebar } from "@/components/community/right-sidebar";

export default function CommunityLayout({ children }: { children: React.ReactNode }) {
  return <CommunityShell rightSidebar={<RightSidebar />}>{children}</CommunityShell>;
}
