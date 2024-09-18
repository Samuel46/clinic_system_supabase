"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/procedures") {
      router.push("/admin/procedures/list");
    }
    router.prefetch("/admin/procedures/list");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
