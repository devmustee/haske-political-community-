"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Hook that returns a `guard` wrapper: call `guard(() => doThing())` from any
 * interactive control. If the visitor is a guest, it shows the
 * "Join Haske Community to participate" dialog instead of running the action.
 */
export function useGuestGate() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const guard = useCallback(
    <T extends unknown[]>(fn: (...args: T) => void) =>
      (...args: T) => {
        if (!session?.user) {
          setOpen(true);
          return;
        }
        fn(...args);
      },
    [session?.user]
  );

  const isGuest = !session?.user;

  const GateDialog = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Haske Community to participate</DialogTitle>
          <DialogDescription>
            Create a free account to like, comment, repost, vote in polls, and follow the conversation shaping
            Adamawa&apos;s future.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Not now
          </Button>
          <Button asChild>
            <Link href="/register">Join Haske Community</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { guard, isGuest, GateDialog };
}
