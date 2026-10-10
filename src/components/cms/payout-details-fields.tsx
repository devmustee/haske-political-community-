"use client";

import { ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PAYOUT_CONSENT_TEXT, payoutDetailsSchema } from "@/lib/payout/rules";
import type { Bank } from "@/lib/payout/banks";

export interface PayoutDraft {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  consent: boolean;
}

export const emptyPayoutDraft: PayoutDraft = { bankCode: "", accountNumber: "", accountName: "", consent: false };

/** Client-side check with the same schema the server uses. Returns field errors, or null when valid. */
export function validatePayoutDraft(d: PayoutDraft): Partial<Record<keyof PayoutDraft, string>> | null {
  const r = payoutDetailsSchema.safeParse(d);
  if (r.success) return null;
  const errors: Partial<Record<keyof PayoutDraft, string>> = {};
  for (const issue of r.error.issues) {
    const k = issue.path[0] as keyof PayoutDraft;
    errors[k] ??= issue.message;
  }
  return errors;
}

const selectClass =
  "h-10 w-full rounded-xl border border-input bg-transparent px-3.5 text-sm shadow-xs focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-sm:min-h-11";

export function PayoutDetailsFields({
  banks,
  value,
  onChange,
  errors,
}: {
  banks: Bank[];
  value: PayoutDraft;
  onChange: (next: PayoutDraft) => void;
  errors?: Partial<Record<keyof PayoutDraft, string>> | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-start gap-2 rounded-xl bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        Your account number is encrypted, and only senior staff can see it, to pay you. We&apos;ll never ask for your BVN, PIN,
        password or OTP.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="payout-bank">Bank</Label>
        <select id="payout-bank" value={value.bankCode} onChange={(e) => onChange({ ...value, bankCode: e.target.value })} className={selectClass}>
          <option value="" disabled>
            Select your bank
          </option>
          {banks.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
        {errors?.bankCode && <p className="text-xs text-destructive">{errors.bankCode}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="payout-number">Account number</Label>
        <Input
          id="payout-number"
          inputMode="numeric"
          autoComplete="off"
          maxLength={13}
          placeholder="10 digits"
          value={value.accountNumber}
          onChange={(e) => onChange({ ...value, accountNumber: e.target.value.replace(/[^\d ]/g, "") })}
        />
        {errors?.accountNumber && <p className="text-xs text-destructive">{errors.accountNumber}</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="payout-name">Name on the account</Label>
        <Input id="payout-name" autoComplete="off" maxLength={100} value={value.accountName} onChange={(e) => onChange({ ...value, accountName: e.target.value })} />
        {errors?.accountName && <p className="text-xs text-destructive">{errors.accountName}</p>}
      </div>
      <label className="flex items-start gap-2.5 text-xs leading-relaxed">
        <input
          type="checkbox"
          checked={value.consent}
          onChange={(e) => onChange({ ...value, consent: e.target.checked })}
          className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
        />
        <span>
          {PAYOUT_CONSENT_TEXT}{" "}
          <a href="/privacy" target="_blank" className="text-primary underline">
            Privacy policy
          </a>
        </span>
      </label>
      {errors?.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
    </div>
  );
}
