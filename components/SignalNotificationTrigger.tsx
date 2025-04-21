"use client";

import { useEffect } from "react";
import supabaseClient from "@/database/supabase/supabase";
import { NotificationService } from "@/lib/notification-service";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/providers/UserProvider";
import usePreferences from "@/hooks/usePreferences";

/**
 * Component that subscribes to new trading signals and creates notifications
 * Triggers notifications when trades start or end based on user preferences
 */
export default function SignalNotificationTrigger() {
  const { user } = useUser();
  const userId = user?.id;
  const { notificationsOn } = usePreferences(userId);

  useEffect(() => {
    // Only subscribe if a user is logged in
    if (!userId) return;

    // Subscribe to new signals
    const signalsChannel = supabaseClient
      .channel("signals-start-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signals" },
        async (payload) => {
          const signal = payload.new;
          if (!signal) return;

          try {
            // Check if this instrument is in the user's notification preferences
            if (
              notificationsOn &&
              notificationsOn.includes(signal.instrument_name)
            ) {
              // Create a notification for the new signal with the trade direction and entry price
              await NotificationService.notifyNewSignal(
                userId,
                signal.instrument_name,
                signal.trade_direction || "unknown",
                signal.entry_price,
              );

              // Show toast notification to the user
              toast({
                title: `New ${signal.trade_direction || ""} Signal`,
                description: `A new trade has started for ${signal.instrument_name}`,
                variant: "default",
              });
            }
          } catch (error) {
            console.error("Error creating signal notification:", error);
          }
        },
      )
      .subscribe();

    // Subscribe to signal fulfillments (completed trades)
    const fulfillmentChannel = supabaseClient
      .channel("signals-end-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "signals",
          filter: "exit_price=is.not.null", // Only match signals that now have an exit price
        },
        async (payload) => {
          const signal = payload.new;
          // Skip if signal is not fulfilled or doesn't have required data
          if (!signal || !signal.exit_price) return;

          try {
            // Check if this instrument is in the user's notification preferences
            if (
              notificationsOn &&
              notificationsOn.includes(signal.instrument_name)
            ) {
              // Calculate quality metrics if available
              const mfe = signal.mfe || 0;
              const mae = signal.mae || 0;
              const riskRewardRatio = mae > 0 ? mfe / mae : mfe;
              const quality = riskRewardRatio >= 4 ? "exceptional" : "standard";

              // Estimate dollar value if available
              let dollarValue = 0;
              if (signal.tick_value) {
                const valueMatch = String(signal.tick_value).match(
                  /\$?(\d+(?:\.\d+)?)/,
                );
                if (valueMatch) {
                  dollarValue = Math.round(mfe * parseFloat(valueMatch[1]));
                } else {
                  dollarValue = Math.round(mfe * 10); // Default multiplier
                }
              }

              // Send notification for completed trade
              await NotificationService.notifySignalCompleted(
                userId,
                signal.instrument_name,
                mfe,
                quality,
                dollarValue,
              );
            }
          } catch (error) {
            console.error(
              "Error creating signal completion notification:",
              error,
            );
          }
        },
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      signalsChannel.unsubscribe();
      fulfillmentChannel.unsubscribe();
    };
  }, [userId, notificationsOn]);

  // This component doesn't render anything visible
  return null;
}
