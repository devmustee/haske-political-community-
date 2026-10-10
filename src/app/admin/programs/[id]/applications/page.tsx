import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { AdminRoleName, ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdminPagePermission } from "@/lib/session";
import { ApplicationStatusSelect } from "@/components/admin/application-status-select";
import { PreventToggle } from "@/components/admin/prevent-toggle";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { APPLICATION_STATUS_INFO } from "@/lib/applications";
import { hasPermission } from "@/lib/permissions";
import { maskAccountNumber } from "@/lib/payout/rules";
import { RevealAccountButton } from "@/components/admin/reveal-account-button";
import { cn, formatDate } from "@/lib/utils";
import { ArrowLeft, ChevronLeft, ChevronRight, Download } from "lucide-react";

export const metadata: Metadata = { title: "Admin · Applications" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;
const EVENT_LABEL: Record<string, string> = {
  SUBMITTED: "Submitted",
  WITHDRAWN: "Withdrawn by applicant",
  PAYOUT_ADDED: "Bank details added",
  PAYOUT_UPDATED: "Bank details updated",
  PAYOUT_REVEALED: "Account number revealed",
  PAYOUT_EXPORTED: "Included in payment export",
  PAYOUT_DELETED: "Bank details deleted",
};
const STATUSES = Object.keys(APPLICATION_STATUS_INFO) as ApplicationStatus[];

export default async function ProgramApplicationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; status?: string; page?: string; flag?: string }>;
}) {
  const admin = await requireAdminPagePermission("programs.manage_applications");
  const roles = (admin.adminRoles ?? []) as AdminRoleName[];
  const canReveal = hasPermission(roles, "programs.view_payout_details");
  const canExport = hasPermission(roles, "programs.export_payouts");
  const { id } = await params;
  const sp = await searchParams;

  const program = await prisma.program.findUnique({
    where: { id },
    select: { id: true, name: true, status: true, applicationDeadline: true, requiresPayoutDetails: true },
  });
  if (!program) notFound();

  const q = (sp.q ?? "").trim().slice(0, 100);
  const status = STATUSES.includes(sp.status as ApplicationStatus) ? (sp.status as ApplicationStatus) : undefined;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const flag = program.requiresPayoutDetails && ["missing", "mismatch", "duplicate"].includes(sp.flag ?? "") ? sp.flag : undefined;

  // Account numbers shared by different applicants (any program), found via
  // the HMAC fingerprint, so nothing is decrypted.
  const sharedHashes = await (async () => {
    if (!program.requiresPayoutDetails) return new Set<string>();
    const groups = await prisma.applicationPayoutDetails.groupBy({ by: ["accountNumberHash"], _count: true, having: { accountNumberHash: { _count: { gt: 1 } } } });
    if (!groups.length) return new Set<string>();
    const rows = await prisma.applicationPayoutDetails.findMany({
      where: { accountNumberHash: { in: groups.map((g) => g.accountNumberHash) } },
      select: { accountNumberHash: true, application: { select: { userId: true } } },
    });
    const users = new Map<string, Set<string>>();
    for (const r of rows) users.set(r.accountNumberHash, (users.get(r.accountNumberHash) ?? new Set()).add(r.application.userId));
    return new Set([...users].filter(([, u]) => u.size > 1).map(([h]) => h));
  })();

  const where: Prisma.ProgramApplicationWhereInput = {
    programId: program.id,
    ...(status ? { status } : {}),
    ...(flag === "missing" ? { status: "ACCEPTED" as const, payout: { is: null } } : {}),
    ...(flag === "mismatch" ? { payout: { is: { nameMatch: { in: ["MISMATCH" as const, "PARTIAL" as const] } } } } : {}),
    ...(flag === "duplicate" ? { payout: { is: { accountNumberHash: { in: [...sharedHashes] } } } } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
            { lga: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, applications, byStatus] = await Promise.all([
    prisma.programApplication.count({ where }),
    prisma.programApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        reviewedBy: { select: { name: true } },
        // Masked fields only; the encrypted number stays server-side.
        payout: { select: { bankName: true, accountNumberLast4: true, accountNumberHash: true, accountName: true, verifiedName: true, nameMatch: true } },
        events: { orderBy: { createdAt: "asc" }, include: { actor: { select: { name: true } } } },
      },
    }),
    prisma.programApplication.groupBy({ by: ["status"], where: { programId: program.id }, _count: true }),
  ]);
  const counts = Object.fromEntries(byStatus.map((s) => [s.status, s._count])) as Partial<Record<ApplicationStatus, number>>;
  const allCount = byStatus.reduce((n, s) => n + s._count, 0);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const href = (over: { status?: string | null; page?: number; flag?: string | null }) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    const st = over.status === undefined ? status : over.status;
    if (st) p.set("status", st);
    const fl = over.flag === undefined ? flag : over.flag;
    if (fl) p.set("flag", fl);
    if (over.page && over.page > 1) p.set("page", String(over.page));
    const s = p.toString();
    return `/admin/programs/${program.id}/applications${s ? `?${s}` : ""}`;
  };

  return (
    <div className="p-6 sm:p-8">
      <Link href="/admin/programs" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Programs
      </Link>
      <h1 className="mt-1 text-h1">Applications</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {program.name} &middot; {allCount} total &middot; program {program.status.toLowerCase()}
        {program.applicationDeadline && <> &middot; deadline {formatDate(program.applicationDeadline)}</>}
      </p>

      {program.requiresPayoutDetails && canExport && (
        <Button asChild variant="outline" size="sm" className="mt-3">
          {/* Plain <a>: a file download, not a client navigation. */}
          <a href={`/admin/programs/${program.id}/applications/export`}>
            <Download className="size-4" /> Export payment list (accepted, with bank details)
          </a>
        </Button>
      )}

      {/* Status filter */}
      <div className="mt-5 flex flex-wrap gap-2">
        <FilterChip href={href({ status: null, page: 1 })} active={!status} label="All" count={allCount} />
        {STATUSES.map((s) => (
          <FilterChip key={s} href={href({ status: s, page: 1 })} active={status === s} label={APPLICATION_STATUS_INFO[s].label} count={counts[s] ?? 0} />
        ))}
      </div>

      {program.requiresPayoutDetails && (
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterChip href={href({ flag: flag === "missing" ? null : "missing", page: 1 })} active={flag === "missing"} label="Accepted, bank details missing" count={null} />
          <FilterChip href={href({ flag: flag === "mismatch" ? null : "mismatch", page: 1 })} active={flag === "mismatch"} label="Name mismatch" count={null} />
          <FilterChip href={href({ flag: flag === "duplicate" ? null : "duplicate", page: 1 })} active={flag === "duplicate"} label="Duplicate account" count={null} />
        </div>
      )}

      {/* Search */}
      <form className="mt-4 flex max-w-md gap-2" action={`/admin/programs/${program.id}/applications`}>
        {status && <input type="hidden" name="status" value={status} />}
        {flag && <input type="hidden" name="flag" value={flag} />}
        <Input name="q" defaultValue={q} placeholder="Search name, email, phone or LGA" aria-label="Search applications" />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <div className="mt-5 flex flex-col gap-2">
        {applications.map((app) => (
          <details key={app.id} className="group rounded-xl border border-border bg-background">
            <summary className="flex cursor-pointer list-none flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">{app.fullName}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {app.email} &middot; {app.phone}
                  {app.lga && <> &middot; {app.lga}</>} &middot; {formatDate(app.createdAt)}
                </p>
                {app.payout && (sharedHashes.has(app.payout.accountNumberHash) || ["MISMATCH", "PARTIAL"].includes(app.payout.nameMatch)) && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {sharedHashes.has(app.payout.accountNumberHash) && <Badge variant="outline" className="border-destructive/50 text-destructive">Duplicate account</Badge>}
                    {["MISMATCH", "PARTIAL"].includes(app.payout.nameMatch) && <Badge variant="outline" className="border-accent text-accent-foreground">Name mismatch</Badge>}
                  </div>
                )}
              </div>
              <PreventToggle className="shrink-0">
                <ApplicationStatusSelect applicationId={app.id} status={app.status} applicantName={app.fullName} />
              </PreventToggle>
            </summary>
            <div className="border-t border-border px-4 py-3 text-sm">
              {program.requiresPayoutDetails && (
                <div className="mb-3 rounded-lg bg-secondary/40 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bank details</p>
                  {app.payout ? (
                    <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p>
                        {app.payout.bankName} &middot; <span className="font-mono">{maskAccountNumber(app.payout.accountNumberLast4)}</span> &middot;{" "}
                        {app.payout.accountName}
                        <span className="block text-xs text-muted-foreground">
                          Name check:{" "}
                          {app.payout.nameMatch === "UNVERIFIED"
                            ? "not checked"
                            : `${app.payout.nameMatch.toLowerCase()}${app.payout.verifiedName ? ` (bank: ${app.payout.verifiedName})` : ""}`}
                        </span>
                      </p>
                      {canReveal && <RevealAccountButton applicationId={app.id} applicantName={app.fullName} />}
                    </div>
                  ) : (
                    <p className="mt-1 text-muted-foreground">Not provided yet.</p>
                  )}
                </div>
              )}
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About the applicant</p>
              <p className="mt-1 whitespace-pre-wrap">{app.details || <span className="text-muted-foreground">No details given.</span>}</p>
              {app.decisionNote && (
                <>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Latest internal note</p>
                  <p className="mt-1 whitespace-pre-wrap">{app.decisionNote}</p>
                </>
              )}
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">History</p>
              <ol className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
                {app.events.map((e) => (
                  <li key={e.id}>
                    {formatDate(e.createdAt)} &middot;{" "}
                    {e.type === "STATUS_CHANGED" && e.fromStatus && e.toStatus
                      ? `${APPLICATION_STATUS_INFO[e.fromStatus].label} → ${APPLICATION_STATUS_INFO[e.toStatus].label}`
                      : (EVENT_LABEL[e.type] ?? e.type)}
                    {e.actor && <> by {e.actor.name}</>}
                    {e.note && <span className="block pl-3 text-foreground/80">“{e.note}”</span>}
                  </li>
                ))}
                {app.events.length === 0 && <li>Submitted {formatDate(app.createdAt)} (before history was recorded)</li>}
              </ol>
            </div>
          </details>
        ))}
        {applications.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No applications match.</p>}
      </div>

      {pages > 1 && (
        <nav className="mt-5 flex items-center justify-between text-sm" aria-label="Pagination">
          <Button asChild variant="outline" size="sm" className={cn(page <= 1 && "pointer-events-none opacity-50")}>
            <Link href={href({ page: page - 1 })} aria-disabled={page <= 1}>
              <ChevronLeft className="size-4" /> Previous
            </Link>
          </Button>
          <span className="text-muted-foreground">
            Page {page} of {pages}
          </span>
          <Button asChild variant="outline" size="sm" className={cn(page >= pages && "pointer-events-none opacity-50")}>
            <Link href={href({ page: page + 1 })} aria-disabled={page >= pages}>
              Next <ChevronRight className="size-4" />
            </Link>
          </Button>
        </nav>
      )}
    </div>
  );
}

function FilterChip({ href, active, label, count }: { href: string; active: boolean; label: string; count: number | null }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined}>
      <Badge variant={active ? "solid" : "outline"} className="min-h-9 cursor-pointer px-3 text-xs">
        {label} {count !== null && <span className="ml-1 tabular-nums opacity-70">{count}</span>}
      </Badge>
    </Link>
  );
}
