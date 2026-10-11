import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendVerificationEmail } from "./email";

describe("email delivery", () => {
  const env = { ...process.env };
  let errorLog: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    delete process.env.SENTRY_DSN;
    errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    process.env = { ...env };
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("reports a refused send without logging the recipient", async () => {
    process.env.EMAIL_PROVIDER = "resend";
    process.env.RESEND_API_KEY = "re_test";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response('{"message":"The haskecommunity.ng domain is not verified (to: amina@example.com)"}', { status: 403 }))
    );

    const result = await sendVerificationEmail("amina@example.com", "https://example.test/verify");

    expect(result.ok).toBe(false);
    expect(errorLog).toHaveBeenCalledOnce();
    const logged = String(errorLog.mock.calls[0][0]);
    expect(logged).toContain("domain is not verified");
    expect(logged).not.toContain("amina@example.com");
  });

  it("reports a network failure instead of throwing", async () => {
    process.env.EMAIL_PROVIDER = "resend";
    process.env.RESEND_API_KEY = "re_test";
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new Error("getaddrinfo ENOTFOUND api.resend.com"))));

    const result = await sendVerificationEmail("amina@example.com", "https://example.test/verify");

    expect(result).toEqual({ ok: false, error: "getaddrinfo ENOTFOUND api.resend.com" });
  });

  it("treats the console provider as a failure in production", async () => {
    process.env.VERCEL_ENV = "production";
    delete process.env.EMAIL_PROVIDER;
    vi.spyOn(console, "log").mockImplementation(() => {});

    const result = await sendVerificationEmail("amina@example.com", "https://example.test/verify");

    expect(result.ok).toBe(false);
    expect(String(errorLog.mock.calls[0][0])).toContain("EMAIL_PROVIDER");
  });

  it("delivers through Resend when it accepts the email", async () => {
    process.env.EMAIL_PROVIDER = "resend";
    process.env.RESEND_API_KEY = "re_test";
    vi.stubGlobal("fetch", vi.fn(async () => new Response('{"id":"1"}', { status: 200 })));

    expect(await sendVerificationEmail("amina@example.com", "https://example.test/verify")).toEqual({ ok: true });
    expect(errorLog).not.toHaveBeenCalled();
  });
});
