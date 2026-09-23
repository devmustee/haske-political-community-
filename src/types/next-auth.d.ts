import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      verification: string;
      status: string;
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
    adminRoles?: string[];
    rolesLoadedAt?: number;
  }
}
