"use client";

import { useEffect } from "react";
import { tradeNotificationManager } from "@/lib/managers/trade-notification-manager";
import { useUser } from "@/providers/UserProvider";

/**
 * This component initializes the trade notification system
 * It monitors Supabase for trade events and sends notifications based on user preferences
 */
export default function TradeNotificationInitializer() {
  const { user } = useUser();

  useEffect(() => {
    // Only initialize if there's a logged-in user
    if (user && user.id) {
      // The manager is already initialized through the singleton pattern
      // This just ensures it's loaded when the app starts
      console.log(
        "Trade notification monitoring initialized for user:",
        user.id,
      );
    }

    // Clean up subscriptions on unmount
    return () => {
      tradeNotificationManager.cleanup();
    };
  }, [user]);

  // This component doesn't render anything
  return null;
}
