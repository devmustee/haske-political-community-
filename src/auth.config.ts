import type { NextAuthConfig } from "next-auth";

// Edge-safe config (no Prisma/bcrypt here) used by middleware for route
// gating. The full config with the Credentials provider lives in auth.ts.
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      const isAdminRoute = pathname.startsWith("/admin");
      const isAuthRoute =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/forgot-password") ||
        pathname.startsWith("/reset-password");

      if (isAdminRoute) return isLoggedIn;
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/community", request.nextUrl));
      }
      return true;
    },
  },
  providers: [],
};
