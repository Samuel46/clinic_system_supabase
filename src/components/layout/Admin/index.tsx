"use client";

import { CheckCircleIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SidebarLayout } from "@/components/sidebar-layout";
import useAppointmentUpdates from "@hooks/useAppointmentUpdates";
import useUpdateInventory from "@hooks/useUpdateInventory";
import { supabase } from "@lib/supabase/client";
import { Patient, Tenant } from "@prisma/client";
import { SessionUser } from "@type/index";
import { Button } from "@ui/button";
import Notification from "@ui/notification";
import { fDateTime } from "@utils/formatTime";

import { ToasterProvider } from "../../../providers";
import NavbarAccount from "./NavbarAccount";
import SideBarAccount from "./SideBarAccount";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { GridPattern } from "@/components/GridPattern";
import { Gradient, GradientBackground } from "@ui/gradient";

type Props = {
  children: React.ReactNode;
  user?: SessionUser;
  tenant: Tenant | null;
};
export function ApplicationLayout({ children, user, tenant }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [messages, setMessages] = useState<{ title: string; description: string }[]>([]);

  useAppointmentUpdates(user);

  const { warnings, setWarnings } = useUpdateInventory(tenant, user);

  console.log(warnings, "warningsss");

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
      {warnings.length > 0 && (
        <Notification messages={warnings} type="warning" setMessages={setWarnings} />
      )}

      <MotionConfig>
        <motion.div
          layout
          style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
          className="relative flex flex-auto overflow-hidden bg-white "
        >
          <motion.div layout className="relative isolate flex w-full flex-col pt-9">
            <GridPattern
              className="absolute inset-x-0 -top-14 -z-10 h-[1000px] w-full fill-rose-50 stroke-neutral-950/5 [mask-image:linear-gradient(to_bottom_left,white_40%,transparent_50%)]"
              yOffset={-96}
              interactive
            />

            <main className="w-full flex-auto z-50">{children}</main>
          </motion.div>
        </motion.div>
      </MotionConfig>
    </SidebarLayout>
  );
}
