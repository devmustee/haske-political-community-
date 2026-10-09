"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutUser } from "@/lib/sign-out";
import { EditProfileDialog } from "@/components/community/edit-profile-dialog";

export function ProfileActions({
  user,
}: {
  user: {
    name: string;
    username: string;
    bio: string | null;
    location: string | null;
    avatarUrl: string | null;
    coverImageUrl: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit profile
      </Button>
      {/* The desktop sidebar has its own sign-out; phones and tablets get it here. */}
      <Button variant="ghost" onClick={signOutUser} className="text-muted-foreground xl:hidden">
        <LogOut className="size-4" />
        Sign out
      </Button>
      <EditProfileDialog open={open} onOpenChange={setOpen} user={user} />
    </div>
  );
}
