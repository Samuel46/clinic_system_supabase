import { Badge } from "@/components/badge";
import { Subheading } from "@/components/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Billing, BillingStatus, Patient, Prisma } from "@prisma/client";
import { Button } from "@ui/button";
import { formatAmountKsh } from "@utils/formatNumber";
import { fDate } from "@utils/formatTime";
import React, { useState } from "react";
import CreateBillDrawer from "./bills/CreateBillDrawer";
import { SessionUser } from "@type/index";
interface Props {
  bills: Prisma.BillingGetPayload<{
    include: { user: true };
  }>[];
  patient: Patient | null;
  user?: SessionUser;
}

export default function PatientBills({ bills, patient, user }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="py-10">
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Subheading>Bill information</Subheading>
        <div className="flex gap-4">
          <Button onClick={() => setOpen(!open)}>Add bill</Button>
        </div>
      </div>

      <Table
        striped
        className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]"
      >
        <TableHead>
          <TableRow>
            <TableHeader>Amount</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Staff</TableHeader>
            <TableHeader>Payment Method</TableHeader>
            <TableHeader>Created At</TableHeader>
            <TableHeader className="text-right">Updated At</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {bills.length > 0 ? (
            bills.map((bill) => (
              <TableRow
                key={bill.id}
                title={`${bill.id}`}
                href={`/admin/patients/bill?id=${bill.id}`}
              >
                <TableCell>{formatAmountKsh(bill.amount)}</TableCell>
                <TableCell className="text-zinc-500">
                  <Badge
                    className="max-w-[250px] truncate font-medium text-pretty"
                    color={
                      bill.status === BillingStatus.UNPAID
                        ? "red"
                        : bill.status === BillingStatus.PAID
                        ? "green"
                        : "sky"
                    }
                  >
                    {bill.status}
                  </Badge>
                </TableCell>
                <TableCell>{bill.user.name}</TableCell>
                <TableCell>{bill.paymentMethod}</TableCell>
                <TableCell>{fDate(bill.createdAt)}</TableCell>
                <TableCell className="text-right">{fDate(bill.updatedAt)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No bills found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <CreateBillDrawer open={open} setOpen={setOpen} patient={patient} user={user} />
    </div>
  );
}
