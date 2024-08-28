import React from "react";
import { Avatar } from "@/components/avatar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/components/sidebar";

import { ChevronUpIcon } from "@heroicons/react/16/solid";
import {
  BanknotesIcon,
  ClockIcon,
  Cog6ToothIcon,
  DocumentIcon,
  ShareIcon,
  Square2StackIcon,
  SwatchIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";

import { usePathname } from "next/navigation";
import AccountDropdownMenu from "./AccountDropdownMenu";

import { Tenant } from "@prisma/client";
import { Dropdown, DropdownButton } from "@/components/dropdown";

import { Activity, Percent, ShoppingBasket, Tablets } from "lucide-react";
import { cn } from "@lib/utils";
import { Icons } from "@ui/icons";
import { SessionUser } from "@type/index";
import { getInitials } from "@utils/index";

type Props = {
  user?: SessionUser;
  tenant: Tenant | null;
};
export default function SideBarAccount({ user, tenant }: Props) {
  let pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <Dropdown>
          <DropdownButton as={SidebarItem} className="lg:mb-2.5">
            <Avatar square initials={getInitials(tenant?.name ?? "")} />
            <SidebarLabel>{tenant?.name}</SidebarLabel>
          </DropdownButton>
        </Dropdown>
      </SidebarHeader>

      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/admin" current={pathname === "/admin"}>
            <Activity
              className={cn(
                pathname === "/admin" ? "text-black " : "text-gray-500",
                "h-5 "
              )}
            />
            <SidebarLabel>Dashboard</SidebarLabel>
          </SidebarItem>

          {(user?.role === "Admin" ||
            user?.role === "Pharmacist" ||
            user?.role === "Clinic") && (
            <>
              <SidebarItem
                href="/admin/invitations"
                current={pathname?.startsWith("/admin/invitations")}
              >
                <ShareIcon
                  className={cn(
                    pathname?.startsWith("/admin/invitations")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Invitations</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/admin/users"
                current={pathname?.startsWith("/admin/users")}
              >
                <UsersIcon
                  className={cn(
                    pathname?.startsWith("/admin/users")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Staff</SidebarLabel>
              </SidebarItem>
            </>
          )}

          {user?.role !== "Pharmacist" && (
            <>
              <SidebarItem
                href="/admin/patients"
                current={pathname?.startsWith("/admin/patients")}
              >
                <UserGroupIcon
                  className={cn(
                    pathname?.startsWith("/admin/patients")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Patients</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/admin/appointments"
                current={pathname?.startsWith("/admin/appointments")}
              >
                <ClockIcon
                  className={cn(
                    pathname?.startsWith("/admin/appointments")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Appointments</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/admin/medical-records"
                current={pathname?.startsWith("/admin/medical-records")}
              >
                <DocumentIcon
                  className={cn(
                    pathname?.startsWith("/admin/medical-records")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Medical record</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/admin/bills"
                current={pathname?.startsWith("/admin/bills")}
              >
                <BanknotesIcon
                  className={cn(
                    pathname?.startsWith("/admin/bills")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Bills</SidebarLabel>
              </SidebarItem>
            </>
          )}

          {user?.role === "Admin" && (
            <>
              <SidebarItem
                href="/admin/tenants"
                current={pathname?.startsWith("/admin/tenants")}
              >
                <Square2StackIcon />
                <SidebarLabel>Tenants</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/admin/roles"
                current={pathname?.startsWith("/admin/roles")}
              >
                <SwatchIcon
                  className={cn(
                    pathname?.startsWith("/admin/roles")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Roles</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/admin/prescriptions"
                current={pathname?.startsWith("/admin/prescriptions")}
              >
                <Tablets
                  className={cn(
                    pathname?.startsWith("/admin/prescriptions")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Prescriptions</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/admin/settings"
                current={pathname?.startsWith("/admin/settings")}
              >
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </>
          )}

          {(user?.role === "Pharmacist" || user?.role === "Admin") && (
            <>
              <SidebarItem
                href="/admin/sales"
                current={pathname?.startsWith("/admin/sales")}
              >
                <Percent
                  className={cn(
                    pathname?.startsWith("/admin/sales")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Sales</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/admin/medications"
                current={pathname?.startsWith("/admin/medications")}
              >
                <Icons.medication
                  className={cn(
                    pathname?.startsWith("/admin/medications")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Medications</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/admin/inventory"
                current={pathname?.startsWith("/admin/inventory")}
              >
                <ShoppingBasket
                  className={cn(
                    pathname?.startsWith("/admin/inventory")
                      ? "text-black "
                      : "text-gray-500",
                    "h-5 "
                  )}
                />
                <SidebarLabel>Inventory</SidebarLabel>
              </SidebarItem>
            </>
          )}
        </SidebarSection>

        {/* <SidebarSection className="max-lg:hidden">
          <SidebarHeading>Upcoming Events</SidebarHeading>

          <SidebarItem href={"#!!"}>Danch event</SidebarItem>
        </SidebarSection> */}

        <SidebarSpacer />

        {/* <SidebarSection>
          <SidebarItem href="#">
            <QuestionMarkCircleIcon />
            <SidebarLabel>Support</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="#">
            <SparklesIcon />
            <SidebarLabel>Changelog</SidebarLabel>
          </SidebarItem>
        </SidebarSection> */}
      </SidebarBody>

      <SidebarFooter className="max-lg:hidden">
        <Dropdown>
          <DropdownButton as={SidebarItem}>
            <span className="flex min-w-0 items-center gap-3">
              <Avatar
                className="size-10"
                square
                initials={getInitials(user?.name ?? "")}
              />
              <span className="min-w-0">
                <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                  {user?.name}
                </span>
                <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                  {user?.email}
                </span>
              </span>
            </span>
            <ChevronUpIcon />
          </DropdownButton>
          <AccountDropdownMenu anchor="top start" />
        </Dropdown>
      </SidebarFooter>
    </Sidebar>
  );
}
