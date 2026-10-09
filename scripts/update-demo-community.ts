/**
 * Targeted update for an already-seeded database. Applies exactly two seed
 * changes, without re-running the (destructive) full seed:
 *
 *   1. The "Suleiman Abba" demo account becomes Engr. Mustapha Mandara
 *      (@mustapha_mandara) with the Official badge.
 *   2. Demo posts lose the " [Demo community post]" suffix. They keep
 *      isDemoContent = true, so they can still be found and removed later.
 *
 * Nothing else is read or written. Safe to run more than once.
 *
 * Usage (dry run by default; nothing is changed):
 *   DATABASE_URL="<production-url>" npx tsx scripts/update-demo-community.ts
 * Then, after checking the printed target and plan:
 *   DATABASE_URL="<production-url>" npx tsx scripts/update-demo-community.ts --apply
 */
import { PrismaClient } from "@prisma/client";

const DEMO_EMAIL = "demo.suleiman@example.com";
const NEW_NAME = "Engr. Mustapha Mandara";
const NEW_USERNAME = "mustapha_mandara";
const LABEL = " [Demo community post]";

const apply = process.argv.includes("--apply");
const prisma = new PrismaClient();

function describeTarget(url: string | undefined) {
  if (!url) return "(DATABASE_URL is not set)";
  try {
    const u = new URL(url);
    return `${u.hostname}${u.port ? `:${u.port}` : ""}${u.pathname}`;
  } catch {
    return "(unparseable DATABASE_URL)";
  }
}

async function main() {
  console.log(`Target database: ${describeTarget(process.env.DATABASE_URL)}`);
  console.log(apply ? "Mode: APPLY (changes will be written)\n" : "Mode: dry run (no changes; add --apply to write)\n");

  // ── 1. Demo account ────────────────────────────────────────────────────
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true, name: true, username: true, verification: true },
  });
  let renameNeeded = false;
  if (!user) {
    console.log(`Account: ${DEMO_EMAIL} not found. Skipping (this database was never seeded with it).`);
  } else if (user.name === NEW_NAME && user.username === NEW_USERNAME && user.verification === "OFFICIAL") {
    console.log(`Account: already "${NEW_NAME}" (@${NEW_USERNAME}, OFFICIAL). Nothing to do.`);
  } else {
    const clash = await prisma.user.findFirst({
      where: { username: { equals: NEW_USERNAME, mode: "insensitive" }, NOT: { id: user.id } },
      select: { email: true },
    });
    if (clash) throw new Error(`Username @${NEW_USERNAME} is already used by another account (${clash.email}). Aborting.`);
    renameNeeded = true;
    console.log(
      `Account: "${user.name}" (@${user.username}, ${user.verification}) -> "${NEW_NAME}" (@${NEW_USERNAME}, OFFICIAL)`
    );
  }

  // ── 2. Demo post labels ────────────────────────────────────────────────
  // Only posts flagged as demo content and ending with the exact label.
  const labelled = await prisma.post.findMany({
    where: { isDemoContent: true, content: { endsWith: LABEL } },
    select: { id: true, content: true },
  });
  console.log(`Demo posts with the label: ${labelled.length}`);
  for (const p of labelled) console.log(`  - "${p.content!.slice(0, 60)}${p.content!.length > 60 ? "…" : ""}"`);

  if (!renameNeeded && labelled.length === 0) {
    console.log("\nNothing to change.");
    return;
  }
  if (!apply) {
    console.log("\nDry run complete. Re-run with --apply to make these changes.");
    return;
  }

  await prisma.$transaction([
    ...(renameNeeded && user
      ? [prisma.user.update({ where: { id: user.id }, data: { name: NEW_NAME, username: NEW_USERNAME, verification: "OFFICIAL" } })]
      : []),
    ...labelled.map((p) =>
      prisma.post.update({ where: { id: p.id }, data: { content: p.content!.slice(0, -LABEL.length) } })
    ),
  ]);
  console.log(`\nApplied: ${renameNeeded ? "account renamed, " : ""}${labelled.length} post label(s) removed.`);
}

main()
  .catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
