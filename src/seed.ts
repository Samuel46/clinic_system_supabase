import { PrismaClient, PermissionAction } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create the tenant
  const tenant = await prisma.tenant.upsert({
    where: { contactEmail: "samlabs@gm.com" },
    update: {},
    create: {
      name: "Sam labs",
      address: "Kenya",
      contactEmail: "samlabs@gm.com",
      contactPhone: "123-456-7890",
    },
  });

  // Create permissions
  const permissions = Object.values(PermissionAction);
  const createdPermissions = await prisma.permission.createMany({
    data: permissions.map((action) => ({ action })),
    skipDuplicates: true, // Skip if permission already exists
  });

  // Create the admin role with all permissions
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Administrator role with full permissions",
      permissions: {
        create: permissions.map((permission) => ({
          permission: { connect: { action: permission } },
        })),
      },
    },
    include: {
      permissions: true,
    },
  });

  const hashedPassword = await bcrypt.hash("12345678", 10);

  // Create an admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "samuelwanjiru728@gmail.com" },
    update: {},
    create: {
      email: "samuelwanjiru728@gmail.com",
      name: "Samuel Wanjiru",
      hashedPassword,
      tenantId: tenant.id,
      roleId: adminRole.id,
    },
  });

  console.log({ tenant, createdPermissions, adminRole, adminUser });
}

main()
  .then(async () => {
    console.log("Success here!!!!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
