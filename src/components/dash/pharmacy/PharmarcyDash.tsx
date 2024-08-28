// import { ClinicStatus, RecentAppointments } from "@/components/dash/clinic";
// import {
//   MedicationDistribution,
//   PharmacyStats,
//   RecentSales,
//   RecentSalesSkeleton,
//   StatsSkeleton,
// } from "@/components/dash/pharmacy";

// import { Heading, Subheading } from "@/components/heading";

// import prisma_next from "@lib/db";
// import { getCurrentUser } from "@lib/session";

// import {
//   fetchMedicationDistribution,
//   fetchMonthlySalesData,
// } from "@services/sales.service";

// import { formatAmountKsh } from "@utils/formatNumber";

// import React, { Suspense } from "react";

// async function getFirstSaleDate(): Promise<Date | null> {
//   const firstSale = await prisma_next.sale.findFirst({
//     orderBy: {
//       createdAt: "asc",
//     },
//     select: {
//       createdAt: true,
//     },
//   });

//   return firstSale ? firstSale.createdAt : null;
// }

// export default async function page() {
//   const result = await fetchMedicationDistribution();
//   const monthlySales = await fetchMonthlySalesData();

//   const user = await getCurrentUser();
//   const firstSaleDate = await getFirstSaleDate();

//   return (
//     <div className=" space-y-6">
//       <Heading>Good afternoon, {user?.name}</Heading>
//       <div className="mt-8 flex items-end justify-between">
//         <Subheading>Overview</Subheading>
//       </div>
//       <div className="mt-4 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
//         <Suspense fallback={<StatsSkeleton />}>
//           <PharmacyStats />
//         </Suspense>
//         <MedicationDistribution
//           data={result}
//           monthlySales={monthlySales}
//           firstSaleDate={firstSaleDate}
//         />
//       </div>

//       <ClinicStatus />

//       <Suspense fallback={<RecentSalesSkeleton />}>
//         <RecentAppointments />
//       </Suspense>

//       {/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 pt-14">
//         <SalesBarChart
//           salesData={salesData}
//           percentageChange={percentageChange}
//           firstSaleDate={firstSaleDate}
//         />
//       </div> */}
//     </div>
//   );
// }
