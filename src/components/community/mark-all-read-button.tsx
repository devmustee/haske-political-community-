"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { markAllNotificationsRead } from "@/lib/actions/notifications";
import { runAction } from "@/lib/run-action";

export function MarkAllReadButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await runAction(() => markAllNotificationsRead());
          router.refresh();
        })
      }
    >
      Mark all read
    </Button>
  );
}
