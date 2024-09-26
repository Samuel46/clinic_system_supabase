"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/treatments/procedures") {
      router.push("/admin/treatments/procedures/list");
    }
    router.prefetch("/admin/treatments/procedures/list");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router]);

  return null;
}
