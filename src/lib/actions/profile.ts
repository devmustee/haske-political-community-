"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/profile";
import type { ActionResult } from "@/lib/actions/auth";

export async function updateProfile(input: UpdateProfileInput): Promise<ActionResult> {
  const user = await requireUser();
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid profile data." };
  const { name, bio, location, avatarUrl, coverImageUrl } = parsed.data;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      bio: bio || null,
      location: location || null,
      avatarUrl: avatarUrl || null,
      coverImageUrl: coverImageUrl || null,
    },
  });

  revalidatePath(`/community/user/${user.username}`);
  return { ok: true, data: undefined };
}
