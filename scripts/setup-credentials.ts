/**
 * Provisions and synchronizes production and localhost testing credentials
 * for Abdulrahman Haske, Platform Admin, and dedicated localhost test accounts.
 *
 * Passwords are read from environment variables (see .env.example), never
 * stored here. PRODUCTION accounts require theirs to be set; LOCALHOST_TESTING
 * accounts are only provisioned when DATABASE_URL is a local database.
 * Passwords are never printed.
 *
 * Usage:
 *   npx tsx scripts/setup-credentials.ts
 *
 * For Production (remote DB), pass the secrets in the environment rather
 * than on the command line, so they don't land in shell history:
 *   DATABASE_URL=… SEED_ADMIN_PASSWORD=… SEED_HASKE_PASSWORD=… npx tsx scripts/setup-credentials.ts
 */

import { PrismaClient, AdminRoleName, VerificationBadge } from "@prisma/client";
import { isLocalDatabase, passwordFields, passwordFromEnv } from "../prisma/credentials";

const prisma = new PrismaClient();

interface CredentialDefinition {
  type: "PRODUCTION" | "LOCALHOST_TESTING";
  name: string;
  username: string;
  email: string;
  /** Env var holding this account's password. */
  passwordEnv: string;
  roles: AdminRoleName[];
  verification: VerificationBadge;
  bio?: string;
  location?: string;
  avatarUrl?: string;
}

export const CREDENTIALS: CredentialDefinition[] = [
  // ── 1. Production: Abdulrahman Bashir Haske ──────────────────────────────
  {
    type: "PRODUCTION",
    name: "Abdulrahman Bashir Haske",
    username: "AbdulrahmanHaske",
    email: "office@haskecommunity.ng",
    passwordEnv: "SEED_HASKE_PASSWORD",
    roles: [AdminRoleName.SUPER_ADMIN, AdminRoleName.CONTENT_ADMIN],
    verification: VerificationBadge.OFFICIAL,
    bio: "Businessman, entrepreneur, philanthropist, and APM Governorship Candidate for Adamawa State 2027.",
    location: "Yola, Adamawa State",
    avatarUrl: "/brand/portrait-haske-traditional.png",
  },

  // ── 2. Production: Platform Admin ────────────────────────────────────────
  {
    type: "PRODUCTION",
    name: "Platform Administrator",
    username: "admin",
    email: "admin@haskecommunity.ng",
    passwordEnv: "SEED_ADMIN_PASSWORD",
    roles: [AdminRoleName.SUPER_ADMIN],
    verification: VerificationBadge.ORGANIZATION,
    bio: "Chief System Administrator for the Haske Political Community platform.",
    location: "Yola / Abuja",
    avatarUrl: "/brand/haske-logo.png",
  },

  // ── 3. Localhost Testing: Super Admin ────────────────────────────────────
  {
    type: "LOCALHOST_TESTING",
    name: "Localhost Test Admin",
    username: "testadmin",
    email: "testadmin@haske.local",
    passwordEnv: "SEED_TEST_ADMIN_PASSWORD",
    roles: [AdminRoleName.SUPER_ADMIN],
    verification: VerificationBadge.OFFICIAL,
    bio: "Developer test administrator account for local preview and verification.",
    location: "Localhost",
    avatarUrl: "/brand/haske-logo.png",
  },

  // ── 4. Localhost Testing: Regular Citizen / Community Member ──────────────
  {
    type: "LOCALHOST_TESTING",
    name: "Localhost Community Tester",
    username: "testuser",
    email: "testuser@haske.local",
    passwordEnv: "SEED_TEST_USER_PASSWORD",
    roles: [],
    verification: VerificationBadge.NONE,
    bio: "Standard citizen user account for testing community posts, voting, and feedback submissions.",
    location: "Jimeta-Yola, Adamawa",
  },
];

async function applyCredentials() {
  console.log("=================================================================");
  console.log("  HASKE COMMUNITY — PROVISIONING CREDENTIALS");
  console.log("=================================================================\n");

  const local = isLocalDatabase();
  const targets = CREDENTIALS.filter((c) => c.type === "PRODUCTION" || local);
  if (!local) console.log("Remote database: skipping LOCALHOST_TESTING accounts.\n");

  // Fail before touching the database if any required password is missing.
  const missing = targets.filter((c) => !passwordFromEnv(c.passwordEnv)).map((c) => c.passwordEnv);
  if (missing.length) throw new Error(`Set these environment variables first: ${missing.join(", ")}`);

  for (const cred of targets) {
    const password = await passwordFields(prisma, cred.email, cred.passwordEnv);

    // Upsert the user by email
    const user = await prisma.user.upsert({
      where: { email: cred.email },
      update: {
        name: cred.name,
        username: cred.username,
        ...password,
        emailVerified: new Date(),
        verification: cred.verification,
        status: "ACTIVE",
        bio: cred.bio,
        location: cred.location,
        ...(cred.avatarUrl ? { avatarUrl: cred.avatarUrl } : {}),
      },
      create: {
        name: cred.name,
        username: cred.username,
        email: cred.email,
        ...password,
        emailVerified: new Date(),
        verification: cred.verification,
        status: "ACTIVE",
        bio: cred.bio,
        location: cred.location,
        avatarUrl: cred.avatarUrl,
        notificationPref: { create: {} },
      },
    });

    // Ensure assigned roles
    for (const role of cred.roles) {
      await prisma.adminRole.upsert({
        where: { userId_role: { userId: user.id, role } },
        update: {},
        create: { userId: user.id, role },
      });
    }

    console.log(`[${cred.type}] ${cred.name}`);
    console.log(`  Identifier (Email):    ${cred.email}`);
    console.log(`  Identifier (Username): ${cred.username}`);
    console.log(`  Password:              ${password.passwordHash ? "updated" : "unchanged"} (from ${cred.passwordEnv})`);
    console.log(`  Roles:                 ${cred.roles.length ? cred.roles.join(", ") : "Regular Member"}`);
    console.log(`  Verification:          ${cred.verification}\n`);
  }

  console.log("=================================================================");
  console.log("  All credentials successfully provisioned in database.");
  console.log("=================================================================\n");
}

applyCredentials()
  .catch((err) => {
    console.error("Failed to provision credentials:", err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
