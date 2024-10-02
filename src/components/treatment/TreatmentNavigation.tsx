"use client";

import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "@/components/navbar";
import { Brain, HeartPulse, Stethoscope, Tablet } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const isPathActive = (pathname: string | null, targetPath: string) =>
  pathname?.startsWith(targetPath);

const isSubPathActive = (pathname: string | null, subPath: string) =>
  pathname?.includes(subPath) && pathname?.startsWith("/admin/treatments");

export default function TreatmentNavigation() {
  const pathname = usePathname();

  return (
    <Navbar className="border rounded-lg px-6 ">
      <NavbarLabel className="flex items-center gap-x-1 text-gray-900">
        <HeartPulse className="size-4" />
        Patient&apos;s care
      </NavbarLabel>
      <NavbarDivider className="max-lg:hidden" />
      <NavbarSection className="max-lg:hidden">
        <NavbarItem
          href="/admin/treatments/list"
          current={
            isPathActive(pathname, "/admin/treatments") &&
            !isSubPathActive(pathname, "prescriptions") &&
            !isSubPathActive(pathname, "procedures")
          }
        >
          <Stethoscope className="h-4" />
          Treatments
        </NavbarItem>
        <NavbarItem
          href="/admin/treatments/prescriptions"
          current={isSubPathActive(pathname, "prescriptions")}
        >
          <Tablet className="size-4" />
          Prescriptions
        </NavbarItem>
        <NavbarItem
          href="/admin/treatments/procedures/list"
          current={isSubPathActive(pathname, "procedures")}
        >
          <Brain className="h-4" /> Procedures
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
    </Navbar>
  );
}
