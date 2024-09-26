import type { Metadata } from "next";
import type React from "react";

import { getCurrentUser } from "@lib/session";

import { ApplicationLayout } from "@/components/layout/Admin";
import { SessionUser } from "@type/index";
import prisma_next from "@lib/db";

export const metadata: Metadata = {
  title: {
    template: "%s - HealthSpace",
    default: "HealthSpace",
  },
  description: "",
};

async function getData(user?: SessionUser) {
  const tenant = await prisma_next.tenant.findUnique({
    where: {
      id: user?.tenantId,
    },
  });

  return { tenant };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  const { tenant } = await getData(user);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className=" text-zinc-950 antialiased lg:bg-zinc-100 dark:bg-zinc-900 dark:text-white dark:lg:bg-zinc-950"
    >
      <body>
        <ApplicationLayout user={user} tenant={tenant}>
          {children}
        </ApplicationLayout>
      </body>
    </html>
  );
}
