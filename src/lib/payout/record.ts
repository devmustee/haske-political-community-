import "server-only";
import { encryptAccountNumber, hashAccountNumber } from "@/lib/crypto/payout";
import { getBankList, checkAccountName } from "@/lib/payout/provider";
import { PAYOUT_CONSENT_VERSION, payoutDetailsSchema, type PayoutDetailsInput } from "@/lib/payout/rules";

/**
 * Validates payout input and turns it into the stored record: encrypted
 * number, last 4, HMAC fingerprint and the name check. The plaintext number
 * never leaves this function except to the bank-name lookup.
 */
export async function buildPayoutRecord(
  input: PayoutDetailsInput,
  applicantName: string
): Promise<{ ok: true; data: PayoutRecord } | { ok: false; error: string }> {
  const parsed = payoutDetailsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check your bank details." };
  const { bankCode, accountNumber, accountName } = parsed.data;

  const bank = (await getBankList()).find((b) => b.code === bankCode);
  if (!bank) return { ok: false, error: "Choose your bank from the list." };

  const check = await checkAccountName(accountNumber, bankCode, accountName, applicantName);
  if (check.nameMatch === "FAILED") {
    return { ok: false, error: "We couldn't find that account at the bank you chose. Please check the account number and bank." };
  }

  return {
    ok: true,
    data: {
      accountName,
      bankCode,
      bankName: bank.name,
      accountNumberEnc: encryptAccountNumber(accountNumber),
      accountNumberLast4: accountNumber.slice(-4),
      accountNumberHash: hashAccountNumber(accountNumber),
      verifiedName: check.verifiedName,
      nameMatch: check.nameMatch,
      consentVersion: PAYOUT_CONSENT_VERSION,
      consentAt: new Date(),
    },
  };
}

export interface PayoutRecord {
  accountName: string;
  bankCode: string;
  bankName: string;
  accountNumberEnc: string;
  accountNumberLast4: string;
  accountNumberHash: string;
  verifiedName: string | null;
  nameMatch: "UNVERIFIED" | "MATCH" | "PARTIAL" | "MISMATCH" | "FAILED";
  consentVersion: string;
  consentAt: Date;
}
