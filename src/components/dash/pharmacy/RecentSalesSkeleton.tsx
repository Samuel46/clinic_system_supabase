import React from "react";
import { TableRow, TableCell } from "@ui/table";
import { Skeleton } from "@ui/skeleton";
import { Subheading } from "@/components/heading";
import { Table, TableBody, TableHead, TableHeader } from "@/components/table";

const RecentSalesSkeleton: React.FC = () => {
  return (
    <>
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
            {Array.from({ length: 10 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="w-full h-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-8" />
                </TableCell>
                <TableCell>
                  <Skeleton className="w-full h-8" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="w-full h-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default RecentSalesSkeleton;
