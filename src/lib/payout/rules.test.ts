import { describe, expect, it } from "vitest";
import { canSetPayoutDetails, compareNames, csvCell, maskAccountNumber, payoutDetailsSchema } from "./rules";

describe("payoutDetailsSchema", () => {
  const ok = { bankCode: "058", accountNumber: "0123 456 789", accountName: "Aisha Umar", consent: true as const };
  it("accepts a valid entry and strips spaces", () => {
    expect(payoutDetailsSchema.parse(ok).accountNumber).toBe("0123456789");
  });
  it("keeps leading zeros", () => {
    expect(payoutDetailsSchema.parse({ ...ok, accountNumber: "0000000001" }).accountNumber).toBe("0000000001");
  });
  it.each(["12345", "12345678901", "01234abcde", ""])("rejects account number %j", (n) => {
    expect(payoutDetailsSchema.safeParse({ ...ok, accountNumber: n }).success).toBe(false);
  });
  it("requires consent and a bank", () => {
    expect(payoutDetailsSchema.safeParse({ ...ok, consent: false }).success).toBe(false);
    expect(payoutDetailsSchema.safeParse({ ...ok, bankCode: "" }).success).toBe(false);
  });
  it("rejects digits/symbols in the account name", () => {
    expect(payoutDetailsSchema.safeParse({ ...ok, accountName: "Aisha 123" }).success).toBe(false);
    expect(payoutDetailsSchema.safeParse({ ...ok, accountName: "Ọlá Adébáyọ̀" }).success).toBe(true);
  });
});

describe("canSetPayoutDetails", () => {
  const base = { requiresPayoutDetails: true, stage: "AT_APPLICATION" as const, status: "SUBMITTED" as const, hasPayout: false };
  it("is off unless the program requires it", () => {
    expect(canSetPayoutDetails({ ...base, requiresPayoutDetails: false })).toBe(false);
  });
  it("allows edits before a decision when collected at application", () => {
    expect(canSetPayoutDetails({ ...base, hasPayout: true })).toBe(true);
    expect(canSetPayoutDetails({ ...base, status: "WAITLISTED", hasPayout: true })).toBe(true);
  });
  it("after-acceptance programs only collect once accepted", () => {
    expect(canSetPayoutDetails({ ...base, stage: "AFTER_ACCEPTANCE" })).toBe(false);
    expect(canSetPayoutDetails({ ...base, stage: "AFTER_ACCEPTANCE", status: "ACCEPTED" })).toBe(true);
  });
  it("locks details once accepted and set, and after final outcomes", () => {
    expect(canSetPayoutDetails({ ...base, status: "ACCEPTED", hasPayout: true })).toBe(false);
    for (const status of ["REJECTED", "WITHDRAWN", "PAID"] as const) expect(canSetPayoutDetails({ ...base, status })).toBe(false);
  });
});

describe("compareNames", () => {
  it("matches regardless of order, case and titles", () => {
    expect(compareNames("UMAR AISHA", "Aisha Umar")).toBe("MATCH");
    expect(compareNames("MANDARA MUSTAPHA", "Engr. Mustapha Mandara")).toBe("MATCH");
    expect(compareNames("BELLO FATIMA ADAMU", "Fatima Bello")).toBe("MATCH");
  });
  it("partial when only one name overlaps", () => {
    expect(compareNames("BELLO IBRAHIM", "Fatima Bello")).toBe("PARTIAL");
  });
  it("mismatch when nothing overlaps", () => {
    expect(compareNames("JOHN DOE", "Fatima Bello")).toBe("MISMATCH");
  });
  it("uses the best of several given names", () => {
    expect(compareNames("UMAR AISHA", "A. Teacher", "Aisha Umar")).toBe("MATCH");
  });
});

describe("helpers", () => {
  it("masks all but the last 4 digits", () => {
    expect(maskAccountNumber("6789")).toBe("******6789");
  });
  it("quotes CSV cells and neutralises formulas", () => {
    expect(csvCell('Say "hi"')).toBe('"Say ""hi"""');
    expect(csvCell("=HYPERLINK(1)")).toBe(`"'=HYPERLINK(1)"`);
    expect(csvCell("+234 803")).toBe(`"'+234 803"`);
    expect(csvCell(null)).toBe('""');
  });
});
