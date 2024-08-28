// next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as NextAuthJWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tenantId: string;
      role: string;
      emailVerified?: Date | null;
      // phone?: string;
      createdAt: Date;
      updatedAt: Date;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    tenantId: string;
    role: string;
    emailVerified?: Date | null;
    // phone?: string;
    createdAt: Date;
    updatedAt: Date;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    tenantId: string;
    role: string;
    emailVerified?: Date | null;
    // phone?: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
