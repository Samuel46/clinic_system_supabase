"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      router.push("/admin");
    }
    router.prefetch("/admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
