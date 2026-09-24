"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/session";
import { logAudit } from "@/lib/audit";
import {
  AchievementCategory,
  ProgramCategory,
  ProgramStatus,
  ContentStatus,
  MediaCenterCategory,
  EventStatus,
} from "@prisma/client";
import type { ActionResult } from "@/lib/actions/auth";

function makeSlug(text: string) {
  return slugify(text, { lower: true, strict: true });
}

// ── Achievements ─────────────────────────────────────────────────────────

export interface AchievementFormInput {
  id?: string;
  title: string;
  category: AchievementCategory;
  year?: string;
  location?: string;
  summary: string;
  description: string;
  impact?: string;
  source?: string;
  sourceUrl?: string;
  contentStatus: ContentStatus;
  featured: boolean;
}

export async function saveAchievement(input: AchievementFormInput): Promise<ActionResult<{ id: string }>> {
  const admin = await requirePermission("cms.achievements");
  if (!input.title.trim() || !input.summary.trim() || !input.description.trim()) {
    return { ok: false, error: "Title, summary and description are required." };
  }

  const data = {
    title: input.title,
    category: input.category,
    year: input.year || null,
    location: input.location || null,
    summary: input.summary,
    description: input.description,
    impact: input.impact || null,
    source: input.source || null,
    sourceUrl: input.sourceUrl || null,
    contentStatus: input.contentStatus,
    featured: input.featured,
  };

  const record = input.id
    ? await prisma.achievement.update({ where: { id: input.id }, data })
    : await prisma.achievement.create({ data: { ...data, slug: makeSlug(input.title) } });

  await logAudit(admin.id, input.id ? "cms.update_achievement" : "cms.create_achievement", "Achievement", record.id);
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  return { ok: true, data: { id: record.id } };
}

export async function deleteAchievement(id: string): Promise<ActionResult> {
  const admin = await requirePermission("cms.achievements");
  await prisma.achievement.delete({ where: { id } });
  await logAudit(admin.id, "cms.delete_achievement", "Achievement", id);
  revalidatePath("/admin/achievements");
  revalidatePath("/achievements");
  return { ok: true, data: undefined };
}

// ── Programs ─────────────────────────────────────────────────────────────

export interface ProgramFormInput {
  id?: string;
  name: string;
  category: ProgramCategory;
  description: string;
  targetBeneficiaries?: string;
  location?: string;
  status: ProgramStatus;
  eligibility?: string;
  resultsImpact?: string;
  adminNotes?: string;
  contentStatus: ContentStatus;
  applicationDeadline?: string;
}

export async function saveProgram(input: ProgramFormInput): Promise<ActionResult<{ id: string }>> {
  const admin = await requirePermission("cms.programs");
  if (!input.name.trim() || !input.description.trim()) {
    return { ok: false, error: "Name and description are required." };
  }

  const data = {
    name: input.name,
    category: input.category,
    description: input.description,
    targetBeneficiaries: input.targetBeneficiaries || null,
    location: input.location || null,
    status: input.status,
    eligibility: input.eligibility || null,
    resultsImpact: input.resultsImpact || null,
    adminNotes: input.adminNotes || null,
    contentStatus: input.contentStatus,
    applicationDeadline: input.applicationDeadline ? new Date(input.applicationDeadline) : null,
  };

  const record = input.id
    ? await prisma.program.update({ where: { id: input.id }, data })
    : await prisma.program.create({ data: { ...data, slug: makeSlug(input.name) } });

  await logAudit(admin.id, input.id ? "cms.update_program" : "cms.create_program", "Program", record.id);
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { ok: true, data: { id: record.id } };
}

export async function deleteProgram(id: string): Promise<ActionResult> {
  const admin = await requirePermission("cms.programs");
  await prisma.program.delete({ where: { id } });
  await logAudit(admin.id, "cms.delete_program", "Program", id);
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { ok: true, data: undefined };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "ACCEPTED" | "REJECTED"
): Promise<ActionResult> {
  const admin = await requirePermission("programs.manage_applications");
  await prisma.programApplication.update({ where: { id: applicationId }, data: { status } });
  await logAudit(admin.id, "cms.update_application_status", "ProgramApplication", applicationId, { status });
  revalidatePath("/admin/programs");
  return { ok: true, data: undefined };
}

// ── Events ───────────────────────────────────────────────────────────────

export interface EventFormInput {
  id?: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  lga?: string;
  speaker?: string;
  imageUrl?: string;
  registrationRequired: boolean;
  capacity?: number;
  eventType?: string;
  status: EventStatus;
  summary?: string;
}

