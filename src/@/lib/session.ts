import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth";
import { DefaultSession } from "next-auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  return session?.user;
}
