"use client";
import React from "react";
import { TableRow, TableCell } from "@ui/table";
import { Skeleton } from "@ui/skeleton";
import { Table, TableBody, TableHead, TableHeader } from "@/components/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/card";

import DynamicBreadcrumb from "@ui/dynamic-breadcrumb";

import { PlusCircleIcon } from "lucide-react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";

const RecentSalesSkeleton: React.FC = () => {
  return (
    <div className=" space-y-6">
      <DynamicBreadcrumb />

      <Skeleton className="flex h-30 w-full items-center bg-muted/70 p-8 py-10 rounded-2xl">
        <Input placeholder="Filter name..." className="h-8 w-[150px] lg:w-[250px]" />
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="h-8 gap-1">
            <PlusCircleIcon className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Procedure
            </span>
          </Button>
        </div>
      </Skeleton>
      <Card className=" rounded-2xl">
        <CardHeader>
          <CardTitle>Procedures</CardTitle>
          <CardDescription>
            Overview of all your procedures. Possible to view and edit from here
          </CardDescription>
        </CardHeader>
        {/* <Subheading className="mt-14">Recent Sales</Subheading> */}

        <CardContent>
          <Table className="mt-4 [--gutter:theme(spacing.6)] lg:[--gutter:theme(spacing.10)]">
            <TableHead>
              <TableRow>
                <TableHeader>Procedure Name</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Step Count</TableHeader>
                <TableHeader>Equipment Count</TableHeader>
                <TableHeader>Create At</TableHeader>
                <TableHeader>Updated At</TableHeader>

                <TableHeader className="text-right"></TableHeader>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentSalesSkeleton;
