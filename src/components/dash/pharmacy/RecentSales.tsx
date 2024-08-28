import { Subheading } from "@/components/heading";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/table";
import { fetchRecentSales } from "@services/sales.service";
import { TableBody } from "@ui/table";
import { formatAmountKsh } from "@utils/formatNumber";
import React from "react";

interface SaleItem {
  medication: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface Sale {
  id: string;
  customerId: string | null;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: SaleItem[];
}

interface RecentSalesProps {
  sales?: Sale[];
}

const RecentSales: React.FC<RecentSalesProps> = async ({ sales }) => {
  const recentSales = await fetchRecentSales();
  return (
    <div>
      <Subheading className="mt-14">Recent Sales</Subheading>
      <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
        <TableHead>
          <TableRow>
            <TableHeader>Purchase Date</TableHeader>
            <TableHeader>Customer ID</TableHeader>
            <TableHeader>Payment Method</TableHeader>
            <TableHeader>Payment Status</TableHeader>

            <TableHeader className="text-right">Total Amount</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentSales.map((sale) => (
            <TableRow
              key={sale.id}
              title={`Order #${sale.id}`}
              href={`/admin/sales/details?sale=${sale.id}`}
            >
              <TableCell className="text-zinc-500">
                {new Date(sale.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>{sale.customerId ?? "N/A"}</TableCell>
              <TableCell>{sale.paymentMethod}</TableCell>
              <TableCell>{sale.paymentStatus}</TableCell>

              <TableCell className="text-right">
                {formatAmountKsh(sale.totalAmount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentSales;
