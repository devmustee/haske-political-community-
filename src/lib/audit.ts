import "server-only";
import { prisma } from "@/lib/prisma";

export async function logAudit(adminId: string, action: string, entityType: string, entityId?: string, metadata?: Record<string, unknown>) {
  await prisma.auditLog.create({
    data: { adminId, action, entityType, entityId, metadata: metadata as never },
  });
}
