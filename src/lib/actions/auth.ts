"use server";

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/services/email";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/lib/validations/auth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function clientKey(prefix: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  return `${prefix}:${ip}`;
}

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function registerUser(input: RegisterInput): Promise<ActionResult<{ userId: string }>> {
  const limited = await rateLimit(await clientKey("register"), 8, 60_000);
  if (!limited.ok) return { ok: false, error: "Too many attempts. Try again in a moment." };

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Check the form for errors.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { name, username, email, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { email: true, username: true },
  });
  if (existing) {
    if (existing.email === email) {
      return { ok: false, error: "An account with this email already exists.", fieldErrors: { email: ["Already in use"] } };
    }
    return { ok: false, error: "This username is taken.", fieldErrors: { username: ["Already in use"] } };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      passwordHash,
      notificationPref: { create: {} },
    },
  });

  const token = randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
  });
  await sendVerificationEmail(user.email, `${APP_URL}/verify-email?token=${token}`);

  return { ok: true, data: { userId: user.id } };
}

export async function verifyEmailToken(token: string): Promise<ActionResult> {
  if (!token) return { ok: false, error: "Missing verification token." };

  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { ok: false, error: "This verification link is invalid or has expired." };
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { emailVerified: new Date() } }),
    prisma.emailVerificationToken.update({ where: { token }, data: { usedAt: new Date() } }),
  ]);

  return { ok: true, data: undefined };
}

export async function resendVerificationEmail(userId: string): Promise<ActionResult> {
  const limited = await rateLimit(await clientKey("resend-verify"), 3, 5 * 60_000);
  if (!limited.ok) return { ok: false, error: "Too many requests. Try again shortly." };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.emailVerified) return { ok: true, data: undefined };

  const token = randomBytes(32).toString("hex");
  await prisma.emailVerificationToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) },
  });
  await sendVerificationEmail(user.email, `${APP_URL}/verify-email?token=${token}`);
  return { ok: true, data: undefined };
}

export async function requestPasswordReset(input: ForgotPasswordInput): Promise<ActionResult> {
  const limited = await rateLimit(await clientKey("forgot-password"), 5, 15 * 60_000);
  if (!limited.ok) return { ok: false, error: "Too many requests. Try again later." };

  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Enter a valid email address." };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  // Always return success to avoid leaking whether an email is registered.
  if (!user) return { ok: true, data: undefined };

  const token = randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt: new Date(Date.now() + 60 * 60 * 1000) },
  });
  await sendPasswordResetEmail(user.email, `${APP_URL}/reset-password?token=${token}`);

  return { ok: true, data: undefined };
}

export async function resetPassword(input: ResetPasswordInput): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { token, password } = parsed.data;

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { ok: false, error: "This reset link is invalid or has expired." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } }),
  ]);

  return { ok: true, data: undefined };
}
