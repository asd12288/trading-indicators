"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/providers/UserProvider";
import useSignals from "@/hooks/useSignals";
import { createClient } from "@/database/supabase/client";

/**
 * NotificationManagerInitializer
 * 
 * NOTE: This component is currently DISABLED to prevent duplicate notifications.
 * Signal notifications are now handled by the SignalNotificationTrigger component.
 * 
 * If you need to re-enable this component, ensure SignalNotificationTrigger 
 * is not also active at the same time to prevent duplicate notifications.
 */
export default function NotificationManagerInitializer() {
  // Component has been disabled - returning null to prevent any processing
  console.log("NotificationManagerInitializer is disabled to prevent duplicate notifications");
  return null;

  // The code below is kept for reference but will not execute due to the return above
  /*
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
  
  // Log the initialization
  useEffect(() => {
    if (user && Object.keys(userPreferences).length > 0) {
      console.log(
        `Signal notification system initialized for user ${user.id}. ` +
        `Watching ${Object.entries(userPreferences).filter(([_, prefs]) => prefs.notifications).length} instruments for notifications.`
      );
    }
  }, [user, userPreferences]);

  // No UI is rendered by this component
  return null;
  */
}
