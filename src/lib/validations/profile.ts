import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(280).optional().or(z.literal("")),
  location: z.string().trim().max(80).optional().or(z.literal("")),
  avatarUrl: z.string().optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
