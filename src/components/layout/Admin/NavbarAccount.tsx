"use client";
import React from "react";

import { Avatar } from "@/components/avatar";

import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from "@/components/navbar";

import AccountDropdownMenu from "./AccountDropdownMenu";

import { Dropdown, DropdownButton } from "@/components/dropdown";
import { User } from "@prisma/client";
import { SessionUser } from "@type/index";
import { getInitials } from "@utils/index";
type Props = {
  user?: SessionUser;
};
export default function NavbarAccount({ user }: Props) {
  return (
    <Navbar>
      <NavbarSpacer />
      <NavbarSection>
        <Dropdown>
          <DropdownButton as={NavbarItem}>
            <Avatar square initials={getInitials(user?.name ?? "")} />
          </DropdownButton>
          <AccountDropdownMenu anchor="bottom end" />
        </Dropdown>
      </NavbarSection>
    </Navbar>
  );
}
