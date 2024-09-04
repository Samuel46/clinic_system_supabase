import { UserForm } from "@/components/users";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import React from "react";
interface Props {
  searchParams: {
    id: string;
  };
}
async function getData(id: string) {
  const currentUser = await prisma_next.user.findUnique({
    where: { id },
  });
  const roles = await prisma_next.role.findMany({
    where: {
      name: {
        not: "Admin", // Exclude the Admin role
      },
    },
  });

  return { currentUser, roles };
}
export default async function EditUserPage({ searchParams: { id } }: Props) {
  const { currentUser, roles } = await getData(id);
  const user = await getCurrentUser();

  const roleOptions = roles.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <UserForm currentUser={currentUser} edit user={user} roleOptions={roleOptions} />
  );
}
