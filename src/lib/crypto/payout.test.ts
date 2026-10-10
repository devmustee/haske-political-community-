import { randomBytes } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { decryptAccountNumber, encryptAccountNumber, hashAccountNumber, isPayoutConfigured } from "./payout";

const key = () => randomBytes(32).toString("base64");

describe("payout crypto", () => {
  const saved = { ...process.env };
  beforeEach(() => {
    process.env.PAYOUT_ENCRYPTION_KEY = key();
    process.env.PAYOUT_HASH_KEY = key();
  });
  afterEach(() => {
    process.env = { ...saved };
  });

  it("round-trips and never stores the plaintext", () => {
    const enc = encryptAccountNumber("0123456789");
    expect(enc.startsWith("v1:")).toBe(true);
    expect(enc).not.toContain("0123456789");
    expect(decryptAccountNumber(enc)).toBe("0123456789");
  });

  it("uses a fresh IV each time", () => {
    expect(encryptAccountNumber("0123456789")).not.toBe(encryptAccountNumber("0123456789"));
  });

  it("rejects tampered ciphertext", () => {
    const [v, iv, tag, ct] = encryptAccountNumber("0123456789").split(":");
    const flipped = Buffer.from(ct, "base64url");
    flipped[0] ^= 1;
    expect(() => decryptAccountNumber([v, iv, tag, flipped.toString("base64url")].join(":"))).toThrow();
  });

  it("can't be decrypted with a different key", () => {
    const enc = encryptAccountNumber("0123456789");
    process.env.PAYOUT_ENCRYPTION_KEY = key();
    expect(() => decryptAccountNumber(enc)).toThrow();
  });

  it("rejects unknown formats", () => {
    expect(() => decryptAccountNumber("v9:a:b:c")).toThrow();
    expect(() => decryptAccountNumber("not-encrypted")).toThrow();
  });

  it("hashes deterministically per key", () => {
    const a = hashAccountNumber("0123456789");
    expect(hashAccountNumber("0123456789")).toBe(a);
    expect(hashAccountNumber("0123456780")).not.toBe(a);
    process.env.PAYOUT_HASH_KEY = key();
    expect(hashAccountNumber("0123456789")).not.toBe(a);
  });

  it("reports configuration", () => {
    expect(isPayoutConfigured()).toBe(true);
    delete process.env.PAYOUT_HASH_KEY;
    expect(isPayoutConfigured()).toBe(false);
    process.env.PAYOUT_HASH_KEY = "too-short";
    expect(isPayoutConfigured()).toBe(false);
  });
});
