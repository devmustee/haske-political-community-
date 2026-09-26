import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      verification: string;
      status: string;
      isEmailVerified: boolean;
      adminRoles: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    verification?: string;
    status?: string;
    isEmailVerified?: boolean;
    adminRoles?: string[];
    rolesLoadedAt?: number;
    /** Set when this token was minted before a subsequent password reset. */
    invalid?: boolean;
  }
}
