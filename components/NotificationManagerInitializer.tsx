"use client";

import { useEffect } from "react";
import { notificationManager } from "@/lib/managers/notification-manager";

/**
 * This component initializes the notification manager when the app loads
 * It doesn't render anything visible
 */
export default function NotificationManagerInitializer() {
  useEffect(() => {
    // Access the notificationManager to initialize it
    console.log("Initializing notification manager...");

    // The manager is a singleton, so just accessing it will initialize it
    const manager = notificationManager;

    // We could add any additional initialization here if needed
  }, []);

  // This component doesn't render anything
  return null;
}
