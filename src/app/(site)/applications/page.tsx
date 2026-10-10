import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/cms/page-hero";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { WithdrawApplicationButton } from "@/components/cms/withdraw-application-button";
import { APPLICATION_STATUS_INFO, canWithdraw } from "@/lib/applications";
import { PayoutDetailsDialog } from "@/components/cms/payout-details-dialog";
import { canSetPayoutDetails, maskAccountNumber } from "@/lib/payout/rules";
import { isPayoutConfigured } from "@/lib/crypto/payout";
import { getBankList } from "@/lib/payout/provider";
import { cn, formatDate } from "@/lib/utils";
import { ClipboardList } from "lucide-react";

export const metadata: Metadata = { title: "My applications", robots: { index: false } };
export const dynamic = "force-dynamic";

const TONE: Record<string, string> = {
  neutral: "bg-secondary text-secondary-foreground",
  progress: "bg-accent-subtle text-accent-foreground dark:text-accent",
  good: "bg-primary/10 text-primary",
  bad: "bg-muted text-muted-foreground",
};

export default async function MyApplicationsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?callbackUrl=/applications");

  const applications = await prisma.programApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    // Only applicant-safe fields: never select decisionNote or event notes.
    select: {
      id: true,
      status: true,
      createdAt: true,
      lga: true,
      program: { select: { name: true, slug: true, requiresPayoutDetails: true, payoutDetailsStage: true } },
      // Masked view only: the encrypted number is never selected here.
      payout: { select: { bankName: true, accountNumberLast4: true, nameMatch: true } },
      events: { orderBy: { createdAt: "asc" }, select: { id: true, toStatus: true, createdAt: true } },
    },
  });

  const payoutConfigured = isPayoutConfigured();
  const canSet = (app: (typeof applications)[number]) =>
    payoutConfigured &&
    canSetPayoutDetails({
      requiresPayoutDetails: app.program.requiresPayoutDetails,
      stage: app.program.payoutDetailsStage,
      status: app.status,
      hasPayout: !!app.payout,
    });
  const banks = applications.some(canSet) ? await getBankList() : [];

  return (
    <div>
      <PageHero eyebrow="Programs" title="My applications" description="Track every program you've applied to. You'll also get a notification whenever a status changes." />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {applications.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No applications yet"
            description="When you apply to a program, you can follow its progress here."
            action={
              <Button asChild>
                <Link href="/programs">Browse programs</Link>
              </Button>
            }
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {applications.map((app) => {
              const info = APPLICATION_STATUS_INFO[app.status];
              return (
                <li key={app.id} className="rounded-2xl border border-[var(--card-border)] bg-card p-5 shadow-soft">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <Link href={`/programs/${app.program.slug}`} className="font-serif text-lg font-bold hover:underline">
                        {app.program.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        Applied {formatDate(app.createdAt)}
                        {app.lga && <> &middot; {app.lga}</>}
                      </p>
                    </div>
                    <span className={cn("w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold", TONE[info.tone])}>{info.label}</span>
                  </div>

                  <p className="mt-3 text-sm">{info.description}</p>

                  {app.events.length > 0 && (
                    <ol className="mt-4 border-l border-border pl-4">
                      {app.events.map((e) => (
                        <li key={e.id} className="relative pb-2 text-xs text-muted-foreground last:pb-0">
                          <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-primary/60" aria-hidden />
                          <span className="font-medium text-foreground">{e.toStatus ? APPLICATION_STATUS_INFO[e.toStatus].label : "Updated"}</span>{" "}
                          &middot; {formatDate(e.createdAt)}
                        </li>
                      ))}
                    </ol>
                  )}

                  {app.program.requiresPayoutDetails && (app.payout || canSet(app)) && (
                    <div className="mt-4 flex flex-col gap-2 rounded-xl bg-secondary/40 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <p className="min-w-0">
                        {app.payout ? (
                          <>
                            <span className="font-medium">{app.payout.bankName}</span> &middot; {maskAccountNumber(app.payout.accountNumberLast4)}
                            {app.payout.nameMatch === "MATCH" && <span className="text-primary"> &middot; name confirmed by bank</span>}
                          </>
                        ) : app.status === "ACCEPTED" ? (
                          <span className="font-medium">Add your bank details so we can pay you.</span>
                        ) : (
                          <span>This program pays beneficiaries. Add the bank account we should use.</span>
                        )}
                      </p>
                      {canSet(app) && (
                        <PayoutDetailsDialog applicationId={app.id} programName={app.program.name} banks={banks} hasExisting={!!app.payout} />
                      )}
                    </div>
                  )}

                  {canWithdraw(app.status) && (
                    <div className="mt-4 border-t border-border pt-3">
                      <WithdrawApplicationButton applicationId={app.id} programName={app.program.name} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
