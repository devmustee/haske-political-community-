import "server-only";
import { prisma } from "@/lib/prisma";

export type RateLimitResult = { ok: true } | { ok: false; retryAfterMs: number };

/**
 * Fixed-window rate limiter shared by every server instance: the counter
 * lives in Postgres, so on Vercel (many short-lived instances) a limit like
 * "8 sign-in attempts per 5 minutes" really is 8, not 8 per instance.
 *
 * One atomic upsert per check. If the database can't be reached, falls back
 * to a per-instance in-memory counter rather than locking everyone out.
 */
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  try {
    const rows = await prisma.$queryRaw<{ count: number; resetAt: Date }[]>`
      INSERT INTO "RateLimit" ("key", "count", "resetAt")
      VALUES (${key}, 1, NOW() + ${windowMs} * INTERVAL '1 millisecond')
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE WHEN "RateLimit"."resetAt" <= NOW() THEN 1 ELSE "RateLimit"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimit"."resetAt" <= NOW() THEN EXCLUDED."resetAt" ELSE "RateLimit"."resetAt" END
      RETURNING "count", "resetAt"`;
    sweepOccasionally();
    const row = rows[0];
    if (row && row.count > limit) return { ok: false, retryAfterMs: Math.max(0, row.resetAt.getTime() - Date.now()) };
    return { ok: true };
  } catch (err) {
    console.error("Shared rate limit unavailable, using in-memory fallback:", err);
    return memoryRateLimit(key, limit, windowMs);
  }
}

/** Removes expired counters on about 1 in 100 checks, after the response. */
function sweepOccasionally() {
  if (Math.random() >= 0.01) return;
  prisma.rateLimit.deleteMany({ where: { resetAt: { lt: new Date() } } }).catch(() => {});
}

const buckets = new Map<string, { count: number; resetAt: number }>();

function memoryRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (bucket.count >= limit) return { ok: false, retryAfterMs: bucket.resetAt - now };
  bucket.count += 1;
  return { ok: true };
}
