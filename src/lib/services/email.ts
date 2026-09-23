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

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  const service = getEmailService();
  return service.send({
    to,
    subject: "Verify your Haske Community account",
    text: `Welcome to Haske Community. Verify your email address:\n\n${verifyUrl}\n\nIf you did not create this account, ignore this email.`,
    html: `<p>Welcome to Haske Community.</p><p><a href="${verifyUrl}">Verify your email address</a></p><p>If you did not create this account, ignore this email.</p>`,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const service = getEmailService();
  return service.send({
    to,
    subject: "Reset your Haske Community password",
    text: `A password reset was requested for your account.\n\n${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`,
    html: `<p>A password reset was requested for your account.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in 1 hour. If you did not request this, ignore this email.</p>`,
  });
}
