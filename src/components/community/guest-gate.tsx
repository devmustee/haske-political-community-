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
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  const guard = useCallback(
    <T extends unknown[]>(fn: (...args: T) => void) =>
      (...args: T) => {
        // Ignore taps in the moment before the session has loaded, rather
        // than telling a signed-in member to join.
        if (status === "loading") return;
        if (!session?.user) {
          setOpen(true);
          return;
        }
        fn(...args);
      },
    [session?.user, status]
  );

  // Only a confirmed guest is a guest: on a slow connection the session takes
  // a moment to load, and signed-in members shouldn't see "Sign in" meanwhile.
  const isGuest = status === "unauthenticated";

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