export async function saveEvent(input: EventFormInput): Promise<ActionResult<{ id: string }>> {
  const admin = await requirePermission("events.manage");
  if (!input.title.trim() || !input.description.trim() || !input.date || !input.venue.trim()) {
    return { ok: false, error: "Title, description, date and venue are required." };
  }

  const data = {
    title: input.title,
    description: input.description,
    date: new Date(input.date),
    venue: input.venue,
    lga: input.lga || null,
    speaker: input.speaker || null,
    imageUrl: input.imageUrl || null,
    registrationRequired: input.registrationRequired,
    capacity: input.capacity || null,
    eventType: input.eventType || null,
    status: input.status,
    summary: input.summary || null,
  };

  const record = input.id
    ? await prisma.event.update({ where: { id: input.id }, data })
    : await prisma.event.create({ data: { ...data, slug: makeSlug(input.title) } });

  await logAudit(admin.id, input.id ? "cms.update_event" : "cms.create_event", "Event", record.id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { ok: true, data: { id: record.id } };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const admin = await requirePermission("events.manage");
  await prisma.event.delete({ where: { id } });
  await logAudit(admin.id, "cms.delete_event", "Event", id);
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { ok: true, data: undefined };
}

// ── Media Center ─────────────────────────────────────────────────────────

export interface MediaFormInput {
  id?: string;
  title: string;
  category: MediaCenterCategory;
  date: string;
  author?: string;
  featuredImage?: string;
  content: string;
  relatedTopic?: string;
  sourceUrl?: string;
  contentStatus: ContentStatus;
}

export async function saveMediaItem(input: MediaFormInput): Promise<ActionResult<{ id: string }>> {
  const admin = await requirePermission("cms.media");
  if (!input.title.trim() || !input.content.trim()) {
    return { ok: false, error: "Title and content are required." };
  }

  const data = {
    title: input.title,
    category: input.category,
    date: new Date(input.date),
    author: input.author || null,
    featuredImage: input.featuredImage || null,
    content: input.content,
    relatedTopic: input.relatedTopic || null,
    sourceUrl: input.sourceUrl || null,
    contentStatus: input.contentStatus,
  };

  const record = input.id
    ? await prisma.mediaCenterItem.update({ where: { id: input.id }, data })
    : await prisma.mediaCenterItem.create({ data: { ...data, slug: makeSlug(input.title) } });

  await logAudit(admin.id, input.id ? "cms.update_media" : "cms.create_media", "MediaCenterItem", record.id);
  revalidatePath("/admin/media");
  revalidatePath("/media");
  return { ok: true, data: { id: record.id } };
}

export async function deleteMediaItem(id: string): Promise<ActionResult> {
  const admin = await requirePermission("cms.media");
  await prisma.mediaCenterItem.delete({ where: { id } });
  await logAudit(admin.id, "cms.delete_media", "MediaCenterItem", id);
  revalidatePath("/admin/media");
  revalidatePath("/media");
  return { ok: true, data: undefined };
}

// ── Policy pillars ───────────────────────────────────────────────────────

export interface PolicyPillarFormInput {
  id?: string;
  name: string;
  category: string;
  problem?: string;
  currentSituation?: string;
  proposedApproach?: string;
  objectives?: string;
  proposedActions?: string;
  expectedOutcomes?: string;
  contentStatus: ContentStatus;
}

export async function savePolicyPillar(input: PolicyPillarFormInput): Promise<ActionResult<{ id: string }>> {
  const admin = await requirePermission("cms.policy");
  if (!input.name.trim()) return { ok: false, error: "Name is required." };

  const data = {
    name: input.name,
    category: input.category,
    problem: input.problem || null,
    currentSituation: input.currentSituation || null,
    proposedApproach: input.proposedApproach || null,
    objectives: input.objectives || null,
    proposedActions: input.proposedActions || null,
    expectedOutcomes: input.expectedOutcomes || null,
    contentStatus: input.contentStatus,
  };

  const record = input.id
    ? await prisma.policyPillar.update({ where: { id: input.id }, data })
    : await prisma.policyPillar.create({ data: { ...data, slug: makeSlug(input.name), order: 999 } });

  await logAudit(admin.id, input.id ? "cms.update_pillar" : "cms.create_pillar", "PolicyPillar", record.id);
  revalidatePath("/admin/manifesto");
  revalidatePath("/manifesto");
  return { ok: true, data: { id: record.id } };
}

// ── Manifesto ────────────────────────────────────────────────────────────

export async function publishManifesto(input: {
  title: string;
  version: string;
  introduction: string;
  pillarIds: string[];
}): Promise<ActionResult<{ id: string }>> {
  const admin = await requirePermission("cms.manifesto");
  if (!input.title.trim() || !input.version.trim() || !input.introduction.trim()) {
    return { ok: false, error: "Title, version and introduction are required." };
  }

  await prisma.manifesto.updateMany({ where: { isCurrent: true }, data: { isCurrent: false } });

  const manifesto = await prisma.manifesto.create({
    data: {
      title: input.title,
      version: input.version,
      publicationDate: new Date(),
      introduction: input.introduction,
      isCurrent: true,
      pillars: { create: input.pillarIds.map((pillarId, order) => ({ pillarId, order })) },
    },
  });

  await logAudit(admin.id, "cms.publish_manifesto", "Manifesto", manifesto.id);
  revalidatePath("/admin/manifesto");
  revalidatePath("/manifesto");
  return { ok: true, data: { id: manifesto.id } };
}

// ── Site settings ────────────────────────────────────────────────────────

export async function updateSiteSetting(key: string, value: unknown): Promise<ActionResult> {
  const admin = await requirePermission("cms.settings");
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: value as never },
    create: { key, value: value as never },
  });
  await logAudit(admin.id, "cms.update_setting", "SiteSetting", key);
  revalidatePath("/");
  revalidatePath("/biography");
  revalidatePath("/mission");
  revalidatePath("/vision");
  return { ok: true, data: undefined };
}
