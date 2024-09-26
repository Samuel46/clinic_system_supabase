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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ApplicationLayout user={user} tenant={tenant}>
          {children}
        </ApplicationLayout>
      </body>
    </html>
  );
}
