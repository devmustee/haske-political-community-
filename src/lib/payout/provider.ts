import "server-only";
import type { NameMatch } from "@prisma/client";
import { FALLBACK_BANKS, type Bank } from "@/lib/payout/banks";
import { compareNames } from "@/lib/payout/rules";

const PAYSTACK = "https://api.paystack.co";
const key = () => process.env.PAYSTACK_SECRET_KEY;

/** Banks to offer: Paystack's live list when configured (cached a day), else the built-in list. */
export async function getBankList(): Promise<Bank[]> {
  if (!key()) return FALLBACK_BANKS;
  try {
    const res = await fetch(`${PAYSTACK}/bank?country=nigeria&perPage=200`, {
      headers: { Authorization: `Bearer ${key()}` },
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return FALLBACK_BANKS;
    const json = (await res.json()) as { data?: { code: string; name: string; active?: boolean }[] };
    const banks = (json.data ?? []).filter((b) => b.active !== false).map((b) => ({ code: b.code, name: b.name }));
    return banks.length ? banks.sort((a, b) => a.name.localeCompare(b.name)) : FALLBACK_BANKS;
  } catch {
    return FALLBACK_BANKS;
  }
}

export interface NameCheck {
  nameMatch: NameMatch;
  verifiedName: string | null;
}

/**
 * Asks the bank (via Paystack's account resolve) whose name the account is
 * in, and compares it with the names the applicant gave. Best-effort: when
 * not configured or the provider is down it returns UNVERIFIED, and FAILED
 * when the bank says the account doesn't exist. Never throws.
 */
export async function checkAccountName(accountNumber: string, bankCode: string, ...givenNames: string[]): Promise<NameCheck> {
  if (!key()) return { nameMatch: "UNVERIFIED", verifiedName: null };
  try {
    const url = `${PAYSTACK}/bank/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${key()}` }, cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (res.status === 422 || res.status === 400) return { nameMatch: "FAILED", verifiedName: null };
    if (!res.ok) return { nameMatch: "UNVERIFIED", verifiedName: null };
    const json = (await res.json()) as { data?: { account_name?: string } };
    const name = json.data?.account_name?.trim();
    if (!name) return { nameMatch: "FAILED", verifiedName: null };
    return { nameMatch: compareNames(name, ...givenNames), verifiedName: name };
  } catch {
    return { nameMatch: "UNVERIFIED", verifiedName: null };
  }
}
