"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/lib/actions/follows";
import { useGuestGate } from "@/components/community/guest-gate";

export function FollowButton({ userId, initialFollowing }: { userId: string; initialFollowing: boolean }) {
  const router = useRouter();
  const { guard, GateDialog } = useGuestGate();
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  const handleClick = guard(() => {
    setFollowing((v) => !v);
    startTransition(async () => {
      const result = await toggleFollow(userId);
      if (!result.ok) {
        toast.error(result.error);
        setFollowing(initialFollowing);
        return;
      }
      router.refresh();
    });
  });

  return (
    <>
      <Button variant={following ? "outline" : "default"} disabled={pending} onClick={handleClick} className="min-w-28">
        {following ? "Following" : "Follow"}
      </Button>
      {GateDialog}
    </>
  );
}
