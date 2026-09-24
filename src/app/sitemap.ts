import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/biography",
    "/achievements",
    "/programs",
    "/mission",
    "/vision",
    "/manifesto",
    "/events",
    "/media",
    "/public-record",
    "/speak-to-haske",
    "/community-issues",
    "/community",
    "/privacy",
    "/terms",
    "/community-guidelines",
  ].map((path) => ({
    url: `${APP_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [achievements, programs, events, media, pillars] = await Promise.all([
    prisma.achievement.findMany({ where: { contentStatus: { notIn: ["DRAFT"] } }, select: { slug: true, updatedAt: true } }),
    prisma.program.findMany({ where: { contentStatus: { notIn: ["DRAFT"] } }, select: { slug: true, updatedAt: true } }),
    prisma.event.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.mediaCenterItem.findMany({ where: { contentStatus: { notIn: ["DRAFT"] } }, select: { slug: true, updatedAt: true } }),
    prisma.policyPillar.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...achievements.map((a) => ({ url: `${APP_URL}/achievements/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...programs.map((p) => ({ url: `${APP_URL}/programs/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...events.map((e) => ({ url: `${APP_URL}/events/${e.slug}`, lastModified: e.updatedAt, changeFrequency: "weekly" as const, priority: 0.5 })),
    ...media.map((m) => ({ url: `${APP_URL}/media/${m.slug}`, lastModified: m.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...pillars.map((p) => ({ url: `${APP_URL}/policies/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
