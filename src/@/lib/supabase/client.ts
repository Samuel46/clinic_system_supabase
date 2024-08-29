import { Appointment } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@type/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const appointmentChannel = supabase.channel("appointment-schedules");

export const inventoryChannel = supabase.channel("inventory-updates");

export const broadcastAppointmentUpdate = (update: Appointment | null) => {
  appointmentChannel.send({
    type: "broadcast",
    event: "appointment-update",
    payload: update,
  });
};
