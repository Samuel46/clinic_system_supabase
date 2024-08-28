import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            role: true, // Ensure to fetch the role
          },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          tenantId: user.tenantId,
          role: user.role.name, // Ensure role is included
          name: user.name,
          email: user.email,
          hashedPassword: user.hashedPassword,
          emailVerified: user.emailVerified ?? null, // Handle null case
          phone: user.phone,
          image: user.image,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(), // Ensure it's a Date object
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : new Date(), // Ensure it's a Date object
          resetToken: user.resetToken,
          resetTokenExpiry: user.resetTokenExpiry ?? null, // Handle null case
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tenantId = user.tenantId;
        token.name = user.name;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
        // token.phone = user.phone;
        token.createdAt = user.createdAt; // Ensure it's a Date object
        token.updatedAt = user.updatedAt; //
      }
      return token;
    },
    // If you want to use the role in client components
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.tenantId = token.tenantId;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
        // session.user.phone = token.phone;
        session.user.createdAt = token.createdAt; // Ensure it's a Date object
        session.user.updatedAt = token.updatedAt; // Ensure it's a Date object
      }
      return session;
    },
  },
};
