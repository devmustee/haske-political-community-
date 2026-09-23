import { z } from "zod";

export const postMediaSchema = z.object({
  url: z.string().min(1),
  type: z.enum(["IMAGE", "VIDEO"]),
  altText: z.string().max(300).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});

export const createPollSchema = z.object({
  question: z.string().trim().min(3, "Poll question is too short").max(280),
  options: z
    .array(z.string().trim().min(1).max(80))
    .min(2, "Add at least 2 options")
    .max(6, "A poll can have at most 6 options"),
  allowMultiple: z.boolean().default(false),
  durationHours: z.number().int().min(1).max(24 * 30).default(24),
  resultsVisibility: z.enum(["AFTER_VOTE", "AFTER_END", "ALWAYS"]).default("AFTER_VOTE"),
});

export const createPostSchema = z
  .object({
    content: z.string().trim().max(2000).optional(),
    linkUrl: z.string().url().optional().or(z.literal("")),
    media: z.array(postMediaSchema).max(4).optional(),
    poll: createPollSchema.optional(),
    quoteOfId: z.string().optional(),
  })
  .refine((data) => Boolean(data.content?.length) || Boolean(data.media?.length) || Boolean(data.poll), {
    message: "Add some text, media, or a poll before posting.",
  });

export const createCommentSchema = z.object({
  postId: z.string(),
  parentId: z.string().optional(),
  content: z.string().trim().min(1, "Comment can't be empty").max(1000),
});

export const reportSchema = z.object({
  targetType: z.enum(["POST", "COMMENT", "USER"]),
  postId: z.string().optional(),
  commentId: z.string().optional(),
  reportedUserId: z.string().optional(),
  reason: z.string().min(1, "Choose a reason"),
  details: z.string().max(1000).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
