import { BillList } from "@/components/bills";
import { billingColumns } from "@/components/bills/data-table/columns";
import PatientList from "@/components/patients/data-table";
import { patientColumns } from "@/components/patients/data-table/columns";
import prisma_next from "@lib/db";
import { getCurrentUser } from "@lib/session";
import { Patient } from "@prisma/client";
import { BillingColumns, SessionUser } from "@type/index";
import { generateTitle, generateUniqueOptions } from "@utils/tenants";
import React from "react";

async function getData(user?: SessionUser) {
  const whereClause = user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};

  const billings = await prisma_next.billing.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: whereClause,
    include: {
      tenant: true,
      patient: true,
      user: true,
    },
  });

  return { billings };
}
export default async function BillListPage() {
  const user = await getCurrentUser();
  const { billings } = await getData(user);

  const data = billings.map((item) => ({
    id: item.id,
    patientName: item.patient.name,
    amount: item.amount,
    status: item.status,
    paymentMethod: item.paymentMethod,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    role: user?.role,
    staff: item.user.name,
  }));

  const filterableColumns = ["amount", "status", "paymentMethod"].map((key) => ({
    id: key,
    title: generateTitle(key),
    options: generateUniqueOptions(data, key as keyof BillingColumns),
  }));

  return (
    <div>
      <BillList
        data={data}
        filterableColumns={filterableColumns}
        columns={billingColumns}
      />
    </div>
  );
}
