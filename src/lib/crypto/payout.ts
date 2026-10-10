import "server-only";
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

/**
 * Encryption for applicants' bank account numbers.
 *
 * - AES-256-GCM with a random 96-bit IV per value; the auth tag detects any
 *   tampering. Stored as "v1:<iv>:<tag>:<ciphertext>" (base64url), so the key
 *   can be rotated later by adding a version and re-encrypting.
 * - HMAC-SHA256 with a separate key gives a stable fingerprint for duplicate
 *   detection without ever decrypting.
 *
 * Keys come from PAYOUT_ENCRYPTION_KEY and PAYOUT_HASH_KEY (32 random bytes
 * each, base64). Losing PAYOUT_ENCRYPTION_KEY makes stored numbers
 * unreadable, so keep a copy in the password manager.
 */
const VERSION = "v1";
const AAD = Buffer.from("haske:payout:account-number:v1");

export class PayoutConfigError extends Error {}

function readKey(name: "PAYOUT_ENCRYPTION_KEY" | "PAYOUT_HASH_KEY"): Buffer {
  const raw = process.env[name];
  if (!raw) throw new PayoutConfigError(`${name} is not set.`);
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new PayoutConfigError(`${name} must be 32 bytes, base64-encoded.`);
  return key;
}

/** True when both keys are present and valid. Payout collection is disabled otherwise. */
export function isPayoutConfigured(): boolean {
  try {
    readKey("PAYOUT_ENCRYPTION_KEY");
    readKey("PAYOUT_HASH_KEY");
    return true;
  } catch {
    return false;
  }
}

export function encryptAccountNumber(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", readKey("PAYOUT_ENCRYPTION_KEY"), iv);
  cipher.setAAD(AAD);
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString("base64url"), tag.toString("base64url"), ciphertext.toString("base64url")].join(":");
}

export function decryptAccountNumber(stored: string): string {
  const [version, iv, tag, ciphertext] = stored.split(":");
  if (version !== VERSION || !iv || !tag || !ciphertext) throw new Error("Unrecognised encrypted value.");
  const decipher = createDecipheriv("aes-256-gcm", readKey("PAYOUT_ENCRYPTION_KEY"), Buffer.from(iv, "base64url"));
  decipher.setAAD(AAD);
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64url")), decipher.final()]).toString("utf8");
}

export function hashAccountNumber(plain: string): string {
  return createHmac("sha256", readKey("PAYOUT_HASH_KEY")).update(plain).digest("hex");
}
