import "server-only";
import { prisma } from "@/lib/prisma";

export async function getSiteSetting<T = unknown>(key: string): Promise<T | null> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return (row?.value as T) ?? null;
}

export interface BiographySettings {
  heading: string;
  paragraphs: string[];
}

export interface ExperienceSettings {
  heading: string;
  entries: { organization: string; role: string; description: string }[];
}

export interface MissionSettings {
  heading: string;
  statement: string;
  note: string;
  priorities: string[];
}

export interface VisionSettings {
  heading: string;
  statement: string;
  note: string;
  themes: { title: string; description: string }[];
}
