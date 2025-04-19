/**
 * Notification Manager
 * Singleton class to manage all notifications in the application
 */

import { debounce } from "lodash";
import supabaseClient from "@/database/supabase/supabase";

export class NotificationManager {
  private static instance: NotificationManager;
  private sentNotifications: Set<string> = new Set();

  // Private constructor to enforce singleton pattern
  private constructor() {
    console.log("NotificationManager initialized");
  }

  // Get the singleton instance
  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Check if a notification with the given key has already been sent
   * @param key The unique key for the notification (typically userId_notificationType_entityId)
   */
  public async hasBeenSent(key: string): Promise<boolean> {
    // First check the in-memory cache
    if (this.sentNotifications.has(key)) {
      return true;
    }

    // Then check the database
    try {
      const { data, error } = await supabaseClient
        .from("notification_tracking")
        .select("key")
        .eq("key", key)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 means no rows returned
        console.error("Error checking notification tracking:", error);
        return false;
      }

      // If we found the key in the database, add it to our local cache
      if (data) {
        this.sentNotifications.add(key);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Error in hasBeenSent:", err);
      return false;
    }
  }

  /**
   * Mark a notification as sent to prevent duplicates
   * @param key The unique key for the notification
   */
  public async markAsSent(key: string): Promise<boolean> {
    try {
      // Add to local cache
      this.sentNotifications.add(key);

      // Add to database
      const { error } = await supabaseClient
        .from("notification_tracking")
        .insert({ key });

      if (error) {
        console.error("Error adding notification tracking:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Error in markAsSent:", err);
      return false;
    }
  }

  /**
   * Debounced version of markAsSent to prevent excessive database operations
   */
  public markAsSentDebounced = debounce(
    async (key: string): Promise<boolean> => {
      return this.markAsSent(key);
    },
    1000, // 1 second delay
    { leading: true, trailing: false },
  );
}

// Export a singleton instance
export const notificationManager = NotificationManager.getInstance();
