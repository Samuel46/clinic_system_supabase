import { supabase } from "@lib/supabase/client";
import { useEffect, useState } from "react";

type PresenceUser = {
  userId: string;
  username: string;
  status: "online" | "offline";
};

const useAppointmentPresence = (
  appointmentId: string,
  userId: string,
  username: string
) => {
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    const channel = supabase.channel(`presence-appointment-${appointmentId}`);

    // Subscribe to the channel
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // Now it's safe to track the current user's presence
        await channel.track({ userId, username });
      }
    });

    // Handle sync event - initializes the list of active users
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const users: PresenceUser[] = Object.keys(state).map((key) => ({
        userId: key,
        username: (state[key][0] as unknown as { username: string }).username,
        status: "online",
      }));
      setActiveUsers(users);
    });

    // Handle join event - a new user joins
    channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
      setActiveUsers((prevUsers) => {
        const newUser: PresenceUser = {
          userId: key,
          username: newPresences[0].username as string,
          status: "online",
        };
        // Filter out any existing user with the same userId
        const filteredUsers = prevUsers.filter((user) => user.userId !== key);
        return [...filteredUsers, newUser];
      });
    });

    // Handle leave event - a user leaves
    channel.on("presence", { event: "leave" }, ({ key }) => {
      setActiveUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === key ? { ...user, status: "offline" } : user
        )
      );
    });

    // Clean up the subscription when the component unmounts
    return () => {
      channel.unsubscribe();
    };
  }, [appointmentId, userId, username]);

  return activeUsers;
};

export default useAppointmentPresence;
