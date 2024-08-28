import { UserList } from "@/components/users";
import { userColumns } from "@/components/users/data-table/columns";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { Prisma } from "@prisma/client";
import { SessionUser, UserWithRoleAndTenant } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData(user?: SessionUser) {
  const isAdminOrClinic = user?.role === "Admin" || user?.role === "Clinic";

  const whereClause: Prisma.UserWhereInput = {
    id: { not: user?.id }, // Exclude the current user
    tenantId: isAdminOrClinic ? undefined : user?.tenantId, // Limit by tenant if not Admin or Clinic
    role: isAdminOrClinic
      ? {
          name: {
            not: "Admin",
          },
        }
      : undefined, // Exclude Admin role if the user is Admin or Clinic
  };

  // Fetch users based on the whereClause
  const users = await prisma_next.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
    include: {
      tenant: true,
      role: true,
    },
  });

  return { users };
}

export default async function UserListPage() {
  const user = await getCurrentUser();

  const { users } = await getData(user);

  const data = users.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    tenant: item.tenant.name,
    role: item.role.name,
  }));

  const filterableColumns = ["role", "tenant", "email"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(data, key as keyof UserWithRoleAndTenant),
  }));
  return (
    <UserList columns={userColumns} data={data} filterableColumns={filterableColumns} />
  );
}
