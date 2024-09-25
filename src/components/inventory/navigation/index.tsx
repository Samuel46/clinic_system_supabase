"use client";

import {
  Navbar,
  NavbarDivider,
  NavbarItem,
  NavbarLabel,
  NavbarSection,
  NavbarSpacer,
} from "@/components/navbar";
import { PillBottle, ShoppingBasket, Syringe } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";

const isPathActive = (pathname: string | null, targetPath: string) =>
  pathname?.startsWith(targetPath);

const isSubPathActive = (pathname: string | null, subPath: string) =>
  pathname?.includes(subPath) && pathname?.startsWith("/admin/inventory");

export default function InventoryNavigation() {
  const pathname = usePathname();

  return (
    <Navbar className="border rounded-lg px-6">
      <NavbarLabel>Stock</NavbarLabel>
      <NavbarDivider className="max-lg:hidden" />
      <NavbarSection className="max-lg:hidden">
        <NavbarItem
          href="/admin/inventory/list"
          current={
            isPathActive(pathname, "/admin/inventory") &&
            !isSubPathActive(pathname, "medications") &&
            !isSubPathActive(pathname, "supplies")
          }
        >
          <ShoppingBasket className="h-4" />
          Inventory
        </NavbarItem>
        <NavbarItem
          href="/admin/inventory/medications"
          current={isSubPathActive(pathname, "medications")}
        >
          <PillBottle className="h-4" />
          Medications
        </NavbarItem>
        <NavbarItem
          href="/admin/inventory/supplies"
          current={isSubPathActive(pathname, "supplies")}
        >
          <Syringe className="h-4" /> Supplies
        </NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
    </Navbar>
  );
}
