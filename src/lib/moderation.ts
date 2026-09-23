import "server-only";
import { prisma } from "@/lib/prisma";

/** Returns true if `text` contains any admin-configured blocked word (whole-word, case-insensitive). */
export async function containsBlockedWord(text: string): Promise<boolean> {
  const words = await prisma.blockedWord.findMany({ select: { word: true } });
  if (words.length === 0) return false;
  const lower = text.toLowerCase();
  return words.some(({ word }) => {
    const pattern = new RegExp(`\\b${word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    return pattern.test(lower);
  });
}

export function extractHashtags(text: string): string[] {
  const matches = text.match(/#([a-zA-Z][a-zA-Z0-9_]{1,49})/g) ?? [];
  return [...new Set(matches.map((m) => m.slice(1).toLowerCase()))];
}
