"use client";

import { signOut } from "next-auth/react";
import { disablePush } from "@/lib/push-client";

/** Signs out, first unsubscribing this device from the account's push notifications. */
export async function signOutUser() {
  await disablePush();
  await signOut({ callbackUrl: "/" });
}
