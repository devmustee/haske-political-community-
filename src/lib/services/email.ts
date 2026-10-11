/**
 * Email delivery service abstraction.
 *
 * Default provider ("console") logs the email instead of sending it — this
 * keeps every auth flow (verification, password reset, notifications)
 * fully functional in development without a configured provider. Set
 * EMAIL_PROVIDER=resend and RESEND_API_KEY in .env to send real email; no
 * call-site changes are needed.
 */

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailService {
  send(input: SendEmailInput): Promise<{ ok: true } | { ok: false; error: string }>;
  isConfigured(): boolean;
}

class ConsoleEmailService implements EmailService {
  isConfigured() {
    return true; // always "works" — it just logs instead of sending
  }
  async send(input: SendEmailInput) {
    console.log("\n──────── [email:console] pending real provider configuration ────────");
    console.log(`To:      ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log(`Body:\n${input.text ?? input.html}`);
    console.log("────────────────────────────────────────────────────────────────────\n");
    return { ok: true as const };
  }
}

class ResendEmailService implements EmailService {
  private apiKey = process.env.RESEND_API_KEY ?? "";

  isConfigured() {
    return this.apiKey.length > 0;
  }

  async send(input: SendEmailInput) {
    if (!this.isConfigured()) {
      return { ok: false as const, error: "RESEND_API_KEY is not configured" };
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Haske Community <no-reply@haskecommunity.ng>",
        to: input.to,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
    if (!res.ok) {
      const error = await res.text();
      return { ok: false as const, error };
    }
    return { ok: true as const };
  }
}

export function getEmailService(): EmailService {
  const provider = process.env.EMAIL_PROVIDER ?? "console";
  switch (provider) {
    case "resend":
      return new ResendEmailService();
    default:
      return new ConsoleEmailService();
  }
}

export type EmailResult = { ok: true } | { ok: false; error: string };

/**
 * Sends through the configured provider and never fails silently: a refused
 * or failed send (wrong sender domain, bad key, network) is logged and
 * reported to Sentry, and the caller gets `ok: false` to tell the user.
 * In production, the "console" provider counts as a failure, since nothing
 * is actually delivered.
 */
async function deliver(kind: string, input: SendEmailInput): Promise<EmailResult> {
  let result: EmailResult;
  if (process.env.VERCEL_ENV === "production" && (process.env.EMAIL_PROVIDER ?? "console") === "console") {
    result = { ok: false, error: "EMAIL_PROVIDER is not set to a real provider in production, so no email was delivered." };
  } else {
    try {
      result = await getEmailService().send(input);
    } catch (err) {
      result = { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }
  if (!result.ok) await reportEmailFailure(kind, result.error);
  return result;
}

async function reportEmailFailure(kind: string, error: string) {
  // Keep recipients' addresses out of logs and Sentry.
  const detail = error.replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, "[email]").slice(0, 500);
  console.error(`Email "${kind}" failed: ${detail}`);
  if (!process.env.SENTRY_DSN) return;
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureMessage(`Email delivery failed: ${kind}`, { level: "error", tags: { email_kind: kind }, extra: { detail } });
    await Sentry.flush(2000);
  } catch {
    // Reporting must never break the request itself.
  }
}

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  return deliver("verification", {
    to,
    subject: "Verify your Haske Community account",
    text: `Welcome to Haske Community. Verify your email address:\n\n${verifyUrl}\n\nIf you did not create this account, ignore this email.`,
    html: `<p>Welcome to Haske Community.</p><p><a href="${verifyUrl}">Verify your email address</a></p><p>If you did not create this account, ignore this email.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return deliver("password-reset", {
    to,
    subject: "Reset your Haske Community password",
    text: `A password reset was requested for your account.\n\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`,
    html: `<p>A password reset was requested for your account.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 1 hour. If you did not request this, ignore this email.</p>`,
  });
}
