import { UserNavigation } from "@/components/users";
import React from "react";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <UserNavigation />

      {children}
    </div>
  );
}
