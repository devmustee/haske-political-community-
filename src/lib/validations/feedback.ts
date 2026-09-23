import { z } from "zod";

export const feedbackSchema = z.object({
  type: z.enum(["IDEA", "COMMUNITY_PROBLEM", "SUGGESTION", "QUESTION", "PROGRAM_FEEDBACK", "POLICY_FEEDBACK"]),
  subject: z.string().trim().min(4, "Give it a short subject").max(150),
  description: z.string().trim().min(10, "Tell us a bit more").max(3000),
  lga: z.string().trim().max(80).optional(),
});

export type FeedbackInput = z.infer<typeof feedbackSchema>;

export const communityIssueSchema = z.object({
  category: z.enum([
    "ROADS",
    "WATER",
    "ELECTRICITY",
    "HEALTHCARE",
    "EDUCATION",
    "AGRICULTURE",
    "SECURITY",
    "YOUTH_EMPLOYMENT",
    "ENVIRONMENT",
    "OTHER",
  ]),
  title: z.string().trim().min(4).max(150),
  description: z.string().trim().min(10).max(3000),
  lga: z.string().trim().min(2, "Select an LGA").max(80),
});

export type CommunityIssueInput = z.infer<typeof communityIssueSchema>;
