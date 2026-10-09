import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { loginSchema } from "@/lib/validations/auth";
import { rateLimit } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { identifier, password } = parsed.data;

        const h = await headers();
        const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
        const limited = rateLimit(`login:${identifier.toLowerCase()}:${ip}`, 8, 5 * 60_000);
        if (!limited.ok) return null;

        const cleanIdentifier = identifier.trim().toLowerCase();
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: { equals: cleanIdentifier, mode: "insensitive" } },
              { username: { equals: cleanIdentifier, mode: "insensitive" } },
            ],
          },
        });

        if (!user || !user.passwordHash) return null;
        if (user.status === "BANNED") return null;
        if (user.status === "SUSPENDED") {
          if (user.suspendedUntil && user.suspendedUntil > new Date()) return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.avatarUrl,
          isEmailVerified: Boolean(user.emailVerified),
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
        token.isEmailVerified = (user as { isEmailVerified?: boolean }).isEmailVerified ?? false;
      }

      if (trigger === "update" || !token.rolesLoadedAt || Date.now() - (token.rolesLoadedAt as number) > 60_000) {
        if (token.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              username: true,
              verification: true,
              avatarUrl: true,
              status: true,
              emailVerified: true,
              passwordChangedAt: true,
              adminRoles: { select: { role: true } },
            },
          });
          if (dbUser) {
            // If the password was changed after this token was minted, the
            // session it represents (e.g. a cookie stolen before the reset)
            // must stop working rather than silently keep full access.
            if (dbUser.passwordChangedAt && typeof token.iat === "number" && dbUser.passwordChangedAt.getTime() / 1000 > token.iat) {
              return { ...token, invalid: true };
            }

            token.username = dbUser.username;
            token.verification = dbUser.verification;
            token.picture = dbUser.avatarUrl;
            token.status = dbUser.status;
            token.isEmailVerified = Boolean(dbUser.emailVerified);
            token.adminRoles = dbUser.adminRoles.map((r) => r.role);
            token.rolesLoadedAt = Date.now();
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.invalid) {
        // Signals a session minted before a password reset — treat as
        // signed out rather than trusting a stale/possibly-stolen cookie.
        return { ...session, user: undefined } as unknown as typeof session;
      }
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.verification = token.verification as string;
        session.user.status = token.status as string;
        session.user.isEmailVerified = Boolean(token.isEmailVerified);
        session.user.adminRoles = (token.adminRoles as string[]) ?? [];
      }
      return session;
    },
  },
});
