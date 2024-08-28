import { Prisma, PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma_next =
  globalThis.prisma ||
  new PrismaClient({
    transactionOptions: {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  });
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma_next;

export default prisma_next;

// import { PrismaClient } from "@prisma/client";

// import { withOptimize } from "@prisma/extension-optimize";

// const extendedPrisma = () => new PrismaClient().$extends(withOptimize());
// type PrismaClientExtended = ReturnType<typeof extendedPrisma>;

// declare global {
//   var prisma: PrismaClientExtended | undefined;
// }

// const prisma_next = globalThis.prisma || new PrismaClient().$extends(withOptimize());
// if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma_next;

// export default prisma_next;
