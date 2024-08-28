import { CreditCard, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { formatAmountKsh } from "@utils/formatNumber";
import prisma_next from "@lib/db";
import { Badge } from "@/components/badge";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Skeleton } from "@ui/skeleton";
import { SessionUser } from "@type/index";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@lib/session";

type BillsData = {
  totalBills: number;
  totalBilledAmount: number;
  paidPercentage: number;
  unpaidPercentage: number;
  pendingPercentage: number;
};

async function fetchBillsData(user?: SessionUser): Promise<BillsData> {
  const tenantFilter: Prisma.BillingWhereInput =
    user?.role !== "Admin" ? { tenantId: user?.tenantId } : {};

  const bills = await prisma_next.billing.findMany({
    where: tenantFilter,
  });
  const totalBills = bills.length;
  const totalBilledAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

  const paidBills = bills.filter((bill) => bill.status === "PAID").length;
  const unpaidBills = bills.filter((bill) => bill.status === "UNPAID").length;
  const pendingBills = bills.filter((bill) => bill.status === "PENDING").length;

  const paidPercentage = (paidBills / totalBills) * 100;
  const unpaidPercentage = (unpaidBills / totalBills) * 100;
  const pendingPercentage = (pendingBills / totalBills) * 100;

  return {
    totalBills,
    totalBilledAmount,
    paidPercentage,
    unpaidPercentage,
    pendingPercentage,
  };
}
export default async function BillsCard() {
  const user = await getCurrentUser();
  const {
    totalBills,
    totalBilledAmount,
    paidPercentage,
    unpaidPercentage,
    pendingPercentage,
  } = await fetchBillsData(user);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bills</CardTitle>
        <Receipt className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalBills} Bills</div>

        <DescriptionList>
          <DescriptionTerm>Total billed:</DescriptionTerm>
          <DescriptionDetails>{formatAmountKsh(totalBilledAmount)}</DescriptionDetails>
          <DescriptionTerm>Paid:</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={"lime"}>
              +{paidPercentage ? paidPercentage.toFixed(2) : 0}%
            </Badge>
          </DescriptionDetails>

          <DescriptionTerm>Unpaid:</DescriptionTerm>
          <DescriptionDetails>
            <Badge color={"rose"}>
              -{unpaidPercentage ? unpaidPercentage.toFixed(2) : 0}%
            </Badge>
          </DescriptionDetails>

          <DescriptionTerm> Pending: </DescriptionTerm>
          <DescriptionDetails>
            <Badge color={"amber"}>
              {pendingPercentage ? pendingPercentage.toFixed(2) : 0}%
            </Badge>
          </DescriptionDetails>
        </DescriptionList>
      </CardContent>
    </Card>
  );
}
