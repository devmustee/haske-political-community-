/**
 * Rotates login credentials for the two accounts that matter for
 * production access: the platform admin and the official Haske account.
 *
 * This does NOT touch DATABASE_URL for you — point it at whichever
 * database you mean by "production" when you invoke this script (see
 * the README note at the bottom of this file for the exact command).
 *
 * Deliberately does not seed/create these accounts if they're missing —
 * that's prisma/seed.ts's job, and this script would otherwise silently
 * create a differently-configured duplicate. Run the seed first if the
 * accounts don't exist yet.
 *
 * Generated passwords are printed once to this terminal and nowhere
 * else (not written to any file, not logged, not sent anywhere) — copy
 * them into a password manager immediately, then clear your terminal
 * scrollback.
 */
import { PrismaClient, AdminRoleName } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

const ACCOUNTS = [
  { email: "admin@haskecommunity.ng", label: "Platform admin", ensureSuperAdmin: true },
  { email: "office@haskecommunity.ng", label: "Haske (official account)", ensureSuperAdmin: false },
] as const;

function generatePassword(length = 20): string {
  // Unambiguous charset (no 0/O/1/l/I) covering upper/lower/digit/symbol.
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+";
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += chars[bytes[i] % chars.length];
  return out;
}

async function rotate(email: string, label: string, ensureSuperAdmin: boolean) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`\n${label}: no account found for ${email} — skipped. Run prisma/seed.ts first if this account should exist.`);
    return;
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { email },
    data: { passwordHash, passwordChangedAt: new Date(), emailVerified: user.emailVerified ?? new Date() },
  });

  if (ensureSuperAdmin) {
    await prisma.adminRole.upsert({
      where: { userId_role: { userId: user.id, role: AdminRoleName.SUPER_ADMIN } },
      update: {},
      create: { userId: user.id, role: AdminRoleName.SUPER_ADMIN },
    });
  }

  console.log(`\n${label}`);
  console.log(`  email:    ${email}`);
  console.log(`  username: ${user.username}`);
  console.log(`  password: ${password}`);
}

async function main() {
  console.log("Rotating credentials — each password is shown exactly once below.");
  console.log("Save both in a password manager now, then clear this terminal's scrollback.\n");

  for (const { email, label, ensureSuperAdmin } of ACCOUNTS) {
    await rotate(email, label, ensureSuperAdmin);
  }

  console.log("\nDone.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

/**
 * Usage (run this from your own terminal — never paste your production
 * DATABASE_URL into chat):
 *
 *   DATABASE_URL="<your production connection string>" npx tsx scripts/rotate-production-credentials.ts
 *
 * If you use Vercel, you can pull the real value first instead of typing
 * it out: `vercel env pull .env.production.local` then run with
 * `DATABASE_URL=$(grep DATABASE_URL .env.production.local | cut -d= -f2-) npx tsx scripts/rotate-production-credentials.ts`
 */
