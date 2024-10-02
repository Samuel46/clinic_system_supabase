"use client";

import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "@/components/navbar";
import { Cross, Link, UsersIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const isPathActive = (pathname: string | null, targetPath: string) =>
  pathname?.startsWith(targetPath);

const isSubPathActive = (pathname: string | null, subPath: string) =>
  pathname?.includes(subPath) && pathname?.startsWith("/admin/users");

export default function UserNavigation() {
  const pathname = usePathname();

  return (
    <Navbar className="border rounded-lg px-6 ">
      <NavbarLabel className="flex items-center gap-x-1 text-gray-900">
        <Cross className="size-4" />
        Staff&apos;s management
      </NavbarLabel>
      <NavbarDivider className="max-lg:hidden" />
      <NavbarSection className="max-lg:hidden">
        <NavbarItem
          href="/admin/users"
          current={
            isPathActive(pathname, "/admin/users") &&
            !isSubPathActive(pathname, "invitations")
          }
        >
          <UsersIcon className="h-4" />
          Staff
        </NavbarItem>
        <NavbarItem
          href="/admin/users/invitations"
          current={isSubPathActive(pathname, "invitations")}
        >
          <Link className="size-4" />
          Invitations
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
    </Navbar>
  );
}
