"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/lib/actions/follows";
import { useGuestGate } from "@/components/community/guest-gate";
import { runAction } from "@/lib/run-action";

export function FollowButton({
  userId,
  initialFollowing,
  size = "default",
}: {
  userId: string;
  initialFollowing: boolean;
  size?: "default" | "sm";
}) {
  const { guard, GateDialog } = useGuestGate();
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  const handleClick = guard(() => {
    setFollowing((v) => !v);
    startTransition(async () => {
      const result = await runAction(() => toggleFollow(userId));
      if (!result.ok) {
        toast.error(result.error);
        setFollowing(initialFollowing);
      }
      // toggleFollow revalidates, and Next.js returns the refreshed page with
      // the action's response, so follower counts update without a reload.
    });
  });

  return (
    <>
      <Button
        variant={following ? "outline" : "default"}
        size={size}
        disabled={pending}
        onClick={handleClick}
        className={size === "sm" ? "min-w-20" : "min-w-28"}
      >
        {following ? "Following" : "Follow"}
      </Button>
      {GateDialog}
    </>
  );
}
