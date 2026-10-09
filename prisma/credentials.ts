/**
 * Passwords for seeded/provisioned accounts come from environment
 * variables, never from the repository. Shared by prisma/seed.ts and
 * scripts/setup-credentials.ts.
 */
import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Load .env explicitly rather than relying on @prisma/client doing it as an
// import side effect. Never overrides variables already set in the shell.
try {
  process.loadEnvFile();
} catch {
  // No .env file (e.g. CI/production, where variables come from the environment).
}

const MIN_PASSWORD_LENGTH = 12;

/** True when DATABASE_URL points at this machine. Test accounts are only ever created there. */
export function isLocalDatabase(url = process.env.DATABASE_URL ?? ""): boolean {
  try {
    const host = new URL(url).hostname;
    return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(host) || host.endsWith(".localhost");
  } catch {
    return false;
  }
}

/** Reads a password env var; undefined when unset or empty. */
export function passwordFromEnv(envVar: string): string | undefined {
  const value = process.env[envVar];
  if (!value) return undefined;
  if (value.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`${envVar} must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  return value;
}

/**
 * Password fields to write for the account with `email`, from `envVar`.
 *
 * Returns {} when the variable is unset (an existing account keeps its
 * password; a new one is created without one, so it can't sign in) or when
 * it already matches, so re-running doesn't bump passwordChangedAt and sign
 * everyone out.
 */
export async function passwordFields(
  prisma: PrismaClient,
  email: string,
  envVar: string
): Promise<{ passwordHash?: string; passwordChangedAt?: Date }> {
  const password = passwordFromEnv(envVar);
  if (!password) {
    const existing = await prisma.user.findUnique({ where: { email }, select: { passwordHash: true } });
    if (!existing?.passwordHash) console.warn(`  ! ${email} has no password. Set ${envVar} and re-run to enable sign-in.`);
    return {};
  }
  const existing = await prisma.user.findUnique({ where: { email }, select: { passwordHash: true } });
  if (existing?.passwordHash && (await bcrypt.compare(password, existing.passwordHash))) return {};
  return { passwordHash: await bcrypt.hash(password, 12), passwordChangedAt: new Date() };
}
