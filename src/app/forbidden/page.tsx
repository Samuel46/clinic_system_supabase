import React from "react";

import { getCurrentUser } from "@lib/session";
import { ForbiddenAccess } from "@/components/auth";

export default async function ForbiddenPage() {
  const user = await getCurrentUser();

  return <ForbiddenAccess user={user} />;
}
