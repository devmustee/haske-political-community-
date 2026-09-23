"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit profile
      </Button>
      <EditProfileDialog open={open} onOpenChange={setOpen} user={user} />
    </>
  );
}
