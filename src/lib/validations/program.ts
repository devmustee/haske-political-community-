import { ADAMAWA_LGAS } from "@/lib/adamawa-lgas";
import { z } from "zod";

export const programApplicationSchema = z.object({
  programId: z.string(),
  fullName: z.string().trim().min(2, "Enter your full name").max(120),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  lga: z.enum(ADAMAWA_LGAS, { message: "Select your LGA" }),
  details: z.string().trim().max(2000).optional(),
});

export type ProgramApplicationInput = z.infer<typeof programApplicationSchema>;
