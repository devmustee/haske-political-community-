import type { Prisma } from "@prisma/client";

/**
 * The user fields that are safe to show anyone. Queries that include a
 * post's author, a comment's author, a notification's actor and so on select
 * these instead of the whole row, so private fields (password hash, email,
 * phone) are never loaded alongside public content and can't end up in a page.
 */
export const publicUserSelect = {
  id: true,
  name: true,
  username: true,
  avatarUrl: true,
  verification: true,
  location: true,
} satisfies Prisma.UserSelect;
