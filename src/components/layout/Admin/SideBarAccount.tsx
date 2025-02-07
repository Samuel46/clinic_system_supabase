import React from "react";
import { Avatar } from "@/components/avatar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
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

import { Activity, HeartPulseIcon, Percent, ShoppingBasket } from "lucide-react";
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
          {/* <SidebarDivider /> */}

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
                href="/admin/settings"
                current={pathname?.startsWith("/admin/settings")}
              >
                <Cog6ToothIcon />
                <SidebarLabel>Settings</SidebarLabel>
              </SidebarItem>
            </>
          )}
        </SidebarSection>

        <>
          <SidebarSection>
            <SidebarHeading>Clinic</SidebarHeading>

            <SidebarItem
              href="/admin/users"
              current={pathname?.startsWith("/admin/users")}
            >
              <UsersIcon
                className={cn(
                  pathname?.startsWith("/admin/users") ? "text-black " : "text-gray-500",
                  "h-5 "
                )}
              />
              <SidebarLabel>Staff</SidebarLabel>
            </SidebarItem>

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
          </SidebarSection>

          <SidebarSection>
            <SidebarHeading>Pharmacy</SidebarHeading>

            <SidebarItem
              href="/admin/inventory/list"
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
              <SidebarLabel>Stock</SidebarLabel>
            </SidebarItem>

            <SidebarItem
              href="/admin/treatments/list"
              current={pathname?.startsWith("/admin/treatments")}
            >
              <HeartPulseIcon
                className={cn(
                  pathname?.startsWith("/admin/treatments")
                    ? "text-black "
                    : "text-gray-500",
                  "h-5 "
                )}
              />
              <SidebarLabel>Patient&apos;s care</SidebarLabel>
            </SidebarItem>
          </SidebarSection>

          <SidebarSection>
            <SidebarHeading>Finance</SidebarHeading>
            <SidebarItem
              href="/admin/bills"
              current={pathname?.startsWith("/admin/bills")}
            >
              <BanknotesIcon
                className={cn(
                  pathname?.startsWith("/admin/bills") ? "text-black " : "text-gray-500",
                  "h-5 "
                )}
              />
              <SidebarLabel>Bills</SidebarLabel>
            </SidebarItem>

            <SidebarItem
              href="/admin/sales"
              current={pathname?.startsWith("/admin/sales")}
            >
              <Percent
                className={cn(
                  pathname?.startsWith("/admin/sales") ? "text-black " : "text-gray-500",
                  "h-5 "
                )}
              />
              <SidebarLabel>Sales</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </>

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
