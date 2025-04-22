"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/providers/UserProvider";
import useSignals from "@/hooks/useSignals";
import { createClient } from "@/database/supabase/client";
import { tradeNotificationManager } from "@/lib/managers/trade-notification-manager";

/**
 * SignalNotificationTrigger
 * This component initializes the notification system for signals and trades.
 * 
 * It monitors:
 * 1. Signal changes (new signals, completed signals)
 * 2. Trade events (via TradeNotificationManager)
 * 
 * Notifications are only sent for instruments that the user has enabled in preferences.
 */
export default function SignalNotificationTrigger() {
  const { user } = useUser();
  const [userPreferences, setUserPreferences] = useState<Record<string, { notifications: boolean; volume: boolean }>>({});
  
  // Fetch user preferences when user changes
  useEffect(() => {
    const fetchUserPreferences = async () => {
      if (!user || !user.id) return;
      
      try {
        const supabase = createClient();
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", user.id)
          .single();
          
        if (error) {
          console.error("Error fetching user preferences:", error);
          return;
        }
        
        if (profile && profile.preferences) {
          setUserPreferences(profile.preferences);
          console.log("Loaded notification preferences for user", user.id);
        }
      } catch (err) {
        console.error("Error in fetchUserPreferences:", err);
      }
    };
    
    fetchUserPreferences();
  }, [user]);

  // Initialize useSignals hook with user preferences to enable notifications
  // The allSignals=true parameter ensures we get all signals, not just the latest per instrument
  const { signals } = useSignals(userPreferences, true);
  
  // Initialize trade notification manager
  useEffect(() => {
    if (user && user.id) {
      // The manager is already initialized through the singleton pattern
      console.log("Trade notification monitoring initialized for user:", user.id);
    }
    
    // Clean up trade subscriptions on unmount
    return () => {
      tradeNotificationManager.cleanup();
    };
  }, [user]);
  
  // Log the initialization
  useEffect(() => {
    if (user && Object.keys(userPreferences).length > 0) {
      const enabledCount = Object.entries(userPreferences).filter(([_, prefs]) => prefs.notifications).length;
      console.log(
        `Signal notification system initialized for user ${user.id}. ` +
        `Watching ${enabledCount} instruments for notifications.`
      );
    }
  }, [user, userPreferences]);

  // No UI is rendered by this component
  return null;
}
