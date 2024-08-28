"use client";

import SideBarAccount from "./SideBarAccount";
import NavbarAccount from "./NavbarAccount";

import { SidebarLayout } from "@/components/sidebar-layout";

import { ToasterProvider } from "../../../providers";
import { SessionUser } from "@type/index";
import { Patient, Tenant } from "@prisma/client";
import { useEffect, useState } from "react";
import { supabase } from "@lib/supabase/client";

import { usePathname, useRouter } from "next/navigation";

import { fDateTime } from "@utils/formatTime";

import { toast } from "sonner";

import { CheckCircleIcon } from "lucide-react";

import { Button } from "@ui/button";
type Props = {
  children: React.ReactNode;
  user?: SessionUser;
  tenant: Tenant | null;
};
export function ApplicationLayout({ children, user, tenant }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [messages, setMessages] = useState<{ title: string; description: string }[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("patient added")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Patient" },
        (payload) => {
          const patient = payload.new as Patient;
          const newMessage = {
            title: `New patient ${patient.name} added by ${user?.name}`,
            description: `${fDateTime(patient.createdAt)} ✅`,
          };

          if (
            tenant?.id === patient.tenantId &&
            ["Admin", "Clinic"].includes(user?.role ?? "")
          ) {
            toast.custom(
              (id) => (
                <div className="rounded-2xl bg-slate-50 p-4 w-full" key={id}>
                  <div className="flex w-full">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="h-5 w-5 text-lime-400"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-slate-800">
                        {newMessage.title}
                      </h3>
                      <div className="mt-2 text-sm text-slate-700">
                        <p>{newMessage.description}</p>
                      </div>
                      <div className="mt-4">
                        <div className="-mx-2 -my-1.5 flex gap-x-2">
                          <Button
                            onClick={() => router.push(`/admin/patients/${patient.id}`)}
                            type="button"
                            size="sm"
                            className=" bg-lime-50/50 outline-lime-50"
                            variant="outline"
                          >
                            View details
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.dismiss(id)}
                            type="button"
                          >
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ),
              {
                duration: Infinity,
                position: "top-right",
              }
            );
          }

          // Add the new message to the state
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    // Cleanup the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, pathname, router, tenant]);
  return (
    <SidebarLayout
      navbar={<NavbarAccount user={user} />}
      sidebar={<SideBarAccount user={user} tenant={tenant} />}
    >
      <ToasterProvider />

      {children}
    </SidebarLayout>
  );
}
