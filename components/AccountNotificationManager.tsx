"use client";

import { useEffect } from "react";
import { useUser } from "@/providers/UserProvider";
import { NotificationService } from "@/lib/notification-service";

/**
 * AccountNotificationManager is a hidden component that automatically
 * generates important notifications related to user account status.
 * It should be mounted once in the app, preferably in a layout component.
 */
export default function AccountNotificationManager() {
  const { user, profile } = useUser();

  useEffect(() => {
    // Only continue if we have a valid user and profile
    if (!user?.id || !profile) return;

    const sendAccountNotifications = async () => {
      try {
        // Check for subscription expiration
        if (profile.subscription_end_date) {
          const endDate = new Date(profile.subscription_end_date);
          const today = new Date();
          const daysLeft = Math.ceil(
            (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );

          // Send reminder when subscription is ending soon (7 days, 3 days, 1 day)
          if (daysLeft <= 7 && daysLeft > 0) {
            await NotificationService.notifySubscriptionReminder(
              user.id,
              daysLeft,
            );
          }
        }

        // Other account-related notifications can be added here
      } catch (error) {
        console.error("Error in AccountNotificationManager:", error);
      }
    };

    // Run immediately and then once per day
    sendAccountNotifications();
    const interval = setInterval(sendAccountNotifications, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.id, profile]);

  // This component doesn't render anything
  return null;
}
