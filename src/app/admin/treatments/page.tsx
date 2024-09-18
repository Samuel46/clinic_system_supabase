"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/treatments") {
      router.push("/admin/treatments/list");
    }
    router.prefetch("/admin/treatments/list");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
