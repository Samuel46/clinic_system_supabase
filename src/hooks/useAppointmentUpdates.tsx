import { supabase } from "@lib/supabase/client";
import { Appointment } from "@prisma/client";
import { SessionUser } from "@type/index";
import { format } from "date-fns";
import { useEffect } from "react";
import { toast } from "sonner";

const useAppointmentUpdates = (user?: SessionUser) => {
  useEffect(() => {
    const appointmentChannel = supabase.channel("appointment-schedules");

    const handleAppointmentUpdate = (payload: { payload: Appointment }) => {
      const data = payload.payload;

      if (data.status === "COMPLETED") {
        toast.success(
          `Appointment completed successfully : ${data.status} at ${format(
            data.updatedAt,
            "ppp"
          )} by ${user?.name} }`,
          {
            position: "top-right",
          }
        );
      } else {
        toast.success(
          `Appointment ${data.id} updated. Status: ${data.status} from ${format(
            data.startTime,
            "p"
          )} to ${format(data.endTime, "p")}`,
          {
            position: "top-right",
          }
        );
      }
    };

    // Listen for appointment updates
    appointmentChannel.on(
      "broadcast",
      { event: "appointment-update" },
      handleAppointmentUpdate
    );

    // Subscribe to the channel
    appointmentChannel.subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      appointmentChannel.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount
};

export default useAppointmentUpdates;
