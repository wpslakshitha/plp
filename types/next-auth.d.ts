import { Role } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: {
      role?: Role;
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}