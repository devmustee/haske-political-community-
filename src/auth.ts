import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { loginSchema } from "@/lib/validations/auth";

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

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }],
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
              adminRoles: { select: { role: true } },
            },
          });
          if (dbUser) {
            token.username = dbUser.username;
            token.verification = dbUser.verification;
            token.picture = dbUser.avatarUrl;
            token.status = dbUser.status;
            token.adminRoles = dbUser.adminRoles.map((r) => r.role);
            token.rolesLoadedAt = Date.now();
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.verification = token.verification as string;
        session.user.status = token.status as string;
        session.user.adminRoles = (token.adminRoles as string[]) ?? [];
      }
      return session;
    },
  },
});
