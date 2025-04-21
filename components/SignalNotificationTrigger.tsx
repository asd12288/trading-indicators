"use client";

import { useEffect } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { NotificationService } from "@/lib/notification-service";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/providers/UserProvider";

/**
 * Component that subscribes to new trading signals and creates notifications
 * This is an example implementation to trigger notifications when new signals are created
 */
export default function SignalNotificationTrigger() {
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    // Only subscribe if a user is logged in
    if (!userId) return;

    console.log("SignalNotificationTrigger: Setting up signal subscription");

    // Subscribe to new signals
    const channel = supabaseClient
      .channel("signals-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signals" },
        async (payload) => {
          const signal = payload.new;
          if (!signal) return;

          try {
            console.log("New signal detected:", signal);

            // Example: Create a notification for the new signal
            await NotificationService.notifyNewSignal(
              userId,
              signal.instrument_name,
              signal.trade_direction,
            );

            // Show toast notification to the user
            toast({
              title: "New Trading Signal",
              description: `A new ${signal.trade_direction} signal for ${signal.instrument_name} is available`,
              variant: "default",
            });
          } catch (error) {
            console.error("Error creating signal notification:", error);
          }
        },
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  // This component doesn't render anything visible
  return null;
}
